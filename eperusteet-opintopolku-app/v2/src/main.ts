import Vue from 'vue';

import { rootConfig  } from '@/mainvue';
import { createLogger } from '@shared/utils/logger';
import '@/config/styles';
const logger = createLogger('Main');

Vue.config.productionTip = false;


async function main() {
  try {
    logger.info('Mounting #app');
    (new Vue(rootConfig)).$mount('#app');
  }
  catch (err) {
    logger.error('Top level error:" ', err);
  }
}

main();
