import _ from 'lodash';

const ktToState = {
  "koulutustyyppi_1": "ammatillinenperustutkinto",
  "koulutustyyppi_11": "ammattitutkinto",
  "koulutustyyppi_12": "erikoisammattitutkinto",
  "koulutustyyppi_14": "aikuistenlukiokoulutus",
  "koulutustyyppi_15": "esiopetus",
  "koulutustyyppi_16": "perusopetus",
  "koulutustyyppi_17": "aikuistenperusopetus",
  "koulutustyyppi_18": "valma",
  "koulutustyyppi_2": "lukiokoulutus",
  "koulutustyyppi_20": "varhaiskasvatus",
  "koulutustyyppi_22": "perusopetukseenvalmistava",
  "koulutustyyppi_23": "valmistavalukiokoulutus",
  "koulutustyyppi_5": "telma",
  "koulutustyyppi_6": "lisaopetus",
  "koulutustyyppi_999907": "taiteenperusopetus",
}

const stateToKt = _.zipObject(
  _.values(ktToState),
  _.keys(ktToState),
);

export function koulutustyyppiStateName(koulutustyyppi: string) {
  return ktToState[koulutustyyppi] || koulutustyyppi;
}

export function stateToKoulutustyyppi(statename: string) {
  return stateToKt[statename];
}

export function koulutustyyppiRelaatiot() {
  return [{
    koulutustyyppi: 'koulutustyyppi_20',
    alityypit: [],
  }, {
    koulutustyyppi: 'koulutustyyppi_15',
    alityypit: [],
  }, {
    koulutustyyppi: 'koulutustyyppi_6',
    alityypit: [],
  }, {
    koulutustyyppi: 'koulutustyyppi_16',
    alityypit: [
      'koulutustyyppi_16',
      'koulutustyyppi_17',
      'koulutustyyppi_22',
    ],
  }, {
    koulutustyyppi: 'koulutustyyppi_999907',
    alityypit: [
      'koulutustyyppi_999907',
    ],
  }];
}
