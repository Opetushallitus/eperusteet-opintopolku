import _ from 'lodash';
import {
  ammatilliset, digitaalinenOsaaminen, esiJaPerusaste,
  kotoutumiskoulutus, lukioJaTaide, muuKoulutus,
  tutkintoonvalmentava,
  vapaasivistystyo,
} from '@shared/utils/perusteet';
import { Kieli } from '@shared/tyypit';

export function allKoulutustyyppiLinks(kieli) {
  return _.chain([
    Kieli.en === kieli ? [] : koulutustyyppiLinks(),
    [
      {
        ..._.first(muuKoulutus()),
        name: 'jotpan-rahoittamat-koulutukset',
      },
    ],
  ]).flatMap()
    .value();
}

export function koulutustyyppiLinks() {
  return _.chain([
    esiJaPerusaste(),
    tutkintoonvalmentava(),
    ammatilliset(),
    lukioJaTaide(),
    vapaasivistystyo(),
    kotoutumiskoulutus(),
  ]).flatMap()
    .value();
}

export function osaaminenJaMaarayksetLinks(id, kieli) {
  return _.chain([
    Kieli.en === kieli ? [] : maarayksetJaMerkitLinks(),
    digitaalinenOsaaminen(id),
  ]).flatMap()
    .value();
}

export function maarayksetJaMerkitLinks() {
  return [
    {
      name: 'opetushallituksen-maaraykset',
      route: {
        name: 'maaraykset',
      },
    },
    {
      name: 'kansalliset-perustaitojen-osaamismerkit',
      route: {
        name: 'osaamismerkit',
      },
    },
  ];
}

export function otherLinks() {
  return [
    {
      name: 'rajapinnat',
      text: 'rajapinnat-info',
      link: {
        fi: 'https://opetushallitus.github.io/eperusteet/',
        sv: 'https://opetushallitus.github.io/eperusteet/',
        en: 'https://opetushallitus.github.io/eperusteet/',
      },
      linkText: 'tutustu-rajapintoihin',
    },
    {
      name: 'koulutuksiin-haku',
      text: 'koulutuksiin-haku-info',
      link: {
        fi: 'https://opintopolku.fi/konfo/fi/',
        sv: 'https://opintopolku.fi/konfo/sv/',
        en: 'https://opintopolku.fi/konfo/en/',
      },
      linkText: 'siirry-opintopolkuun',
    },
  ];
}
