import * as _ from 'lodash';
import Vue from 'vue';

import { Kielet } from '@shared/stores/kieli';
import { rootConfig } from '@/mainvue';
import { createLogger } from '@shared/utils/logger';
import { Lokalisointi } from '@shared/api/eperusteet';
import { registerIconColorSchemeChange } from '@shared/utils/icon';
import '@shared/config/styles';
import { Virheet } from '@shared/stores/virheet';

const logger = createLogger('Main');

Vue.config.productionTip = false;

async function getKaannokset() {
  const [fi, sv, en] = _.map(await Promise.all(_.map(['fi', 'sv', 'en'], lang => Lokalisointi.getAllKaannokset(lang))), 'data');
  return { fi, sv, en } as any;
}

async function main() {
  try {
    logger.info('Mounting #app');
    registerIconColorSchemeChange();
    (new Vue(rootConfig)).$mount('#app');
    Kielet.load(await getKaannokset());
  }
  catch (err) {
    logger.error('Top level error:" ', err);
    Virheet.lisaaVirhe({ err: '500' });
  }
}

main();
