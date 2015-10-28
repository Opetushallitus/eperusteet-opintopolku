# ePerusteet-opintopolku

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
- Node.js (v0.10.37) ([NVM](https://github.com/creationix/nvm) Hyvä vaihtoehto ajaa useampia versioita)
  - (sudo) npm -g install yo
  - Jos bower ja/tai grunt puuttuvat niin aja myös
    (sudo) npm -g install bower
    (sudo) npm -g install grunt-cli

Ajaminen paikallisesti
----------------------

eperusteet-opintopolku-app: 

    cd eperusteet-opintopolku-app/yo
    npm install
    npm install -g grunt-cli
    npm install -g bower
    bower install
    grunt dev