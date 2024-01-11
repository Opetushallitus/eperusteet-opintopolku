import { Koulutustyyppi, KoulutustyyppiToteutus } from '@shared/tyypit';
import _ from 'lodash';

export const KoodistoLops2019LaajaAlaiset = 'laajaalainenosaaminenlops2021';

export const EperusteetKoulutustyypit = Object.freeze([
  'koulutustyyppi_1', // ammatillinen perustutkinto
  'koulutustyyppi_2', // lukiokoulutus
  'koulutustyyppi_5', // telma
  'koulutustyyppi_6', // lisaopetus
  'koulutustyyppi_11', // ammattitutkinto
  'koulutustyyppi_12', // erikoisammattitutkinto
  'koulutustyyppi_14', // aikuisten lukiokoulutus
  'koulutustyyppi_15', // esiopetus
  'koulutustyyppi_16', // perusopetus
  'koulutustyyppi_17', // aikuisten perusopetus
  'koulutustyyppi_18', // valma
  'koulutustyyppi_20', // varhaiskasvatus
  'koulutustyyppi_22', // perusopetuksen valmistava
  'koulutustyyppi_23', // valmistava lukiokoulutus
  'koulutustyyppi_999907', // taiteen perusopetus,
  'koulutustyyppi_10', // vapaa sivistystyo
  'koulutustyyppi_30', // aikuisten maahanmuuttajien kotoutumiskoulutus
  'koulutustyyppi_35', // vapaa sivistystyo lukutaito
  'koulutustyyppi_40', // tutkintoon valmentava
]);

export function isLukio(koulutustyyppi: string) {
  return _.includes(LukioKoulutustyypit, koulutustyyppi);
}

export const LukioKoulutustyypit = [
  'koulutustyyppi_2',
  'koulutustyyppi_14',
  'koulutustyyppi_23',
];

export const AmmatillisetKoulutustyypit = [
  'koulutustyyppi_1',
  'koulutustyyppi_11',
  'koulutustyyppi_12',
  'koulutustyyppi_5',
  'koulutustyyppi_18',
];

export const VapaasivistystyoKoulutustyypit = [
  'koulutustyyppi_10',
  'koulutustyyppi_30',
  'koulutustyyppi_35',
];

export const PerusopetusKoulutustyypit = [
  'koulutustyyppi_16',
  'koulutustyyppi_22',
  'koulutustyyppi_6',
  'koulutustyyppi_17',
];

export const yleissivistavatKoulutustyypit = [
  'koulutustyyppi_20',
  'koulutustyyppi_15',
  'koulutustyyppi_16',
  'koulutustyyppi_22',
  'koulutustyyppi_6',
  'koulutustyyppi_17',
  'koulutustyyppi_999907',
  'koulutustyyppi_2',
  'koulutustyyppi_23',
  'koulutustyyppi_14',
];

export const themes = {
  'koulutustyyppi_1': 'ammatillinen',
  'koulutustyyppi_11': 'ammatillinen',
  'koulutustyyppi_12': 'ammatillinen',
  'koulutustyyppi_5': 'ammatillinen',
  'koulutustyyppi_18': 'ammatillinen',
  'koulutustyyppi_14': 'lukiokoulutus',
  'koulutustyyppi_15': 'esiopetus',
  'koulutustyyppi_16': 'perusopetus',
  'koulutustyyppi_17': 'perusopetus',
  'koulutustyyppi_2': 'lukiokoulutus',
  'koulutustyyppi_20': 'varhaiskasvatus',
  'koulutustyyppi_22': 'perusopetus',
  'koulutustyyppi_23': 'lukiokoulutus',
  'koulutustyyppi_6': 'perusopetus',
  'koulutustyyppi_999907': 'taiteenperusopetus',
  'koulutustyyppi_10': 'vapaasivistystyo',
  'koulutustyyppi_30': 'kotoutumiskoulutus',
  'koulutustyyppi_35': 'vapaasivistystyo',
  'koulutustyyppi_40': 'tutkintoonvalmentava',
  'koulutustyyppi_muu': 'muukoulutus',
};

