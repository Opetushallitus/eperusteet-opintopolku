import Vue from 'vue';

import { Kielet, KieliStore } from '@shared/stores/kieli';
import { rootConfig  } from '@/mainvue';
import { createLogger } from '@shared/utils/logger';
import { Lokalisointi } from '@shared/api/eperusteet';
import * as _ from 'lodash';
import '@/config/styles';
const logger = createLogger('Main');

Vue.config.productionTip = false;


async function getKaannokset() {
  const [fi, sv, en] = await Promise.all(
    _.map(['fi', 'sv', 'en'], lang => Lokalisointi.getAllKaannokset(lang)));
  return { fi, sv, en } as any;
}

async function main() {
  try {
    logger.info('Mounting #app');
    KieliStore.load(getKaannokset);
    (new Vue(rootConfig)).$mount('#app');
  }
  catch (err) {
    logger.error('Top level error:" ', err);
  }
}

main();
