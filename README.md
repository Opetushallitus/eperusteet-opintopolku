# eperusteet-opintopolku

[![Build Status](https://github.com/Opetushallitus/eperusteet-opintopolku/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-opintopolku/actions)

## 1. Palvelun tehtävä

Opetussuunnitelmien perusteiden julkinen käyttöliittymä.

## 2. Arkkitehtuuri

Vue 3- ja Vite-pohjainen julkinen käyttöliittymä. UI käyttää PrimeVue- ja Tailwind-kirjastoja.

Sovellus hakee sisällön REST-rajapinnoista:
- [eperusteet](https://github.com/Opetushallitus/eperusteet) (perusteet)
- [eperusteet-ylops](https://github.com/Opetushallitus/eperusteet-ylops) (paikalliset opetussuunnitelmat)
- [eperusteet-amosaa](https://github.com/Opetushallitus/eperusteet-amosaa) (ammatillisen koulutuksen järjestämissuunnitelmat)

Yhteiset UI-komponentit tulevat [eperusteet-frontend-utils](https://github.com/Opetushallitus/eperusteet-frontend-utils) -submodulesta.

## 3. Kehitysympäristö

### 3.1. Esivaatimukset

Asenna haluamallasi tavalla (esim. [nvm](https://github.com/nvm-sh/nvm)) **Node.js 24**.

Projekti käyttää Yarn 4.13.0 -pakettienhallintaa (`packageManager`). Yarn asentuu automaattisesti kun ajat `yarn install` (Corepack).

### Rajapintojen generointi

Projekti käyttää eperusteet-frontend-utilsia, joka otetaan käyttöön gitin submodulena.
Tämä onnistuu ajamalla projektin juuressa `git submodule update --init --recursive`.

Tämän jälkeen generoi TypeScript-interfacet backendin rajapinnasta:

```bash
cd eperusteet-frontend-utils/vue
yarn install
yarn gen:api
```

Tämän jälkeen poista `node_modules`-kansio `eperusteet-frontend-utils/vue` alta
ja aja vielä `yarn install` koko projektin juuressa.

Rajapintojen generointiin käytetään oletuksena eperusteet-, ylops- ja amosaa-repositoroihin generoituja OpenAPI-kuvauksia. Tiedostot voi ylikirjoittaa ympäristömuuttujilla:

- `EPERUSTEET_SPECFILE`
- `EPERUSTEET_YLOPS_SPECFILE`
- `EPERUSTEET_AMOSAA_SPECFILE`

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

Oletuksena `yarn dev` käyttää palveluiden localhost-osoitteita.

Valmiit skriptit eri ympäristöille:

```bash
# Localhost-backendit (eperusteet :8080, ylops :8081, amosaa :8082)
yarn dev:local

# QA / testiopintopolku
yarn dev:qa

# Muut ympäristöt
yarn dev:untuva
yarn dev:hahtuva
yarn dev:prod
```

Sovellus on käytettävissä osoitteessa http://localhost:9020

#### Lähdekoodin analysoiminen

```bash
yarn lint

# Korjaus automaattisesti
yarn lint --fix
```

#### Tuotantoversion buildaus

Projekti käyttää Vite-buildia.

```bash
yarn build

# Preview tuotantobuildista
yarn preview
```

## 4. Ympäristöt

### 4.1. Testiympäristöt

- [untuva](https://eperusteet.untuvaopintopolku.fi)
- [hahtuva](https://eperusteet.hahtuvaopintopolku.fi)
- [QA eli pallero](https://eperusteet.testiopintopolku.fi)

### 4.2. Tuotantoympäristö

[eperusteet.opintopolku.fi](https://eperusteet.opintopolku.fi)

### 4.3. Continuous integration

Buildipalveluna käytetään GitHub Actionsia ([build.yml](/.github/workflows/build.yml)).

## 5. Koodityyli

Projekti on Vue 3:lla.

Suositeltavia resursseja:
- [Vue 3 style guide](https://vuejs.org/style-guide/)
- [Vue 3 documentation](https://vuejs.org/guide/introduction.html)
- [PrimeVue](https://primevue.org/)

## ePerusteet-projektit

|Projekti | Build status |
|-----|-----|
|[ePerusteet](https://github.com/Opetushallitus/eperusteet)|[![Build Status](https://github.com/Opetushallitus/eperusteet/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet/actions)|
|[ePerusteet-amosaa](https://github.com/Opetushallitus/eperusteet-amosaa) | [![Build Status](https://github.com/Opetushallitus/eperusteet-amosaa/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-amosaa/actions)|
|[ePerusteet-ylops](https://github.com/Opetushallitus/eperusteet-ylops) | [![Build Status](https://github.com/Opetushallitus/eperusteet-ylops/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-ylops/actions)|
|[ePerusteet-ui](https://github.com/Opetushallitus/eperusteet-ui) | [![Build Status](https://github.com/Opetushallitus/eperusteet-ui/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-ui/actions)|
|[eperusteet-ylops-ui](https://github.com/Opetushallitus/eperusteet-ylops-ui) | [![Build Status](https://github.com/Opetushallitus/eperusteet-ylops-ui/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-ylops-ui/actions) |
|[ePerusteet-amosaa-ui](https://github.com/Opetushallitus/eperusteet-amosaa-ui) | [![Build Status](https://github.com/Opetushallitus/eperusteet-amosaa-ui/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-amosaa-ui/actions)|
|[ePerusteet-opintopolku](https://github.com/Opetushallitus/eperusteet-opintopolku) | [![Build Status](https://github.com/Opetushallitus/eperusteet-opintopolku/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-opintopolku/actions) |
|[ePerusteet-backend-utils](https://github.com/Opetushallitus/eperusteet-backend-utils) | [![Build Status](https://github.com/Opetushallitus/eperusteet-backend-utils/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-backend-utils/actions)|
|[ePerusteet-frontend-utils](https://github.com/Opetushallitus/eperusteet-frontend-utils) | [![Build Status](https://github.com/Opetushallitus/eperusteet-frontend-utils/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-frontend-utils/actions) |
|[ePerusteet-pdf](https://github.com/Opetushallitus/eperusteet-pdf) | [![Build Status](https://github.com/Opetushallitus/eperusteet-pdf/actions/workflows/build.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-pdf/actions) |
|[eperusteet-e2e-smoke-test](https://github.com/Opetushallitus/eperusteet-e2e-smoke-test) | [![Build Status](https://github.com/Opetushallitus/eperusteet-e2e-smoke-test/actions/workflows/playwright.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-e2e-smoke-test/actions)|