export const tyyppiThemes = {
  'digitaalinen_osaaminen': 'digiosaaminen',
};

export enum Toteutus {
  VARHAISKASVATUS = 'varhaiskasvatus',
  ESIOPETUS = 'esiopetus',
  PERUSOPETUS = 'perusopetus',
  TAITEENPERUSOPETUS = 'taiteenperusopetus',
  LUKIOKOULUTUS = 'lukiokoulutus',
  VAPAASIVISTYSTYO = 'vapaasivistystyo',
  AMMATILLINEN = 'ammatillinen',
  TUTKINTOONVALMENTAVA = 'tutkintoonvalmentava',
  KOTOUTUMISKOULUTUS = 'kotoutumiskoulutus',
  MUU = 'muukoulutus',
}

export const EperusteetKoulutustyyppiRyhmat = {
  [Toteutus.VARHAISKASVATUS]: [
    'koulutustyyppi_20',
  ],
  [Toteutus.ESIOPETUS]: [
    'koulutustyyppi_15',
  ],
  [Toteutus.PERUSOPETUS]: PerusopetusKoulutustyypit,
  [Toteutus.TAITEENPERUSOPETUS]: [
    'koulutustyyppi_999907',
  ],
  [Toteutus.LUKIOKOULUTUS]: LukioKoulutustyypit,
  [Toteutus.AMMATILLINEN]: AmmatillisetKoulutustyypit,
  [Toteutus.VAPAASIVISTYSTYO]: [
    'koulutustyyppi_10',
    'koulutustyyppi_35',
  ],
  [Toteutus.TUTKINTOONVALMENTAVA]: [
    'koulutustyyppi_40',
  ],
  [Toteutus.KOTOUTUMISKOULUTUS]: [
    'koulutustyyppi_30',
  ],
  [Toteutus.MUU]: [
    'koulutustyyppi_muu',
  ],
};

export const EperusteetKoulutustyyppiRyhmaSort = {
  [Toteutus.AMMATILLINEN]: 1,
  [Toteutus.VARHAISKASVATUS]: 2,
  [Toteutus.ESIOPETUS]: 3,
  [Toteutus.PERUSOPETUS]: 4,
  [Toteutus.TAITEENPERUSOPETUS]: 5,
  [Toteutus.LUKIOKOULUTUS]: 6,
  [Toteutus.VAPAASIVISTYSTYO]: 7,
  [Toteutus.TUTKINTOONVALMENTAVA]: 8,
  [Toteutus.KOTOUTUMISKOULUTUS]: 9,
};

export interface KoulutustyyppiRyhma {
  ryhma: string,
  koulutustyypit: string[],
}

export function ryhmatKoulutustyypeilla() {
  return _.invertBy(themes);
}

export function koulutustyyppiRyhmat(): KoulutustyyppiRyhma[] {
  const koulutustyyppiRyhmat = ryhmatKoulutustyypeilla();
  return _.chain(themes)
    .invertBy()
    .keys()
    .map(koulutustyyppiryhma => {
      return {
        ryhma: koulutustyyppiryhma,
        koulutustyypit: koulutustyyppiRyhmat[koulutustyyppiryhma],
      } as KoulutustyyppiRyhma;
    })
    .value();
}

export const kouluturtyyppiRyhmat = [
  'varhaiskasvatus',
  'esiopetus',
  'perusopetus',
  'taiteenperusopetus',
  'lukiokoulutus',
  'ammatillinen',
];

export const koulutustyyppiRyhmaSort = {
  'varhaiskasvatus': 1,
  'esiopetus': 2,
  'perusopetus': 3,
  'taiteenperusopetus': 4,
  'lukiokoulutus': 5,
  'ammatillinen': 6,
  'vapaasivistystyo': 7,
  'tutkintoonvalmentava': 8,
  'kotoutumiskoulutus': 9,
};

