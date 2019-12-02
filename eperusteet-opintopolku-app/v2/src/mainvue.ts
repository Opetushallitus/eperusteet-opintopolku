import Vue from 'vue';
import Loading from 'vue-loading-overlay';
import Notifications from 'vue-notification';
import VueScrollTo from 'vue-scrollto';
import VueMatomo from 'vue-matomo';

import '@/config/bootstrap';
import '@/config/fontawesome';

import { router } from '@/router';
import { KieliStore } from '@shared/stores/kieli';
// import { Virheet } from '@shared/stores/virheet';

import { createLogger } from '@shared/utils/logger';
import _ from 'lodash';

import App from '@/App.vue';
const logger = createLogger('main');

Vue.config.devtools = true;
Vue.use(Notifications);

const isProduction = () => process.env.NODE_ENV === 'production';

if (!isProduction()) {
  const VueAxe = require('vue-axe');
  Vue.use(VueAxe, {
    config: {
      rules: [
        { id: 'heading-order', enabled: true },
        { id: 'label-title-only', enabled: true },
        { id: 'landmark-one-main', enabled: false },
        { id: 'page-has-heading-one', enabled: false },
        { id: 'region', enabled: false },
      ],
    },
    clearConsoleOnUpdate: false,
  });
}

Vue.use(Loading, {
  fullPage: true,
  color: '#159ecb',
  loader: 'dots',
});

Vue.use(VueScrollTo, {
  duration: 1000,
});

if (isProduction()) {
  const siteDomain = document.domain;
  let siteId = 2;
  if (siteDomain === 'eperusteet.opintopolku.fi') {
    siteId = 11;
  }

  Vue.use(VueMatomo, {
    host: 'https://analytiikka.opintopolku.fi/piwik',
    siteId: siteId,
    router: router,
  });
}

const SocialSharing = require('vue-social-sharing');
Vue.use(SocialSharing);

KieliStore.setup(Vue, {
  messages: {
    fi: require('@/translations/locale-fi.json'),
    sv: require('@/translations/locale-sv.json'),
  },
});


import VueI18n, { IVueI18n } from 'vue-i18n';

declare module 'vue/types/vue' {
  interface Vue {
    readonly $i18n: VueI18n & IVueI18n;
    $t: typeof VueI18n.prototype.t;
    $tc: typeof VueI18n.prototype.tc;
    $te: typeof VueI18n.prototype.te;
    $d: typeof VueI18n.prototype.d;
    $n: typeof VueI18n.prototype.n;
    $kaanna: (localizationObject: object | null | undefined) => string;
  }
}

function errorCaptured(err: Error, vm: Vue, info: string) {
  logger.error(err, info);
  if (isProduction()) {
    // Virheet.lisaaVirhe({
    //   path: vm.$route.path,
    //   state: _.cloneDeep(vm.$data),
    //   err: err.message,
    //   info,
    // });
  }
}

export const rootConfig: any = {
  i18n: KieliStore.i18n,
  router,
  render: (h: any) => h(App),
  errorCaptured,
};
