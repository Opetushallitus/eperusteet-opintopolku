import _ from 'lodash';
import {
  ammatilliset, digitaalinenOsaaminen,
  kotoutumiskoulutus, muuKoulutus,
  tutkintoonvalmentava,
  vapaasivistystyo,
  yleissivistavat,
} from '@shared/utils/perusteet';

export function koulutustyyppiLinks() {
  return _.chain([
    yleissivistavat(),
    ammatilliset(),
    vapaasivistystyo(),
    tutkintoonvalmentava(),
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
    digitaalinenOsaaminen(id),
    {
      name: 'kansalliset-perustaitojen-osaamismerkit',
      route: {
        name: 'osaamismerkit',
      },
    },
    {
      name: 'opetushallituksen-maaraykset',
      route: {
        name: 'maaraykset',
      },
    },
  ]).flatMap()
    .value();
}

export function otherLinks() {
  return {
    ajankohtaista: {
      name: 'ajankohtaista',
      route: {
        name: 'uutiset',
      },
    },
    // palvelu: {
    //   name: 'tietoa-palvelusta',
    //   link: {
    //     fi: 'https://www.oph.fi/fi',
    //     sv: 'https://www.oph.fi/sv',
    //     en: 'https://www.oph.fi/en',
    //   },
    // },
    rajapinnat: {
      name: 'rajapinnat',
      link: {
        fi: 'https://opetushallitus.github.io/eperusteet/',
        sv: 'https://opetushallitus.github.io/eperusteet/',
        en: 'https://opetushallitus.github.io/eperusteet/',
      },
    },
    koulutus: {
      name: 'koulutuksiin-haku',
      link: {
        fi: 'https://opintopolku.fi/konfo/fi/',
        sv: 'https://opintopolku.fi/konfo/sv/',
        en: 'https://opintopolku.fi/konfo/en/',
      },
    },
  };
}