export const themeColors = {
  'etusivu': [0, 0, 0],
  'ammatillinen': [0, 136, 0],
  'esiopetus': [132, 210, 255],
  'lukiokoulutus': [1, 67, 218],
  'perusopetus': [103, 204, 204],
  'varhaiskasvatus': [255, 204, 51],
  'taiteenperusopetus': [250, 204, 234],
  'vapaasivistystyo': [102, 0, 102],
  'tutkintoonvalmentava': [255, 80, 0],
  'kotoutumiskoulutus': [122, 174, 122],
  'muukoulutus': [230, 8, 149],
};

export const tyyppiColors = {
  'digitaalinen_osaaminen': [230, 246, 255],
  'maarayskokoelma': [255, 255, 255],
};

export const ktToState = {
  'koulutustyyppi_1': 'ammatillinenperustutkinto',
  'koulutustyyppi_11': 'ammattitutkinto',
  'koulutustyyppi_12': 'erikoisammattitutkinto',
  'koulutustyyppi_14': 'aikuistenlukiokoulutus',
  'koulutustyyppi_15': 'esiopetus',
  'koulutustyyppi_16': 'perusopetus',
  'koulutustyyppi_17': 'aikuistenperusopetus',
  'koulutustyyppi_18': 'valma',
  'koulutustyyppi_2': 'lukiokoulutus',
  'koulutustyyppi_20': 'varhaiskasvatus',
  'koulutustyyppi_22': 'perusopetukseenvalmistava',
  'koulutustyyppi_23': 'valmistavalukiokoulutus',
  'koulutustyyppi_5': 'telma',
  'koulutustyyppi_6': 'lisaopetus',
  'koulutustyyppi_999907': 'taiteenperusopetus',
  'koulutustyyppi_10': 'vapaasivistystyo',
  'koulutustyyppi_30': 'kotoutumiskoulutus',
  'koulutustyyppi_35': 'vapaasivistystyolukutaito',
  'koulutustyyppi_40': 'tutkintoonvalmentava',
  'koulutustyyppi_muu': 'muukoulutus',
};

const ktToUrlShortParam = {
  'koulutustyyppi_16': 'perusopetus',
  'koulutustyyppi_2': 'lukiokoulutus',
  'koulutustyyppi_999907': 'tpo',
  'koulutustyyppi_17': 'aipe',
};

const perusteToUrlShortParam = {
  'koulutustyyppi_16': 'perusopetus',
  'koulutustyyppi_2': 'lukiokoulutus',
  'koulutustyyppi_999907': 'tpo',
  'koulutustyyppi_17': 'aipe',
  'koulutustyyppi_14': 'lukiokoulutus',
  'koulutustyyppi_23': 'lukiokoulutus',
};

const stateToKt = _.zipObject(
  _.values(ktToState),
  _.keys(ktToState),
);

export const koulutustyypitPdfTukiOpintopolku = [
  'koulutustyyppi_1', 'koulutustyyppi_5', 'koulutustyyppi_6', 'koulutustyyppi_11',
  'koulutustyyppi_12', 'koulutustyyppi_15', 'koulutustyyppi_18',
  'koulutustyyppi_20', 'koulutustyyppi_999907', 'koulutustyyppi_10', 'koulutustyyppi_40',
  'koulutustyyppi_35', 'koulutustyyppi_30',
  // 'koulutustyyppi_17', 'koulutustyyppi_2', 'koulutustyyppi_14', 'koulutustyyppi_16', 'koulutustyyppi_23',
];

export const koulutustyypitPdfTuki = [
  'koulutustyyppi_1', 'koulutustyyppi_5', 'koulutustyyppi_6', 'koulutustyyppi_11',
  'koulutustyyppi_12', 'koulutustyyppi_15', 'koulutustyyppi_17', 'koulutustyyppi_18',
  'koulutustyyppi_20', 'koulutustyyppi_22', 'koulutustyyppi_999907', 'koulutustyyppi_10', 'koulutustyyppi_40',
  'koulutustyyppi_35', 'koulutustyyppi_30',
  'koulutustyyppi_2', 'koulutustyyppi_14', 'koulutustyyppi_16', 'koulutustyyppi_23',
];

