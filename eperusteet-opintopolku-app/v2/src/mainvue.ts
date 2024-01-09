import Vue from 'vue';
import Loading from 'vue-loading-overlay';
import Notifications from 'vue-notification';
import VueScrollTo from 'vue-scrollto';
import VueMatomo from 'vue-matomo';
import VueCompositionApi from '@vue/composition-api';
import PortalVue from 'portal-vue';
import Aikaleima from '@shared/plugins/aikaleima';
import Kaannos from '@shared/plugins/kaannos';
import { Vahvistus } from '@shared/plugins/vahvistus';
import '@shared/config/bootstrap';
import '@shared/config/defaultcomponents';
import 'material-icons/iconfont/material-icons.css';
import { router } from '@/router';
import { Kielet } from '@shared/stores/kieli';
import App from '@/App.vue';
import VueI18n from 'vue-i18n';

Vue.config.devtools = true;
Vue.use(Notifications);
Vue.use(VueI18n);
Vue.use(VueCompositionApi);
Vue.use(PortalVue);
Vue.use(Kaannos, { squareBrackets: false });
Vue.use(Aikaleima);
Vue.use(Vahvistus);

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
        { id: 'scope-attr-valid', enabled: false }, // https://github.com/vue-a11y/vue-axe/issues/4
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

Vue.use(Kielet, {
  messages: {
    fi: {
      ...require('@shared/translations/locale-fi.json'),
    },
    sv: {
      ...require('@shared/translations/locale-sv.json'),
    },
  },
});

export const rootConfig: any = {
  i18n: Kielet.i18n,
  router,
  render: (h: any) => h(App),
};
