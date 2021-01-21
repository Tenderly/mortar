import { ContractBinding, TransactionData } from '../../../interfaces/mortar';
import ConfigService from '../../config/service';
import { GasPriceCalculator } from '../gas/calculator';
import { checkIfExist } from '../../utils/util';
import { Wallet, providers, BigNumber } from 'ethers';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { ModuleState } from '../../modules/states/module';
import { SingleContractLinkReference } from '../../types/artifacts/libraries';
import { CliError } from '../../types/errors';
import { ethers } from 'ethers';
import { IGasCalculator, IGasPriceCalculator, IGasProvider } from '../gas';

export type TxMetaData = {
  gasPrice?: BigNumber;
  nonce?: number
};

export class EthTxGenerator {
  private configService: ConfigService;
  private gasPriceCalculator: IGasPriceCalculator;
  private gasCalculator: IGasCalculator;
  private readonly ethers: providers.JsonRpcProvider;
  private readonly wallet: Wallet;
  private readonly networkId: number;
  private nonceMap: { [address: string]: number };

  constructor(configService: ConfigService, gasPriceCalculator: IGasPriceCalculator, gasCalculator: IGasCalculator, networkId: number, ethers: providers.JsonRpcProvider) {
    this.configService = configService;
    this.ethers = ethers;

    this.wallet = new Wallet(this.configService.getFirstPrivateKey(), this.ethers);
    this.gasPriceCalculator = gasPriceCalculator;
    this.gasCalculator = gasCalculator;
    this.networkId = networkId;
    this.nonceMap = {};
  }

  changeGasPriceCalculator(newGasPriceCalculator: IGasPriceCalculator) {
    this.gasPriceCalculator = newGasPriceCalculator;
  }

  initTx(moduleState: ModuleState): ModuleState {
    for (const [stateElementName, stateElement] of Object.entries(moduleState)) {
      if (stateElement instanceof ContractBinding) {
        if (checkIfExist(moduleState[stateElementName]?.txData)) {
          continue;
        }

        const rawTx: TransactionData = {
          input: undefined,
          output: undefined,
        };

        // @TODO: enable multiple address to send tx. HD wallet, address array
        rawTx.input = {
          from: this.wallet.address,
          input: stateElement.bytecode as string
        };

        moduleState[stateElementName].txData = rawTx;
      }
    }

    return moduleState;
  }

  async getTransactionCount(walletAddress: string): Promise<number> {
    if (!checkIfExist((this.nonceMap)[walletAddress])) {
      (this.nonceMap)[walletAddress] = await this.ethers.getTransactionCount(walletAddress);
      return (this.nonceMap)[walletAddress]++;
    }

    // @TODO: what nonce has increased in the mean time? (other tx, other deployment, etc.)
    return (this.nonceMap)[walletAddress]++;
  }

  async generateSingedTx(value: number, data: string, wallet?: ethers.Wallet | undefined): Promise<string> {
    const gas = await this.gasCalculator.estimateGas(this.wallet.address, undefined, data);

    const tx: TransactionRequest = {
      from: this.wallet.address,
      value: value,
      gasPrice: await this.gasPriceCalculator.getCurrentPrice(),
      gasLimit: gas,
      data: data,
      chainId: this.networkId
    };

    if (wallet) {
      tx.from = wallet.address;
      tx.nonce = await this.getTransactionCount(await wallet.getAddress());
      return wallet.signTransaction(tx);
    }

    tx.nonce = await this.getTransactionCount(await this.wallet.getAddress());
    return this.wallet.signTransaction(tx);
  }

  addLibraryAddresses(bytecode: string, binding: ContractBinding, moduleState: ModuleState): string {
    const libraries = binding.libraries as SingleContractLinkReference;

    for (const [libraryName, libraryOccurrences] of Object.entries(libraries)) {
      const contractAddress = (moduleState[libraryName] as ContractBinding).deployMetaData?.contractAddress as string;
      if (!checkIfExist(contractAddress)) {
        throw new CliError(`Library is not deployed - ${libraryName}`);
      }

      for (const occurrence of libraryOccurrences) {
        const start = (occurrence.start + 1) * 2;
        const length = occurrence.length * 2;

        const firstPart = bytecode.slice(0, start);
        const secondPart = bytecode.slice(start + length);

        bytecode = firstPart.concat(contractAddress.substring(2), secondPart);
      }
    }

    return bytecode;
  }

  async fetchTxData(walletAddress: string): Promise<TxMetaData> {
    return {
      gasPrice: await this.gasPriceCalculator.getCurrentPrice(),
      nonce: await this.getTransactionCount(walletAddress),
    };
  }
}