export function koulutustyyppiStateName(koulutustyyppi: string) {
  return ktToState[koulutustyyppi] || koulutustyyppi;
}

export function stateToKoulutustyyppi(statename: string) {
  return stateToKt[statename];
}

export function koulutustyyppiUrlShortParamName(koulutustyyppi: string) {
  return ktToUrlShortParam[koulutustyyppi] || koulutustyyppiStateName(koulutustyyppi);
}

export function perusteKoulutustyyppiUrlShortParamName(koulutustyyppi: string) {
  return perusteToUrlShortParam[koulutustyyppi] || koulutustyyppiStateName(koulutustyyppi);
}

// Koulutustyyppi on oltava myös alityyppinä
export function koulutustyyppiRelaatiot() {
  return [
    ...yleissivastavatKoulutustyyppiRelaatiot(),
    ...vapaasivistystyoKoulutustyyppiRelaatiot(),
  ];
}

export function yleissivastavatKoulutustyyppiRelaatiot() {
  return [{
    koulutustyyppi: 'koulutustyyppi_20',
    alityypit: ['koulutustyyppi_20'],
  }, {
    koulutustyyppi: 'koulutustyyppi_15',
    alityypit: ['koulutustyyppi_15'],
  }, {
    koulutustyyppi: 'koulutustyyppi_16',
    alityypit: [
      'koulutustyyppi_6',
      'koulutustyyppi_16',
      'koulutustyyppi_17',
      'koulutustyyppi_22',
    ],
  }, {
    koulutustyyppi: 'koulutustyyppi_999907',
    alityypit: [
      'koulutustyyppi_999907',
    ],
  }, {
    koulutustyyppi: 'koulutustyyppi_2',
    alityypit: [
      'koulutustyyppi_2',
      'koulutustyyppi_14',
      'koulutustyyppi_23',
    ],
  }];
}

export function vapaasivistystyoKoulutustyyppiRelaatiot() {
  return [{
    koulutustyyppi: 'koulutustyyppi_10',
    alityypit: [
      'koulutustyyppi_10',
      'koulutustyyppi_35',
    ],
  }];
}

export function ryhmat(koulutustyyppi: string) {
  const relaatiot = koulutustyyppiRelaatiot();
  const idx = _.findIndex(relaatiot, { koulutustyyppi });
  if (idx >= 0) {
    return relaatiot[idx].alityypit;
  }
  else {
    return [koulutustyyppi];
  }
}

export function isAmmatillinenKoulutustyyppi(kt: string | undefined): boolean {
  return _.includes(AmmatillisetKoulutustyypit, kt);
}

export function isVapaasivistystyoKoulutustyyppi(kt: string | undefined): boolean {
  return _.includes(VapaasivistystyoKoulutustyypit, kt);
}

export function isAmmatillinen(statename: string): boolean {
  const koulutustyyppi = stateToKoulutustyyppi(statename);
  return themes[koulutustyyppi] === 'ammatillinen';
}

export function isAmmatillinenKoulutustyyppiOrRyhma(kt: string | undefined): boolean {
  return isAmmatillinenKoulutustyyppi(kt) || kt === 'ammatillinen';
}

export function isKoulutustyyppiAmmatillinen(koulutustyyppi: string): boolean {
  return themes[koulutustyyppi] === 'ammatillinen';
}

export function isPerusteVanhaLukio(peruste): boolean {
  return _.toLower(peruste.toteutus) === KoulutustyyppiToteutus.lops
    || (peruste.koulutustyyppi === Koulutustyyppi.lukiovalmistavakoulutus && _.toLower(peruste.toteutus) !== KoulutustyyppiToteutus.lops2019);
}

export function isVstLukutaito(koulutustyyppi): boolean {
  return koulutustyyppi === 'koulutustyyppi_35';
}

export function koulutustyyppiTheme(koulutustyyppi: string) {
  return themes[koulutustyyppi] || koulutustyyppi || 'muu';
}

export function tyyppiTheme(tyyppi: string) {
  return tyyppiThemes[tyyppi] || 'muu';
}

