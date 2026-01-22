import * as _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';
import { registerIconColorSchemeChange } from '@shared/utils/icon';
import '@shared/config/styles';
import { createApp } from 'vue';
import App from './App.vue';
import { pinia } from '@/pinia';
import VueMatomo from 'vue-matomo';
import { createI18n } from 'vue-i18n';
import kaannos, { Kaannos } from '@shared/plugins/kaannos';
import { Aikaleima } from '@shared/plugins/aikaleima';
import VueScrollTo from 'vue-scrollto';
import { Kieli } from '@shared/tyypit';
import { setAppInstance } from '@shared/utils/globals';
import { registerDefaultComponents } from '@shared/config/defaultcomponents';
import { router } from './router';
// import '@shared/config/bootstrap';
import 'material-icons/iconfont/material-icons.css';
import fiLocale from '@shared/translations/locale-fi.json';
import svLocale from '@shared/translations/locale-sv.json';
import enLocale from '@shared/translations/locale-en.json';
import Sticky from 'vue-sticky-directive';
import { LoadingPlugin } from 'vue-loading-overlay';
import { createHead } from '@unhead/vue/client';
import { Notifikaatiot } from '@shared/plugins/notifikaatiot';
import { setPrimeVue } from '@shared/primevue';

const app = createApp(App);

registerIconColorSchemeChange();
registerDefaultComponents(app);

setAppInstance(app);
setPrimeVue(app);

app.use(pinia);
app.use(router);
app.use(kaannos, { squareBrackets: false });

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
app.use(Notifikaatiot);
app.use(VueScrollTo, {
  duration: 1000,
});
app.use(Sticky);

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  app.config.errorHandler?.(event.reason, null, 'unhandledrejection');
});

const matomoSiteIds = {
  'eperusteet.opintopolku.fi': 11,
  'eperusteet.testiopintopolku.fi': 34,
  'localhost': 34,
};

if (matomoSiteIds[window.location.hostname]) {
  app.use(VueMatomo, {
    host: 'https://analytiikka.opintopolku.fi/matomo',
    siteId: matomoSiteIds[window.location.hostname],
    router: router,
    disableCookies: true,
    trackSiteSearch: (to) => {
      if (to.query.haku) {
        return { keyword: to.query.haku };
      }

      return null;
    },
  });
}

app.mount('#app');
