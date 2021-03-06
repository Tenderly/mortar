# Migration process

In case that you already deployed your contracts we got you covered, you still can use mortar. You just need to migrate
your build/artifact file to mortar state file and to write your module deployment script. So let's start!

## Truffle migration

### Initial project setup

Your current project structure should look something like this:

```
├── build
│   └── contracts
├── contracts
│    ├── ContraNameOne.sol
│    └── ContraNameTwo.sol
├── migrations
│    ├── 1_initial_migration.js
│    └── 2_deploy_contract.js
├── node_modules
├── truffle-config.js
└── package.json
```

Firstly lets setup mortar in this project - you can follow this [document](../setup_procedure.md)

### Build migration

After you have initialized mortar, lets start with the migration process. It is rather simple, lets start with next
command:

```
mortar migration --moduleName=YourModuleName
```

This command will look under `./build` folder and try to find if you already have deployed some contracts in order to
replicate mortar state file based on those contract deployment data.

### Deployment file replication

After you can either manually try to replicate deployment file or try tutorial.

```
mortar tutorial
```
