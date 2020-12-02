import {DeployedContractBinding} from "../../../interfaces/mortar";
import {Prompter} from "../../prompter";
import {ModuleStateRepo} from "../../modules/state_repo";
import {checkIfExist} from "../../utils/util";
import {EthTxGenerator} from "./generator";
import {providers} from "ethers";
import {defaultAbiCoder as abiCoder} from "@ethersproject/abi"
import {TransactionReceipt} from "@ethersproject/abstract-provider";
import {JsonFragmentType} from "../../types/abi";
import {cli} from "cli-ux";
import {EventHandler} from "../../modules/events/handler";

const CONSTRUCTOR_TYPE = 'constructor'
export const BLOCK_CONFIRMATION_NUMBER = 0

export class TxExecutor {
  private prompter: Prompter
  private moduleState: ModuleStateRepo
  private txGenerator: EthTxGenerator
  private ethers: providers.JsonRpcProvider

  constructor(prompter: Prompter, moduleState: ModuleStateRepo, txGenerator: EthTxGenerator, networkId: number, ethers: providers.JsonRpcProvider) {
    this.prompter = prompter
    this.moduleState = moduleState
    this.txGenerator = txGenerator

    this.ethers = ethers
  }

  async executeBindings(moduleName: string, bindings: { [p: string]: DeployedContractBinding }): Promise<void> {
    for (let [name, binding] of Object.entries(bindings)) {
      if (checkIfExist(binding.txData.output)) {
        cli.info(name, "is already deployed")
        await this.prompter.promptContinueToNextBinding()
      }

      await EventHandler.executeBeforeDeploymentEventHook(bindings[name], bindings)
      if (!checkIfExist(binding.txData.output)) {
        cli.info(name, " - deploying")
        await EventHandler.executeBeforeDeployEventHook(bindings[name], bindings)
        bindings[name] = await this.executeSingleBinding(binding, bindings)
        await EventHandler.executeAfterDeployEventHook(bindings[name], bindings)

        await EventHandler.executeOnChangeEventHook(bindings[name], bindings)
      }
      await EventHandler.executeAfterDeploymentEventHook(bindings[name], bindings)

      this.moduleState.storeNewState(moduleName, bindings)
    }

    return
  }

  private async executeSingleBinding(binding: DeployedContractBinding, bindings: { [p: string]: DeployedContractBinding }): Promise<DeployedContractBinding> {
    let constructorFragmentInputs = [] as JsonFragmentType[]

    for (let i = 0; i < binding.abi.length; i++) {
      const abi = binding.abi[i]

      if (abi.type == CONSTRUCTOR_TYPE && abi.inputs) {
        constructorFragmentInputs = abi.inputs
        break
      }
    }

    let bytecode: string = binding.bytecode
    const values: any[] = []
    const types: any[] = []

    for (let i = 0; i < constructorFragmentInputs?.length; i++) {
      switch (typeof binding.args[i]) {
        case "object": {
          if (binding.args[i]?._isBigNumber) {
            let value = binding.args[i].toString()

            values.push(value)
            types.push(constructorFragmentInputs[i].type)
            break
          }

          if (binding.args[i].length > 0) {
            values.push(binding.args[i])
            types.push(constructorFragmentInputs[i].type)
            break
          }

          if ("contract " + binding.args[i].name != constructorFragmentInputs[i].internalType) {
            cli.info("Unsupported type for - ", binding.name,
              " \n provided: ", binding.args[i].name,
              "\n expected: ", constructorFragmentInputs[i].internalType || "")
            cli.exit(0)
          }

          const dependencyName = binding.args[i].name
          const dependencyTxData = bindings[dependencyName].txData
          if (!checkIfExist(dependencyTxData) || !checkIfExist(dependencyTxData.output)) {
            cli.info("Dependency contract not deployed\n", "Binding name: ", binding.name, "\n Dependency name: ", binding.args[i].name)
            cli.exit(0)
          }

          if (dependencyTxData.output != null && !dependencyTxData.output.status) {
            cli.info("Dependency contract not included in the block \n", "Binding name: ", binding.name, "\n Dependency name: ", binding.args[i].name)
            cli.exit(0)
          }

          if (!checkIfExist(dependencyTxData.contractAddress)) {
            cli.info("No contract address in dependency tree \n", "Binding name: ", binding.name, "\n Dependency name: ", binding.args[i].name)
            cli.exit(0)
          }

          values.push(dependencyTxData.contractAddress)
          types.push(constructorFragmentInputs[i].type)

          break
        }
        case "number": {
          values.push(binding.args[i])
          types.push(constructorFragmentInputs[i].type)

          break
        }
        case "string": {
          if (constructorFragmentInputs[i].type == "bytes") {
            values.push(Buffer.from(binding.args[i]))
            types.push(constructorFragmentInputs[i].type)
            break
          }

          values.push(binding.args[i])
          types.push(constructorFragmentInputs[i].type)

          break
        }
        case "boolean": {
          values.push(binding.args[i])
          types.push(constructorFragmentInputs[i].type)


          break
        }
        default: {
          cli.info("Unsupported type for - ", binding.name, " ", binding.args[i])
          cli.exit(0)
        }
      }
    }

    bytecode = bytecode + abiCoder.encode(types, values).substring(2)

    const signedTx = await this.txGenerator.generateSingedTx(
      0,
      bytecode,
    )

    await this.prompter.promptSignedTransaction(signedTx)
    await this.prompter.promptExecuteTx()
    const txReceipt = await this.sendTransaction(binding.name, signedTx)

    binding.txData.contractAddress = txReceipt.contractAddress
    binding.txData.output = txReceipt

    return binding
  }

  private async sendTransaction(name: string, signedTx: string): Promise<TransactionReceipt> {
    return new Promise(async (resolve) => {

      this.prompter.sendingTx()
      const txResp = await this.ethers.sendTransaction(signedTx)
      this.prompter.sentTx()
      const txReceipt = await txResp.wait(BLOCK_CONFIRMATION_NUMBER)
      this.prompter.transactionReceipt()
      this.prompter.waitTransactionConfirmation()
      this.prompter.transactionConfirmation(name, BLOCK_CONFIRMATION_NUMBER)

      resolve(txReceipt)
      return txReceipt
    })
  }
}
