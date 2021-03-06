import { buildModule, ModuleBuilder } from '../../../../src';

export const SynthetixLibraries = buildModule('SynthetixLibraries', async (m: ModuleBuilder) => {
  m.library('SafeDecimalMath');
  m.library('Math');
});

export const SynthetixPrototypes = buildModule('SynthetixPrototypes', async (m: ModuleBuilder) => {
  m.prototype('ReadProxy');
  m.prototype('Proxy');
  m.prototype('EternalStorage');
  m.prototype('ProxyERC20');
  m.prototype('TokenState');
  m.prototype('MintableSynthetix');
  m.prototype('Synthetix');
  m.prototype('RealtimeDebtCache');
  m.prototype('DebtCache');
  m.prototype('Exchanger');
  m.prototype('ExchangerWithVirtualSynth');
  m.prototype('IssuerWithoutLiquidations');
  m.prototype('Issuer');
  m.prototype('FixedSupplySchedule');
  m.prototype('Synth');
  m.prototype('PurgeableSynth');
  m.prototype('MultiCollateralSynth');
  m.prototype('EmptyEtherCollateral');
});
