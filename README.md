# eperusteet-opintopolku

[![Build Status](https://travis-ci.org/Opetushallitus/eperusteet-opintopolku.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet-opintopolku)
[![Maintainability](https://api.codeclimate.com/v1/badges/24fc0c3e2b968b432319/maintainability)](https://codeclimate.com/github/Opetushallitus/eperusteet-opintopolku/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/24fc0c3e2b968b432319/test_coverage)](https://codeclimate.com/github/Opetushallitus/eperusteet-opintopolku/test_coverage)

## 1. Palvelun tehtävä

Opetussuunnitelmien perusteiden julkinen käyttöliittymä.

## 2. Arkkitehtuuri

## 3. Kehitysympäristö

### 3.1. Esivaatimukset

Asenna haluamallasi tavalla (esim [nvm](https://github.com/nvm-sh/nvm)) `Node.js 21`

Projekti käyttää Yarn 4.9.2 pakettienhallintaan. Yarn asentuu automaattisesti kun ajat `yarn install`.

### Rajapintojen generointi

Projekti käyttää eperusteet-frontend-utilsia joka otetaan käyttöön gitin submodulena.
Tämä onnistuu ajamalla projektin juuressa `git submodule update --init --recursive`

Tämän jälkeen generoi typescript interfacet backendin rajapinnasta ajamalla seuraavat komennot:

```bash
cd eperusteet-frontend-utils/vue
yarn install
yarn gen:api
```

Tämän jälkeen poista node_modules-kansio `eperusteet-frontend-utils/vue` alta
ja aja vielä `yarn install` koko projektin juuressa.

Rajapintojen generointiin käytetään oletuksena eperusteisiin generoitua apikuvausta. Tiedoston voi ylikirjoittaa
ympäristömuuttujalla EPERUSTEET_SPECFILE osoittamaan hakemistoon.

### 3.2. Testien ajaminen

Projekti käyttää Vitest-testauskirjastoa.

```bash

# Kaikki testit
yarn test

# Testit watch-tilassa
yarn test --watch

# Testit UI:lla
yarn test --ui

```

### 3.3. Ajaminen lokaalisti

#### Kehitysympäristön käynnistys

Oletuksena sovellus käyttää palveluiden localhost-osoitteita. Käyttääksesi eri palveluosoitteita, aseta seuraavat ympäristömuuttujat:

```bash
export EPERUSTEET_SERVICE=https://eperusteet.testiopintopolku.fi
export EPERUSTEET_YLOPS_SERVICE=https://eperusteet.testiopintopolku.fi
export EPERUSTEET_AMOSAA_SERVICE=https://eperusteet.testiopintopolku.fi
```

Sen jälkeen komento:
```bash
yarn dev
```

Sovellus on käytettävissä osoitteessa http://localhost:9020

#### Lähdekoodin analysoiminen

```bash
yarn lint

# Korjaus automaattisesti
yarn lint --fix

```

#### Tuotantoversion buildaus

Projekti käyttää Vite-builderoa.

```bash
yarn build

# Preview tuotantobuildista
yarn preview
```

## 4. Ympäristöt

### 4.1. Testiympäristöt

Testiympäristöt löytyvät seuraavista osoitteista

- [untuva](https://eperusteet.untuvaopintopolku.fi)
- [hahtuva](https://eperusteet.hahtuvaopintopolku.fi)
- [QA eli pallero](https://eperusteet.testiopintopolku.fi)

### 4.2. Continuous integration

https://github.com/Opetushallitus/eperusteet-opintopolku/actions

## 5. Koodityyli

Projekti on migroitu Vue 3:een.

Suositeltavia resursseja:
 - [Vue 3 style guide](https://vuejs.org/style-guide/)
 - [Vue 3 documentation](https://vuejs.org/guide/introduction.html)
 - [BootstrapVue](https://bootstrap-vue.org/docs)

## ePerusteet-projektit

|Projekti|Build status|Maintainability|Test Coverage|Known Vulnerabilities|
|-----|-----|-----|-----|-----|
|[ePerusteet](https://github.com/Opetushallitus/eperusteet) | [![Build Status](https://travis-ci.org/Opetushallitus/eperusteet.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet)|     |     |     |
|[ePerusteet-amosaa](https://github.com/Opetushallitus/eperusteet-amosaa) | [![Build Status](https://travis-ci.org/Opetushallitus/eperusteet-amosaa.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet-amosaa)|     |     |     |
|[ePerusteet-ylops](https://github.com/Opetushallitus/eperusteet-ylops) | [![Build Status](https://travis-ci.org/Opetushallitus/eperusteet-ylops.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet-ylops)|     |     |     |
|[ePerusteet-ui](https://github.com/Opetushallitus/eperusteet-ui) | [![Build Status](https://travis-ci.org/Opetushallitus/eperusteet-ui.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet-ui)|     |     |     |
|[eperusteet-ylops-ui](https://github.com/Opetushallitus/eperusteet-ylops-ui) | [![Build Status](https://travis-ci.org/Opetushallitus/eperusteet-ylops-ui.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet-ylops-ui) | [![Maintainability](https://api.codeclimate.com/v1/badges/eea9e59302df6e343d57/maintainability)](https://codeclimate.com/github/Opetushallitus/eperusteet-ylops-ui/maintainability) | [![Test Coverage](https://api.codeclimate.com/v1/badges/eea9e59302df6e343d57/test_coverage)](https://codeclimate.com/github/Opetushallitus/eperusteet-ylops-ui/test_coverage)|     |
|[ePerusteet-amosaa-ui](https://github.com/Opetushallitus/eperusteet-amosaa-ui) | [![Build Status](https://travis-ci.org/Opetushallitus/eperusteet-amosaa-ui.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet-amosaa-ui)|     |     |     |
|[ePerusteet-opintopolku](https://github.com/Opetushallitus/eperusteet-opintopolku) | [![Build Status](https://travis-ci.org/Opetushallitus/eperusteet-opintopolku.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet-opintopolku) | [![Maintainability](https://api.codeclimate.com/v1/badges/24fc0c3e2b968b432319/maintainability)](https://codeclimate.com/github/Opetushallitus/eperusteet-opintopolku/maintainability) | [![Test Coverage](https://api.codeclimate.com/v1/badges/24fc0c3e2b968b432319/test_coverage)](https://codeclimate.com/github/Opetushallitus/eperusteet-opintopolku/test_coverage)|     |
|[ePerusteet-backend-utils](https://github.com/Opetushallitus/eperusteet-backend-utils) | [![Build Status](https://travis-ci.org/Opetushallitus/eperusteet-backend-utils.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet-backend-utils)|     |     |     |
|[ePerusteet-frontend-utils](https://github.com/Opetushallitus/eperusteet-frontend-utils) | [![Build Status](https://travis-ci.org/Opetushallitus/eperusteet-frontend-utils.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet-frontend-utils) | [![Maintainability](https://api.codeclimate.com/v1/badges/f782a4a50622ae34a2bd/maintainability)](https://codeclimate.com/github/Opetushallitus/eperusteet-frontend-utils/maintainability) | [![Test Coverage](https://api.codeclimate.com/v1/badges/f782a4a50622ae34a2bd/test_coverage)](https://codeclimate.com/github/Opetushallitus/eperusteet-frontend-utils/test_coverage)|     |