export function koulutustyyppiThemeColor(tyyppi: string) {
  return themeColors[themes[tyyppi]] || themeColors[tyyppi] || tyyppiColors[tyyppi] || [47, 95, 209];
}

export function isKoulutustyyppiPdfTuettu(koulutustyyppi: string | undefined) {
  return _.includes(koulutustyypitPdfTuki, koulutustyyppi);
}

export function isKoulutustyyppiPdfTuettuOpintopolku(koulutustyyppi: string | undefined) {
  return _.includes(koulutustyypitPdfTukiOpintopolku, koulutustyyppi);
}

export function rgb2string(color: number[]) {
  return `rgb(${color[0]},${color[1]},${color[2]})`;
}

export function calculateVisibleColor(bgRGBColor = [0, 0, 0], limit = 125): string {
  // http://www.w3.org/TR/AERT#color-contrast
  const value = Math.round(((bgRGBColor[0] * 299) + (bgRGBColor[1] * 587) + (bgRGBColor[2] * 114)) / 1000);
  if (value > limit) {
    return 'black';
  }
  else {
    return 'white';
  }
}

export function ammatilliset() {
  return [{
    name: 'ammatillinen-koulutus',
    route: {
      name: 'ammatillinenSelaus',
      params: {
        koulutustyyppi: 'ammatillinen',
      },
    },
    alityypit: EperusteetKoulutustyyppiRyhmat.ammatillinen,
  }];
}

export function yleissivistavat() {
  return _.map(yleissivastavatKoulutustyyppiRelaatiot(), kt => {
    return {
      ...kt,
      name: koulutustyyppiStateName(kt.koulutustyyppi),
      route: {
        name: 'kooste',
        params: {
          koulutustyyppi: koulutustyyppiStateName(kt.koulutustyyppi),
        },
      },
    };
  });
}

export function vapaasivistystyo() {
  return [{
    name: koulutustyyppiStateName('koulutustyyppi_10'),
    route: {
      name: 'kooste',
      params: {
        koulutustyyppi: koulutustyyppiStateName('koulutustyyppi_10'),
      },
    },
    alityypit: EperusteetKoulutustyyppiRyhmat.vapaasivistystyo,
  }];
}

export function tutkintoonvalmentava() {
  return [{
    name: koulutustyyppiStateName('koulutustyyppi_40'),
    route: {
      name: 'kooste',
      params: {
        koulutustyyppi: koulutustyyppiStateName('koulutustyyppi_40'),
      },
    },
    alityypit: EperusteetKoulutustyyppiRyhmat.tutkintoonvalmentava,
  }];
}

export function kotoutumiskoulutus() {
  return [{
    name: koulutustyyppiStateName('koulutustyyppi_30'),
    route: {
      name: 'kooste',
      params: {
        koulutustyyppi: koulutustyyppiStateName('koulutustyyppi_30'),
      },
    },
    alityypit: EperusteetKoulutustyyppiRyhmat.kotoutumiskoulutus,
  }];
}

export function muuKoulutus() {
  return [{
    name: 'muukoulutus',
    route: {
      name: 'kooste',
      params: {
        koulutustyyppi: koulutustyyppiStateName('koulutustyyppi_muu'),
      },
    },
    alityypit: ['koulutustyyppi_muu'],
  }];
}

export function koulutustyypinRyhma(koulutustyyppi) {
  return _.find(_.keys(EperusteetKoulutustyyppiRyhmat), ryhma => _.includes(EperusteetKoulutustyyppiRyhmat[ryhma], koulutustyyppi));
}

// etsitään koulutustyypillä ryhmä ja palautetaan kaikki ryhmän koulutustyypit
export function ryhmanKoulutustyypit(koulutustyyppi) {
  if (_.includes(PerusopetusKoulutustyypit, koulutustyyppi)) {
    return PerusopetusKoulutustyypit;
  }
  if (_.includes(LukioKoulutustyypit, koulutustyyppi)) {
    return LukioKoulutustyypit;
  }
  if (_.includes(AmmatillisetKoulutustyypit, koulutustyyppi)) {
    return AmmatillisetKoulutustyypit;
  }
  if (_.includes(VapaasivistystyoKoulutustyypit, koulutustyyppi)) {
    return VapaasivistystyoKoulutustyypit;
  }
  return [koulutustyyppi];
}

