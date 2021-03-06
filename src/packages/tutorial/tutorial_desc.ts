import chalk from 'chalk';

export const INITIAL_MSG = chalk.gray(`Hey wizard, props for starting the tutorial :)
Firstly let's try to explain what mortar is and what this tutorial is going to tackle.

Mortar is IaC smart contract deployment, this means that you don't need to define order of execution but rather the
smart contract dependencies and life cycle event's to be triggered. In this tutorial we will showcase how those are
used in your use case.
`);

export const MODULE_NAME_DESC = `Module is encapsulation for smart contract infrastructure, that includes smart contract deployment,
their interaction and event's execution.`;

export const PROTOTYPE_DESC = `Prototype is smart contract definition for contract reuse. This is used to deploy same contract with different configuration.`;

export const CONTRACT_NAME_DESC = `This is your smart contract name, you can check what it is in your .sol file.`;

export const CONTRACT_DESC = `This is smart contract deployment definition.`;

export const CONSTRUCTOR_ARGS = `${chalk.gray('comma separated values, in case that other contract is argument just put contract name')}
Constructor arguments`;

export const CONTRACT_DUPLICATES = `We have detected that you defined your contract multiple times. This is no issue just provide friendly name for this one ;)
Friendly name`;

export const EVENT_DESC = `Events is small chunk of code that is bounded to contract itself and his life cycle in deployment.
For example, if we have 'afterDeploy' event, that small chunk of the code would be executed immediately after contract deployment.

You can see mortar documentation for more detailed explanation:
(https://github.com/Tenderly/mortar/blob/main/docs/concepts/module_builder/events.md)`;
