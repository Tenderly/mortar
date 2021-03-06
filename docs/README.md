# Mortar

Solidity infrastructure as a code tool for easy deployment and management of smart contract infrastructure on Ethereum.

# Commands

| Commands                      | Glossary                                                              | Link                                        |
| ----------------------------- | --------------------------------------------------------------------- | ------------------------------------------- |
| Mortar Init                   | Initialize mortar config file and script.                             | [mortar init](./commands/init.md)           |
| Mortar Diff                   | Show difference between current and already deployed module.          | [mortar diff](./commands/diff.md)           |
| Mortar Deploy                 | Run/Continue deployment of the module.                                | [mortar deploy](./commands/deploy.md)       |
| Mortar GenTypes               | Generate custom module types on top of current module.                | [mortar genTypes](./commands/genTypes.md)   |
| Mortar Usage                  | Generate usage module, module made only for usage in other modules    | [mortar usage](./commands/usage.md)         |
| Mortar Migration              | Ability to migrate from other build/state files to mortar state file. | [mortar migration](./commands/migration.md) |
| Mortar Tutorial               | Step by step creation of simple deployment module with description.   | [mortar migration](./commands/migration.md) |

# Tutorials

| Tutorials     | Glossary                            | Link                                        |
| ------------- | ----------------------------------- | ------------------------------------------- |
| Basic         | Basic showcase of functionality.    | [basic](./tutorial/basic.md)                |
| Intermediate  | More complex functionality showcase | [intermediate](./tutorial/intermediate.md)  |
| Advanced      | Synthetix deployment module.        | [advanced](./tutorial/advanced.md)  |

# Concepts

| Concepts                      | Glossary                                        | Link        |
| ----------------------------- | ----------------------------------------------- | ----------- |
| Module Builder                | Interface for building contract infrastructure. | [module_builder](./concepts/module_builder/module_builder.md)                                        |
| Events                        | Event hooks for contract deployments.           | [events](./concepts/module_builder/events.md)                                                        |
| Contract Bindings             | Contract deployment abstraction.                | [contract_bindings](./concepts/module_builder/contract_binding.md)                                   |
| Module Deployment             | Module deployment overview.                     | [module_deployment](./concepts/module_deployment/module_deployment.md)                               |
| Module Dependencies resolving | Module dependencies resolving overview.         | [module_deps_resolver](./concepts/module_deps_resovler/module_deps_resolver.md)                      |
| Module Registry and resolver  | Deployment registry and deployment resolver.    | [module_registry_resolver](./concepts/module_registry_resolver/module_registry_resolver.md)          |
| Module State File             | Detailed data of deployment process.            | [module_state_file](./concepts/module_state_file/module_state_file.md)                               |
| Config                        | Mortar configuration options.                   | [config](./concepts/config.md)                                                                       |

# On-boarding - Migrations and external module usage

| On-boarding             | Link        |
| ----------------------- | ----------- |
| Migration process       | [migration-process](./on-boarding/migration.md)|
| Usage module generation | [usage-module-gen](./on-boarding/usage-module.md#usage-generation)|
| External module usage   | [usage-module-usage](./on-boarding/usage-module.md#usage-of-usage-module-in-other-projects)|

# Ported projects

| Projects          | Link        |
| ----------------- | ----------- |
| Synthetix port    | [synthetix module](../example/synthetix/deployment/module.ts)                |
| Tornado cash port | [tornado cash module](../example/tornado_core/deployment/tornado.module.ts)  |

# Developer UX

| Developer UX  | Glossary                                                           | Link                                      |
| ------------- | ------------------------------------------------------------------ | ----------------------------------------- |
| Expectancy    | Used as a easier way to expect contract read value.                | [expectancy](./ux/ux.md#Expectancy)       |
| Macros        | Way to wrap some custom deployment functionality for later reuse.  | [macros](./ux/ux.md#Macros)               |

# Testing

| Testing       | Glossary                                   | Link                                     |
| ------------- | ------------------------------------------ | ---------------------------------------- |
| Integration   | Integration test example and explanation.  | [test](./testing/integration/example.md) |
