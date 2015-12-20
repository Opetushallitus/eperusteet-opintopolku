epOpintopolkuApp
  .factory('LukioData', function (Algoritmit, $state, Kieli, Utils) {

    var lukioRakenne= {
      "root" : true,
      "muokattu" : 1450125511042,
      "opsId" : 69962,
      "perusteen" : {
        "perusteId" : 8626440,
        "oppiaineet" : [ {
          "id" : 8626494,
          "tunniste" : "43d195e9-b4d7-47d0-9a3c-c234b4604c88",
          "koodiUri" : "oppiaineetyleissivistava2_kt",
          "koodiArvo" : "KT",
          "koosteinen" : true,
          "jarjestys" : 2,
          "abstrakti" : false,
          "nimi" : {
            "fi" : "Uskonto",
            "_id" : "8626766"
          },
          "kuvaus" : null,
          "pakollinenKurssiKuvaus" : null,
          "syventavaKurssiKuvaus" : null,
          "soveltavaKurssiKuvaus" : null,
          "tehtava" : null,
          "tavoitteet" : {
            "id" : null,
            "otsikko" : {
              "fi" : "Opetuksen tavoitteet",
              "_id" : "8626767"
            },
            "teksti" : {
              "fi" : "<p>Yleisesti uskottavat tavoitteet.</p>",
              "_id" : "8626768"
            }
          },
          "arviointi" : null,
          "oppimaarat" : [ {
            "id" : 8626498,
            "tunniste" : "70abd299-cb7d-4c43-b0d0-fefb605d0487",
            "koodiUri" : "oppiaineetyleissivistava2_kt2",
            "koodiArvo" : "KT2",
            "koosteinen" : false,
            "jarjestys" : 2,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Ortodoksinen uskonto",
              "_id" : "8626878"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ {
              "id" : 8627131,
              "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
              "nimi" : {
                "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                "_id" : "8627114"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk5",
              "koodiArvo" : "UK5",
              "lokalisoituKoodi" : {
                "fi" : "UK5",
                "_id" : "8627115"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 3,
              "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626687,
              "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
              "nimi" : {
                "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                "_id" : "8627006"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk1",
              "koodiArvo" : "UK1",
              "lokalisoituKoodi" : {
                "fi" : "UK1",
                "_id" : "8627007"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626689,
              "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
              "nimi" : {
                "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                "_id" : "8627110"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk3",
              "koodiArvo" : "UK3",
              "lokalisoituKoodi" : {
                "fi" : "UK3",
                "_id" : "8627111"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 2,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627132,
              "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
              "nimi" : {
                "fi" : "Uskonnot ja media",
                "_id" : "8627116"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk6",
              "koodiArvo" : "UK6",
              "lokalisoituKoodi" : {
                "fi" : "UK6",
                "_id" : "8627117"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            } ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          }, {
            "id" : 8626497,
            "tunniste" : "6015b29d-844b-4b49-ae56-83953b9cd299",
            "koodiUri" : "oppiaineetyleissivistava2_kt5",
            "koodiArvo" : "KT5",
            "koosteinen" : false,
            "jarjestys" : 4,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Juutalainen uskonto",
              "_id" : "8626877"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ {
              "id" : 8626689,
              "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
              "nimi" : {
                "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                "_id" : "8627110"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk3",
              "koodiArvo" : "UK3",
              "lokalisoituKoodi" : {
                "fi" : "UK3",
                "_id" : "8627111"
              },
              "oppiaineId" : 8626497,
              "jarjestys" : 2,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627131,
              "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
              "nimi" : {
                "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                "_id" : "8627114"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk5",
              "koodiArvo" : "UK5",
              "lokalisoituKoodi" : {
                "fi" : "UK5",
                "_id" : "8627115"
              },
              "oppiaineId" : 8626497,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627132,
              "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
              "nimi" : {
                "fi" : "Uskonnot ja media",
                "_id" : "8627116"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk6",
              "koodiArvo" : "UK6",
              "lokalisoituKoodi" : {
                "fi" : "UK6",
                "_id" : "8627117"
              },
              "oppiaineId" : 8626497,
              "jarjestys" : 5,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627130,
              "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
              "nimi" : {
                "fi" : "Uskonto suomalaisessa yhteiskunnassa",
                "_id" : "8627112"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk4",
              "koodiArvo" : "UK4",
              "lokalisoituKoodi" : {
                "fi" : "UK4",
                "_id" : "8627113"
              },
              "oppiaineId" : 8626497,
              "jarjestys" : 3,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626687,
              "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
              "nimi" : {
                "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                "_id" : "8627006"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk1",
              "koodiArvo" : "UK1",
              "lokalisoituKoodi" : {
                "fi" : "UK1",
                "_id" : "8627007"
              },
              "oppiaineId" : 8626497,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            } ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          }, {
            "id" : 8626499,
            "tunniste" : "639c7d09-be48-4288-bb98-f9bec240bec5",
            "koodiUri" : "oppiaineetyleissivistava2_kt3",
            "koodiArvo" : "KT3",
            "koosteinen" : false,
            "jarjestys" : 3,
            "abstrakti" : null,
            "nimi" : {
              "fi" : "Katolinen uskonto",
              "_id" : "8627118"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : {
              "fi" : "<p>Syventävä katolinen kuvaus.</p>",
              "_id" : "8627119"
            },
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ {
              "id" : 8626689,
              "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
              "nimi" : {
                "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                "_id" : "8627110"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk3",
              "koodiArvo" : "UK3",
              "lokalisoituKoodi" : {
                "fi" : "UK3",
                "_id" : "8627111"
              },
              "oppiaineId" : 8626499,
              "jarjestys" : 3,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626687,
              "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
              "nimi" : {
                "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                "_id" : "8627006"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk1",
              "koodiArvo" : "UK1",
              "lokalisoituKoodi" : {
                "fi" : "UK1",
                "_id" : "8627007"
              },
              "oppiaineId" : 8626499,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626688,
              "tunniste" : "0f7101cf-a103-4725-9228-2283772d4b2a",
              "nimi" : {
                "fi" : "Maailmanlaajuinen katolisuus",
                "_id" : "8627008"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk2",
              "koodiArvo" : "UK2",
              "lokalisoituKoodi" : {
                "fi" : "UK2",
                "_id" : "8627009"
              },
              "oppiaineId" : 8626499,
              "jarjestys" : 2,
              "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627132,
              "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
              "nimi" : {
                "fi" : "Uskonnot ja media",
                "_id" : "8627116"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk6",
              "koodiArvo" : "UK6",
              "lokalisoituKoodi" : {
                "fi" : "UK6",
                "_id" : "8627117"
              },
              "oppiaineId" : 8626499,
              "jarjestys" : 6,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627130,
              "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
              "nimi" : {
                "fi" : "Uskonto suomalaisessa yhteiskunnassa",
                "_id" : "8627112"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk4",
              "koodiArvo" : "UK4",
              "lokalisoituKoodi" : {
                "fi" : "UK4",
                "_id" : "8627113"
              },
              "oppiaineId" : 8626499,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627131,
              "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
              "nimi" : {
                "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                "_id" : "8627114"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk5",
              "koodiArvo" : "UK5",
              "lokalisoituKoodi" : {
                "fi" : "UK5",
                "_id" : "8627115"
              },
              "oppiaineId" : 8626499,
              "jarjestys" : 5,
              "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            } ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : {
                "fi" : "<p>Syventävä katolinen kuvaus.</p>",
                "_id" : "8627119"
              }
            }
          }, {
            "id" : 8626496,
            "tunniste" : "b5f6e632-b840-4144-a694-347b3c7ea0b0",
            "koodiUri" : "oppiaineetyleissivistava2_kt1",
            "koodiArvo" : "KT1",
            "koosteinen" : false,
            "jarjestys" : 1,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Evankelisluterilainen uskonto",
              "_id" : "8626874"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : {
              "id" : null,
              "otsikko" : {
                "fi" : "Opetuksen tavoitteet",
                "_id" : "8626875"
              },
              "teksti" : {
                "fi" : "<p>Evankelisluterilaisen uskonnon tavoitteet</p>",
                "_id" : "8626876"
              }
            },
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ {
              "id" : 8627130,
              "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
              "nimi" : {
                "fi" : "Uskonto suomalaisessa yhteiskunnassa",
                "_id" : "8627112"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk4",
              "koodiArvo" : "UK4",
              "lokalisoituKoodi" : {
                "fi" : "UK4",
                "_id" : "8627113"
              },
              "oppiaineId" : 8626496,
              "jarjestys" : 3,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627131,
              "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
              "nimi" : {
                "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                "_id" : "8627114"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk5",
              "koodiArvo" : "UK5",
              "lokalisoituKoodi" : {
                "fi" : "UK5",
                "_id" : "8627115"
              },
              "oppiaineId" : 8626496,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626687,
              "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
              "nimi" : {
                "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                "_id" : "8627006"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk1",
              "koodiArvo" : "UK1",
              "lokalisoituKoodi" : {
                "fi" : "UK1",
                "_id" : "8627007"
              },
              "oppiaineId" : 8626496,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626689,
              "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
              "nimi" : {
                "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                "_id" : "8627110"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk3",
              "koodiArvo" : "UK3",
              "lokalisoituKoodi" : {
                "fi" : "UK3",
                "_id" : "8627111"
              },
              "oppiaineId" : 8626496,
              "jarjestys" : 2,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627132,
              "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
              "nimi" : {
                "fi" : "Uskonnot ja media",
                "_id" : "8627116"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk6",
              "koodiArvo" : "UK6",
              "lokalisoituKoodi" : {
                "fi" : "UK6",
                "_id" : "8627117"
              },
              "oppiaineId" : 8626496,
              "jarjestys" : 5,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            } ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          } ],
          "kurssit" : [ ],
          "kurssiTyyppiKuvaukset" : {
            "VALTAKUNNALLINEN_PAKOLLINEN" : null,
            "VALTAKUNNALLINEN_SOVELTAVA" : null,
            "VALTAKUNNALLINEN_SYVENTAVA" : null
          }
        }, {
          "id" : 8626495,
          "tunniste" : "ab25add7-553d-45c8-8388-4b099980728e",
          "koodiUri" : "oppiaineetyleissivistava2_li",
          "koodiArvo" : "LI",
          "koosteinen" : false,
          "jarjestys" : 3,
          "abstrakti" : null,
          "nimi" : {
            "fi" : "Liikunta",
            "_id" : "8626769"
          },
          "kuvaus" : null,
          "pakollinenKurssiKuvaus" : {
            "fi" : "<p>Pakollisten kurssien kuvaus</p>",
            "_id" : "8626870"
          },
          "syventavaKurssiKuvaus" : {
            "fi" : "<p>Syventävien kurssien kuvaus</p>",
            "_id" : "8626871"
          },
          "soveltavaKurssiKuvaus" : {
            "fi" : "<p>Soveltavien kuvaus</p>",
            "_id" : "8627005"
          },
          "tehtava" : {
            "id" : null,
            "otsikko" : {
              "_id" : "8626872"
            },
            "teksti" : {
              "_id" : "8626873"
            }
          },
          "tavoitteet" : null,
          "arviointi" : null,
          "oppimaarat" : [ ],
          "kurssit" : [ {
            "id" : 8626684,
            "tunniste" : "4b2a21b2-3897-46f8-a7a0-94b14f608ebc",
            "nimi" : {
              "fi" : "Energiaa liikunnasta",
              "_id" : "8626879"
            },
            "kuvaus" : null,
            "koodiUri" : "lukionkurssit_li1",
            "koodiArvo" : "LI1",
            "lokalisoituKoodi" : {
              "fi" : "LI1",
              "_id" : "8627000"
            },
            "oppiaineId" : 8626495,
            "jarjestys" : 1,
            "tyyppi" : "PAKOLLINEN",
            "opetussuunnitelma" : null,
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "id" : 8626685,
            "tunniste" : "d359da1b-38a7-4475-9773-5778ea69fa9b",
            "nimi" : {
              "fi" : "Aktiivinen elämäntapa",
              "_id" : "8627001"
            },
            "kuvaus" : null,
            "koodiUri" : "lukionkurssit_li2",
            "koodiArvo" : "LI2",
            "lokalisoituKoodi" : {
              "fi" : "LI2",
              "_id" : "8627002"
            },
            "oppiaineId" : 8626495,
            "jarjestys" : 2,
            "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
            "opetussuunnitelma" : null,
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "id" : 8626686,
            "tunniste" : "15b9e88d-586b-4ed5-9cf2-acd8cc3e6c89",
            "nimi" : {
              "fi" : "Terveyttä liikkuen",
              "_id" : "8627003"
            },
            "kuvaus" : null,
            "koodiUri" : "lukionkurssit_li3",
            "koodiArvo" : "LI3",
            "lokalisoituKoodi" : {
              "fi" : "LI3",
              "_id" : "8627004"
            },
            "oppiaineId" : 8626495,
            "jarjestys" : 3,
            "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
            "opetussuunnitelma" : null,
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          } ],
          "kurssiTyyppiKuvaukset" : {
            "VALTAKUNNALLINEN_PAKOLLINEN" : {
              "fi" : "<p>Pakollisten kurssien kuvaus</p>",
              "_id" : "8626870"
            },
            "VALTAKUNNALLINEN_SOVELTAVA" : {
              "fi" : "<p>Soveltavien kuvaus</p>",
              "_id" : "8627005"
            },
            "VALTAKUNNALLINEN_SYVENTAVA" : {
              "fi" : "<p>Syventävien kurssien kuvaus</p>",
              "_id" : "8626871"
            }
          }
        }, {
          "id" : 8626490,
          "tunniste" : "62f61305-ab59-48b3-9932-3d4d0a229766",
          "koodiUri" : "oppiaineetyleissivistava2_vk",
          "koodiArvo" : "VK",
          "koosteinen" : true,
          "jarjestys" : 1,
          "abstrakti" : false,
          "nimi" : {
            "fi" : "Vieraat kielet",
            "_id" : "8626377"
          },
          "kuvaus" : null,
          "pakollinenKurssiKuvaus" : null,
          "syventavaKurssiKuvaus" : null,
          "soveltavaKurssiKuvaus" : null,
          "tehtava" : {
            "id" : null,
            "otsikko" : {
              "_id" : "8626379"
            },
            "teksti" : {
              "_id" : "8626520"
            }
          },
          "tavoitteet" : {
            "id" : null,
            "otsikko" : {
              "fi" : "Opetuksen tavoitteet",
              "_id" : "8626378"
            },
            "teksti" : {
              "fi" : "<p>Vieraiden kielien yleiset tavoitteet</p>",
              "_id" : "8626522"
            }
          },
          "arviointi" : {
            "id" : null,
            "otsikko" : {
              "fi" : "Arviointi",
              "_id" : "8626376"
            },
            "teksti" : {
              "fi" : "<p>Vieraiden kielien yleiset arvioinnit.</p>",
              "_id" : "8626521"
            }
          },
          "oppimaarat" : [ {
            "id" : 8626492,
            "tunniste" : "330df029-c8de-4e5a-a4fc-58a9e05a6ce2",
            "koodiUri" : "oppiaineetyleissivistava2_a12",
            "koodiArvo" : "A12",
            "koosteinen" : false,
            "jarjestys" : 1,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Englannin A1-oppimäärä",
              "_id" : "8626529"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : {
              "fi" : "<p>Englannin pakollsiet kurssit</p>",
              "_id" : "8626590"
            },
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : {
              "id" : null,
              "otsikko" : {
                "_id" : "8626591"
              },
              "teksti" : {
                "_id" : "8626592"
              }
            },
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ {
              "id" : 8626681,
              "tunniste" : "cd3ccfbc-6371-40f9-a666-213b7bc1a5e9",
              "nimi" : {
                "fi" : "Ihminen verkostoissa",
                "_id" : "8626698"
              },
              "kuvaus" : {
                "fi" : "<p>Toinen kurssi</p>",
                "_id" : "8626697"
              },
              "koodiUri" : "lukionkurssit_ena2",
              "koodiArvo" : "ENA2",
              "lokalisoituKoodi" : {
                "fi" : "ENA2",
                "_id" : "8626699"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 2,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626682,
              "tunniste" : "599aa0d6-edb8-4dff-8e79-97e669ab86a6",
              "nimi" : {
                "fi" : "Kulttuuri-ilmiöitä",
                "_id" : "8626760"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_ena3",
              "koodiArvo" : "ENA3",
              "lokalisoituKoodi" : {
                "fi" : "ENA3",
                "_id" : "8626761"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 3,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626680,
              "tunniste" : "08b49ab9-6c05-4df7-80e5-eb467dd84354",
              "nimi" : {
                "fi" : "Englannin kieli ja maailmani",
                "_id" : "8626691"
              },
              "kuvaus" : {
                "fi" : "<p>Englannin 1. kurssi</p>",
                "_id" : "8626690"
              },
              "koodiUri" : "lukionkurssit_ena1",
              "koodiArvo" : "ENA1",
              "lokalisoituKoodi" : {
                "fi" : "ENA1",
                "_id" : "8626692"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : {
                "id" : null,
                "otsikko" : {
                  "fi" : "Tavoitteet",
                  "_id" : "8626693"
                },
                "teksti" : {
                  "fi" : "<p>Jolla voi olla tavoite</p>",
                  "_id" : "8626695"
                }
              },
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626683,
              "tunniste" : "c8a5aa31-7d31-4a40-a319-d660f1b898e2",
              "nimi" : {
                "fi" : "Viesti ja vaikuta puhuen",
                "_id" : "8626763"
              },
              "kuvaus" : {
                "fi" : "<p>Syventävä kurssi</p>",
                "_id" : "8626762"
              },
              "koodiUri" : "lukionkurssit_ena8",
              "koodiArvo" : "ENA8",
              "lokalisoituKoodi" : {
                "fi" : "ENA8",
                "_id" : "8626764"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            } ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : {
                "fi" : "<p>Englannin pakollsiet kurssit</p>",
                "_id" : "8626590"
              },
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          }, {
            "id" : 8627220,
            "tunniste" : "d9b6e712-ea38-4447-bdb2-66cedf0ecdf2",
            "koodiUri" : "oppiaineetyleissivistava2_b2",
            "koodiArvo" : "B2",
            "koosteinen" : false,
            "jarjestys" : 4,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Vieraat kielet, B2-oppimäärä",
              "_id" : "8627230"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          }, {
            "id" : 8626491,
            "tunniste" : "ab605112-fde9-49c3-9f31-dfc87aa9b551",
            "koodiUri" : "oppiaineetyleissivistava2_a1",
            "koodiArvo" : "A1",
            "koosteinen" : false,
            "jarjestys" : 2,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Vieraat kielet, A1-oppimäärä",
              "_id" : "8626523"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : {
              "fi" : "<p>Pakolliset vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
              "_id" : "8626524"
            },
            "syventavaKurssiKuvaus" : {
              "fi" : "<p>Valtakunnalliset syventävät vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
              "_id" : "8626526"
            },
            "soveltavaKurssiKuvaus" : {
              "fi" : "<p>Valtakunnalliset soveltavat vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
              "_id" : "8626525"
            },
            "tehtava" : {
              "id" : null,
              "otsikko" : {
                "_id" : "8626527"
              },
              "teksti" : {
                "_id" : "8626528"
              }
            },
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : {
                "fi" : "<p>Pakolliset vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
                "_id" : "8626524"
              },
              "VALTAKUNNALLINEN_SOVELTAVA" : {
                "fi" : "<p>Valtakunnalliset soveltavat vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
                "_id" : "8626525"
              },
              "VALTAKUNNALLINEN_SYVENTAVA" : {
                "fi" : "<p>Valtakunnalliset syventävät vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
                "_id" : "8626526"
              }
            }
          }, {
            "id" : 8626493,
            "tunniste" : "d9abf45d-3c37-4fa6-a179-35c8306665c5",
            "koodiUri" : "oppiaineetyleissivistava2_b1",
            "koodiArvo" : "B1",
            "koosteinen" : false,
            "jarjestys" : 3,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Vieraat kielet, B1-oppimäärä",
              "_id" : "8626765"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          } ],
          "kurssit" : [ ],
          "kurssiTyyppiKuvaukset" : {
            "VALTAKUNNALLINEN_PAKOLLINEN" : null,
            "VALTAKUNNALLINEN_SOVELTAVA" : null,
            "VALTAKUNNALLINEN_SYVENTAVA" : null
          }
        } ]
      },
      "oppiaineet" : [ {
        "perusteen" : {
          "id" : 8626494,
          "tunniste" : "43d195e9-b4d7-47d0-9a3c-c234b4604c88",
          "koodiUri" : "oppiaineetyleissivistava2_kt",
          "koodiArvo" : "KT",
          "koosteinen" : true,
          "jarjestys" : 2,
          "abstrakti" : false,
          "nimi" : {
            "fi" : "Uskonto",
            "_id" : "8626766"
          },
          "kuvaus" : null,
          "pakollinenKurssiKuvaus" : null,
          "syventavaKurssiKuvaus" : null,
          "soveltavaKurssiKuvaus" : null,
          "tehtava" : null,
          "tavoitteet" : {
            "id" : null,
            "otsikko" : {
              "fi" : "Opetuksen tavoitteet",
              "_id" : "8626767"
            },
            "teksti" : {
              "fi" : "<p>Yleisesti uskottavat tavoitteet.</p>",
              "_id" : "8626768"
            }
          },
          "arviointi" : null,
          "oppimaarat" : [ {
            "id" : 8626498,
            "tunniste" : "70abd299-cb7d-4c43-b0d0-fefb605d0487",
            "koodiUri" : "oppiaineetyleissivistava2_kt2",
            "koodiArvo" : "KT2",
            "koosteinen" : false,
            "jarjestys" : 2,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Ortodoksinen uskonto",
              "_id" : "8626878"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ {
              "id" : 8627131,
              "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
              "nimi" : {
                "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                "_id" : "8627114"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk5",
              "koodiArvo" : "UK5",
              "lokalisoituKoodi" : {
                "fi" : "UK5",
                "_id" : "8627115"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 3,
              "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626687,
              "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
              "nimi" : {
                "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                "_id" : "8627006"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk1",
              "koodiArvo" : "UK1",
              "lokalisoituKoodi" : {
                "fi" : "UK1",
                "_id" : "8627007"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626689,
              "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
              "nimi" : {
                "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                "_id" : "8627110"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk3",
              "koodiArvo" : "UK3",
              "lokalisoituKoodi" : {
                "fi" : "UK3",
                "_id" : "8627111"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 2,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627132,
              "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
              "nimi" : {
                "fi" : "Uskonnot ja media",
                "_id" : "8627116"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk6",
              "koodiArvo" : "UK6",
              "lokalisoituKoodi" : {
                "fi" : "UK6",
                "_id" : "8627117"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            } ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          }, {
            "id" : 8626497,
            "tunniste" : "6015b29d-844b-4b49-ae56-83953b9cd299",
            "koodiUri" : "oppiaineetyleissivistava2_kt5",
            "koodiArvo" : "KT5",
            "koosteinen" : false,
            "jarjestys" : 4,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Juutalainen uskonto",
              "_id" : "8626877"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ {
              "id" : 8626689,
              "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
              "nimi" : {
                "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                "_id" : "8627110"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk3",
              "koodiArvo" : "UK3",
              "lokalisoituKoodi" : {
                "fi" : "UK3",
                "_id" : "8627111"
              },
              "oppiaineId" : 8626497,
              "jarjestys" : 2,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627131,
              "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
              "nimi" : {
                "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                "_id" : "8627114"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk5",
              "koodiArvo" : "UK5",
              "lokalisoituKoodi" : {
                "fi" : "UK5",
                "_id" : "8627115"
              },
              "oppiaineId" : 8626497,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627132,
              "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
              "nimi" : {
                "fi" : "Uskonnot ja media",
                "_id" : "8627116"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk6",
              "koodiArvo" : "UK6",
              "lokalisoituKoodi" : {
                "fi" : "UK6",
                "_id" : "8627117"
              },
              "oppiaineId" : 8626497,
              "jarjestys" : 5,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627130,
              "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
              "nimi" : {
                "fi" : "Uskonto suomalaisessa yhteiskunnassa",
                "_id" : "8627112"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk4",
              "koodiArvo" : "UK4",
              "lokalisoituKoodi" : {
                "fi" : "UK4",
                "_id" : "8627113"
              },
              "oppiaineId" : 8626497,
              "jarjestys" : 3,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626687,
              "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
              "nimi" : {
                "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                "_id" : "8627006"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk1",
              "koodiArvo" : "UK1",
              "lokalisoituKoodi" : {
                "fi" : "UK1",
                "_id" : "8627007"
              },
              "oppiaineId" : 8626497,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            } ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          }, {
            "id" : 8626499,
            "tunniste" : "639c7d09-be48-4288-bb98-f9bec240bec5",
            "koodiUri" : "oppiaineetyleissivistava2_kt3",
            "koodiArvo" : "KT3",
            "koosteinen" : false,
            "jarjestys" : 3,
            "abstrakti" : null,
            "nimi" : {
              "fi" : "Katolinen uskonto",
              "_id" : "8627118"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : {
              "fi" : "<p>Syventävä katolinen kuvaus.</p>",
              "_id" : "8627119"
            },
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ {
              "id" : 8626689,
              "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
              "nimi" : {
                "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                "_id" : "8627110"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk3",
              "koodiArvo" : "UK3",
              "lokalisoituKoodi" : {
                "fi" : "UK3",
                "_id" : "8627111"
              },
              "oppiaineId" : 8626499,
              "jarjestys" : 3,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626687,
              "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
              "nimi" : {
                "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                "_id" : "8627006"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk1",
              "koodiArvo" : "UK1",
              "lokalisoituKoodi" : {
                "fi" : "UK1",
                "_id" : "8627007"
              },
              "oppiaineId" : 8626499,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626688,
              "tunniste" : "0f7101cf-a103-4725-9228-2283772d4b2a",
              "nimi" : {
                "fi" : "Maailmanlaajuinen katolisuus",
                "_id" : "8627008"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk2",
              "koodiArvo" : "UK2",
              "lokalisoituKoodi" : {
                "fi" : "UK2",
                "_id" : "8627009"
              },
              "oppiaineId" : 8626499,
              "jarjestys" : 2,
              "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627132,
              "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
              "nimi" : {
                "fi" : "Uskonnot ja media",
                "_id" : "8627116"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk6",
              "koodiArvo" : "UK6",
              "lokalisoituKoodi" : {
                "fi" : "UK6",
                "_id" : "8627117"
              },
              "oppiaineId" : 8626499,
              "jarjestys" : 6,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627130,
              "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
              "nimi" : {
                "fi" : "Uskonto suomalaisessa yhteiskunnassa",
                "_id" : "8627112"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk4",
              "koodiArvo" : "UK4",
              "lokalisoituKoodi" : {
                "fi" : "UK4",
                "_id" : "8627113"
              },
              "oppiaineId" : 8626499,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627131,
              "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
              "nimi" : {
                "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                "_id" : "8627114"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk5",
              "koodiArvo" : "UK5",
              "lokalisoituKoodi" : {
                "fi" : "UK5",
                "_id" : "8627115"
              },
              "oppiaineId" : 8626499,
              "jarjestys" : 5,
              "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            } ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : {
                "fi" : "<p>Syventävä katolinen kuvaus.</p>",
                "_id" : "8627119"
              }
            }
          }, {
            "id" : 8626496,
            "tunniste" : "b5f6e632-b840-4144-a694-347b3c7ea0b0",
            "koodiUri" : "oppiaineetyleissivistava2_kt1",
            "koodiArvo" : "KT1",
            "koosteinen" : false,
            "jarjestys" : 1,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Evankelisluterilainen uskonto",
              "_id" : "8626874"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : {
              "id" : null,
              "otsikko" : {
                "fi" : "Opetuksen tavoitteet",
                "_id" : "8626875"
              },
              "teksti" : {
                "fi" : "<p>Evankelisluterilaisen uskonnon tavoitteet</p>",
                "_id" : "8626876"
              }
            },
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ {
              "id" : 8627130,
              "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
              "nimi" : {
                "fi" : "Uskonto suomalaisessa yhteiskunnassa",
                "_id" : "8627112"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk4",
              "koodiArvo" : "UK4",
              "lokalisoituKoodi" : {
                "fi" : "UK4",
                "_id" : "8627113"
              },
              "oppiaineId" : 8626496,
              "jarjestys" : 3,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627131,
              "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
              "nimi" : {
                "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                "_id" : "8627114"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk5",
              "koodiArvo" : "UK5",
              "lokalisoituKoodi" : {
                "fi" : "UK5",
                "_id" : "8627115"
              },
              "oppiaineId" : 8626496,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626687,
              "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
              "nimi" : {
                "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                "_id" : "8627006"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk1",
              "koodiArvo" : "UK1",
              "lokalisoituKoodi" : {
                "fi" : "UK1",
                "_id" : "8627007"
              },
              "oppiaineId" : 8626496,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626689,
              "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
              "nimi" : {
                "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                "_id" : "8627110"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk3",
              "koodiArvo" : "UK3",
              "lokalisoituKoodi" : {
                "fi" : "UK3",
                "_id" : "8627111"
              },
              "oppiaineId" : 8626496,
              "jarjestys" : 2,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627132,
              "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
              "nimi" : {
                "fi" : "Uskonnot ja media",
                "_id" : "8627116"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk6",
              "koodiArvo" : "UK6",
              "lokalisoituKoodi" : {
                "fi" : "UK6",
                "_id" : "8627117"
              },
              "oppiaineId" : 8626496,
              "jarjestys" : 5,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            } ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          } ],
          "kurssit" : [ ],
          "kurssiTyyppiKuvaukset" : {
            "VALTAKUNNALLINEN_PAKOLLINEN" : null,
            "VALTAKUNNALLINEN_SOVELTAVA" : null,
            "VALTAKUNNALLINEN_SYVENTAVA" : null
          }
        },
        "id" : 70105,
        "oppiaineId" : null,
        "muokattu" : 1450425212656,
        "tunniste" : "43d195e9-b4d7-47d0-9a3c-c234b4604c88",
        "tila" : "luonnos",
        "oma" : true,
        "maariteltyPohjassa" : true,
        "jarjestys" : null,
        "tyyppi" : "yhteinen",
        "laajuus" : null,
        "koosteinen" : true,
        "nimi" : {
          "fi" : "Uskonto",
          "_id" : "70060"
        },
        "abstrakti" : null,
        "tehtava" : null,
        "tavoitteet" : null,
        "arviointi" : null,
        "kurssiTyyppiKuvaukset" : {
          "PAIKALLINEN_SYVENTAVA" : null,
          "VALTAKUNNALLINEN_SOVELTAVA" : null,
          "VALTAKUNNALLINEN_PAKOLLINEN" : null,
          "PAIKALLINEN_SOVELTAVA" : null,
          "PAIKALLINEN_PAKOLLINEN" : null,
          "VALTAKUNNALLINEN_SYVENTAVA" : null
        },
        "oppimaarat" : [ {
          "perusteen" : {
            "id" : 8626494,
            "tunniste" : "43d195e9-b4d7-47d0-9a3c-c234b4604c88",
            "koodiUri" : "oppiaineetyleissivistava2_kt",
            "koodiArvo" : "KT",
            "koosteinen" : true,
            "jarjestys" : 2,
            "abstrakti" : false,
            "nimi" : {
              "fi" : "Uskonto",
              "_id" : "8626766"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : {
              "id" : null,
              "otsikko" : {
                "fi" : "Opetuksen tavoitteet",
                "_id" : "8626767"
              },
              "teksti" : {
                "fi" : "<p>Yleisesti uskottavat tavoitteet.</p>",
                "_id" : "8626768"
              }
            },
            "arviointi" : null,
            "oppimaarat" : [ {
              "id" : 8626498,
              "tunniste" : "70abd299-cb7d-4c43-b0d0-fefb605d0487",
              "koodiUri" : "oppiaineetyleissivistava2_kt2",
              "koodiArvo" : "KT2",
              "koosteinen" : false,
              "jarjestys" : 2,
              "abstrakti" : true,
              "nimi" : {
                "fi" : "Ortodoksinen uskonto",
                "_id" : "8626878"
              },
              "kuvaus" : null,
              "pakollinenKurssiKuvaus" : null,
              "syventavaKurssiKuvaus" : null,
              "soveltavaKurssiKuvaus" : null,
              "tehtava" : null,
              "tavoitteet" : null,
              "arviointi" : null,
              "oppimaarat" : [ ],
              "kurssit" : [ {
                "id" : 8627131,
                "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
                "nimi" : {
                  "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                  "_id" : "8627114"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk5",
                "koodiArvo" : "UK5",
                "lokalisoituKoodi" : {
                  "fi" : "UK5",
                  "_id" : "8627115"
                },
                "oppiaineId" : 8626498,
                "jarjestys" : 3,
                "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8626687,
                "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
                "nimi" : {
                  "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                  "_id" : "8627006"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk1",
                "koodiArvo" : "UK1",
                "lokalisoituKoodi" : {
                  "fi" : "UK1",
                  "_id" : "8627007"
                },
                "oppiaineId" : 8626498,
                "jarjestys" : 1,
                "tyyppi" : "PAKOLLINEN",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8626689,
                "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
                "nimi" : {
                  "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                  "_id" : "8627110"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk3",
                "koodiArvo" : "UK3",
                "lokalisoituKoodi" : {
                  "fi" : "UK3",
                  "_id" : "8627111"
                },
                "oppiaineId" : 8626498,
                "jarjestys" : 2,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8627132,
                "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
                "nimi" : {
                  "fi" : "Uskonnot ja media",
                  "_id" : "8627116"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk6",
                "koodiArvo" : "UK6",
                "lokalisoituKoodi" : {
                  "fi" : "UK6",
                  "_id" : "8627117"
                },
                "oppiaineId" : 8626498,
                "jarjestys" : 4,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              } ],
              "kurssiTyyppiKuvaukset" : {
                "VALTAKUNNALLINEN_PAKOLLINEN" : null,
                "VALTAKUNNALLINEN_SOVELTAVA" : null,
                "VALTAKUNNALLINEN_SYVENTAVA" : null
              }
            }, {
              "id" : 8626497,
              "tunniste" : "6015b29d-844b-4b49-ae56-83953b9cd299",
              "koodiUri" : "oppiaineetyleissivistava2_kt5",
              "koodiArvo" : "KT5",
              "koosteinen" : false,
              "jarjestys" : 4,
              "abstrakti" : true,
              "nimi" : {
                "fi" : "Juutalainen uskonto",
                "_id" : "8626877"
              },
              "kuvaus" : null,
              "pakollinenKurssiKuvaus" : null,
              "syventavaKurssiKuvaus" : null,
              "soveltavaKurssiKuvaus" : null,
              "tehtava" : null,
              "tavoitteet" : null,
              "arviointi" : null,
              "oppimaarat" : [ ],
              "kurssit" : [ {
                "id" : 8626689,
                "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
                "nimi" : {
                  "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                  "_id" : "8627110"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk3",
                "koodiArvo" : "UK3",
                "lokalisoituKoodi" : {
                  "fi" : "UK3",
                  "_id" : "8627111"
                },
                "oppiaineId" : 8626497,
                "jarjestys" : 2,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8627131,
                "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
                "nimi" : {
                  "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                  "_id" : "8627114"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk5",
                "koodiArvo" : "UK5",
                "lokalisoituKoodi" : {
                  "fi" : "UK5",
                  "_id" : "8627115"
                },
                "oppiaineId" : 8626497,
                "jarjestys" : 4,
                "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8627132,
                "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
                "nimi" : {
                  "fi" : "Uskonnot ja media",
                  "_id" : "8627116"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk6",
                "koodiArvo" : "UK6",
                "lokalisoituKoodi" : {
                  "fi" : "UK6",
                  "_id" : "8627117"
                },
                "oppiaineId" : 8626497,
                "jarjestys" : 5,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8627130,
                "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
                "nimi" : {
                  "fi" : "Uskonto suomalaisessa yhteiskunnassa",
                  "_id" : "8627112"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk4",
                "koodiArvo" : "UK4",
                "lokalisoituKoodi" : {
                  "fi" : "UK4",
                  "_id" : "8627113"
                },
                "oppiaineId" : 8626497,
                "jarjestys" : 3,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8626687,
                "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
                "nimi" : {
                  "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                  "_id" : "8627006"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk1",
                "koodiArvo" : "UK1",
                "lokalisoituKoodi" : {
                  "fi" : "UK1",
                  "_id" : "8627007"
                },
                "oppiaineId" : 8626497,
                "jarjestys" : 1,
                "tyyppi" : "PAKOLLINEN",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              } ],
              "kurssiTyyppiKuvaukset" : {
                "VALTAKUNNALLINEN_PAKOLLINEN" : null,
                "VALTAKUNNALLINEN_SOVELTAVA" : null,
                "VALTAKUNNALLINEN_SYVENTAVA" : null
              }
            }, {
              "id" : 8626499,
              "tunniste" : "639c7d09-be48-4288-bb98-f9bec240bec5",
              "koodiUri" : "oppiaineetyleissivistava2_kt3",
              "koodiArvo" : "KT3",
              "koosteinen" : false,
              "jarjestys" : 3,
              "abstrakti" : null,
              "nimi" : {
                "fi" : "Katolinen uskonto",
                "_id" : "8627118"
              },
              "kuvaus" : null,
              "pakollinenKurssiKuvaus" : null,
              "syventavaKurssiKuvaus" : {
                "fi" : "<p>Syventävä katolinen kuvaus.</p>",
                "_id" : "8627119"
              },
              "soveltavaKurssiKuvaus" : null,
              "tehtava" : null,
              "tavoitteet" : null,
              "arviointi" : null,
              "oppimaarat" : [ ],
              "kurssit" : [ {
                "id" : 8626689,
                "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
                "nimi" : {
                  "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                  "_id" : "8627110"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk3",
                "koodiArvo" : "UK3",
                "lokalisoituKoodi" : {
                  "fi" : "UK3",
                  "_id" : "8627111"
                },
                "oppiaineId" : 8626499,
                "jarjestys" : 3,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8626687,
                "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
                "nimi" : {
                  "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                  "_id" : "8627006"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk1",
                "koodiArvo" : "UK1",
                "lokalisoituKoodi" : {
                  "fi" : "UK1",
                  "_id" : "8627007"
                },
                "oppiaineId" : 8626499,
                "jarjestys" : 1,
                "tyyppi" : "PAKOLLINEN",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8626688,
                "tunniste" : "0f7101cf-a103-4725-9228-2283772d4b2a",
                "nimi" : {
                  "fi" : "Maailmanlaajuinen katolisuus",
                  "_id" : "8627008"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk2",
                "koodiArvo" : "UK2",
                "lokalisoituKoodi" : {
                  "fi" : "UK2",
                  "_id" : "8627009"
                },
                "oppiaineId" : 8626499,
                "jarjestys" : 2,
                "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8627132,
                "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
                "nimi" : {
                  "fi" : "Uskonnot ja media",
                  "_id" : "8627116"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk6",
                "koodiArvo" : "UK6",
                "lokalisoituKoodi" : {
                  "fi" : "UK6",
                  "_id" : "8627117"
                },
                "oppiaineId" : 8626499,
                "jarjestys" : 6,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8627130,
                "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
                "nimi" : {
                  "fi" : "Uskonto suomalaisessa yhteiskunnassa",
                  "_id" : "8627112"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk4",
                "koodiArvo" : "UK4",
                "lokalisoituKoodi" : {
                  "fi" : "UK4",
                  "_id" : "8627113"
                },
                "oppiaineId" : 8626499,
                "jarjestys" : 4,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8627131,
                "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
                "nimi" : {
                  "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                  "_id" : "8627114"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk5",
                "koodiArvo" : "UK5",
                "lokalisoituKoodi" : {
                  "fi" : "UK5",
                  "_id" : "8627115"
                },
                "oppiaineId" : 8626499,
                "jarjestys" : 5,
                "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              } ],
              "kurssiTyyppiKuvaukset" : {
                "VALTAKUNNALLINEN_PAKOLLINEN" : null,
                "VALTAKUNNALLINEN_SOVELTAVA" : null,
                "VALTAKUNNALLINEN_SYVENTAVA" : {
                  "fi" : "<p>Syventävä katolinen kuvaus.</p>",
                  "_id" : "8627119"
                }
              }
            }, {
              "id" : 8626496,
              "tunniste" : "b5f6e632-b840-4144-a694-347b3c7ea0b0",
              "koodiUri" : "oppiaineetyleissivistava2_kt1",
              "koodiArvo" : "KT1",
              "koosteinen" : false,
              "jarjestys" : 1,
              "abstrakti" : true,
              "nimi" : {
                "fi" : "Evankelisluterilainen uskonto",
                "_id" : "8626874"
              },
              "kuvaus" : null,
              "pakollinenKurssiKuvaus" : null,
              "syventavaKurssiKuvaus" : null,
              "soveltavaKurssiKuvaus" : null,
              "tehtava" : null,
              "tavoitteet" : {
                "id" : null,
                "otsikko" : {
                  "fi" : "Opetuksen tavoitteet",
                  "_id" : "8626875"
                },
                "teksti" : {
                  "fi" : "<p>Evankelisluterilaisen uskonnon tavoitteet</p>",
                  "_id" : "8626876"
                }
              },
              "arviointi" : null,
              "oppimaarat" : [ ],
              "kurssit" : [ {
                "id" : 8627130,
                "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
                "nimi" : {
                  "fi" : "Uskonto suomalaisessa yhteiskunnassa",
                  "_id" : "8627112"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk4",
                "koodiArvo" : "UK4",
                "lokalisoituKoodi" : {
                  "fi" : "UK4",
                  "_id" : "8627113"
                },
                "oppiaineId" : 8626496,
                "jarjestys" : 3,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8627131,
                "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
                "nimi" : {
                  "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                  "_id" : "8627114"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk5",
                "koodiArvo" : "UK5",
                "lokalisoituKoodi" : {
                  "fi" : "UK5",
                  "_id" : "8627115"
                },
                "oppiaineId" : 8626496,
                "jarjestys" : 4,
                "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8626687,
                "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
                "nimi" : {
                  "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                  "_id" : "8627006"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk1",
                "koodiArvo" : "UK1",
                "lokalisoituKoodi" : {
                  "fi" : "UK1",
                  "_id" : "8627007"
                },
                "oppiaineId" : 8626496,
                "jarjestys" : 1,
                "tyyppi" : "PAKOLLINEN",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8626689,
                "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
                "nimi" : {
                  "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                  "_id" : "8627110"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk3",
                "koodiArvo" : "UK3",
                "lokalisoituKoodi" : {
                  "fi" : "UK3",
                  "_id" : "8627111"
                },
                "oppiaineId" : 8626496,
                "jarjestys" : 2,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8627132,
                "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
                "nimi" : {
                  "fi" : "Uskonnot ja media",
                  "_id" : "8627116"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk6",
                "koodiArvo" : "UK6",
                "lokalisoituKoodi" : {
                  "fi" : "UK6",
                  "_id" : "8627117"
                },
                "oppiaineId" : 8626496,
                "jarjestys" : 5,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              } ],
              "kurssiTyyppiKuvaukset" : {
                "VALTAKUNNALLINEN_PAKOLLINEN" : null,
                "VALTAKUNNALLINEN_SOVELTAVA" : null,
                "VALTAKUNNALLINEN_SYVENTAVA" : null
              }
            } ],
            "kurssit" : [ ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          },
          "id" : 70108,
          "oppiaineId" : 70105,
          "muokattu" : 1450125588442,
          "tunniste" : "43d195e9-b4d7-47d0-9a3c-c234b4604c88",
          "tila" : "luonnos",
          "oma" : true,
          "maariteltyPohjassa" : false,
          "jarjestys" : null,
          "tyyppi" : "yhteinen",
          "laajuus" : null,
          "koosteinen" : false,
          "nimi" : {
            "fi" : "Evankelisluterilainen uskonto",
            "_id" : "70242"
          },
          "abstrakti" : null,
          "tehtava" : null,
          "tavoitteet" : null,
          "arviointi" : null,
          "kurssiTyyppiKuvaukset" : {
            "PAIKALLINEN_SYVENTAVA" : null,
            "VALTAKUNNALLINEN_SOVELTAVA" : null,
            "VALTAKUNNALLINEN_PAKOLLINEN" : null,
            "PAIKALLINEN_SOVELTAVA" : null,
            "PAIKALLINEN_PAKOLLINEN" : null,
            "VALTAKUNNALLINEN_SYVENTAVA" : null
          },
          "oppimaarat" : [ ],
          "pohjanTarjonta" : [ {
            "perusteen" : {
              "id" : 8626497,
              "tunniste" : "6015b29d-844b-4b49-ae56-83953b9cd299",
              "koodiUri" : "oppiaineetyleissivistava2_kt5",
              "koodiArvo" : "KT5",
              "koosteinen" : false,
              "jarjestys" : 4,
              "abstrakti" : true,
              "nimi" : {
                "fi" : "Juutalainen uskonto",
                "_id" : "8626877"
              },
              "kuvaus" : null,
              "pakollinenKurssiKuvaus" : null,
              "syventavaKurssiKuvaus" : null,
              "soveltavaKurssiKuvaus" : null,
              "tehtava" : null,
              "tavoitteet" : null,
              "arviointi" : null,
              "oppimaarat" : [ ],
              "kurssit" : [ {
                "id" : 8626689,
                "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
                "nimi" : {
                  "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                  "_id" : "8627110"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk3",
                "koodiArvo" : "UK3",
                "lokalisoituKoodi" : {
                  "fi" : "UK3",
                  "_id" : "8627111"
                },
                "oppiaineId" : 8626497,
                "jarjestys" : 2,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8627131,
                "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
                "nimi" : {
                  "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                  "_id" : "8627114"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk5",
                "koodiArvo" : "UK5",
                "lokalisoituKoodi" : {
                  "fi" : "UK5",
                  "_id" : "8627115"
                },
                "oppiaineId" : 8626497,
                "jarjestys" : 4,
                "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8627132,
                "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
                "nimi" : {
                  "fi" : "Uskonnot ja media",
                  "_id" : "8627116"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk6",
                "koodiArvo" : "UK6",
                "lokalisoituKoodi" : {
                  "fi" : "UK6",
                  "_id" : "8627117"
                },
                "oppiaineId" : 8626497,
                "jarjestys" : 5,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8627130,
                "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
                "nimi" : {
                  "fi" : "Uskonto suomalaisessa yhteiskunnassa",
                  "_id" : "8627112"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk4",
                "koodiArvo" : "UK4",
                "lokalisoituKoodi" : {
                  "fi" : "UK4",
                  "_id" : "8627113"
                },
                "oppiaineId" : 8626497,
                "jarjestys" : 3,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8626687,
                "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
                "nimi" : {
                  "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                  "_id" : "8627006"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk1",
                "koodiArvo" : "UK1",
                "lokalisoituKoodi" : {
                  "fi" : "UK1",
                  "_id" : "8627007"
                },
                "oppiaineId" : 8626497,
                "jarjestys" : 1,
                "tyyppi" : "PAKOLLINEN",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              } ],
              "kurssiTyyppiKuvaukset" : {
                "VALTAKUNNALLINEN_PAKOLLINEN" : null,
                "VALTAKUNNALLINEN_SOVELTAVA" : null,
                "VALTAKUNNALLINEN_SYVENTAVA" : null
              }
            },
            "id" : 69995,
            "oppiaineId" : 69994,
            "muokattu" : 1450125467337,
            "tunniste" : "6015b29d-844b-4b49-ae56-83953b9cd299",
            "tila" : "luonnos",
            "oma" : false,
            "maariteltyPohjassa" : false,
            "jarjestys" : null,
            "tyyppi" : "lukio",
            "laajuus" : null,
            "koosteinen" : false,
            "nimi" : {
              "fi" : "Juutalainen uskonto",
              "_id" : "70061"
            },
            "abstrakti" : true,
            "tehtava" : null,
            "tavoitteet" : null,
            "arviointi" : null,
            "kurssiTyyppiKuvaukset" : {
              "PAIKALLINEN_SYVENTAVA" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "PAIKALLINEN_SOVELTAVA" : null,
              "PAIKALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            },
            "oppimaarat" : [ ],
            "pohjanTarjonta" : [ ],
            "koodiUri" : "oppiaineetyleissivistava2_kt5",
            "koodiArvo" : "KT5",
            "kieliKoodiUri" : null,
            "kieliKoodiArvo" : null,
            "kieli" : null,
            "kurssit" : [ {
              "perusteen" : {
                "id" : 8626687,
                "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
                "nimi" : {
                  "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                  "_id" : "8627006"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk1",
                "koodiArvo" : "UK1",
                "lokalisoituKoodi" : {
                  "fi" : "UK1",
                  "_id" : "8627007"
                },
                "oppiaineId" : 8626498,
                "jarjestys" : 1,
                "tyyppi" : "PAKOLLINEN",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              },
              "id" : 69982,
              "muokattu" : 1450125467331,
              "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
              "nimi" : {
                "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                "_id" : "69927"
              },
              "kuvaus" : null,
              "oma" : true,
              "palautettava" : false,
              "koodiUri" : "lukionkurssit_uk1",
              "koodiArvo" : "UK1",
              "tyyppi" : "VALTAKUNNALLINEN_PAKOLLINEN",
              "lokalisoituKoodi" : {
                "fi" : "UK1",
                "_id" : "69928"
              },
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "perusteen" : {
                "id" : 8626689,
                "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
                "nimi" : {
                  "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                  "_id" : "8627110"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk3",
                "koodiArvo" : "UK3",
                "lokalisoituKoodi" : {
                  "fi" : "UK3",
                  "_id" : "8627111"
                },
                "oppiaineId" : 8626498,
                "jarjestys" : 2,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              },
              "id" : 69986,
              "muokattu" : 1450125467342,
              "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
              "nimi" : {
                "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                "_id" : "70071"
              },
              "kuvaus" : null,
              "oma" : true,
              "palautettava" : false,
              "koodiUri" : "lukionkurssit_uk3",
              "koodiArvo" : "UK3",
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "lokalisoituKoodi" : {
                "fi" : "UK3",
                "_id" : "70072"
              },
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "perusteen" : {
                "id" : 8627130,
                "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
                "nimi" : {
                  "fi" : "Uskonto suomalaisessa yhteiskunnassa",
                  "_id" : "8627112"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk4",
                "koodiArvo" : "UK4",
                "lokalisoituKoodi" : {
                  "fi" : "UK4",
                  "_id" : "8627113"
                },
                "oppiaineId" : 8626497,
                "jarjestys" : 3,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              },
              "id" : 69985,
              "muokattu" : 1450125467340,
              "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
              "nimi" : {
                "fi" : "Uskonto suomalaisessa yhteiskunnassa",
                "_id" : "70069"
              },
              "kuvaus" : null,
              "oma" : true,
              "palautettava" : false,
              "koodiUri" : "lukionkurssit_uk4",
              "koodiArvo" : "UK4",
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "lokalisoituKoodi" : {
                "fi" : "UK4",
                "_id" : "70070"
              },
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "perusteen" : {
                "id" : 8627131,
                "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
                "nimi" : {
                  "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                  "_id" : "8627114"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk5",
                "koodiArvo" : "UK5",
                "lokalisoituKoodi" : {
                  "fi" : "UK5",
                  "_id" : "8627115"
                },
                "oppiaineId" : 8626498,
                "jarjestys" : 3,
                "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              },
              "id" : 69983,
              "muokattu" : 1450125467338,
              "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
              "nimi" : {
                "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                "_id" : "70065"
              },
              "kuvaus" : null,
              "oma" : true,
              "palautettava" : false,
              "koodiUri" : "lukionkurssit_uk5",
              "koodiArvo" : "UK5",
              "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
              "lokalisoituKoodi" : {
                "fi" : "UK5",
                "_id" : "70066"
              },
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "perusteen" : {
                "id" : 8627132,
                "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
                "nimi" : {
                  "fi" : "Uskonnot ja media",
                  "_id" : "8627116"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk6",
                "koodiArvo" : "UK6",
                "lokalisoituKoodi" : {
                  "fi" : "UK6",
                  "_id" : "8627117"
                },
                "oppiaineId" : 8626498,
                "jarjestys" : 4,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              },
              "id" : 69988,
              "muokattu" : 1450125467344,
              "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
              "nimi" : {
                "fi" : "Uskonnot ja media",
                "_id" : "70079"
              },
              "kuvaus" : null,
              "oma" : true,
              "palautettava" : false,
              "koodiUri" : "lukionkurssit_uk6",
              "koodiArvo" : "UK6",
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "lokalisoituKoodi" : {
                "fi" : "UK6",
                "_id" : "70090"
              },
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            } ]
          }, {
            "perusteen" : {
              "id" : 8626498,
              "tunniste" : "70abd299-cb7d-4c43-b0d0-fefb605d0487",
              "koodiUri" : "oppiaineetyleissivistava2_kt2",
              "koodiArvo" : "KT2",
              "koosteinen" : false,
              "jarjestys" : 2,
              "abstrakti" : true,
              "nimi" : {
                "fi" : "Ortodoksinen uskonto",
                "_id" : "8626878"
              },
              "kuvaus" : null,
              "pakollinenKurssiKuvaus" : null,
              "syventavaKurssiKuvaus" : null,
              "soveltavaKurssiKuvaus" : null,
              "tehtava" : null,
              "tavoitteet" : null,
              "arviointi" : null,
              "oppimaarat" : [ ],
              "kurssit" : [ {
                "id" : 8627131,
                "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
                "nimi" : {
                  "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                  "_id" : "8627114"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk5",
                "koodiArvo" : "UK5",
                "lokalisoituKoodi" : {
                  "fi" : "UK5",
                  "_id" : "8627115"
                },
                "oppiaineId" : 8626498,
                "jarjestys" : 3,
                "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8626687,
                "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
                "nimi" : {
                  "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                  "_id" : "8627006"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk1",
                "koodiArvo" : "UK1",
                "lokalisoituKoodi" : {
                  "fi" : "UK1",
                  "_id" : "8627007"
                },
                "oppiaineId" : 8626498,
                "jarjestys" : 1,
                "tyyppi" : "PAKOLLINEN",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8626689,
                "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
                "nimi" : {
                  "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                  "_id" : "8627110"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk3",
                "koodiArvo" : "UK3",
                "lokalisoituKoodi" : {
                  "fi" : "UK3",
                  "_id" : "8627111"
                },
                "oppiaineId" : 8626498,
                "jarjestys" : 2,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8627132,
                "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
                "nimi" : {
                  "fi" : "Uskonnot ja media",
                  "_id" : "8627116"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk6",
                "koodiArvo" : "UK6",
                "lokalisoituKoodi" : {
                  "fi" : "UK6",
                  "_id" : "8627117"
                },
                "oppiaineId" : 8626498,
                "jarjestys" : 4,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              } ],
              "kurssiTyyppiKuvaukset" : {
                "VALTAKUNNALLINEN_PAKOLLINEN" : null,
                "VALTAKUNNALLINEN_SOVELTAVA" : null,
                "VALTAKUNNALLINEN_SYVENTAVA" : null
              }
            },
            "id" : 69997,
            "oppiaineId" : 69994,
            "muokattu" : 1450125467338,
            "tunniste" : "70abd299-cb7d-4c43-b0d0-fefb605d0487",
            "tila" : "luonnos",
            "oma" : false,
            "maariteltyPohjassa" : false,
            "jarjestys" : null,
            "tyyppi" : "lukio",
            "laajuus" : null,
            "koosteinen" : false,
            "nimi" : {
              "fi" : "Ortodoksinen uskonto",
              "_id" : "70064"
            },
            "abstrakti" : true,
            "tehtava" : null,
            "tavoitteet" : null,
            "arviointi" : null,
            "kurssiTyyppiKuvaukset" : {
              "PAIKALLINEN_SYVENTAVA" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "PAIKALLINEN_SOVELTAVA" : null,
              "PAIKALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            },
            "oppimaarat" : [ ],
            "pohjanTarjonta" : [ ],
            "koodiUri" : "oppiaineetyleissivistava2_kt2",
            "koodiArvo" : "KT2",
            "kieliKoodiUri" : null,
            "kieliKoodiArvo" : null,
            "kieli" : null,
            "kurssit" : [ {
              "perusteen" : {
                "id" : 8626687,
                "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
                "nimi" : {
                  "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                  "_id" : "8627006"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk1",
                "koodiArvo" : "UK1",
                "lokalisoituKoodi" : {
                  "fi" : "UK1",
                  "_id" : "8627007"
                },
                "oppiaineId" : 8626498,
                "jarjestys" : 1,
                "tyyppi" : "PAKOLLINEN",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              },
              "id" : 69982,
              "muokattu" : 1450125467331,
              "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
              "nimi" : {
                "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                "_id" : "69927"
              },
              "kuvaus" : null,
              "oma" : true,
              "palautettava" : false,
              "koodiUri" : "lukionkurssit_uk1",
              "koodiArvo" : "UK1",
              "tyyppi" : "VALTAKUNNALLINEN_PAKOLLINEN",
              "lokalisoituKoodi" : {
                "fi" : "UK1",
                "_id" : "69928"
              },
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "perusteen" : {
                "id" : 8626689,
                "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
                "nimi" : {
                  "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                  "_id" : "8627110"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk3",
                "koodiArvo" : "UK3",
                "lokalisoituKoodi" : {
                  "fi" : "UK3",
                  "_id" : "8627111"
                },
                "oppiaineId" : 8626498,
                "jarjestys" : 2,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              },
              "id" : 69986,
              "muokattu" : 1450125467342,
              "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
              "nimi" : {
                "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                "_id" : "70071"
              },
              "kuvaus" : null,
              "oma" : true,
              "palautettava" : false,
              "koodiUri" : "lukionkurssit_uk3",
              "koodiArvo" : "UK3",
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "lokalisoituKoodi" : {
                "fi" : "UK3",
                "_id" : "70072"
              },
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "perusteen" : {
                "id" : 8627131,
                "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
                "nimi" : {
                  "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                  "_id" : "8627114"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk5",
                "koodiArvo" : "UK5",
                "lokalisoituKoodi" : {
                  "fi" : "UK5",
                  "_id" : "8627115"
                },
                "oppiaineId" : 8626498,
                "jarjestys" : 3,
                "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              },
              "id" : 69983,
              "muokattu" : 1450125467338,
              "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
              "nimi" : {
                "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                "_id" : "70065"
              },
              "kuvaus" : null,
              "oma" : true,
              "palautettava" : false,
              "koodiUri" : "lukionkurssit_uk5",
              "koodiArvo" : "UK5",
              "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
              "lokalisoituKoodi" : {
                "fi" : "UK5",
                "_id" : "70066"
              },
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "perusteen" : {
                "id" : 8627132,
                "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
                "nimi" : {
                  "fi" : "Uskonnot ja media",
                  "_id" : "8627116"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk6",
                "koodiArvo" : "UK6",
                "lokalisoituKoodi" : {
                  "fi" : "UK6",
                  "_id" : "8627117"
                },
                "oppiaineId" : 8626498,
                "jarjestys" : 4,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              },
              "id" : 69988,
              "muokattu" : 1450125467344,
              "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
              "nimi" : {
                "fi" : "Uskonnot ja media",
                "_id" : "70079"
              },
              "kuvaus" : null,
              "oma" : true,
              "palautettava" : false,
              "koodiUri" : "lukionkurssit_uk6",
              "koodiArvo" : "UK6",
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "lokalisoituKoodi" : {
                "fi" : "UK6",
                "_id" : "70090"
              },
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            } ]
          }, {
            "perusteen" : {
              "id" : 8626496,
              "tunniste" : "b5f6e632-b840-4144-a694-347b3c7ea0b0",
              "koodiUri" : "oppiaineetyleissivistava2_kt1",
              "koodiArvo" : "KT1",
              "koosteinen" : false,
              "jarjestys" : 1,
              "abstrakti" : true,
              "nimi" : {
                "fi" : "Evankelisluterilainen uskonto",
                "_id" : "8626874"
              },
              "kuvaus" : null,
              "pakollinenKurssiKuvaus" : null,
              "syventavaKurssiKuvaus" : null,
              "soveltavaKurssiKuvaus" : null,
              "tehtava" : null,
              "tavoitteet" : {
                "id" : null,
                "otsikko" : {
                  "fi" : "Opetuksen tavoitteet",
                  "_id" : "8626875"
                },
                "teksti" : {
                  "fi" : "<p>Evankelisluterilaisen uskonnon tavoitteet</p>",
                  "_id" : "8626876"
                }
              },
              "arviointi" : null,
              "oppimaarat" : [ ],
              "kurssit" : [ {
                "id" : 8627130,
                "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
                "nimi" : {
                  "fi" : "Uskonto suomalaisessa yhteiskunnassa",
                  "_id" : "8627112"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk4",
                "koodiArvo" : "UK4",
                "lokalisoituKoodi" : {
                  "fi" : "UK4",
                  "_id" : "8627113"
                },
                "oppiaineId" : 8626496,
                "jarjestys" : 3,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8627131,
                "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
                "nimi" : {
                  "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                  "_id" : "8627114"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk5",
                "koodiArvo" : "UK5",
                "lokalisoituKoodi" : {
                  "fi" : "UK5",
                  "_id" : "8627115"
                },
                "oppiaineId" : 8626496,
                "jarjestys" : 4,
                "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8626687,
                "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
                "nimi" : {
                  "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                  "_id" : "8627006"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk1",
                "koodiArvo" : "UK1",
                "lokalisoituKoodi" : {
                  "fi" : "UK1",
                  "_id" : "8627007"
                },
                "oppiaineId" : 8626496,
                "jarjestys" : 1,
                "tyyppi" : "PAKOLLINEN",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8626689,
                "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
                "nimi" : {
                  "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                  "_id" : "8627110"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk3",
                "koodiArvo" : "UK3",
                "lokalisoituKoodi" : {
                  "fi" : "UK3",
                  "_id" : "8627111"
                },
                "oppiaineId" : 8626496,
                "jarjestys" : 2,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              }, {
                "id" : 8627132,
                "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
                "nimi" : {
                  "fi" : "Uskonnot ja media",
                  "_id" : "8627116"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk6",
                "koodiArvo" : "UK6",
                "lokalisoituKoodi" : {
                  "fi" : "UK6",
                  "_id" : "8627117"
                },
                "oppiaineId" : 8626496,
                "jarjestys" : 5,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              } ],
              "kurssiTyyppiKuvaukset" : {
                "VALTAKUNNALLINEN_PAKOLLINEN" : null,
                "VALTAKUNNALLINEN_SOVELTAVA" : null,
                "VALTAKUNNALLINEN_SYVENTAVA" : null
              }
            },
            "id" : 69993,
            "oppiaineId" : 69994,
            "muokattu" : 1450125467332,
            "tunniste" : "b5f6e632-b840-4144-a694-347b3c7ea0b0",
            "tila" : "luonnos",
            "oma" : false,
            "maariteltyPohjassa" : false,
            "jarjestys" : null,
            "tyyppi" : "lukio",
            "laajuus" : null,
            "koosteinen" : false,
            "nimi" : {
              "fi" : "Evankelisluterilainen uskonto",
              "_id" : "69929"
            },
            "abstrakti" : true,
            "tehtava" : null,
            "tavoitteet" : null,
            "arviointi" : null,
            "kurssiTyyppiKuvaukset" : {
              "PAIKALLINEN_SYVENTAVA" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "PAIKALLINEN_SOVELTAVA" : null,
              "PAIKALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            },
            "oppimaarat" : [ ],
            "pohjanTarjonta" : [ ],
            "koodiUri" : "oppiaineetyleissivistava2_kt1",
            "koodiArvo" : "KT1",
            "kieliKoodiUri" : null,
            "kieliKoodiArvo" : null,
            "kieli" : null,
            "kurssit" : [ {
              "perusteen" : {
                "id" : 8626687,
                "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
                "nimi" : {
                  "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                  "_id" : "8627006"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk1",
                "koodiArvo" : "UK1",
                "lokalisoituKoodi" : {
                  "fi" : "UK1",
                  "_id" : "8627007"
                },
                "oppiaineId" : 8626498,
                "jarjestys" : 1,
                "tyyppi" : "PAKOLLINEN",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              },
              "id" : 69982,
              "muokattu" : 1450125467331,
              "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
              "nimi" : {
                "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                "_id" : "69927"
              },
              "kuvaus" : null,
              "oma" : true,
              "palautettava" : false,
              "koodiUri" : "lukionkurssit_uk1",
              "koodiArvo" : "UK1",
              "tyyppi" : "VALTAKUNNALLINEN_PAKOLLINEN",
              "lokalisoituKoodi" : {
                "fi" : "UK1",
                "_id" : "69928"
              },
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "perusteen" : {
                "id" : 8626689,
                "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
                "nimi" : {
                  "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                  "_id" : "8627110"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk3",
                "koodiArvo" : "UK3",
                "lokalisoituKoodi" : {
                  "fi" : "UK3",
                  "_id" : "8627111"
                },
                "oppiaineId" : 8626498,
                "jarjestys" : 2,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              },
              "id" : 69986,
              "muokattu" : 1450125467342,
              "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
              "nimi" : {
                "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                "_id" : "70071"
              },
              "kuvaus" : null,
              "oma" : true,
              "palautettava" : false,
              "koodiUri" : "lukionkurssit_uk3",
              "koodiArvo" : "UK3",
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "lokalisoituKoodi" : {
                "fi" : "UK3",
                "_id" : "70072"
              },
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "perusteen" : {
                "id" : 8627130,
                "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
                "nimi" : {
                  "fi" : "Uskonto suomalaisessa yhteiskunnassa",
                  "_id" : "8627112"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk4",
                "koodiArvo" : "UK4",
                "lokalisoituKoodi" : {
                  "fi" : "UK4",
                  "_id" : "8627113"
                },
                "oppiaineId" : 8626497,
                "jarjestys" : 3,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              },
              "id" : 69985,
              "muokattu" : 1450125467340,
              "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
              "nimi" : {
                "fi" : "Uskonto suomalaisessa yhteiskunnassa",
                "_id" : "70069"
              },
              "kuvaus" : null,
              "oma" : true,
              "palautettava" : false,
              "koodiUri" : "lukionkurssit_uk4",
              "koodiArvo" : "UK4",
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "lokalisoituKoodi" : {
                "fi" : "UK4",
                "_id" : "70070"
              },
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "perusteen" : {
                "id" : 8627131,
                "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
                "nimi" : {
                  "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                  "_id" : "8627114"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk5",
                "koodiArvo" : "UK5",
                "lokalisoituKoodi" : {
                  "fi" : "UK5",
                  "_id" : "8627115"
                },
                "oppiaineId" : 8626498,
                "jarjestys" : 3,
                "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              },
              "id" : 69983,
              "muokattu" : 1450125467338,
              "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
              "nimi" : {
                "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                "_id" : "70065"
              },
              "kuvaus" : null,
              "oma" : true,
              "palautettava" : false,
              "koodiUri" : "lukionkurssit_uk5",
              "koodiArvo" : "UK5",
              "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
              "lokalisoituKoodi" : {
                "fi" : "UK5",
                "_id" : "70066"
              },
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "perusteen" : {
                "id" : 8627132,
                "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
                "nimi" : {
                  "fi" : "Uskonnot ja media",
                  "_id" : "8627116"
                },
                "kuvaus" : null,
                "koodiUri" : "lukionkurssit_uk6",
                "koodiArvo" : "UK6",
                "lokalisoituKoodi" : {
                  "fi" : "UK6",
                  "_id" : "8627117"
                },
                "oppiaineId" : 8626498,
                "jarjestys" : 4,
                "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
                "opetussuunnitelma" : null,
                "tavoitteet" : null,
                "keskeinenSisalto" : null,
                "tavoitteetJaKeskeinenSisalto" : null
              },
              "id" : 69988,
              "muokattu" : 1450125467344,
              "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
              "nimi" : {
                "fi" : "Uskonnot ja media",
                "_id" : "70079"
              },
              "kuvaus" : null,
              "oma" : true,
              "palautettava" : false,
              "koodiUri" : "lukionkurssit_uk6",
              "koodiArvo" : "UK6",
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "lokalisoituKoodi" : {
                "fi" : "UK6",
                "_id" : "70090"
              },
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            } ]
          } ],
          "koodiUri" : "oppiaineetyleissivistava2_kt1",
          "koodiArvo" : "KT1",
          "kieliKoodiUri" : null,
          "kieliKoodiArvo" : null,
          "kieli" : null,
          "kurssit" : [ {
            "perusteen" : {
              "id" : 8626687,
              "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
              "nimi" : {
                "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                "_id" : "8627006"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk1",
              "koodiArvo" : "UK1",
              "lokalisoituKoodi" : {
                "fi" : "UK1",
                "_id" : "8627007"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 70203,
            "muokattu" : 1450125588437,
            "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
            "nimi" : {
              "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
              "_id" : "69927"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_uk1",
            "koodiArvo" : "UK1",
            "tyyppi" : "VALTAKUNNALLINEN_PAKOLLINEN",
            "lokalisoituKoodi" : {
              "fi" : "UK1",
              "_id" : "69928"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "perusteen" : {
              "id" : 8626689,
              "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
              "nimi" : {
                "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                "_id" : "8627110"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk3",
              "koodiArvo" : "UK3",
              "lokalisoituKoodi" : {
                "fi" : "UK3",
                "_id" : "8627111"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 2,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 70204,
            "muokattu" : 1450125588438,
            "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
            "nimi" : {
              "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
              "_id" : "70071"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_uk3",
            "koodiArvo" : "UK3",
            "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
            "lokalisoituKoodi" : {
              "fi" : "UK3",
              "_id" : "70072"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "perusteen" : {
              "id" : 8627130,
              "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
              "nimi" : {
                "fi" : "Uskonto suomalaisessa yhteiskunnassa",
                "_id" : "8627112"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk4",
              "koodiArvo" : "UK4",
              "lokalisoituKoodi" : {
                "fi" : "UK4",
                "_id" : "8627113"
              },
              "oppiaineId" : 8626497,
              "jarjestys" : 3,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 70207,
            "muokattu" : 1450125588439,
            "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
            "nimi" : {
              "fi" : "Uskonto suomalaisessa yhteiskunnassa",
              "_id" : "70069"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_uk4",
            "koodiArvo" : "UK4",
            "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
            "lokalisoituKoodi" : {
              "fi" : "UK4",
              "_id" : "70070"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "perusteen" : {
              "id" : 8627131,
              "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
              "nimi" : {
                "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                "_id" : "8627114"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk5",
              "koodiArvo" : "UK5",
              "lokalisoituKoodi" : {
                "fi" : "UK5",
                "_id" : "8627115"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 3,
              "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 70205,
            "muokattu" : 1450125588438,
            "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
            "nimi" : {
              "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
              "_id" : "70065"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_uk5",
            "koodiArvo" : "UK5",
            "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
            "lokalisoituKoodi" : {
              "fi" : "UK5",
              "_id" : "70066"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "perusteen" : {
              "id" : 8627132,
              "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
              "nimi" : {
                "fi" : "Uskonnot ja media",
                "_id" : "8627116"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk6",
              "koodiArvo" : "UK6",
              "lokalisoituKoodi" : {
                "fi" : "UK6",
                "_id" : "8627117"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 70206,
            "muokattu" : 1450125588439,
            "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
            "nimi" : {
              "fi" : "Uskonnot ja media",
              "_id" : "70079"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_uk6",
            "koodiArvo" : "UK6",
            "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
            "lokalisoituKoodi" : {
              "fi" : "UK6",
              "_id" : "70090"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          } ]
        }, {
          "perusteen" : {
            "id" : 8626496,
            "tunniste" : "b5f6e632-b840-4144-a694-347b3c7ea0b0",
            "koodiUri" : "oppiaineetyleissivistava2_kt1",
            "koodiArvo" : "KT1",
            "koosteinen" : false,
            "jarjestys" : 1,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Evankelisluterilainen uskonto",
              "_id" : "8626874"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : {
              "id" : null,
              "otsikko" : {
                "fi" : "Opetuksen tavoitteet",
                "_id" : "8626875"
              },
              "teksti" : {
                "fi" : "<p>Evankelisluterilaisen uskonnon tavoitteet</p>",
                "_id" : "8626876"
              }
            },
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ {
              "id" : 8627130,
              "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
              "nimi" : {
                "fi" : "Uskonto suomalaisessa yhteiskunnassa",
                "_id" : "8627112"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk4",
              "koodiArvo" : "UK4",
              "lokalisoituKoodi" : {
                "fi" : "UK4",
                "_id" : "8627113"
              },
              "oppiaineId" : 8626496,
              "jarjestys" : 3,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627131,
              "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
              "nimi" : {
                "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                "_id" : "8627114"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk5",
              "koodiArvo" : "UK5",
              "lokalisoituKoodi" : {
                "fi" : "UK5",
                "_id" : "8627115"
              },
              "oppiaineId" : 8626496,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626687,
              "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
              "nimi" : {
                "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                "_id" : "8627006"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk1",
              "koodiArvo" : "UK1",
              "lokalisoituKoodi" : {
                "fi" : "UK1",
                "_id" : "8627007"
              },
              "oppiaineId" : 8626496,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626689,
              "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
              "nimi" : {
                "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                "_id" : "8627110"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk3",
              "koodiArvo" : "UK3",
              "lokalisoituKoodi" : {
                "fi" : "UK3",
                "_id" : "8627111"
              },
              "oppiaineId" : 8626496,
              "jarjestys" : 2,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627132,
              "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
              "nimi" : {
                "fi" : "Uskonnot ja media",
                "_id" : "8627116"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk6",
              "koodiArvo" : "UK6",
              "lokalisoituKoodi" : {
                "fi" : "UK6",
                "_id" : "8627117"
              },
              "oppiaineId" : 8626496,
              "jarjestys" : 5,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            } ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          },
          "id" : 73317,
          "oppiaineId" : 70105,
          "muokattu" : 1450425212656,
          "tunniste" : "b5f6e632-b840-4144-a694-347b3c7ea0b0",
          "tila" : "luonnos",
          "oma" : true,
          "maariteltyPohjassa" : false,
          "jarjestys" : null,
          "tyyppi" : "yhteinen",
          "laajuus" : null,
          "koosteinen" : false,
          "nimi" : {
            "fi" : "Evankelisluterilainen uskonto 2",
            "_id" : "73144"
          },
          "abstrakti" : null,
          "tehtava" : null,
          "tavoitteet" : null,
          "arviointi" : null,
          "kurssiTyyppiKuvaukset" : {
            "PAIKALLINEN_SYVENTAVA" : null,
            "VALTAKUNNALLINEN_SOVELTAVA" : null,
            "VALTAKUNNALLINEN_PAKOLLINEN" : null,
            "PAIKALLINEN_SOVELTAVA" : null,
            "PAIKALLINEN_PAKOLLINEN" : null,
            "VALTAKUNNALLINEN_SYVENTAVA" : null
          },
          "oppimaarat" : [ ],
          "pohjanTarjonta" : [ ],
          "koodiUri" : "oppiaineetyleissivistava2_kt1",
          "koodiArvo" : "KT1",
          "kieliKoodiUri" : null,
          "kieliKoodiArvo" : null,
          "kieli" : null,
          "kurssit" : [ {
            "perusteen" : {
              "id" : 8626687,
              "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
              "nimi" : {
                "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                "_id" : "8627006"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk1",
              "koodiArvo" : "UK1",
              "lokalisoituKoodi" : {
                "fi" : "UK1",
                "_id" : "8627007"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 73333,
            "muokattu" : 1450425212654,
            "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
            "nimi" : {
              "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
              "_id" : "69927"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_uk1",
            "koodiArvo" : "UK1",
            "tyyppi" : "VALTAKUNNALLINEN_PAKOLLINEN",
            "lokalisoituKoodi" : {
              "fi" : "UK1",
              "_id" : "69928"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "perusteen" : {
              "id" : 8626689,
              "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
              "nimi" : {
                "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                "_id" : "8627110"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk3",
              "koodiArvo" : "UK3",
              "lokalisoituKoodi" : {
                "fi" : "UK3",
                "_id" : "8627111"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 2,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 73331,
            "muokattu" : 1450425212653,
            "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
            "nimi" : {
              "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
              "_id" : "70071"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_uk3",
            "koodiArvo" : "UK3",
            "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
            "lokalisoituKoodi" : {
              "fi" : "UK3",
              "_id" : "70072"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "perusteen" : {
              "id" : 8627130,
              "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
              "nimi" : {
                "fi" : "Uskonto suomalaisessa yhteiskunnassa",
                "_id" : "8627112"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk4",
              "koodiArvo" : "UK4",
              "lokalisoituKoodi" : {
                "fi" : "UK4",
                "_id" : "8627113"
              },
              "oppiaineId" : 8626497,
              "jarjestys" : 3,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 73332,
            "muokattu" : 1450425212654,
            "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
            "nimi" : {
              "fi" : "Uskonto suomalaisessa yhteiskunnassa",
              "_id" : "70069"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_uk4",
            "koodiArvo" : "UK4",
            "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
            "lokalisoituKoodi" : {
              "fi" : "UK4",
              "_id" : "70070"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "perusteen" : {
              "id" : 8627132,
              "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
              "nimi" : {
                "fi" : "Uskonnot ja media",
                "_id" : "8627116"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk6",
              "koodiArvo" : "UK6",
              "lokalisoituKoodi" : {
                "fi" : "UK6",
                "_id" : "8627117"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 73335,
            "muokattu" : 1450425212655,
            "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
            "nimi" : {
              "fi" : "Uskonnot ja media",
              "_id" : "70079"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_uk6",
            "koodiArvo" : "UK6",
            "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
            "lokalisoituKoodi" : {
              "fi" : "UK6",
              "_id" : "70090"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          } ]
        }, {
          "perusteen" : {
            "id" : 8626497,
            "tunniste" : "6015b29d-844b-4b49-ae56-83953b9cd299",
            "koodiUri" : "oppiaineetyleissivistava2_kt5",
            "koodiArvo" : "KT5",
            "koosteinen" : false,
            "jarjestys" : 4,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Juutalainen uskonto",
              "_id" : "8626877"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ {
              "id" : 8626689,
              "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
              "nimi" : {
                "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                "_id" : "8627110"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk3",
              "koodiArvo" : "UK3",
              "lokalisoituKoodi" : {
                "fi" : "UK3",
                "_id" : "8627111"
              },
              "oppiaineId" : 8626497,
              "jarjestys" : 2,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627131,
              "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
              "nimi" : {
                "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                "_id" : "8627114"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk5",
              "koodiArvo" : "UK5",
              "lokalisoituKoodi" : {
                "fi" : "UK5",
                "_id" : "8627115"
              },
              "oppiaineId" : 8626497,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627132,
              "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
              "nimi" : {
                "fi" : "Uskonnot ja media",
                "_id" : "8627116"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk6",
              "koodiArvo" : "UK6",
              "lokalisoituKoodi" : {
                "fi" : "UK6",
                "_id" : "8627117"
              },
              "oppiaineId" : 8626497,
              "jarjestys" : 5,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627130,
              "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
              "nimi" : {
                "fi" : "Uskonto suomalaisessa yhteiskunnassa",
                "_id" : "8627112"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk4",
              "koodiArvo" : "UK4",
              "lokalisoituKoodi" : {
                "fi" : "UK4",
                "_id" : "8627113"
              },
              "oppiaineId" : 8626497,
              "jarjestys" : 3,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626687,
              "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
              "nimi" : {
                "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                "_id" : "8627006"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk1",
              "koodiArvo" : "UK1",
              "lokalisoituKoodi" : {
                "fi" : "UK1",
                "_id" : "8627007"
              },
              "oppiaineId" : 8626497,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            } ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          },
          "id" : 71954,
          "oppiaineId" : 70105,
          "muokattu" : 1450418523136,
          "tunniste" : "6015b29d-844b-4b49-ae56-83953b9cd299",
          "tila" : "luonnos",
          "oma" : true,
          "maariteltyPohjassa" : false,
          "jarjestys" : null,
          "tyyppi" : "yhteinen",
          "laajuus" : null,
          "koosteinen" : false,
          "nimi" : {
            "fi" : "Juutalainen uskonto oma",
            "_id" : "72488"
          },
          "abstrakti" : null,
          "tehtava" : null,
          "tavoitteet" : null,
          "arviointi" : null,
          "kurssiTyyppiKuvaukset" : {
            "PAIKALLINEN_SYVENTAVA" : null,
            "VALTAKUNNALLINEN_SOVELTAVA" : null,
            "VALTAKUNNALLINEN_PAKOLLINEN" : null,
            "PAIKALLINEN_SOVELTAVA" : null,
            "PAIKALLINEN_PAKOLLINEN" : null,
            "VALTAKUNNALLINEN_SYVENTAVA" : null
          },
          "oppimaarat" : [ ],
          "pohjanTarjonta" : [ ],
          "koodiUri" : "oppiaineetyleissivistava2_kt5",
          "koodiArvo" : "KT5",
          "kieliKoodiUri" : null,
          "kieliKoodiArvo" : null,
          "kieli" : null,
          "kurssit" : [ {
            "perusteen" : {
              "id" : 8626687,
              "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
              "nimi" : {
                "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                "_id" : "8627006"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk1",
              "koodiArvo" : "UK1",
              "lokalisoituKoodi" : {
                "fi" : "UK1",
                "_id" : "8627007"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 71969,
            "muokattu" : 1450418523131,
            "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
            "nimi" : {
              "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
              "_id" : "69927"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_uk1",
            "koodiArvo" : "UK1",
            "tyyppi" : "VALTAKUNNALLINEN_PAKOLLINEN",
            "lokalisoituKoodi" : {
              "fi" : "UK1",
              "_id" : "69928"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "perusteen" : {
              "id" : 8626689,
              "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
              "nimi" : {
                "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                "_id" : "8627110"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk3",
              "koodiArvo" : "UK3",
              "lokalisoituKoodi" : {
                "fi" : "UK3",
                "_id" : "8627111"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 2,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 71967,
            "muokattu" : 1450418523131,
            "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
            "nimi" : {
              "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
              "_id" : "70071"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_uk3",
            "koodiArvo" : "UK3",
            "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
            "lokalisoituKoodi" : {
              "fi" : "UK3",
              "_id" : "70072"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "perusteen" : {
              "id" : 8627130,
              "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
              "nimi" : {
                "fi" : "Uskonto suomalaisessa yhteiskunnassa",
                "_id" : "8627112"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk4",
              "koodiArvo" : "UK4",
              "lokalisoituKoodi" : {
                "fi" : "UK4",
                "_id" : "8627113"
              },
              "oppiaineId" : 8626497,
              "jarjestys" : 3,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 71966,
            "muokattu" : 1450418523131,
            "tunniste" : "44510844-40d1-457f-aa08-141e5dfb84e2",
            "nimi" : {
              "fi" : "Uskonto suomalaisessa yhteiskunnassa",
              "_id" : "70069"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_uk4",
            "koodiArvo" : "UK4",
            "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
            "lokalisoituKoodi" : {
              "fi" : "UK4",
              "_id" : "70070"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "perusteen" : {
              "id" : 8627131,
              "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
              "nimi" : {
                "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                "_id" : "8627114"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk5",
              "koodiArvo" : "UK5",
              "lokalisoituKoodi" : {
                "fi" : "UK5",
                "_id" : "8627115"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 3,
              "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 72740,
            "muokattu" : 1450418523131,
            "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
            "nimi" : {
              "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
              "_id" : "70065"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_uk5",
            "koodiArvo" : "UK5",
            "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
            "lokalisoituKoodi" : {
              "fi" : "UK5",
              "_id" : "70066"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "perusteen" : {
              "id" : 8627132,
              "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
              "nimi" : {
                "fi" : "Uskonnot ja media",
                "_id" : "8627116"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk6",
              "koodiArvo" : "UK6",
              "lokalisoituKoodi" : {
                "fi" : "UK6",
                "_id" : "8627117"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 71968,
            "muokattu" : 1450418523131,
            "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
            "nimi" : {
              "fi" : "Uskonnot ja media",
              "_id" : "70079"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_uk6",
            "koodiArvo" : "UK6",
            "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
            "lokalisoituKoodi" : {
              "fi" : "UK6",
              "_id" : "70090"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          } ]
        }, {
          "perusteen" : {
            "id" : 8626498,
            "tunniste" : "70abd299-cb7d-4c43-b0d0-fefb605d0487",
            "koodiUri" : "oppiaineetyleissivistava2_kt2",
            "koodiArvo" : "KT2",
            "koosteinen" : false,
            "jarjestys" : 2,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Ortodoksinen uskonto",
              "_id" : "8626878"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ {
              "id" : 8627131,
              "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
              "nimi" : {
                "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                "_id" : "8627114"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk5",
              "koodiArvo" : "UK5",
              "lokalisoituKoodi" : {
                "fi" : "UK5",
                "_id" : "8627115"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 3,
              "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626687,
              "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
              "nimi" : {
                "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                "_id" : "8627006"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk1",
              "koodiArvo" : "UK1",
              "lokalisoituKoodi" : {
                "fi" : "UK1",
                "_id" : "8627007"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626689,
              "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
              "nimi" : {
                "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                "_id" : "8627110"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk3",
              "koodiArvo" : "UK3",
              "lokalisoituKoodi" : {
                "fi" : "UK3",
                "_id" : "8627111"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 2,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8627132,
              "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
              "nimi" : {
                "fi" : "Uskonnot ja media",
                "_id" : "8627116"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk6",
              "koodiArvo" : "UK6",
              "lokalisoituKoodi" : {
                "fi" : "UK6",
                "_id" : "8627117"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            } ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          },
          "id" : 73316,
          "oppiaineId" : 70105,
          "muokattu" : 1450425176817,
          "tunniste" : "70abd299-cb7d-4c43-b0d0-fefb605d0487",
          "tila" : "luonnos",
          "oma" : true,
          "maariteltyPohjassa" : false,
          "jarjestys" : null,
          "tyyppi" : "yhteinen",
          "laajuus" : null,
          "koosteinen" : false,
          "nimi" : {
            "fi" : "Ortodoksinen uskonto OMA NIMI",
            "_id" : "73143"
          },
          "abstrakti" : null,
          "tehtava" : null,
          "tavoitteet" : null,
          "arviointi" : null,
          "kurssiTyyppiKuvaukset" : {
            "PAIKALLINEN_SYVENTAVA" : null,
            "VALTAKUNNALLINEN_SOVELTAVA" : null,
            "VALTAKUNNALLINEN_PAKOLLINEN" : null,
            "PAIKALLINEN_SOVELTAVA" : null,
            "PAIKALLINEN_PAKOLLINEN" : null,
            "VALTAKUNNALLINEN_SYVENTAVA" : null
          },
          "oppimaarat" : [ ],
          "pohjanTarjonta" : [ ],
          "koodiUri" : "oppiaineetyleissivistava2_kt2",
          "koodiArvo" : "KT2",
          "kieliKoodiUri" : null,
          "kieliKoodiArvo" : null,
          "kieli" : null,
          "kurssit" : [ {
            "perusteen" : {
              "id" : 8626687,
              "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
              "nimi" : {
                "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
                "_id" : "8627006"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk1",
              "koodiArvo" : "UK1",
              "lokalisoituKoodi" : {
                "fi" : "UK1",
                "_id" : "8627007"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 72747,
            "muokattu" : 1450425176815,
            "tunniste" : "afa35751-45a9-4375-b5f9-b7bd58e52875",
            "nimi" : {
              "fi" : "Uskonto ilmiönä – kristinuskon, juutalaisuuden ja islamin jäljillä",
              "_id" : "69927"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_uk1",
            "koodiArvo" : "UK1",
            "tyyppi" : "VALTAKUNNALLINEN_PAKOLLINEN",
            "lokalisoituKoodi" : {
              "fi" : "UK1",
              "_id" : "69928"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "perusteen" : {
              "id" : 8626689,
              "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
              "nimi" : {
                "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
                "_id" : "8627110"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk3",
              "koodiArvo" : "UK3",
              "lokalisoituKoodi" : {
                "fi" : "UK3",
                "_id" : "8627111"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 2,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 72749,
            "muokattu" : 1450425176815,
            "tunniste" : "e35a8260-9844-41bf-8626-f1ce0969f115",
            "nimi" : {
              "fi" : "Maailman uskontoja ja uskonnollisia liikkeitä",
              "_id" : "70071"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_uk3",
            "koodiArvo" : "UK3",
            "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
            "lokalisoituKoodi" : {
              "fi" : "UK3",
              "_id" : "70072"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "perusteen" : {
              "id" : 8627131,
              "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
              "nimi" : {
                "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
                "_id" : "8627114"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk5",
              "koodiArvo" : "UK5",
              "lokalisoituKoodi" : {
                "fi" : "UK5",
                "_id" : "8627115"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 3,
              "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 73330,
            "muokattu" : 1450425176815,
            "tunniste" : "39474f1a-cae0-49b1-a610-6c281a3091f8",
            "nimi" : {
              "fi" : "Uskonnot tieteessä, taiteessa ja populaarikulttuurissa",
              "_id" : "70065"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_uk5",
            "koodiArvo" : "UK5",
            "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
            "lokalisoituKoodi" : {
              "fi" : "UK5",
              "_id" : "70066"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "perusteen" : {
              "id" : 8627132,
              "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
              "nimi" : {
                "fi" : "Uskonnot ja media",
                "_id" : "8627116"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_uk6",
              "koodiArvo" : "UK6",
              "lokalisoituKoodi" : {
                "fi" : "UK6",
                "_id" : "8627117"
              },
              "oppiaineId" : 8626498,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 72748,
            "muokattu" : 1450425176815,
            "tunniste" : "b63ad132-bd24-4a1a-9d0d-dbe05601b3bf",
            "nimi" : {
              "fi" : "Uskonnot ja media",
              "_id" : "70079"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_uk6",
            "koodiArvo" : "UK6",
            "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
            "lokalisoituKoodi" : {
              "fi" : "UK6",
              "_id" : "70090"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          } ]
        } ],
        "pohjanTarjonta" : [ ],
        "koodiUri" : "oppiaineetyleissivistava2_kt",
        "koodiArvo" : "KT",
        "kieliKoodiUri" : null,
        "kieliKoodiArvo" : null,
        "kieli" : null,
        "kurssit" : [ ]
      }, {
        "perusteen" : {
          "id" : 8626490,
          "tunniste" : "62f61305-ab59-48b3-9932-3d4d0a229766",
          "koodiUri" : "oppiaineetyleissivistava2_vk",
          "koodiArvo" : "VK",
          "koosteinen" : true,
          "jarjestys" : 1,
          "abstrakti" : false,
          "nimi" : {
            "fi" : "Vieraat kielet",
            "_id" : "8626377"
          },
          "kuvaus" : null,
          "pakollinenKurssiKuvaus" : null,
          "syventavaKurssiKuvaus" : null,
          "soveltavaKurssiKuvaus" : null,
          "tehtava" : {
            "id" : null,
            "otsikko" : {
              "_id" : "8626379"
            },
            "teksti" : {
              "_id" : "8626520"
            }
          },
          "tavoitteet" : {
            "id" : null,
            "otsikko" : {
              "fi" : "Opetuksen tavoitteet",
              "_id" : "8626378"
            },
            "teksti" : {
              "fi" : "<p>Vieraiden kielien yleiset tavoitteet</p>",
              "_id" : "8626522"
            }
          },
          "arviointi" : {
            "id" : null,
            "otsikko" : {
              "fi" : "Arviointi",
              "_id" : "8626376"
            },
            "teksti" : {
              "fi" : "<p>Vieraiden kielien yleiset arvioinnit.</p>",
              "_id" : "8626521"
            }
          },
          "oppimaarat" : [ {
            "id" : 8626492,
            "tunniste" : "330df029-c8de-4e5a-a4fc-58a9e05a6ce2",
            "koodiUri" : "oppiaineetyleissivistava2_a12",
            "koodiArvo" : "A12",
            "koosteinen" : false,
            "jarjestys" : 1,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Englannin A1-oppimäärä",
              "_id" : "8626529"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : {
              "fi" : "<p>Englannin pakollsiet kurssit</p>",
              "_id" : "8626590"
            },
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : {
              "id" : null,
              "otsikko" : {
                "_id" : "8626591"
              },
              "teksti" : {
                "_id" : "8626592"
              }
            },
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ {
              "id" : 8626681,
              "tunniste" : "cd3ccfbc-6371-40f9-a666-213b7bc1a5e9",
              "nimi" : {
                "fi" : "Ihminen verkostoissa",
                "_id" : "8626698"
              },
              "kuvaus" : {
                "fi" : "<p>Toinen kurssi</p>",
                "_id" : "8626697"
              },
              "koodiUri" : "lukionkurssit_ena2",
              "koodiArvo" : "ENA2",
              "lokalisoituKoodi" : {
                "fi" : "ENA2",
                "_id" : "8626699"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 2,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626682,
              "tunniste" : "599aa0d6-edb8-4dff-8e79-97e669ab86a6",
              "nimi" : {
                "fi" : "Kulttuuri-ilmiöitä",
                "_id" : "8626760"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_ena3",
              "koodiArvo" : "ENA3",
              "lokalisoituKoodi" : {
                "fi" : "ENA3",
                "_id" : "8626761"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 3,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626680,
              "tunniste" : "08b49ab9-6c05-4df7-80e5-eb467dd84354",
              "nimi" : {
                "fi" : "Englannin kieli ja maailmani",
                "_id" : "8626691"
              },
              "kuvaus" : {
                "fi" : "<p>Englannin 1. kurssi</p>",
                "_id" : "8626690"
              },
              "koodiUri" : "lukionkurssit_ena1",
              "koodiArvo" : "ENA1",
              "lokalisoituKoodi" : {
                "fi" : "ENA1",
                "_id" : "8626692"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : {
                "id" : null,
                "otsikko" : {
                  "fi" : "Tavoitteet",
                  "_id" : "8626693"
                },
                "teksti" : {
                  "fi" : "<p>Jolla voi olla tavoite</p>",
                  "_id" : "8626695"
                }
              },
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626683,
              "tunniste" : "c8a5aa31-7d31-4a40-a319-d660f1b898e2",
              "nimi" : {
                "fi" : "Viesti ja vaikuta puhuen",
                "_id" : "8626763"
              },
              "kuvaus" : {
                "fi" : "<p>Syventävä kurssi</p>",
                "_id" : "8626762"
              },
              "koodiUri" : "lukionkurssit_ena8",
              "koodiArvo" : "ENA8",
              "lokalisoituKoodi" : {
                "fi" : "ENA8",
                "_id" : "8626764"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            } ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : {
                "fi" : "<p>Englannin pakollsiet kurssit</p>",
                "_id" : "8626590"
              },
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          }, {
            "id" : 8627220,
            "tunniste" : "d9b6e712-ea38-4447-bdb2-66cedf0ecdf2",
            "koodiUri" : "oppiaineetyleissivistava2_b2",
            "koodiArvo" : "B2",
            "koosteinen" : false,
            "jarjestys" : 4,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Vieraat kielet, B2-oppimäärä",
              "_id" : "8627230"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          }, {
            "id" : 8626491,
            "tunniste" : "ab605112-fde9-49c3-9f31-dfc87aa9b551",
            "koodiUri" : "oppiaineetyleissivistava2_a1",
            "koodiArvo" : "A1",
            "koosteinen" : false,
            "jarjestys" : 2,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Vieraat kielet, A1-oppimäärä",
              "_id" : "8626523"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : {
              "fi" : "<p>Pakolliset vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
              "_id" : "8626524"
            },
            "syventavaKurssiKuvaus" : {
              "fi" : "<p>Valtakunnalliset syventävät vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
              "_id" : "8626526"
            },
            "soveltavaKurssiKuvaus" : {
              "fi" : "<p>Valtakunnalliset soveltavat vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
              "_id" : "8626525"
            },
            "tehtava" : {
              "id" : null,
              "otsikko" : {
                "_id" : "8626527"
              },
              "teksti" : {
                "_id" : "8626528"
              }
            },
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : {
                "fi" : "<p>Pakolliset vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
                "_id" : "8626524"
              },
              "VALTAKUNNALLINEN_SOVELTAVA" : {
                "fi" : "<p>Valtakunnalliset soveltavat vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
                "_id" : "8626525"
              },
              "VALTAKUNNALLINEN_SYVENTAVA" : {
                "fi" : "<p>Valtakunnalliset syventävät vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
                "_id" : "8626526"
              }
            }
          }, {
            "id" : 8626493,
            "tunniste" : "d9abf45d-3c37-4fa6-a179-35c8306665c5",
            "koodiUri" : "oppiaineetyleissivistava2_b1",
            "koodiArvo" : "B1",
            "koosteinen" : false,
            "jarjestys" : 3,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Vieraat kielet, B1-oppimäärä",
              "_id" : "8626765"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          } ],
          "kurssit" : [ ],
          "kurssiTyyppiKuvaukset" : {
            "VALTAKUNNALLINEN_PAKOLLINEN" : null,
            "VALTAKUNNALLINEN_SOVELTAVA" : null,
            "VALTAKUNNALLINEN_SYVENTAVA" : null
          }
        },
        "id" : 70106,
        "oppiaineId" : null,
        "muokattu" : 1450425847523,
        "tunniste" : "62f61305-ab59-48b3-9932-3d4d0a229766",
        "tila" : "luonnos",
        "oma" : true,
        "maariteltyPohjassa" : true,
        "jarjestys" : null,
        "tyyppi" : "yhteinen",
        "laajuus" : null,
        "koosteinen" : true,
        "nimi" : {
          "fi" : "Vieraat kielet",
          "_id" : "70094"
        },
        "abstrakti" : null,
        "tehtava" : null,
        "tavoitteet" : null,
        "arviointi" : null,
        "kurssiTyyppiKuvaukset" : {
          "PAIKALLINEN_SYVENTAVA" : null,
          "VALTAKUNNALLINEN_SOVELTAVA" : null,
          "VALTAKUNNALLINEN_PAKOLLINEN" : null,
          "PAIKALLINEN_SOVELTAVA" : null,
          "PAIKALLINEN_PAKOLLINEN" : null,
          "VALTAKUNNALLINEN_SYVENTAVA" : null
        },
        "oppimaarat" : [ {
          "perusteen" : {
            "id" : 8626492,
            "tunniste" : "330df029-c8de-4e5a-a4fc-58a9e05a6ce2",
            "koodiUri" : "oppiaineetyleissivistava2_a12",
            "koodiArvo" : "A12",
            "koosteinen" : false,
            "jarjestys" : 1,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Englannin A1-oppimäärä",
              "_id" : "8626529"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : {
              "fi" : "<p>Englannin pakollsiet kurssit</p>",
              "_id" : "8626590"
            },
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : {
              "id" : null,
              "otsikko" : {
                "_id" : "8626591"
              },
              "teksti" : {
                "_id" : "8626592"
              }
            },
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ {
              "id" : 8626681,
              "tunniste" : "cd3ccfbc-6371-40f9-a666-213b7bc1a5e9",
              "nimi" : {
                "fi" : "Ihminen verkostoissa",
                "_id" : "8626698"
              },
              "kuvaus" : {
                "fi" : "<p>Toinen kurssi</p>",
                "_id" : "8626697"
              },
              "koodiUri" : "lukionkurssit_ena2",
              "koodiArvo" : "ENA2",
              "lokalisoituKoodi" : {
                "fi" : "ENA2",
                "_id" : "8626699"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 2,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626682,
              "tunniste" : "599aa0d6-edb8-4dff-8e79-97e669ab86a6",
              "nimi" : {
                "fi" : "Kulttuuri-ilmiöitä",
                "_id" : "8626760"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_ena3",
              "koodiArvo" : "ENA3",
              "lokalisoituKoodi" : {
                "fi" : "ENA3",
                "_id" : "8626761"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 3,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626680,
              "tunniste" : "08b49ab9-6c05-4df7-80e5-eb467dd84354",
              "nimi" : {
                "fi" : "Englannin kieli ja maailmani",
                "_id" : "8626691"
              },
              "kuvaus" : {
                "fi" : "<p>Englannin 1. kurssi</p>",
                "_id" : "8626690"
              },
              "koodiUri" : "lukionkurssit_ena1",
              "koodiArvo" : "ENA1",
              "lokalisoituKoodi" : {
                "fi" : "ENA1",
                "_id" : "8626692"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : {
                "id" : null,
                "otsikko" : {
                  "fi" : "Tavoitteet",
                  "_id" : "8626693"
                },
                "teksti" : {
                  "fi" : "<p>Jolla voi olla tavoite</p>",
                  "_id" : "8626695"
                }
              },
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626683,
              "tunniste" : "c8a5aa31-7d31-4a40-a319-d660f1b898e2",
              "nimi" : {
                "fi" : "Viesti ja vaikuta puhuen",
                "_id" : "8626763"
              },
              "kuvaus" : {
                "fi" : "<p>Syventävä kurssi</p>",
                "_id" : "8626762"
              },
              "koodiUri" : "lukionkurssit_ena8",
              "koodiArvo" : "ENA8",
              "lokalisoituKoodi" : {
                "fi" : "ENA8",
                "_id" : "8626764"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            } ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : {
                "fi" : "<p>Englannin pakollsiet kurssit</p>",
                "_id" : "8626590"
              },
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          },
          "id" : 73480,
          "oppiaineId" : 70106,
          "muokattu" : 1450425847524,
          "tunniste" : "330df029-c8de-4e5a-a4fc-58a9e05a6ce2",
          "tila" : "luonnos",
          "oma" : true,
          "maariteltyPohjassa" : false,
          "jarjestys" : null,
          "tyyppi" : "yhteinen",
          "laajuus" : null,
          "koosteinen" : false,
          "nimi" : {
            "fi" : "Englannin A1-oppimäärä",
            "_id" : "73490"
          },
          "abstrakti" : null,
          "tehtava" : null,
          "tavoitteet" : null,
          "arviointi" : null,
          "kurssiTyyppiKuvaukset" : {
            "PAIKALLINEN_SYVENTAVA" : null,
            "VALTAKUNNALLINEN_SOVELTAVA" : null,
            "VALTAKUNNALLINEN_PAKOLLINEN" : {
              "fi" : "<p>Englannin pakollsiet kurssit</p>",
              "_id" : "70111"
            },
            "PAIKALLINEN_SOVELTAVA" : null,
            "PAIKALLINEN_PAKOLLINEN" : null,
            "VALTAKUNNALLINEN_SYVENTAVA" : null
          },
          "oppimaarat" : [ ],
          "pohjanTarjonta" : [ ],
          "koodiUri" : "oppiaineetyleissivistava2_a12",
          "koodiArvo" : "A12",
          "kieliKoodiUri" : "lukiokielitarjonta_en",
          "kieliKoodiArvo" : "EN",
          "kieli" : {
            "fi" : "englannin kieli",
            "_id" : "73149"
          },
          "kurssit" : [ {
            "perusteen" : {
              "id" : 8626680,
              "tunniste" : "08b49ab9-6c05-4df7-80e5-eb467dd84354",
              "nimi" : {
                "fi" : "Englannin kieli ja maailmani",
                "_id" : "8626691"
              },
              "kuvaus" : {
                "fi" : "<p>Englannin 1. kurssi</p>",
                "_id" : "8626690"
              },
              "koodiUri" : "lukionkurssit_ena1",
              "koodiArvo" : "ENA1",
              "lokalisoituKoodi" : {
                "fi" : "ENA1",
                "_id" : "8626692"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : {
                "id" : null,
                "otsikko" : {
                  "fi" : "Tavoitteet",
                  "_id" : "8626693"
                },
                "teksti" : {
                  "fi" : "<p>Jolla voi olla tavoite</p>",
                  "_id" : "8626695"
                }
              },
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 73339,
            "muokattu" : 1450427328738,
            "tunniste" : "08b49ab9-6c05-4df7-80e5-eb467dd84354",
            "nimi" : {
              "fi" : "Englannin kieli ja maailmani",
              "_id" : "70114"
            },
            "kuvaus" : {
              "fi" : "<p>Ja mehän opitaan täällä!</p>",
              "_id" : "73492"
            },
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_ena1",
            "koodiArvo" : "ENA1",
            "tyyppi" : "VALTAKUNNALLINEN_PAKOLLINEN",
            "lokalisoituKoodi" : {
              "fi" : "ENA1",
              "_id" : "70115"
            },
            "tavoitteet" : {
              "id" : 73570,
              "otsikko" : {
                "fi" : "Tavoitteet",
                "_id" : "73493"
              },
              "teksti" : {
                "fi" : "<p>Oma tavoite!</p>",
                "_id" : "73494"
              }
            },
            "keskeinenSisalto" : {
              "id" : 73571,
              "otsikko" : {
                "fi" : "Keskeiset sisällöt",
                "_id" : "73495"
              },
              "teksti" : {
                "fi" : "<p>Oma keskeinen sisätlö jota ei perusteessa!</p>",
                "_id" : "73496"
              }
            },
            "tavoitteetJaKeskeinenSisalto" : {
              "id" : 73572,
              "otsikko" : {
                "fi" : "dgfdg",
                "_id" : "73499"
              },
              "teksti" : {
                "fi" : "<p>gfdgfdg</p>\n\n<p> </p>",
                "_id" : "73640"
              }
            }
          }, {
            "perusteen" : {
              "id" : 8626681,
              "tunniste" : "cd3ccfbc-6371-40f9-a666-213b7bc1a5e9",
              "nimi" : {
                "fi" : "Ihminen verkostoissa",
                "_id" : "8626698"
              },
              "kuvaus" : {
                "fi" : "<p>Toinen kurssi</p>",
                "_id" : "8626697"
              },
              "koodiUri" : "lukionkurssit_ena2",
              "koodiArvo" : "ENA2",
              "lokalisoituKoodi" : {
                "fi" : "ENA2",
                "_id" : "8626699"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 2,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 73337,
            "muokattu" : 1450425847520,
            "tunniste" : "cd3ccfbc-6371-40f9-a666-213b7bc1a5e9",
            "nimi" : {
              "fi" : "Ihminen verkostoissa",
              "_id" : "70116"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_ena2",
            "koodiArvo" : "ENA2",
            "tyyppi" : "VALTAKUNNALLINEN_PAKOLLINEN",
            "lokalisoituKoodi" : {
              "fi" : "ENA2",
              "_id" : "70117"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "perusteen" : {
              "id" : 8626682,
              "tunniste" : "599aa0d6-edb8-4dff-8e79-97e669ab86a6",
              "nimi" : {
                "fi" : "Kulttuuri-ilmiöitä",
                "_id" : "8626760"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_ena3",
              "koodiArvo" : "ENA3",
              "lokalisoituKoodi" : {
                "fi" : "ENA3",
                "_id" : "8626761"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 3,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 73336,
            "muokattu" : 1450425847520,
            "tunniste" : "599aa0d6-edb8-4dff-8e79-97e669ab86a6",
            "nimi" : {
              "fi" : "Kulttuuri-ilmiöitä",
              "_id" : "70140"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_ena3",
            "koodiArvo" : "ENA3",
            "tyyppi" : "VALTAKUNNALLINEN_PAKOLLINEN",
            "lokalisoituKoodi" : {
              "fi" : "ENA3",
              "_id" : "70141"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "perusteen" : {
              "id" : 8626683,
              "tunniste" : "c8a5aa31-7d31-4a40-a319-d660f1b898e2",
              "nimi" : {
                "fi" : "Viesti ja vaikuta puhuen",
                "_id" : "8626763"
              },
              "kuvaus" : {
                "fi" : "<p>Syventävä kurssi</p>",
                "_id" : "8626762"
              },
              "koodiUri" : "lukionkurssit_ena8",
              "koodiArvo" : "ENA8",
              "lokalisoituKoodi" : {
                "fi" : "ENA8",
                "_id" : "8626764"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 73338,
            "muokattu" : 1450425847520,
            "tunniste" : "c8a5aa31-7d31-4a40-a319-d660f1b898e2",
            "nimi" : {
              "fi" : "Viesti ja vaikuta puhuen",
              "_id" : "70091"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_ena8",
            "koodiArvo" : "ENA8",
            "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
            "lokalisoituKoodi" : {
              "fi" : "ENA8",
              "_id" : "70092"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          } ]
        }, {
          "perusteen" : {
            "id" : 8626493,
            "tunniste" : "d9abf45d-3c37-4fa6-a179-35c8306665c5",
            "koodiUri" : "oppiaineetyleissivistava2_b1",
            "koodiArvo" : "B1",
            "koosteinen" : false,
            "jarjestys" : 3,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Vieraat kielet, B1-oppimäärä",
              "_id" : "8626765"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          },
          "id" : 73318,
          "oppiaineId" : 70106,
          "muokattu" : 1450425530731,
          "tunniste" : "d9abf45d-3c37-4fa6-a179-35c8306665c5",
          "tila" : "luonnos",
          "oma" : true,
          "maariteltyPohjassa" : false,
          "jarjestys" : null,
          "tyyppi" : "yhteinen",
          "laajuus" : null,
          "koosteinen" : false,
          "nimi" : {
            "fi" : "italian kieli, B1-oppimäärä",
            "_id" : "73146"
          },
          "abstrakti" : null,
          "tehtava" : null,
          "tavoitteet" : null,
          "arviointi" : null,
          "kurssiTyyppiKuvaukset" : {
            "PAIKALLINEN_SYVENTAVA" : null,
            "VALTAKUNNALLINEN_SOVELTAVA" : null,
            "VALTAKUNNALLINEN_PAKOLLINEN" : null,
            "PAIKALLINEN_SOVELTAVA" : null,
            "PAIKALLINEN_PAKOLLINEN" : null,
            "VALTAKUNNALLINEN_SYVENTAVA" : null
          },
          "oppimaarat" : [ ],
          "pohjanTarjonta" : [ ],
          "koodiUri" : "oppiaineetyleissivistava2_b1",
          "koodiArvo" : "B1",
          "kieliKoodiUri" : "lukiokielitarjonta_ia",
          "kieliKoodiArvo" : "IA",
          "kieli" : {
            "fi" : "italian kieli",
            "_id" : "73145"
          },
          "kurssit" : [ ]
        }, {
          "perusteen" : {
            "id" : 8627220,
            "tunniste" : "d9b6e712-ea38-4447-bdb2-66cedf0ecdf2",
            "koodiUri" : "oppiaineetyleissivistava2_b2",
            "koodiArvo" : "B2",
            "koosteinen" : false,
            "jarjestys" : 4,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Vieraat kielet, B2-oppimäärä",
              "_id" : "8627230"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          },
          "id" : 73319,
          "oppiaineId" : 70106,
          "muokattu" : 1450425558990,
          "tunniste" : "d9b6e712-ea38-4447-bdb2-66cedf0ecdf2",
          "tila" : "luonnos",
          "oma" : true,
          "maariteltyPohjassa" : false,
          "jarjestys" : null,
          "tyyppi" : "yhteinen",
          "laajuus" : null,
          "koosteinen" : false,
          "nimi" : {
            "fi" : "muu kieli, B2-oppimäärä",
            "_id" : "73148"
          },
          "abstrakti" : null,
          "tehtava" : null,
          "tavoitteet" : null,
          "arviointi" : null,
          "kurssiTyyppiKuvaukset" : {
            "PAIKALLINEN_SYVENTAVA" : null,
            "VALTAKUNNALLINEN_SOVELTAVA" : null,
            "VALTAKUNNALLINEN_PAKOLLINEN" : null,
            "PAIKALLINEN_SOVELTAVA" : null,
            "PAIKALLINEN_PAKOLLINEN" : null,
            "VALTAKUNNALLINEN_SYVENTAVA" : null
          },
          "oppimaarat" : [ ],
          "pohjanTarjonta" : [ ],
          "koodiUri" : "oppiaineetyleissivistava2_b2",
          "koodiArvo" : "B2",
          "kieliKoodiUri" : "lukiokielitarjonta_kx",
          "kieliKoodiArvo" : "KX",
          "kieli" : {
            "fi" : "muu kieli X KIELI",
            "_id" : "73147"
          },
          "kurssit" : [ ]
        }, {
          "perusteen" : {
            "id" : 8627220,
            "tunniste" : "d9b6e712-ea38-4447-bdb2-66cedf0ecdf2",
            "koodiUri" : "oppiaineetyleissivistava2_b2",
            "koodiArvo" : "B2",
            "koosteinen" : false,
            "jarjestys" : 4,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Vieraat kielet, B2-oppimäärä",
              "_id" : "8627230"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          },
          "id" : 71953,
          "oppiaineId" : 70106,
          "muokattu" : 1450418454599,
          "tunniste" : "d9b6e712-ea38-4447-bdb2-66cedf0ecdf2",
          "tila" : "luonnos",
          "oma" : true,
          "maariteltyPohjassa" : false,
          "jarjestys" : null,
          "tyyppi" : "yhteinen",
          "laajuus" : null,
          "koosteinen" : false,
          "nimi" : {
            "fi" : "ranskan kieli, B2-oppimäärä",
            "_id" : "72487"
          },
          "abstrakti" : null,
          "tehtava" : null,
          "tavoitteet" : null,
          "arviointi" : null,
          "kurssiTyyppiKuvaukset" : {
            "PAIKALLINEN_SYVENTAVA" : null,
            "VALTAKUNNALLINEN_SOVELTAVA" : null,
            "VALTAKUNNALLINEN_PAKOLLINEN" : null,
            "PAIKALLINEN_SOVELTAVA" : null,
            "PAIKALLINEN_PAKOLLINEN" : null,
            "VALTAKUNNALLINEN_SYVENTAVA" : null
          },
          "oppimaarat" : [ ],
          "pohjanTarjonta" : [ ],
          "koodiUri" : "oppiaineetyleissivistava2_b2",
          "koodiArvo" : "B2",
          "kieliKoodiUri" : "lukiokielitarjonta_ra",
          "kieliKoodiArvo" : "RA",
          "kieli" : {
            "fi" : "ranskan kieli",
            "_id" : "72486"
          },
          "kurssit" : [ ]
        } ],
        "pohjanTarjonta" : [ {
          "perusteen" : {
            "id" : 8627220,
            "tunniste" : "d9b6e712-ea38-4447-bdb2-66cedf0ecdf2",
            "koodiUri" : "oppiaineetyleissivistava2_b2",
            "koodiArvo" : "B2",
            "koosteinen" : false,
            "jarjestys" : 4,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Vieraat kielet, B2-oppimäärä",
              "_id" : "8627230"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          },
          "id" : 70102,
          "oppiaineId" : 70100,
          "muokattu" : 1450125467348,
          "tunniste" : "d9b6e712-ea38-4447-bdb2-66cedf0ecdf2",
          "tila" : "luonnos",
          "oma" : false,
          "maariteltyPohjassa" : false,
          "jarjestys" : null,
          "tyyppi" : "lukio",
          "laajuus" : null,
          "koosteinen" : false,
          "nimi" : {
            "fi" : "Vieraat kielet, B2-oppimäärä",
            "_id" : "70096"
          },
          "abstrakti" : true,
          "tehtava" : null,
          "tavoitteet" : null,
          "arviointi" : null,
          "kurssiTyyppiKuvaukset" : {
            "PAIKALLINEN_SYVENTAVA" : null,
            "VALTAKUNNALLINEN_SOVELTAVA" : null,
            "VALTAKUNNALLINEN_PAKOLLINEN" : null,
            "PAIKALLINEN_SOVELTAVA" : null,
            "PAIKALLINEN_PAKOLLINEN" : null,
            "VALTAKUNNALLINEN_SYVENTAVA" : null
          },
          "oppimaarat" : [ ],
          "pohjanTarjonta" : [ ],
          "koodiUri" : "oppiaineetyleissivistava2_b2",
          "koodiArvo" : "B2",
          "kieliKoodiUri" : null,
          "kieliKoodiArvo" : null,
          "kieli" : null,
          "kurssit" : [ ]
        }, {
          "perusteen" : {
            "id" : 8626493,
            "tunniste" : "d9abf45d-3c37-4fa6-a179-35c8306665c5",
            "koodiUri" : "oppiaineetyleissivistava2_b1",
            "koodiArvo" : "B1",
            "koosteinen" : false,
            "jarjestys" : 3,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Vieraat kielet, B1-oppimäärä",
              "_id" : "8626765"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : null,
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : null,
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : null,
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          },
          "id" : 70101,
          "oppiaineId" : 70100,
          "muokattu" : 1450125467348,
          "tunniste" : "d9abf45d-3c37-4fa6-a179-35c8306665c5",
          "tila" : "luonnos",
          "oma" : false,
          "maariteltyPohjassa" : false,
          "jarjestys" : null,
          "tyyppi" : "lukio",
          "laajuus" : null,
          "koosteinen" : false,
          "nimi" : {
            "fi" : "Vieraat kielet, B1-oppimäärä",
            "_id" : "70095"
          },
          "abstrakti" : true,
          "tehtava" : null,
          "tavoitteet" : null,
          "arviointi" : null,
          "kurssiTyyppiKuvaukset" : {
            "PAIKALLINEN_SYVENTAVA" : null,
            "VALTAKUNNALLINEN_SOVELTAVA" : null,
            "VALTAKUNNALLINEN_PAKOLLINEN" : null,
            "PAIKALLINEN_SOVELTAVA" : null,
            "PAIKALLINEN_PAKOLLINEN" : null,
            "VALTAKUNNALLINEN_SYVENTAVA" : null
          },
          "oppimaarat" : [ ],
          "pohjanTarjonta" : [ ],
          "koodiUri" : "oppiaineetyleissivistava2_b1",
          "koodiArvo" : "B1",
          "kieliKoodiUri" : null,
          "kieliKoodiArvo" : null,
          "kieli" : null,
          "kurssit" : [ ]
        }, {
          "perusteen" : {
            "id" : 8626491,
            "tunniste" : "ab605112-fde9-49c3-9f31-dfc87aa9b551",
            "koodiUri" : "oppiaineetyleissivistava2_a1",
            "koodiArvo" : "A1",
            "koosteinen" : false,
            "jarjestys" : 2,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Vieraat kielet, A1-oppimäärä",
              "_id" : "8626523"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : {
              "fi" : "<p>Pakolliset vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
              "_id" : "8626524"
            },
            "syventavaKurssiKuvaus" : {
              "fi" : "<p>Valtakunnalliset syventävät vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
              "_id" : "8626526"
            },
            "soveltavaKurssiKuvaus" : {
              "fi" : "<p>Valtakunnalliset soveltavat vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
              "_id" : "8626525"
            },
            "tehtava" : {
              "id" : null,
              "otsikko" : {
                "_id" : "8626527"
              },
              "teksti" : {
                "_id" : "8626528"
              }
            },
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : {
                "fi" : "<p>Pakolliset vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
                "_id" : "8626524"
              },
              "VALTAKUNNALLINEN_SOVELTAVA" : {
                "fi" : "<p>Valtakunnalliset soveltavat vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
                "_id" : "8626525"
              },
              "VALTAKUNNALLINEN_SYVENTAVA" : {
                "fi" : "<p>Valtakunnalliset syventävät vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
                "_id" : "8626526"
              }
            }
          },
          "id" : 70103,
          "oppiaineId" : 70100,
          "muokattu" : 1450125467349,
          "tunniste" : "ab605112-fde9-49c3-9f31-dfc87aa9b551",
          "tila" : "luonnos",
          "oma" : false,
          "maariteltyPohjassa" : false,
          "jarjestys" : null,
          "tyyppi" : "lukio",
          "laajuus" : null,
          "koosteinen" : false,
          "nimi" : {
            "fi" : "Vieraat kielet, A1-oppimäärä",
            "_id" : "70097"
          },
          "abstrakti" : true,
          "tehtava" : null,
          "tavoitteet" : null,
          "arviointi" : null,
          "kurssiTyyppiKuvaukset" : {
            "PAIKALLINEN_SYVENTAVA" : null,
            "VALTAKUNNALLINEN_SOVELTAVA" : {
              "fi" : "<p>Valtakunnalliset soveltavat vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
              "_id" : "70099"
            },
            "VALTAKUNNALLINEN_PAKOLLINEN" : {
              "fi" : "<p>Pakolliset vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
              "_id" : "70098"
            },
            "PAIKALLINEN_SOVELTAVA" : null,
            "PAIKALLINEN_PAKOLLINEN" : null,
            "VALTAKUNNALLINEN_SYVENTAVA" : {
              "fi" : "<p>Valtakunnalliset syventävät vieraan kielen kurssit A1-oppimäärässä yleisesti...</p>",
              "_id" : "70110"
            }
          },
          "oppimaarat" : [ ],
          "pohjanTarjonta" : [ ],
          "koodiUri" : "oppiaineetyleissivistava2_a1",
          "koodiArvo" : "A1",
          "kieliKoodiUri" : null,
          "kieliKoodiArvo" : null,
          "kieli" : null,
          "kurssit" : [ ]
        }, {
          "perusteen" : {
            "id" : 8626492,
            "tunniste" : "330df029-c8de-4e5a-a4fc-58a9e05a6ce2",
            "koodiUri" : "oppiaineetyleissivistava2_a12",
            "koodiArvo" : "A12",
            "koosteinen" : false,
            "jarjestys" : 1,
            "abstrakti" : true,
            "nimi" : {
              "fi" : "Englannin A1-oppimäärä",
              "_id" : "8626529"
            },
            "kuvaus" : null,
            "pakollinenKurssiKuvaus" : {
              "fi" : "<p>Englannin pakollsiet kurssit</p>",
              "_id" : "8626590"
            },
            "syventavaKurssiKuvaus" : null,
            "soveltavaKurssiKuvaus" : null,
            "tehtava" : {
              "id" : null,
              "otsikko" : {
                "_id" : "8626591"
              },
              "teksti" : {
                "_id" : "8626592"
              }
            },
            "tavoitteet" : null,
            "arviointi" : null,
            "oppimaarat" : [ ],
            "kurssit" : [ {
              "id" : 8626681,
              "tunniste" : "cd3ccfbc-6371-40f9-a666-213b7bc1a5e9",
              "nimi" : {
                "fi" : "Ihminen verkostoissa",
                "_id" : "8626698"
              },
              "kuvaus" : {
                "fi" : "<p>Toinen kurssi</p>",
                "_id" : "8626697"
              },
              "koodiUri" : "lukionkurssit_ena2",
              "koodiArvo" : "ENA2",
              "lokalisoituKoodi" : {
                "fi" : "ENA2",
                "_id" : "8626699"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 2,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626682,
              "tunniste" : "599aa0d6-edb8-4dff-8e79-97e669ab86a6",
              "nimi" : {
                "fi" : "Kulttuuri-ilmiöitä",
                "_id" : "8626760"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_ena3",
              "koodiArvo" : "ENA3",
              "lokalisoituKoodi" : {
                "fi" : "ENA3",
                "_id" : "8626761"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 3,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626680,
              "tunniste" : "08b49ab9-6c05-4df7-80e5-eb467dd84354",
              "nimi" : {
                "fi" : "Englannin kieli ja maailmani",
                "_id" : "8626691"
              },
              "kuvaus" : {
                "fi" : "<p>Englannin 1. kurssi</p>",
                "_id" : "8626690"
              },
              "koodiUri" : "lukionkurssit_ena1",
              "koodiArvo" : "ENA1",
              "lokalisoituKoodi" : {
                "fi" : "ENA1",
                "_id" : "8626692"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : {
                "id" : null,
                "otsikko" : {
                  "fi" : "Tavoitteet",
                  "_id" : "8626693"
                },
                "teksti" : {
                  "fi" : "<p>Jolla voi olla tavoite</p>",
                  "_id" : "8626695"
                }
              },
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            }, {
              "id" : 8626683,
              "tunniste" : "c8a5aa31-7d31-4a40-a319-d660f1b898e2",
              "nimi" : {
                "fi" : "Viesti ja vaikuta puhuen",
                "_id" : "8626763"
              },
              "kuvaus" : {
                "fi" : "<p>Syventävä kurssi</p>",
                "_id" : "8626762"
              },
              "koodiUri" : "lukionkurssit_ena8",
              "koodiArvo" : "ENA8",
              "lokalisoituKoodi" : {
                "fi" : "ENA8",
                "_id" : "8626764"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            } ],
            "kurssiTyyppiKuvaukset" : {
              "VALTAKUNNALLINEN_PAKOLLINEN" : {
                "fi" : "<p>Englannin pakollsiet kurssit</p>",
                "_id" : "8626590"
              },
              "VALTAKUNNALLINEN_SOVELTAVA" : null,
              "VALTAKUNNALLINEN_SYVENTAVA" : null
            }
          },
          "id" : 69999,
          "oppiaineId" : 70100,
          "muokattu" : 1450125467346,
          "tunniste" : "330df029-c8de-4e5a-a4fc-58a9e05a6ce2",
          "tila" : "luonnos",
          "oma" : false,
          "maariteltyPohjassa" : false,
          "jarjestys" : null,
          "tyyppi" : "lukio",
          "laajuus" : null,
          "koosteinen" : false,
          "nimi" : {
            "fi" : "Englannin A1-oppimäärä",
            "_id" : "70093"
          },
          "abstrakti" : true,
          "tehtava" : null,
          "tavoitteet" : null,
          "arviointi" : null,
          "kurssiTyyppiKuvaukset" : {
            "PAIKALLINEN_SYVENTAVA" : null,
            "VALTAKUNNALLINEN_SOVELTAVA" : null,
            "VALTAKUNNALLINEN_PAKOLLINEN" : {
              "fi" : "<p>Englannin pakollsiet kurssit</p>",
              "_id" : "70111"
            },
            "PAIKALLINEN_SOVELTAVA" : null,
            "PAIKALLINEN_PAKOLLINEN" : null,
            "VALTAKUNNALLINEN_SYVENTAVA" : null
          },
          "oppimaarat" : [ ],
          "pohjanTarjonta" : [ ],
          "koodiUri" : "oppiaineetyleissivistava2_a12",
          "koodiArvo" : "A12",
          "kieliKoodiUri" : null,
          "kieliKoodiArvo" : null,
          "kieli" : null,
          "kurssit" : [ {
            "perusteen" : {
              "id" : 8626680,
              "tunniste" : "08b49ab9-6c05-4df7-80e5-eb467dd84354",
              "nimi" : {
                "fi" : "Englannin kieli ja maailmani",
                "_id" : "8626691"
              },
              "kuvaus" : {
                "fi" : "<p>Englannin 1. kurssi</p>",
                "_id" : "8626690"
              },
              "koodiUri" : "lukionkurssit_ena1",
              "koodiArvo" : "ENA1",
              "lokalisoituKoodi" : {
                "fi" : "ENA1",
                "_id" : "8626692"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 1,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : {
                "id" : null,
                "otsikko" : {
                  "fi" : "Tavoitteet",
                  "_id" : "8626693"
                },
                "teksti" : {
                  "fi" : "<p>Jolla voi olla tavoite</p>",
                  "_id" : "8626695"
                }
              },
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 70121,
            "muokattu" : 1450125467354,
            "tunniste" : "08b49ab9-6c05-4df7-80e5-eb467dd84354",
            "nimi" : {
              "fi" : "Englannin kieli ja maailmani",
              "_id" : "70114"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_ena1",
            "koodiArvo" : "ENA1",
            "tyyppi" : "VALTAKUNNALLINEN_PAKOLLINEN",
            "lokalisoituKoodi" : {
              "fi" : "ENA1",
              "_id" : "70115"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "perusteen" : {
              "id" : 8626681,
              "tunniste" : "cd3ccfbc-6371-40f9-a666-213b7bc1a5e9",
              "nimi" : {
                "fi" : "Ihminen verkostoissa",
                "_id" : "8626698"
              },
              "kuvaus" : {
                "fi" : "<p>Toinen kurssi</p>",
                "_id" : "8626697"
              },
              "koodiUri" : "lukionkurssit_ena2",
              "koodiArvo" : "ENA2",
              "lokalisoituKoodi" : {
                "fi" : "ENA2",
                "_id" : "8626699"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 2,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 70122,
            "muokattu" : 1450125467354,
            "tunniste" : "cd3ccfbc-6371-40f9-a666-213b7bc1a5e9",
            "nimi" : {
              "fi" : "Ihminen verkostoissa",
              "_id" : "70116"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_ena2",
            "koodiArvo" : "ENA2",
            "tyyppi" : "VALTAKUNNALLINEN_PAKOLLINEN",
            "lokalisoituKoodi" : {
              "fi" : "ENA2",
              "_id" : "70117"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "perusteen" : {
              "id" : 8626682,
              "tunniste" : "599aa0d6-edb8-4dff-8e79-97e669ab86a6",
              "nimi" : {
                "fi" : "Kulttuuri-ilmiöitä",
                "_id" : "8626760"
              },
              "kuvaus" : null,
              "koodiUri" : "lukionkurssit_ena3",
              "koodiArvo" : "ENA3",
              "lokalisoituKoodi" : {
                "fi" : "ENA3",
                "_id" : "8626761"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 3,
              "tyyppi" : "PAKOLLINEN",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 70124,
            "muokattu" : 1450125467356,
            "tunniste" : "599aa0d6-edb8-4dff-8e79-97e669ab86a6",
            "nimi" : {
              "fi" : "Kulttuuri-ilmiöitä",
              "_id" : "70140"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_ena3",
            "koodiArvo" : "ENA3",
            "tyyppi" : "VALTAKUNNALLINEN_PAKOLLINEN",
            "lokalisoituKoodi" : {
              "fi" : "ENA3",
              "_id" : "70141"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "perusteen" : {
              "id" : 8626683,
              "tunniste" : "c8a5aa31-7d31-4a40-a319-d660f1b898e2",
              "nimi" : {
                "fi" : "Viesti ja vaikuta puhuen",
                "_id" : "8626763"
              },
              "kuvaus" : {
                "fi" : "<p>Syventävä kurssi</p>",
                "_id" : "8626762"
              },
              "koodiUri" : "lukionkurssit_ena8",
              "koodiArvo" : "ENA8",
              "lokalisoituKoodi" : {
                "fi" : "ENA8",
                "_id" : "8626764"
              },
              "oppiaineId" : 8626492,
              "jarjestys" : 4,
              "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma" : null,
              "tavoitteet" : null,
              "keskeinenSisalto" : null,
              "tavoitteetJaKeskeinenSisalto" : null
            },
            "id" : 69989,
            "muokattu" : 1450125467346,
            "tunniste" : "c8a5aa31-7d31-4a40-a319-d660f1b898e2",
            "nimi" : {
              "fi" : "Viesti ja vaikuta puhuen",
              "_id" : "70091"
            },
            "kuvaus" : null,
            "oma" : true,
            "palautettava" : false,
            "koodiUri" : "lukionkurssit_ena8",
            "koodiArvo" : "ENA8",
            "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
            "lokalisoituKoodi" : {
              "fi" : "ENA8",
              "_id" : "70092"
            },
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          } ]
        } ],
        "koodiUri" : "oppiaineetyleissivistava2_vk",
        "koodiArvo" : "VK",
        "kieliKoodiUri" : null,
        "kieliKoodiArvo" : null,
        "kieli" : null,
        "kurssit" : [ ]
      }, {
        "perusteen" : null,
        "id" : 70634,
        "oppiaineId" : null,
        "muokattu" : 1450271228442,
        "tunniste" : "b881dc62-47b9-450f-9426-4c0b6b186ba0",
        "tila" : "luonnos",
        "oma" : true,
        "maariteltyPohjassa" : false,
        "jarjestys" : null,
        "tyyppi" : "yhteinen",
        "laajuus" : null,
        "koosteinen" : false,
        "nimi" : {
          "fi" : "Historia",
          "sv" : "Historia",
          "_id" : "70836"
        },
        "abstrakti" : null,
        "tehtava" : {
          "id" : 70646,
          "otsikko" : {
            "fi" : "Oppiaineen tehtävä",
            "_id" : "70839"
          },
          "teksti" : {
            "fi" : "<p>saSas</p>",
            "_id" : "70880"
          }
        },
        "tavoitteet" : {
          "id" : 70645,
          "otsikko" : {
            "fi" : "Opetuksen tavoitteet",
            "_id" : "70837"
          },
          "teksti" : {
            "fi" : "<p>asSasa</p>",
            "_id" : "70838"
          }
        },
        "arviointi" : {
          "id" : 70644,
          "otsikko" : {
            "fi" : "Arviointi",
            "_id" : "70834"
          },
          "teksti" : {
            "fi" : "<p>SsASas aasassas</p>",
            "_id" : "70835"
          }
        },
        "kurssiTyyppiKuvaukset" : {
          "PAIKALLINEN_SYVENTAVA" : null,
          "VALTAKUNNALLINEN_SOVELTAVA" : null,
          "VALTAKUNNALLINEN_PAKOLLINEN" : null,
          "PAIKALLINEN_SOVELTAVA" : null,
          "PAIKALLINEN_PAKOLLINEN" : null,
          "VALTAKUNNALLINEN_SYVENTAVA" : null
        },
        "oppimaarat" : [ ],
        "pohjanTarjonta" : [ ],
        "koodiUri" : "oppiaineetyleissivistava2_hi",
        "koodiArvo" : "HI",
        "kieliKoodiUri" : null,
        "kieliKoodiArvo" : null,
        "kieli" : null,
        "kurssit" : [ ]
      }, {
        "perusteen" : {
          "id" : 8626495,
          "tunniste" : "ab25add7-553d-45c8-8388-4b099980728e",
          "koodiUri" : "oppiaineetyleissivistava2_li",
          "koodiArvo" : "LI",
          "koosteinen" : false,
          "jarjestys" : 3,
          "abstrakti" : null,
          "nimi" : {
            "fi" : "Liikunta",
            "_id" : "8626769"
          },
          "kuvaus" : null,
          "pakollinenKurssiKuvaus" : {
            "fi" : "<p>Pakollisten kurssien kuvaus</p>",
            "_id" : "8626870"
          },
          "syventavaKurssiKuvaus" : {
            "fi" : "<p>Syventävien kurssien kuvaus</p>",
            "_id" : "8626871"
          },
          "soveltavaKurssiKuvaus" : {
            "fi" : "<p>Soveltavien kuvaus</p>",
            "_id" : "8627005"
          },
          "tehtava" : {
            "id" : null,
            "otsikko" : {
              "_id" : "8626872"
            },
            "teksti" : {
              "_id" : "8626873"
            }
          },
          "tavoitteet" : null,
          "arviointi" : null,
          "oppimaarat" : [ ],
          "kurssit" : [ {
            "id" : 8626684,
            "tunniste" : "4b2a21b2-3897-46f8-a7a0-94b14f608ebc",
            "nimi" : {
              "fi" : "Energiaa liikunnasta",
              "_id" : "8626879"
            },
            "kuvaus" : null,
            "koodiUri" : "lukionkurssit_li1",
            "koodiArvo" : "LI1",
            "lokalisoituKoodi" : {
              "fi" : "LI1",
              "_id" : "8627000"
            },
            "oppiaineId" : 8626495,
            "jarjestys" : 1,
            "tyyppi" : "PAKOLLINEN",
            "opetussuunnitelma" : null,
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "id" : 8626685,
            "tunniste" : "d359da1b-38a7-4475-9773-5778ea69fa9b",
            "nimi" : {
              "fi" : "Aktiivinen elämäntapa",
              "_id" : "8627001"
            },
            "kuvaus" : null,
            "koodiUri" : "lukionkurssit_li2",
            "koodiArvo" : "LI2",
            "lokalisoituKoodi" : {
              "fi" : "LI2",
              "_id" : "8627002"
            },
            "oppiaineId" : 8626495,
            "jarjestys" : 2,
            "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
            "opetussuunnitelma" : null,
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          }, {
            "id" : 8626686,
            "tunniste" : "15b9e88d-586b-4ed5-9cf2-acd8cc3e6c89",
            "nimi" : {
              "fi" : "Terveyttä liikkuen",
              "_id" : "8627003"
            },
            "kuvaus" : null,
            "koodiUri" : "lukionkurssit_li3",
            "koodiArvo" : "LI3",
            "lokalisoituKoodi" : {
              "fi" : "LI3",
              "_id" : "8627004"
            },
            "oppiaineId" : 8626495,
            "jarjestys" : 3,
            "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
            "opetussuunnitelma" : null,
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          } ],
          "kurssiTyyppiKuvaukset" : {
            "VALTAKUNNALLINEN_PAKOLLINEN" : {
              "fi" : "<p>Pakollisten kurssien kuvaus</p>",
              "_id" : "8626870"
            },
            "VALTAKUNNALLINEN_SOVELTAVA" : {
              "fi" : "<p>Soveltavien kuvaus</p>",
              "_id" : "8627005"
            },
            "VALTAKUNNALLINEN_SYVENTAVA" : {
              "fi" : "<p>Syventävien kurssien kuvaus</p>",
              "_id" : "8626871"
            }
          }
        },
        "id" : 70104,
        "oppiaineId" : null,
        "muokattu" : 1450125511045,
        "tunniste" : "ab25add7-553d-45c8-8388-4b099980728e",
        "tila" : "luonnos",
        "oma" : true,
        "maariteltyPohjassa" : true,
        "jarjestys" : null,
        "tyyppi" : "yhteinen",
        "laajuus" : null,
        "koosteinen" : false,
        "nimi" : {
          "fi" : "Liikunta",
          "_id" : "70075"
        },
        "abstrakti" : null,
        "tehtava" : null,
        "tavoitteet" : null,
        "arviointi" : null,
        "kurssiTyyppiKuvaukset" : {
          "PAIKALLINEN_SYVENTAVA" : null,
          "VALTAKUNNALLINEN_SOVELTAVA" : {
            "fi" : "<p>Soveltavien kuvaus</p>",
            "_id" : "70077"
          },
          "VALTAKUNNALLINEN_PAKOLLINEN" : {
            "fi" : "<p>Pakollisten kurssien kuvaus</p>",
            "_id" : "70076"
          },
          "PAIKALLINEN_SOVELTAVA" : null,
          "PAIKALLINEN_PAKOLLINEN" : null,
          "VALTAKUNNALLINEN_SYVENTAVA" : {
            "fi" : "<p>Syventävien kurssien kuvaus</p>",
            "_id" : "70078"
          }
        },
        "oppimaarat" : [ ],
        "pohjanTarjonta" : [ ],
        "koodiUri" : "oppiaineetyleissivistava2_li",
        "koodiArvo" : "LI",
        "kieliKoodiUri" : null,
        "kieliKoodiArvo" : null,
        "kieli" : null,
        "kurssit" : [ {
          "perusteen" : null,
          "id" : 73700,
          "muokattu" : 1450428713640,
          "tunniste" : "d3e560f7-289e-497f-b4bd-32ee39d7dc9a",
          "nimi" : {
            "fi" : "Paikallinen soveltava kurssi",
            "_id" : "73641"
          },
          "kuvaus" : null,
          "oma" : true,
          "palautettava" : false,
          "koodiUri" : "lukionkurssit_pso",
          "koodiArvo" : "PSO",
          "tyyppi" : "PAIKALLINEN_SOVELTAVA",
          "lokalisoituKoodi" : {
            "fi" : "PSO",
            "_id" : "73642"
          },
          "tavoitteet" : null,
          "keskeinenSisalto" : null,
          "tavoitteetJaKeskeinenSisalto" : null
        }, {
          "perusteen" : null,
          "id" : 70721,
          "muokattu" : 1450271059211,
          "tunniste" : "e556097a-fbde-476f-ae9e-629a73ea5c85",
          "nimi" : {
            "fi" : "Tanssin lukiodiplomi",
            "_id" : "70686"
          },
          "kuvaus" : {
            "fi" : "<p>adqrq werfwefwe fds sf sdfsdfs</p>",
            "_id" : "70685"
          },
          "oma" : true,
          "palautettava" : false,
          "koodiUri" : "lukionkurssit_ld7",
          "koodiArvo" : "LD7",
          "tyyppi" : "PAIKALLINEN_SOVELTAVA",
          "lokalisoituKoodi" : {
            "fi" : "LD7",
            "_id" : "70687"
          },
          "tavoitteet" : null,
          "keskeinenSisalto" : null,
          "tavoitteetJaKeskeinenSisalto" : null
        }, {
          "perusteen" : {
            "id" : 8626684,
            "tunniste" : "4b2a21b2-3897-46f8-a7a0-94b14f608ebc",
            "nimi" : {
              "fi" : "Energiaa liikunnasta",
              "_id" : "8626879"
            },
            "kuvaus" : null,
            "koodiUri" : "lukionkurssit_li1",
            "koodiArvo" : "LI1",
            "lokalisoituKoodi" : {
              "fi" : "LI1",
              "_id" : "8627000"
            },
            "oppiaineId" : 8626495,
            "jarjestys" : 1,
            "tyyppi" : "PAKOLLINEN",
            "opetussuunnitelma" : null,
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          },
          "id" : 70127,
          "muokattu" : 1450426976774,
          "tunniste" : "4b2a21b2-3897-46f8-a7a0-94b14f608ebc",
          "nimi" : {
            "fi" : "Energiaa liikunnasta",
            "_id" : "70118"
          },
          "kuvaus" : {
            "fi" : "<p>Oma paikallinen kuvaus</p>",
            "_id" : "73491"
          },
          "oma" : true,
          "palautettava" : false,
          "koodiUri" : "lukionkurssit_li1",
          "koodiArvo" : "LI1",
          "tyyppi" : "VALTAKUNNALLINEN_PAKOLLINEN",
          "lokalisoituKoodi" : {
            "fi" : "LI1",
            "_id" : "70119"
          },
          "tavoitteet" : null,
          "keskeinenSisalto" : null,
          "tavoitteetJaKeskeinenSisalto" : null
        }, {
          "perusteen" : {
            "id" : 8626685,
            "tunniste" : "d359da1b-38a7-4475-9773-5778ea69fa9b",
            "nimi" : {
              "fi" : "Aktiivinen elämäntapa",
              "_id" : "8627001"
            },
            "kuvaus" : null,
            "koodiUri" : "lukionkurssit_li2",
            "koodiArvo" : "LI2",
            "lokalisoituKoodi" : {
              "fi" : "LI2",
              "_id" : "8627002"
            },
            "oppiaineId" : 8626495,
            "jarjestys" : 2,
            "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
            "opetussuunnitelma" : null,
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          },
          "id" : 70126,
          "muokattu" : 1450125511048,
          "tunniste" : "d359da1b-38a7-4475-9773-5778ea69fa9b",
          "nimi" : {
            "fi" : "Aktiivinen elämäntapa",
            "_id" : "70112"
          },
          "kuvaus" : null,
          "oma" : true,
          "palautettava" : false,
          "koodiUri" : "lukionkurssit_li2",
          "koodiArvo" : "LI2",
          "tyyppi" : "VALTAKUNNALLINEN_SYVENTAVA",
          "lokalisoituKoodi" : {
            "fi" : "LI2",
            "_id" : "70113"
          },
          "tavoitteet" : null,
          "keskeinenSisalto" : null,
          "tavoitteetJaKeskeinenSisalto" : null
        }, {
          "perusteen" : {
            "id" : 8626686,
            "tunniste" : "15b9e88d-586b-4ed5-9cf2-acd8cc3e6c89",
            "nimi" : {
              "fi" : "Terveyttä liikkuen",
              "_id" : "8627003"
            },
            "kuvaus" : null,
            "koodiUri" : "lukionkurssit_li3",
            "koodiArvo" : "LI3",
            "lokalisoituKoodi" : {
              "fi" : "LI3",
              "_id" : "8627004"
            },
            "oppiaineId" : 8626495,
            "jarjestys" : 3,
            "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
            "opetussuunnitelma" : null,
            "tavoitteet" : null,
            "keskeinenSisalto" : null,
            "tavoitteetJaKeskeinenSisalto" : null
          },
          "id" : 70125,
          "muokattu" : 1450125511045,
          "tunniste" : "15b9e88d-586b-4ed5-9cf2-acd8cc3e6c89",
          "nimi" : {
            "fi" : "Terveyttä liikkuen",
            "_id" : "70073"
          },
          "kuvaus" : null,
          "oma" : true,
          "palautettava" : false,
          "koodiUri" : "lukionkurssit_li3",
          "koodiArvo" : "LI3",
          "tyyppi" : "VALTAKUNNALLINEN_SOVELTAVA",
          "lokalisoituKoodi" : {
            "fi" : "LI3",
            "_id" : "70074"
          },
          "tavoitteet" : null,
          "keskeinenSisalto" : null,
          "tavoitteetJaKeskeinenSisalto" : null
        } ]
      }, {
        "perusteen" : null,
        "id" : 70633,
        "oppiaineId" : null,
        "muokattu" : 1450271149955,
        "tunniste" : "22af7ffa-7e06-459b-b07d-4a0c98503916",
        "tila" : "luonnos",
        "oma" : true,
        "maariteltyPohjassa" : false,
        "jarjestys" : null,
        "tyyppi" : "yhteinen",
        "laajuus" : null,
        "koosteinen" : false,
        "nimi" : {
          "fi" : "Kotitalous",
          "sv" : "Huslig ekonomi",
          "_id" : "70688"
        },
        "abstrakti" : null,
        "tehtava" : {
          "id" : 70643,
          "otsikko" : {
            "fi" : "Oppiaineen tehtävä",
            "_id" : "70689"
          },
          "teksti" : {
            "fi" : "<p>asdasdasdasASDASD</p>",
            "_id" : "70830"
          }
        },
        "tavoitteet" : null,
        "arviointi" : null,
        "kurssiTyyppiKuvaukset" : {
          "PAIKALLINEN_SYVENTAVA" : null,
          "VALTAKUNNALLINEN_SOVELTAVA" : null,
          "VALTAKUNNALLINEN_PAKOLLINEN" : null,
          "PAIKALLINEN_SOVELTAVA" : null,
          "PAIKALLINEN_PAKOLLINEN" : null,
          "VALTAKUNNALLINEN_SYVENTAVA" : null
        },
        "oppimaarat" : [ ],
        "pohjanTarjonta" : [ ],
        "koodiUri" : "oppiaineetyleissivistava2_ko",
        "koodiArvo" : "KO",
        "kieliKoodiUri" : null,
        "kieliKoodiArvo" : null,
        "kieli" : null,
        "kurssit" : [ {
          "perusteen" : null,
          "id" : 70722,
          "muokattu" : 1450271185373,
          "tunniste" : "f9cf1184-cf7e-45ee-ab51-8e49ace41a8e",
          "nimi" : {
            "fi" : "Terveyden perusteet",
            "_id" : "70832"
          },
          "kuvaus" : {
            "fi" : "<p>ASDASDASDA</p>",
            "_id" : "70831"
          },
          "oma" : true,
          "palautettava" : false,
          "koodiUri" : "lukionkurssit_te1",
          "koodiArvo" : "TE1",
          "tyyppi" : "PAIKALLINEN_SYVENTAVA",
          "lokalisoituKoodi" : {
            "fi" : "TE1",
            "_id" : "70833"
          },
          "tavoitteet" : null,
          "keskeinenSisalto" : null,
          "tavoitteetJaKeskeinenSisalto" : null
        } ]
      }, {
        "perusteen" : null,
        "id" : 70631,
        "oppiaineId" : null,
        "muokattu" : 1450270894828,
        "tunniste" : "52531cbc-69c8-4907-bf8d-7b79ae31f29c",
        "tila" : "luonnos",
        "oma" : true,
        "maariteltyPohjassa" : false,
        "jarjestys" : null,
        "tyyppi" : "yhteinen",
        "laajuus" : null,
        "koosteinen" : false,
        "nimi" : {
          "fi" : "Matematiikka",
          "sv" : "Matematik",
          "_id" : "70680"
        },
        "abstrakti" : null,
        "tehtava" : null,
        "tavoitteet" : null,
        "arviointi" : null,
        "kurssiTyyppiKuvaukset" : {
          "PAIKALLINEN_SYVENTAVA" : null,
          "VALTAKUNNALLINEN_SOVELTAVA" : null,
          "VALTAKUNNALLINEN_PAKOLLINEN" : null,
          "PAIKALLINEN_SOVELTAVA" : null,
          "PAIKALLINEN_PAKOLLINEN" : null,
          "VALTAKUNNALLINEN_SYVENTAVA" : null
        },
        "oppimaarat" : [ ],
        "pohjanTarjonta" : [ ],
        "koodiUri" : "oppiaineetyleissivistava2_ma",
        "koodiArvo" : "MA",
        "kieliKoodiUri" : null,
        "kieliKoodiArvo" : null,
        "kieli" : null,
        "kurssit" : [ {
          "perusteen" : null,
          "id" : 70720,
          "muokattu" : 1450270930697,
          "tunniste" : "608dbab5-d6e5-4623-bba2-3a90747038cd",
          "nimi" : {
            "fi" : "Talousmatematiikka",
            "_id" : "70682"
          },
          "kuvaus" : {
            "fi" : "<p>asdas asdasdasda asdasd as</p>",
            "_id" : "70681"
          },
          "oma" : true,
          "palautettava" : false,
          "koodiUri" : "lukionkurssit_mab6",
          "koodiArvo" : "MAB6",
          "tyyppi" : "PAIKALLINEN_SYVENTAVA",
          "lokalisoituKoodi" : {
            "fi" : "MAB6",
            "_id" : "70683"
          },
          "tavoitteet" : null,
          "keskeinenSisalto" : null,
          "tavoitteetJaKeskeinenSisalto" : null
        } ]
      } ]
    };

    var aihekokonaisuudet = {
      "perusteen" : {
        "uuidTunniste" : "03bb93d0-74f5-4ad8-9ec0-59cced7be9a3",
        "id" : 8626460,
        "otsikko" : {
          "fi" : "Aihekokonaisuudet",
          "_id" : "8626372"
        },
        "yleiskuvaus" : {
          "fi" : "<p>Yleiset aihekokonaisuuksien kuvaukset</p>",
          "_id" : "8626593"
        },
        "muokattu" : 1450105873958,
        "muokkaaja" : "1.2.246.562.24.60388320264",
        "parent" : null,
        "aihekokonaisuudet" : [ {
          "tunniste" : "2f13414d-3bfe-4355-a9ec-777d2c1aeab9",
          "id" : 8626640,
          "otsikko" : {
            "fi" : "Eräs aihekokonaisuus",
            "_id" : "8626594"
          },
          "yleiskuvaus" : {
            "fi" : "<p>Jolla on kuvaus</p>",
            "_id" : "8626595"
          },
          "jnro" : 1,
          "parent" : null,
          "muokattu" : null,
          "muokkaaja" : null
        }, {
          "tunniste" : "65287437-0bae-4928-8400-5c9548cde59e",
          "id" : 8626641,
          "otsikko" : {
            "fi" : "Toinen aihekokonaisuus",
            "_id" : "8626598"
          },
          "yleiskuvaus" : {
            "fi" : "<p>Jossa on myös</p>\n\n<hr />\n<p>Monitahoisia</p>\n\n<table border=\"1\" cellpadding=\"1\" cellspacing=\"1\" style=\"width:500px\">\n\t<tbody>\n\t\t<tr>\n\t\t\t<td>kuvauksia</td>\n\t\t\t<td>mahdolliesti</td>\n\t\t</tr>\n\t</tbody>\n</table>\n\n<p> </p>",
            "_id" : "8626599"
          },
          "jnro" : null,
          "parent" : null,
          "muokattu" : null,
          "muokkaaja" : null
        } ]
      },
      "paikallinen" : {
        "uuidTunniste" : "03bb93d0-74f5-4ad8-9ec0-59cced7be9a3",
        "id" : 70002,
        "otsikko" : null,
        "yleiskuvaus" : {
          "fi" : "<p>Yleiskuvaus.</p>",
          "_id" : "70490"
        },
        "muokattu" : 1450197481353,
        "muokkaaja" : "1.2.246.562.24.60388320264",
        "aihekokonaisuudet" : [ {
          "tunniste" : "65287437-0bae-4928-8400-5c9548cde59e",
          "id" : 70014,
          "otsikko" : {
            "fi" : "Toinen aihekokonaisuus",
            "_id" : "70142"
          },
          "yleiskuvaus" : null,
          "jnro" : 1,
          "parent" : {
            "tunniste" : "65287437-0bae-4928-8400-5c9548cde59e",
            "id" : 70012,
            "otsikko" : {
              "fi" : "Toinen aihekokonaisuus",
              "_id" : "70142"
            },
            "yleiskuvaus" : null,
            "jnro" : 1,
            "parent" : null,
            "muokattu" : 1450125467368,
            "muokkaaja" : "1.2.246.562.24.60388320264"
          },
          "muokattu" : 1450125511050,
          "muokkaaja" : "1.2.246.562.24.60388320264",
          "perusteen" : {
            "tunniste" : "65287437-0bae-4928-8400-5c9548cde59e",
            "id" : 8626641,
            "otsikko" : {
              "fi" : "Toinen aihekokonaisuus",
              "_id" : "8626598"
            },
            "yleiskuvaus" : {
              "fi" : "<p>Jossa on myös</p>\n\n<hr />\n<p>Monitahoisia</p>\n\n<table border=\"1\" cellpadding=\"1\" cellspacing=\"1\" style=\"width:500px\">\n\t<tbody>\n\t\t<tr>\n\t\t\t<td>kuvauksia</td>\n\t\t\t<td>mahdolliesti</td>\n\t\t</tr>\n\t</tbody>\n</table>\n\n<p> </p>",
              "_id" : "8626599"
            },
            "jnro" : null,
            "parent" : null,
            "muokattu" : null,
            "muokkaaja" : null
          }
        }, {
          "tunniste" : "5e30782a-6356-4770-8b7d-346a11d71b3f",
          "id" : 70510,
          "otsikko" : {
            "fi" : "Uusi kokonaisuus",
            "_id" : "70491"
          },
          "yleiskuvaus" : {
            "fi" : "<p>uuden kokonaisuuden kuvaus</p>",
            "_id" : "70492"
          },
          "jnro" : 2,
          "parent" : null,
          "muokattu" : 1450197502629,
          "muokkaaja" : "1.2.246.562.24.60388320264",
          "perusteen" : null
        }, {
          "tunniste" : "2f13414d-3bfe-4355-a9ec-777d2c1aeab9",
          "id" : 70015,
          "otsikko" : {
            "fi" : "Eräs aihekokonaisuus",
            "_id" : "70143"
          },
          "yleiskuvaus" : {
            "fi" : "<p>Pakallinen tarkenne.</p>",
            "_id" : "70493"
          },
          "jnro" : 3,
          "parent" : {
            "tunniste" : "2f13414d-3bfe-4355-a9ec-777d2c1aeab9",
            "id" : 70013,
            "otsikko" : {
              "fi" : "Eräs aihekokonaisuus",
              "_id" : "70143"
            },
            "yleiskuvaus" : null,
            "jnro" : 2,
            "parent" : null,
            "muokattu" : 1450125467370,
            "muokkaaja" : "1.2.246.562.24.60388320264"
          },
          "muokattu" : 1450197516972,
          "muokkaaja" : "1.2.246.562.24.60388320264",
          "perusteen" : {
            "tunniste" : "2f13414d-3bfe-4355-a9ec-777d2c1aeab9",
            "id" : 8626640,
            "otsikko" : {
              "fi" : "Eräs aihekokonaisuus",
              "_id" : "8626594"
            },
            "yleiskuvaus" : {
              "fi" : "<p>Jolla on kuvaus</p>",
              "_id" : "8626595"
            },
            "jnro" : 1,
            "parent" : null,
            "muokattu" : null,
            "muokkaaja" : null
          }
        }, {
          "tunniste" : "4d7b2675-2dbc-4f57-8691-2ed284873379",
          "id" : 70511,
          "otsikko" : {
            "fi" : "Finally the ultimate kokonaisuus",
            "_id" : "70881"
          },
          "yleiskuvaus" : {
            "fi" : "<p>asdfasdas asdasda asdasd asdas adasdasdad</p>",
            "_id" : "70882"
          },
          "jnro" : null,
          "parent" : null,
          "muokattu" : 1450271279864,
          "muokkaaja" : "1.2.246.562.24.15005182044",
          "perusteen" : null
        } ]
      },
      "kommentti" : null,
      "tunniste" : "03bb93d0-74f5-4ad8-9ec0-59cced7be9a3"
    };

    var yleisetTavoitteet = {
      "perusteen" : {
        "parent" : null,
        "uuidTunniste" : "730c2d9a-eed9-4f48-a530-335eba8841ad",
        "id" : 8624101,
        "otsikko" : {
          "fi" : "Opetuksen yleiset tavoitteet - OTSIKKO",
          "_id" : "8624116"
        },
        "kuvaus" : {
          "fi" : "<p>Opetuksessa on paljon tavoitteita ja muuta - SISÄLTÖ</p>",
          "_id" : "8624115"
        },
        "muokattu" : 1447489521463,
        "muokkaaja" : "1.2.246.562.24.33447367959"
      },
      "paikallinen" : {
        "parent" : {
          "parent" : null,
          "uuidTunniste" : "9b33b40a-3f8d-4874-9d7e-1771475dbd78",
          "id" : 68094,
          "otsikko" : null,
          "kuvaus" : null,
          "muokattu" : 1449680959538,
          "muokkaaja" : "1.2.246.562.24.60388320264"
        },
        "uuidTunniste" : "9b33b40a-3f8d-4874-9d7e-1771475dbd78",
        "id" : 69800,
        "otsikko" : null,
        "kuvaus" : null,
        "muokattu" : 1450102758892,
        "muokkaaja" : "1.2.246.562.24.15005182044",
        "perusteen" : null
      },
      "kommentti" : null,
      "tunniste" : "730c2d9a-eed9-4f48-a530-335eba8841ad"
    };

    var ops = {
      "id" : 69202,
      "julkaisukielet" : [ "fi" ],
      "organisaatiot" : [ {
        "oid" : "1.2.246.562.10.79499343246",
        "tyypit" : [ "Koulutustoimija" ],
        "nimi" : {
          "fi" : "Tampereen kaupunki"
        }
      } ],
      "kunnat" : [ {
        "id" : 840,
        "koodiUri" : "kunta_837",
        "koodiArvo" : "837",
        "nimi" : {
          "fi" : "Tampere",
          "sv" : "Tammerfors"
        }
      } ],
      "kuvaus" : null,
      "luoja" : "1.2.246.562.24.15005182044",
      "luotu" : 1450102758887,
      "muokattu" : 1450175934328,
      "muokkaaja" : "1.2.246.562.24.15005182044",
      "nimi" : {
        "fi" : "Rick's Lukio Test",
        "_id" : "69732"
      },
      "perusteenDiaarinumero" : "123/Janne/2015",
      "tila" : "luonnos",
      "tyyppi" : "ops",
      "koulutustyyppi" : "koulutustyyppi_2",
      "paatospaivamaara" : 1450216800000,
      "esikatseltavissa" : true,
      "pohja" : {
        "id" : 68034,
        "nimi" : {
          "fi" : "Lukiopohja (Tommin 2.)",
          "_id" : "68332"
        },
        "_pohja" : null
      },
      "vuosiluokkakokonaisuudet" : [ ],
      "oppiaineet" : [ {
        "oma" : true,
        "oppiaine" : {
          "id" : 69412,
          "tunniste" : "187773f8-f7d8-4dd1-887a-208d28bef283",
          "tila" : "luonnos",
          "tyyppi" : "yhteinen",
          "jnro" : null,
          "laajuus" : null,
          "koosteinen" : false,
          "nimi" : {
            "fi" : "Liikunta",
            "_id" : "68770"
          },
          "abstrakti" : null,
          "oppimaarat" : null,
          "vuosiluokkakokonaisuudet" : [ ],
          "koodiUri" : "oppiaineetyleissivistava2_li",
          "koodiArvo" : "LI"
        }
      }, {
        "oma" : true,
        "oppiaine" : {
          "id" : 69414,
          "tunniste" : "c0a849de-af72-47ec-8ef6-9740095f5718",
          "tila" : "luonnos",
          "tyyppi" : "yhteinen",
          "jnro" : null,
          "laajuus" : null,
          "koosteinen" : true,
          "nimi" : {
            "fi" : "Vieraat kielet",
            "_id" : "68754"
          },
          "abstrakti" : null,
          "oppimaarat" : [ ],
          "vuosiluokkakokonaisuudet" : [ ],
          "koodiUri" : "oppiaineetyleissivistava2_vk",
          "koodiArvo" : "VK"
        }
      }, {
        "oma" : true,
        "oppiaine" : {
          "id" : 69416,
          "tunniste" : "1cc955d5-ffe2-4597-90e0-2b2032078d64",
          "tila" : "luonnos",
          "tyyppi" : "yhteinen",
          "jnro" : null,
          "laajuus" : null,
          "koosteinen" : false,
          "nimi" : {
            "fi" : "Historia",
            "sv" : "Historia",
            "_id" : "69735"
          },
          "abstrakti" : null,
          "oppimaarat" : null,
          "vuosiluokkakokonaisuudet" : [ ],
          "koodiUri" : "oppiaineetyleissivistava2_hi",
          "koodiArvo" : "HI"
        }
      }, {
        "oma" : true,
        "oppiaine" : {
          "id" : 69413,
          "tunniste" : "c9400700-f311-4285-8ee0-42a47dd10ff2",
          "tila" : "luonnos",
          "tyyppi" : "yhteinen",
          "jnro" : null,
          "laajuus" : null,
          "koosteinen" : true,
          "nimi" : {
            "fi" : "Matematiikka",
            "_id" : "68733"
          },
          "abstrakti" : null,
          "oppimaarat" : [ ],
          "vuosiluokkakokonaisuudet" : [ ],
          "koodiUri" : "oppiaineetyleissivistava2_ma",
          "koodiArvo" : "MA"
        }
      }, {
        "oma" : true,
        "oppiaine" : {
          "id" : 69415,
          "tunniste" : "3b7610c5-e42d-4ce4-8706-4c41a49fc0ce",
          "tila" : "luonnos",
          "tyyppi" : "yhteinen",
          "jnro" : null,
          "laajuus" : null,
          "koosteinen" : false,
          "nimi" : {
            "fi" : "Kuvataide",
            "sv" : "Bildkonst",
            "_id" : "69733"
          },
          "abstrakti" : null,
          "oppimaarat" : null,
          "vuosiluokkakokonaisuudet" : [ ],
          "koodiUri" : "oppiaineetyleissivistava2_ku",
          "koodiArvo" : "KU"
        }
      } ]
    };

    var teksti1 = {
      "id" : 69555,
      "omistussuhde" : "oma",
      "pakollinen" : false,
      "valmis" : false,
      "lapset" : [ {
        "id" : 69553,
        "tekstiKappale" : {
          "id" : 69581,
          "luotu" : 1450102758774,
          "muokattu" : 1450102758774,
          "muokkaaja" : "1.2.246.562.24.15005182044",
          "nimi" : {
            "fi" : "Opetuksen järjestäminen",
            "_id" : "68333"
          },
          "teksti" : null,
          "tila" : "luonnos",
          "tunniste" : "fd73cfa7-7796-42be-864f-4c9db72e7b7c",
          "pakollinen" : null,
          "valmis" : null
        },
        "omistussuhde" : "oma",
        "pakollinen" : false,
        "valmis" : false,
        "lapset" : [ ]
      }, {
        "id" : 69554,
        "tekstiKappale" : {
          "id" : 69582,
          "luotu" : 1450102758777,
          "muokattu" : 1450102758777,
          "muokkaaja" : "1.2.246.562.24.15005182044",
          "nimi" : {
            "fi" : "Opetuksen toteuttamisen lähtökohdat",
            "_id" : "68334"
          },
          "teksti" : null,
          "tila" : "luonnos",
          "tunniste" : "6cb528bc-20d4-493c-9dc7-72a24ee72672",
          "pakollinen" : null,
          "valmis" : null
        },
        "omistussuhde" : "oma",
        "pakollinen" : false,
        "valmis" : false,
        "lapset" : [ ]
      } ]
    };

    var teksti2 = {
      "id" : 69555,
      "omistussuhde" : "oma",
      "pakollinen" : false,
      "valmis" : false,
      "lapset" : [ {
      "id" : 69553,
      "tekstiKappale" : {
        "id" : 69581,
        "luotu" : 1450102758774,
        "muokattu" : 1450102758774,
        "muokkaaja" : "1.2.246.562.24.15005182044",
        "nimi" : {
          "fi" : "Opetuksen järjestäminen",
          "_id" : "68333"
        },
        "teksti" : null,
        "tila" : "luonnos",
        "tunniste" : "fd73cfa7-7796-42be-864f-4c9db72e7b7c",
        "pakollinen" : null,
        "valmis" : null
      },
      "omistussuhde" : "oma",
      "pakollinen" : false,
      "valmis" : false,
      "lapset" : [ ]
    }, {
      "id" : 69554,
      "tekstiKappale" : {
        "id" : 69582,
        "luotu" : 1450102758777,
        "muokattu" : 1450102758777,
        "muokkaaja" : "1.2.246.562.24.15005182044",
        "nimi" : {
          "fi" : "Opetuksen toteuttamisen lähtökohdat",
          "_id" : "68334"
        },
        "teksti" : null,
        "tila" : "luonnos",
        "tunniste" : "6cb528bc-20d4-493c-9dc7-72a24ee72672",
        "pakollinen" : null,
        "valmis" : null
      },
      "omistussuhde" : "oma",
      "pakollinen" : false,
      "valmis" : false,
      "lapset" : [ ]
    } ]
    };

    var otsikot = {
      "id" : 69948,
      "tekstiKappale" : null,
      "omistussuhde" : "oma",
      "pakollinen" : false,
      "valmis" : false,
      "lapset" : [ {
        "id" : 69946,
        "tekstiKappale" : {
          "id" : 69954,
          "luotu" : 1450125510925,
          "muokattu" : 1450125510925,
          "muokkaaja" : "1.2.246.562.24.60388320264",
          "nimi" : {
            "fi" : "Opetuksen järjestäminen",
            "_id" : "69924"
          },
          "tila" : "luonnos",
          "tunniste" : "37119a20-1261-4297-8cc2-cf5d135642ab",
          "pakollinen" : null,
          "valmis" : null
        },
        "omistussuhde" : "oma",
        "pakollinen" : false,
        "valmis" : false,
        "lapset" : [ {
          "id" : 71045,
          "tekstiKappale" : {
            "id" : 71074,
            "luotu" : 1450361544885,
            "muokattu" : 1450361556991,
            "muokkaaja" : "1.2.246.562.24.15005182044",
            "nimi" : {
              "fi" : "Uusi tekstikappale 1",
              "_id" : "71246"
            },
            "tila" : "luonnos",
            "tunniste" : "d44bd2b0-529b-4e50-b873-398a7b44210e",
            "pakollinen" : null,
            "valmis" : null
          },
          "omistussuhde" : "oma",
          "pakollinen" : false,
          "valmis" : false,
          "lapset" : [ {
            "id" : 71044,
            "tekstiKappale" : {
              "id" : 71073,
              "luotu" : 1450361543386,
              "muokattu" : 1450361569175,
              "muokkaaja" : "1.2.246.562.24.15005182044",
              "nimi" : {
                "fi" : "Uusi tekstikappale 2",
                "_id" : "71248"
              },
              "tila" : "luonnos",
              "tunniste" : "22de9cfe-acc8-453c-957c-0fe5d14c5a13",
              "pakollinen" : null,
              "valmis" : null
            },
            "omistussuhde" : "oma",
            "pakollinen" : false,
            "valmis" : false,
            "lapset" : [ ],
            "_tekstiKappale" : null
          } ],
          "_tekstiKappale" : null
        } ],
        "_tekstiKappale" : null
      }, {
        "id" : 69947,
        "tekstiKappale" : {
          "id" : 69955,
          "luotu" : 1450125510929,
          "muokattu" : 1450125510929,
          "muokkaaja" : "1.2.246.562.24.60388320264",
          "nimi" : {
            "fi" : "Opetuksen toteuttamisen lähtökohdat",
            "_id" : "69925"
          },
          "tila" : "luonnos",
          "tunniste" : "5c141f57-1ac8-4699-94f4-e28e0e1833ac",
          "pakollinen" : null,
          "valmis" : null
        },
        "omistussuhde" : "oma",
        "pakollinen" : false,
        "valmis" : false,
        "lapset" : [ {
          "id" : 71043,
          "tekstiKappale" : {
            "id" : 71072,
            "luotu" : 1450361540212,
            "muokattu" : 1450361585635,
            "muokkaaja" : "1.2.246.562.24.15005182044",
            "nimi" : {
              "fi" : "Uusi tekstikappale 3",
              "_id" : "71350"
            },
            "tila" : "luonnos",
            "tunniste" : "73af7e52-8985-424c-918b-de072bf57459",
            "pakollinen" : null,
            "valmis" : null
          },
          "omistussuhde" : "oma",
          "pakollinen" : false,
          "valmis" : false,
          "lapset" : [ ],
          "_tekstiKappale" : null
        } ],
        "_tekstiKappale" : null
      } ],
      "_tekstiKappale" : null
    };

    var tekstikappale = {
      "id" : 71045,
      "tekstiKappale" : {
        "id" : 71074,
        "luotu" : 1450361544885,
        "muokattu" : 1450361556991,
        "muokkaaja" : "1.2.246.562.24.15005182044",
        "nimi" : {
          "fi" : "Uusi tekstikappale 1",
          "_id" : "71246"
        },
        "teksti" : {
          "fi" : "<p>asdasd DASDD asd adasdasdasd adsadasdad</p>",
          "_id" : "71247"
        },
        "tila" : "luonnos",
        "tunniste" : "d44bd2b0-529b-4e50-b873-398a7b44210e",
        "pakollinen" : null,
        "valmis" : null
      },
      "omistussuhde" : "oma",
      "pakollinen" : false,
      "valmis" : false,
      "lapset" : [ "71044" ]
    };

    return { lukioRakenne, aihekokonaisuudet, otsikot, yleisetTavoitteet, ops, tekstikappale, teksti1, teksti2 }

  });
