import Vue from 'vue';
import _ from 'lodash';
import { Oikeus } from '../tyypit';
import { Computed } from '../utils/interfaces';

const DisableTags = ['input', 'button'];

export interface IOikeusProvider {
  hasOikeus: (oikeus: Oikeus, kohde?: any) => boolean;
  isAdmin?: Computed<boolean>;
  hasOphCrud?: Computed<boolean>;
  casKayttaja: Computed<any>;
  sovellusOikeudet: Computed<SovellusOikeus[]>;
  logoutUrl?: Computed<string>;
}

export interface OikeustarkasteluConfig {
  oikeusProvider: IOikeusProvider;
}

declare module 'vue/types/vue' {
  interface Vue {
    $hasOikeus: (oikeus: Oikeus, kohde?: any) => boolean;
    $isAdmin: () => boolean;
    $hasOphCrud: () => boolean;
  }
}

export class Oikeustarkastelu {
  public static install(vue: typeof Vue, config: OikeustarkasteluConfig) {
    vue.prototype.$isAdmin = () => config.oikeusProvider.isAdmin?.value || false;
    vue.prototype.$hasOphCrud = () => config.oikeusProvider.hasOphCrud?.value || false;

    vue.prototype.$hasOikeus = function(oikeus: Oikeus, kohde?: any) {
      return config.oikeusProvider.hasOikeus(oikeus, kohde);
    };

    // Sisällön kääntäminen
    vue.directive('oikeustarkastelu', (el: any, binding) => {
      // Hide the element before rights have been resolved
      if (!el.oldDisplayValue && el.style.display !== 'none') {
        el.oldDisplayValue = el.style.display;
      }

      el.style.display = 'none';

      let value = binding.value || 'luku';
      let kohde: any;
      if (_.isObject(value)) {
        kohde = (value as any).kohde;
        value = (value as any).oikeus;
      }

      if (config.oikeusProvider.hasOikeus(value, kohde)) {
        el.style.display = el.oldDisplayValue;
      }
      else {
        const { tagName } = el;
        if (_.includes(DisableTags, _.toLower(tagName))) {
          (el as HTMLInputElement).disabled = true;
          el.style.display = el.oldDisplayValue;
        }
      }
    });
  }
}

export interface SovellusOikeus {
  eperusteSovellus: EperusteSovellus;
  valittu: boolean;
}

export interface EperusteSovellus {
  sovellus: string;
  url: string;
}

export const EPERUSTEET_SOVELLUKSET = [
  {
    sovellus: 'APP_EPERUSTEET',
    url: '/eperusteet-app',
  },
  {
    sovellus: 'APP_EPERUSTEET_YLOPS',
    url: '/eperusteet-ylops-app',
  },
  {
    sovellus: 'APP_EPERUSTEET_AMOSAA',
    url: '/eperusteet-amosaa-app/#/ammatillinen',
  },
  {
    sovellus: 'APP_EPERUSTEET_VST',
    url: '/eperusteet-amosaa-app/#/vapaasivistystyo',
  },
  {
    sovellus: 'APP_EPERUSTEET_TUVA',
    url: '/eperusteet-amosaa-app/#/tutkintoonvalmentava',
  },
  {
    sovellus: 'APP_EPERUSTEET_KOTO',
    url: '/eperusteet-amosaa-app/#/kotoutumiskoulutus',
  },
];

export function getSovellusoikeudet(casRoles: string[], valittuSovellus: string): SovellusOikeus[] {
  const toSovellusOikeus = (eperusteSovellus) => ({
    eperusteSovellus,
    valittu: valittuSovellus === eperusteSovellus.sovellus,
  });

  const origin = window.location.origin;
  if (_.includes(origin, 'localhost')) {
    return _.map(EPERUSTEET_SOVELLUKSET, eperusteSovellus => toSovellusOikeus(eperusteSovellus));
  }
  else {
    return _.chain(casRoles)
      .filter(casRole => _.includes(_.map(EPERUSTEET_SOVELLUKSET, 'sovellus'), casRole))
      .map(sovellus => _.find(EPERUSTEET_SOVELLUKSET, eSovellus => eSovellus.sovellus === sovellus))
      .map(sovellus => toSovellusOikeus(sovellus))
      .value();
  }
}

export const OIKEUS_KAANNOT = {
  'READ': 'luku',
  'READ_UPDATE': 'muokkaus',
  'CRUD': 'luonti',
  'ADMIN': 'hallinta',
};

export const EPERUSTEET_KOULUTUSTYYPPI_PAIKALLISET_SOVELLUKSET = {
  'koulutustyyppi_1': 'APP_EPERUSTEET_AMOSAA', // ammatillinen perustutkinto
  'koulutustyyppi_2': 'APP_EPERUSTEET_YLOPS', // lukiokoulutus
  'koulutustyyppi_5': 'APP_EPERUSTEET_AMOSAA', // telma
  'koulutustyyppi_6': 'APP_EPERUSTEET_YLOPS', // lisaopetus
  'koulutustyyppi_11': 'APP_EPERUSTEET_AMOSAA', // ammattitutkinto
  'koulutustyyppi_12': 'APP_EPERUSTEET_AMOSAA', // erikoisammattitutkinto
  'koulutustyyppi_14': 'APP_EPERUSTEET_YLOPS', // aikuisten lukiokoulutus
  'koulutustyyppi_15': 'APP_EPERUSTEET_YLOPS', // esiopetus
  'koulutustyyppi_16': 'APP_EPERUSTEET_YLOPS', // perusopetus
  'koulutustyyppi_17': 'APP_EPERUSTEET_YLOPS', // aikuisten perusopetus
  'koulutustyyppi_18': 'APP_EPERUSTEET_AMOSAA', // valma
  'koulutustyyppi_20': 'APP_EPERUSTEET_YLOPS', // varhaiskasvatus
  'koulutustyyppi_22': 'APP_EPERUSTEET_YLOPS', // perusopetuksen valmistava
  'koulutustyyppi_23': 'APP_EPERUSTEET_YLOPS', // valmistava lukiokoulutus
  'koulutustyyppi_999907': 'APP_EPERUSTEET_YLOPS', // taiteen perusopetus,
  'koulutustyyppi_10': 'APP_EPERUSTEET_VST', // vapaa sivistystyo
  'koulutustyyppi_30': 'APP_EPERUSTEET_KOTO', // aikuisten maahanmuuttajien kotoutumiskoulutus
  'koulutustyyppi_35': 'APP_EPERUSTEET_VST', // vapaa sivistystyo lukutaito
  'koulutustyyppi_40': 'APP_EPERUSTEET_TUVA', // tutkintoon valmentava
};
