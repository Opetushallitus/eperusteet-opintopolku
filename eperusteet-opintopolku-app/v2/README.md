# ePerusteet-opintopolku UI

[![Maintainability](https://api.codeclimate.com/v1/badges/24fc0c3e2b968b432319/maintainability)](https://codeclimate.com/github/Opetushallitus/eperusteet-opintopolku/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/24fc0c3e2b968b432319/test_coverage)](https://codeclimate.com/github/Opetushallitus/eperusteet-opintopolku/test_coverage)
[![Build Status](https://travis-ci.org/Opetushallitus/eperusteet-opintopolku.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet-opintopolku)

## Project setup
```
cd eperusteet-opintopolku-app/v2
git submodule update --init --recursive  
yarn install

cd eperusteet-opintopolku-app/v2/eperusteet-frontend-utils/vue
yarn install
yarn gen:api
```

### Compiles and hot-reloads for development

Oletuksellisesti opintopolku käyttää sovelluksien localhost-osoitteita. Lisää ympäristömuuttujiin haluttu sovelluksen osoite: 

```
export EPERUSTEET_SERVICE=https://eperusteet.testiopintopolku.fi
export EPERUSTEET_YLOPS_SERVICE=https://eperusteet.testiopintopolku.fi
export EPERUSTEET_AMOSAA_SERVICE=https://eperusteet.testiopintopolku.fi
```

Sovelluksen käynnistäminen
```
yarn server
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Run your end-to-end tests
```
yarn run test:e2e
```

### Run your unit tests
```
yarn run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
