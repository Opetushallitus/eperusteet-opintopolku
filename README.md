# ePerusteet-opintopolku

[![Build Status](https://travis-ci.org/Opetushallitus/eperusteet-opintopolku.svg?branch=master)](https://travis-ci.org/Opetushallitus/eperusteet-opintopolku)
[![Test Coverage](https://api.codeclimate.com/v1/badges/24fc0c3e2b968b432319/test_coverage)](https://codeclimate.com/github/Opetushallitus/eperusteet-opintopolku/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/24fc0c3e2b968b432319/maintainability)](https://codeclimate.com/github/Opetushallitus/eperusteet-opintopolku/maintainability)

## Konfigurointi paikallisesti (grunt)

ePerusteet-servicen sijainti konfiguroidaan kotihakemistoon tiedostoon:

    {HOME}/oph-configuration/eperusteet-opintopolku/config.json

Tiedoston sisältö (korvaa `{host}` oikealla hostilla):

    {
      "eperusteet-service": "https://{host}/eperusteet-service"
    }

Kehitysympäristön pystytys
--------------------------
- JDK 8
- Maven
- Node.js (v6.11.2) ([NVM](https://github.com/creationix/nvm) Hyvä vaihtoehto ajaa useampia versioita)
  - (sudo) npm -g install yo
  - Jos grunt puuttuvat niin aja myös
    (sudo) npm -g install grunt-cli

Ajaminen paikallisesti
----------------------

eperusteet-opintopolku-app: 

    cd eperusteet-opintopolku-app/yo
    npm install
    npm install -g grunt-cli
    npm install -g typings
    typings install
    grunt dev
