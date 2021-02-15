import { buildModule, ModuleBuilder } from '../../../src/interfaces/mortar';

export const FirstModule = buildModule('FirstModule', async (m: ModuleBuilder) => {
  const A = m.contract('A');
  const B = m.contract('B', A);

  A.afterDeploy(m, 'afterDeployBandC', async () => {
    await A.instance().setExample(11);
  });
});
