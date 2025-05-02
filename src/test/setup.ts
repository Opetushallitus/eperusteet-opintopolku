// tests/unit.setup.ts
import { config } from '@vue/test-utils';

config.global.mocks = {
  // $t: tKey => tKey,
  // $sd: tKey => tKey,
  $kaannaPlaceholder: tKey => tKey,
  $kaanna: x => x ? x.fi : 'kaanna',
  $t: (tKey) => tKey,
  $sd: (tKey) => tKey,
  $kaannaOlioTaiTeksti: (tKey) => tKey,
};
