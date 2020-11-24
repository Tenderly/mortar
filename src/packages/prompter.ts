import {DeployedContractBinding} from "../interfaces/mortar";
import cli from "cli-ux";

export class Prompter {
  constructor() {
  }

  promptDeployerBindings(bindings: { [p: string]: DeployedContractBinding }): void {
    for (let [name, bind] of Object.entries(bindings)) {
      cli.debug("Contract name: ", name)
      cli.debug("   Tx Data: ")
      cli.debug("            Input", bind.txData.input?.input || "")
      cli.debug("            From", bind.txData.input?.from || "")
    }
  }

  async promptContinueDeployment(): Promise<void> {
    const con = await cli.prompt('Do you wish to continue with deployment of this module? (Y/n)')
    if (con != 'n' && con != 'Y') {
      return await this.promptContinueDeployment()
    }

    if (con == 'n') {
      cli.exit()
    }
  }

  async promptExecuteTx(): Promise<void> {
    const con = await cli.prompt('Execute transactions? (Y/n)')
    if (con != 'n' && con != 'Y') {
      return await this.promptExecuteTx()
    }

    if (con == 'n') {
      cli.exit()
      process.exit()
    }
  }

  promptSignedTransaction(tx: string): void {
    cli.debug(`Signed transaction: ${tx}`)
  }

  errorPrompt(error: Error): void {
    cli.error(error)
  }

  sendingTx(): void {
    cli.action.start("Sending tx")
  }

  sentTx(): void {
    cli.action.stop("sent")
  }

  transactionReceipt(): void {
    cli.log("Waiting for block confirmation...")
  }

  waitTransactionConfirmation(): void {
    cli.action.start("Block is mining")
  }

  transactionConfirmation(name: string, confirmationNumber: number): void {
    cli.action.stop(`\n ${name} - Current block confirmation: ${confirmationNumber}`)
  }
}