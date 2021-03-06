# Contract instance

If you want to call some contract function or read any contract property you will need to call `.instance()` function
first in order to get `ethers.Contract` like object to interact with.

```typescript
export const FirstModule = buildModule('FirstModule', async (m: ModuleBuilder) => {
  const A = m.contract('A');

  A.afterDeploy(m, 'afterDeployA', async () => {
    const contractInstance = A.instance();

    await contractInstance.setExample(1);
  });
});
```

## Custom signers

If you would like to change singer/deployer of contract function call you can use it like this:

```
A.instance().setDeployer(newWallet)
```

```
setDeployer(wallet: ethers.Wallet): ContractBinding
```
