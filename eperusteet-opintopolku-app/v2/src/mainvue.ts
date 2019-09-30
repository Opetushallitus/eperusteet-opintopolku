import Vue from 'vue';
import Loading from 'vue-loading-overlay';
import Notifications from 'vue-notification';

import '@/config/bootstrap';
import '@/config/fontawesome';

import { router } from '@/router';
import { i18n } from 'eperusteet-frontend-utils/vue/src/stores/kieli';
import { Virheet } from 'eperusteet-frontend-utils/vue/src/stores/virheet';

import { createLogger } from 'eperusteet-frontend-utils/vue/src/utils/logger';
import _ from 'lodash';

import App from '@/App.vue';
const logger = createLogger('main');

Vue.use(Notifications);

Vue.use(Loading, {
  fullPage: true,
  color: '#159ecb',
  loader: 'dots',
});

const isDevelopmentMode = () => _.get(process.env.NODE_ENV, '') === 'development';

function errorCaptured(err: Error, vm: Vue, info: string) {
  logger.error(err, info);
  if (!isDevelopmentMode()) {
    // Virheet.lisaaVirhe({
    //   path: vm.$route.path,
    //   state: _.cloneDeep(vm.$data),
    //   err: err.message,
    //   info,
    // });
  }
}

export const rootConfig: any = {
  i18n,
  router,
  render: (h: any) => h(App),
  errorCaptured,
};