export function colorize(topic: string) {
  const str = koulutustyyppiThemeColor(topic);
  return rgb2string(str) || 'black';
}

export function getLaajaAlaisetKoodit() {
  return [{
    koodi: 'lops2019laajaalainenosaaminen_1',
    nimi: {
      fi: 'Globaali- ja kulttuuriosaaminen',
    },
  }, {
    koodi: 'lops2019laajaalainenosaaminen_2',
    nimi: {
      fi: 'Hyvinvointiosaaminen',
    },
  }, {
    koodi: 'lops2019laajaalainenosaaminen_3',
    nimi: {
      fi: 'Vuorovaikutusosaaminen',
    },
  }, {
    koodi: 'lops2019laajaalainenosaaminen_4',
    nimi: {
      fi: 'Eettisyys ja ympäristöosaaminen',
    },
  }, {
    koodi: 'lops2019laajaalainenosaaminen_5',
    nimi: {
      fi: 'Yhteiskunnallinen osaaminen',
    },
  }, {
    koodi: 'lops2019laajaalainenosaaminen_6',
    nimi: {
      fi: 'Monitieteinen ja luova osaaminen',
    },
  }];
}

export const perustetila = Object.freeze({
  luonnos: 'luonnos',
  valmis: 'valmis',
  poistettu: 'poistettu',
});

export const perusteprojektitila = Object.freeze({
  poistettu: 'poistettu',
  laadinta: 'laadinta',
  kommentointi: 'kommentointi',
  valmis: 'valmis',
  julkaistu: 'julkaistu',
});

export function metadataToLocalized(metadata: any[], field: string) {
  return _.mapValues(_.keyBy(metadata, v => _.toLower(v.kieli)), v => v[field]);
}

export function perusteenSuoritustapa(peruste: any): 'OPS' | 'NAYTTO' | 'REFORMI' | 'PERUSOPETUS' | 'LISAOPETUS' | 'VARHAISKASVATUS' | 'OPAS' | 'ESIOPETUS' | 'AIPE' | 'TPO' | 'LUKIOKOULUTUS' | 'LUKIOKOULUTUS2019' {
  const suoritustavat = _.map(peruste.suoritustavat, 'suoritustapakoodi');

  if (_.includes(suoritustavat, 'reformi')) {
    return 'REFORMI';
  }

  if (_.includes(suoritustavat, 'naytto')) {
    return 'NAYTTO';
  }

  return _.toUpper(_.head(suoritustavat)) as any;
}

export function getArvo(koodillinen: any) {
  return _.get(koodillinen, 'koodi.arvo')
    || _.get(koodillinen, 'arvo')
    || _.get(koodillinen, 'koodi.uri')
    || _.get(koodillinen, 'uri')
    || _.get(koodillinen, 'koodi')
    || koodillinen;
}

const splitKoodi = _.memoize((arvo: string) => {
  if (_.isString(arvo) && !_.isEmpty(arvo)) {
    const splitattu = arvo.match(/^([^0-9]*?)(\d+$)/);

    if (splitattu && splitattu.length > 2) {
      return [splitattu[1], Number(splitattu[2])];
    }
  }
  return [arvo, 0];
});

export function getUri(koodillinen: any) {
  return _.get(koodillinen, 'koodi.uri', _.get(koodillinen, 'uri', koodillinen));
}

export function koodiAlku(koodillinen: object | string) {
  return _.toLower(_.toString(splitKoodi(getArvo(koodillinen))[0]));
}

export function koodiNumero(koodillinen: object | string) {
  return splitKoodi(getArvo(koodillinen))[1];
}

export function koodiSorters(): any[] {
  return [koodiAlku, koodiNumero];
}
