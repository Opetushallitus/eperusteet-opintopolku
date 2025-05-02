import * as _ from 'lodash';
import Vue from 'vue';

import { Kielet } from '@shared/stores/kieli';
import { createLogger } from '@shared/utils/logger';
import { getKaannokset, Lokalisointi } from '@shared/api/eperusteet';
import { registerIconColorSchemeChange } from '@shared/utils/icon';
import '@shared/config/styles';
import { Virheet } from '@shared/stores/virheet';
import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import VueMatomo from 'vue-matomo';
import Notifications from 'vue-notification';
import PortalVue from 'portal-vue';
import { createI18n } from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';
import { Aikaleima } from '@shared/plugins/aikaleima';
import VueScrollTo from 'vue-scrollto';
import { Kieli } from '@shared/tyypit';
import { setAppInstance } from '@shared/utils/globals';
import { router } from './router';
import '@shared/config/bootstrap';
import 'material-icons/iconfont/material-icons.css';
import '@shared/config/defaultcomponents';
import fiLocale from '@shared/translations/locale-fi.json';
import svLocale from '@shared/translations/locale-sv.json';
import enLocale from '@shared/translations/locale-en.json';
import { configureCompat } from 'vue';
import Sticky from 'vue-sticky-directive';
import { LoadingPlugin } from 'vue-loading-overlay';
import { createHead } from '@unhead/vue/client';
// import Vuex from 'vuex';

const app = createApp(App);

registerIconColorSchemeChange();

configureCompat({
  COMPONENT_V_MODEL: false,
});

// Store app reference in globals utility
setAppInstance(app);

// Vue.use(Vuex);

app.use(createPinia());
app.use(router);
app.use(new Kaannos(), { squareBrackets: false });

export const i18n = createI18n({
  legacy: false, // Set to false to use Composition API
  locale: Kieli.fi,
  fallbackLocale: Kieli.fi,
  messages: {
    fi: {
      ...fiLocale,
    },
    sv: {
      ...svLocale,
    },
    en: {
      ...enLocale,
    },
  },
});

app.use(i18n);
app.use(Kielet, { i18n });
app.use(new Aikaleima());
app.use(LoadingPlugin);
app.use(createHead());

// Register i18n's t function as a global property for use in templates and globals.ts
app.config.globalProperties.$t = i18n.global.t;

// legacy stuff for now

Vue.use(Sticky);

// Vue.use(Notifications);
// Vue.use(PortalVue);

// Vue.use(VueMeta, {
//   refreshOnceOnNavigation: true,
// });


// Vue.use(Vahvistus);
// Vue.use(Loading, {
//   fullPage: true,
//   color: '#159ecb',
//   loader: 'dots',
// });

Vue.use(VueScrollTo, {
  duration: 1000,
});

// const matomoSiteIds = {
//   'eperusteet.opintopolku.fi': 11,
//   'eperusteet.testiopintopolku.fi': 34,
//   'localhost': 34,
// };

// if (matomoSiteIds[window.location.hostname]) {
//   Vue.use(VueMatomo, {
//     host: 'https://analytiikka.opintopolku.fi/matomo',
//     siteId: matomoSiteIds[window.location.hostname],
//     router: router,
//     disableCookies: true,
//   });
// }

app.mount('#app');
// const logger = createLogger('Main');

// Vue.config.productionTip = false;
