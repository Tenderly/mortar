import { IPrompter } from './index';
import { ModuleState } from '../../modules/states/module';
import { SingleBar } from 'cli-progress';
import cli from 'cli-ux';
import chalk from 'chalk';
import { checkIfExist } from '../util';
import { CliError } from '../../types/errors';

enum StateElementStatus {
  'NOT_EXECUTED' = 'not executed',
  'RUNNING' = 'running',
  'SUCCESSFUL' = 'successful',
  'DEPLOYED' = 'already executed/deployed',
  'FAILED' = 'failed',
}

enum DescActionList {
  'SKIPPED' = 'skipped',
  'SUCCESSFUL' = 'SUCCESSFUL',
  'CREATE' = 'create',
}

export class SimpleOverviewPrompter implements IPrompter {
  private moduleBars: {
    [moduleName: string]: SingleBar
  };

  private currentModuleName: string;

  constructor() {
    this.moduleBars = {};
  }

  finishedExecutionOfWalletTransfer(from: string, to: string): void {
  }

  executeWalletTransfer(address: string, to: string): void {
  }

  startModuleDeploy(moduleName: string, moduleState: ModuleState): void {
    this.currentModuleName = moduleName;
    cli.info(chalk.bold('\n\nDeploy module - ', chalk.green(moduleName)));

    this.moduleBars[moduleName] = new SingleBar({
      clearOnComplete: false,
      synchronousUpdate: true,
      fps: 100,
      format: `# ${chalk.bold('{module}')} progress [{bar}] {percentage}% | {value}/{total} | Current element: ${chalk.bold('{element}')} -> status: {status} | Action: {action}`,
    });
    this.moduleBars[moduleName].start(Object.entries(moduleState).length, 0, {
      module: this.currentModuleName,
      element: 'N/A',
      status: 'N/A'
    });
  }

  alreadyDeployed(elementName: string): void {
    this.moduleBars[this.currentModuleName].increment({
      module: this.currentModuleName,
      element: elementName,
      status: StateElementStatus.DEPLOYED,
      action: DescActionList.SKIPPED
    });
  }

  bindingExecution(bindingName: string): void {
    this.moduleBars[this.currentModuleName].update({
      module: this.currentModuleName,
      element: bindingName,
      status: StateElementStatus.RUNNING,
      action: DescActionList.CREATE
    });
  }

  errorPrompt(): void {
    if (!this.moduleBars[this.currentModuleName]) {
      return;
    }

    this.moduleBars[this.currentModuleName].stop();
  }

  eventExecution(eventName: string): void {
    this.moduleBars[this.currentModuleName].update({
      module: this.currentModuleName,
      element: eventName,
      status: StateElementStatus.RUNNING,
      action: 'N/A'
    });
  }

  finishModuleDeploy(): void {
    this.moduleBars[this.currentModuleName].update({
      module: this.currentModuleName,
      element: this.currentModuleName,
      status: StateElementStatus.SUCCESSFUL,
      action: 'N/A'
    });
    this.moduleBars[this.currentModuleName].stop();

    this.currentModuleName = '';
  }

  finishedEventExecution(eventName: string): void {
    this.handleElementCompletion(eventName);
  }

  finishedBindingExecution(bindingName: string): void {
    this.handleElementCompletion(bindingName);
  }

  private handleElementCompletion(elementName: string): void {
    this.moduleBars[this.currentModuleName].increment({
      module: this.currentModuleName,
      element: elementName,
      status: StateElementStatus.SUCCESSFUL,
      action: 'N/A'
    });
  }

  finishedExecutionOfContractFunction(functionName: string): void {
  }

  nothingToDeploy(): void {
    cli.info('State file is up to date and their is nothing to be deployed, if you still want to trigger deploy use --help to see how.');
    cli.exit(0);
  }

  promptContinueDeployment(): Promise<void> {
    // overview will not have confirmations
    return;
  }

  promptExecuteTx(): Promise<void> {
    // overview will not have metadata
    return;
  }

  promptSignedTransaction(tx: string): void {
    // overview will not have metadata
    return;
  }

  sendingTx(eventName: string, functionName: string = 'CREATE'): void {
    if (!checkIfExist(this.moduleBars[this.currentModuleName])) {
      throw new CliError('Current module not found when trying to log transactions');
    }

    this.moduleBars[this.currentModuleName].update({
      module: this.currentModuleName,
      element: eventName,
      status: StateElementStatus.RUNNING,
      action: `${functionName} -> sending`
    });
  }

  sentTx(eventName: string, functionName: string = 'CREATE'): void {
    if (!checkIfExist(this.moduleBars[this.currentModuleName])) {
      throw new CliError('Current module not found when trying to log transactions');
    }

    this.moduleBars[this.currentModuleName].update({
      module: this.currentModuleName,
      element: eventName,
      status: StateElementStatus.RUNNING,
      action: `${functionName} -> sent`
    });
  }

  transactionConfirmation(confirmationNumber: number, eventName: string, functionName: string = 'CREATE'): void {
    if (!checkIfExist(this.moduleBars[this.currentModuleName])) {
      throw new CliError('Current module not found when trying to log transactions');
    }

    this.moduleBars[this.currentModuleName].update({
      module: this.currentModuleName,
      element: eventName,
      status: StateElementStatus.RUNNING,
      action: `${functionName} -> confirmed ${confirmationNumber}`
    });
  }

  transactionReceipt(): void {
  }

  waitTransactionConfirmation(): void {
  }

  executeContractFunction(): void {
  }

  generatedTypes(): void {
    cli.info("Successfully generated module types, look under './.mortar/<module_name>'");
  }

  finishedModuleUsageGeneration(moduleName: string) {
  }

  startingModuleUsageGeneration(moduleName: string) {
  }
}
