# Integration testing

This a simple example of one single integration test. We explain basic process and idea on how to test mortar
deployment. If you want to see more example you can go to [here](../../../test/commands/deploy_command.test.ts).

## Code Example

```typescript
describe('mortar deploy - integration', () => {
  const mortar = new MortarTests(
    {
      networkId: networkId,
      stateFileNames: [],
    }, {
      privateKeys: [testPrivateKey],
      mnemonic: '',
      hdPath: '',
    });

  it('should be able to deploy module - single new binding', async () => {
    const projectFileName = 'single-new-binding';
    process.chdir(path.resolve(rootDir, `./test/projects-scenarios/${projectFileName}`));
    await loadStateFile(mortar, projectFileName);
    await runDeployCommand(mortar, projectFileName);

    const moduleStateFile = await mortar.getStateFile(moduleName);
    const contractBinding = moduleStateFile['Example'] as unknown as ContractBindingMetaData;
    assert.equal(contractBinding.deployMetaData.contractAddress.length > 0, true);
    assert.equal(contractBinding.deployMetaData.logicallyDeployed, true);
    mortar.cleanup();
  });
})
```

## Explanation

In this example we are using `mocha` and `chai` for testing.

We've implemented `MortarTests` class in order make mortar user test their deployment's. You can call `deploy()`
and `diff()` on this class in order to run same mortar commands programmatically. The main difference is that test are
run in-memory so file-system wouldn't be overwritten. 

In order for assertion, deployment validation and testing scenarios we also added next functions to the `MortarTests` 
```typescript
  cleanup() {
    this.moduleStateRepo.clear();
  }

  setStateFile(moduleName: string, stateFile: ModuleStateFile) {
    this.moduleStateRepo.storeNewState(moduleName, stateFile);
  }

  async getStateFile(moduleName: string): Promise<ModuleStateFile> {
    return this.moduleStateRepo.getStateIfExist(moduleName);
  }
```
