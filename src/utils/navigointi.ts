import _ from 'lodash';
import {
  ammatilliset, digitaalinenOsaaminen, esiJaPerusaste,
  kotoutumiskoulutus, lukioJaTaide, muuKoulutus,
  tutkintoonvalmentava,
  vapaasivistystyo,
} from '@shared/utils/perusteet';

export function koulutustyyppiLinks() {
  return _.chain([
    esiJaPerusaste(),
    tutkintoonvalmentava(),
    ammatilliset(),
    lukioJaTaide(),
    vapaasivistystyo(),
    kotoutumiskoulutus(),
    [
      {
        ..._.first(muuKoulutus()),
        name: 'jotpan-rahoittamat-koulutukset',
      },
    ],
  ]).flatMap()
    .value();
}

export function osaaminenJaMaarayksetLinks(id) {
  return _.chain([
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
    digitaalinenOsaaminen(id),
  ]).flatMap()
    .value();
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
