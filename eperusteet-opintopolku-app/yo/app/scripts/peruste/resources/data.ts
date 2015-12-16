epOpintopolkuApp
  .factory('LukioData', function (Algoritmit, $state, Kieli, Utils) {

    var lukioRakenne= {
      "muokattu": 1448008520595,
      "opsId": 1311,
      "perusteen": {
        "perusteId": 8624080,
        "oppiaineet": [{
          "id": 8624204,
          "tunniste": "c0a849de-af72-47ec-8ef6-9740095f5718",
          "koodiUri": "oppiaineetyleissivistava2_vk",
          "koodiArvo": "VK",
          "koosteinen": true,
          "jarjestys": 1,
          "abstrakti": false,
          "nimi": {
            "fi": "Vieraat kielet",
            "_id": "8624522"
          },
          "kuvaus": null,
          "pakollinenKurssiKuvaus": null,
          "syventavaKurssiKuvaus": null,
          "soveltavaKurssiKuvaus": null,
          "tehtava": {
            "id": null,
            "otsikko": {
              "_id": "8624524"
            },
            "teksti": {
              "_id": "8624525"
            }
          },
          "tavoitteet": {
            "id": null,
            "otsikko": {
              "fi": "Opetuksen tavoitteet",
              "_id": "8624523"
            },
            "teksti": {
              "fi": "<p>Vieraat kielet kuvaus...</p>",
              "_id": "8624526"
            }
          },
          "arviointi": {
            "id": null,
            "otsikko": {
              "fi": "Arviointi",
              "_id": "8624521"
            },
            "teksti": {
              "fi": "<p>Vieraat kielet arviointi...</p>",
              "_id": "8624527"
            }
          },
          "oppimaarat": [{
            "id": 8624207,
            "tunniste": "2937b12f-277c-489f-8ba5-87fe9ab57771",
            "koodiUri": "oppiaineetyleissivistava2_b2",
            "koodiArvo": "B2",
            "koosteinen": false,
            "jarjestys": 1,
            "abstrakti": true,
            "nimi": {
              "fi": "Vieraat kielet, B2-oppimÃ¤Ã¤rÃ¤",
              "_id": "8624667"
            },
            "kuvaus": null,
            "pakollinenKurssiKuvaus": {
              "fi": "<p>Vieraat kielet, B2-oppimÃ¤Ã¤rÃ¤ pakollisten kurssien yleinen kuvaus...</p>",
              "_id": "8624668"
            },
            "syventavaKurssiKuvaus": {
              "fi": "<p>Vieraat kielet, B2-oppimÃ¤Ã¤rÃ¤ valtakunnallisten syventÃ¤vien kyrssien yleinen kuvaus</p>",
              "_id": "8624700"
            },
            "soveltavaKurssiKuvaus": {
              "fi": "<p>Vieraat kielet, B2-oppimÃ¤Ã¤rÃ¤ valtakunnallisten soveltavien kurssien yleinen kuvaus</p>",
              "_id": "8624669"
            },
            "tehtava": {
              "id": null,
              "otsikko": {
                "_id": "8624702"
              },
              "teksti": {
                "_id": "8624703"
              }
            },
            "tavoitteet": {
              "id": null,
              "otsikko": {
                "fi": "Opetuksen tavoitteet",
                "_id": "8624701"
              },
              "teksti": {
                "fi": "<p>Vieraat kielet, B2-oppimÃ¤Ã¤rÃ¤ tavoitteet...</p>",
                "_id": "8624704"
              }
            },
            "arviointi": {
              "id": null,
              "otsikko": {
                "fi": "Arviointi",
                "_id": "8624666"
              },
              "teksti": {
                "fi": "<p>Vieraat kielet, B2-oppimÃ¤Ã¤rÃ¤ arviointi...</p>",
                "_id": "8624705"
              }
            },
            "oppimaarat": [],
            "kurssit": [{
              "id": 8624439,
              "tunniste": "e0111e0c-564e-472e-8984-bf50792e69a6",
              "nimi": {
                "fi": "ElÃ¤mÃ¤n tÃ¤rkeitÃ¤ asioita",
                "_id": "8624811"
              },
              "kuvaus": null,
              "koodiUri": "VKB21",
              "koodiArvo": "lukionkurssit_vkb21",
              "lokalisoituKoodi": {
                "fi": "VKB21",
                "_id": "8624812"
              },
              "oppiaineId": 8624207,
              "jarjestys": 1,
              "tyyppi": "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma": null,
              "tavoitteet": null,
              "keskeinenSisalto": null,
              "tavoitteetJaKeskeinenSisalto": null
            }, {
              "id": 8624840,
              "tunniste": "04c6430c-701f-4964-88c6-2d5514f5275a",
              "nimi": {
                "fi": "Monenlaista elÃ¤mÃ¤Ã¤",
                "_id": "8624813"
              },
              "kuvaus": null,
              "koodiUri": "VKB22",
              "koodiArvo": "lukionkurssit_vkb22",
              "lokalisoituKoodi": {
                "fi": "VKB22",
                "_id": "8624814"
              },
              "oppiaineId": 8624207,
              "jarjestys": 2,
              "tyyppi": "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma": null,
              "tavoitteet": null,
              "keskeinenSisalto": null,
              "tavoitteetJaKeskeinenSisalto": null
            }]
          }, {
            "id": 8624205,
            "tunniste": "f0ba922c-b44e-4ea2-8cd9-8f467c968608",
            "koodiUri": "oppiaineetyleissivistava2_a1",
            "koodiArvo": "A1",
            "koosteinen": false,
            "jarjestys": 3,
            "abstrakti": true,
            "nimi": {
              "fi": "Vieraat kielet, A-oppimÃ¤Ã¤rÃ¤",
              "_id": "8624529"
            },
            "kuvaus": null,
            "pakollinenKurssiKuvaus": {
              "fi": "<p>Vieraat kielet, A-oppimÃ¤Ã¤rÃ¤ kurssien yleinen kuvaus</p>",
              "_id": "8624610"
            },
            "syventavaKurssiKuvaus": {
              "fi": "<p>Vieraat kielet, A-oppimÃ¤Ã¤rÃ¤ valtakunnallisten syventÃ¤vien kurssien yleinen kuvaus < /p>",
              "_id": "8624612"
            },
            "soveltavaKurssiKuvaus": {
              "fi": "<p>Vieraat kielet, A-oppimÃ¤Ã¤rÃ¤ valtakunnallisten soveltavien kurssien yleinen kuvaus < /p>",
              "_id": "8624611"
            },
            "tehtava": {
              "id": null,
              "otsikko": {
                "_id": "8624614"
              },
              "teksti": {
                "_id": "8624615"
              }
            },
            "tavoitteet": {
              "id": null,
              "otsikko": {
                "fi": "Opetuksen tavoitteet",
                "_id": "8624613"
              },
              "teksti": {
                "fi": "<p>Vieraat kielet, A-oppimÃ¤Ã¤rÃ¤ opetuksen tavoitteet...</p>",
                "_id": "8624616"
              }
            },
            "arviointi": {
              "id": null,
              "otsikko": {
                "fi": "Arviointi",
                "_id": "8624528"
              },
              "teksti": {
                "fi": "<p>Vieraat kielet, A-oppimÃ¤Ã¤rÃ¤ arviointi...</p>",
                "_id": "8624617"
              }
            },
            "oppimaarat": [],
            "kurssit": [{
              "id": 8624436,
              "tunniste": "6cd3fbfa-e847-4a47-afab-29739f8b2891",
              "nimi": {
                "fi": "Ihminen verkostoissa",
                "_id": "8624770"
              },
              "kuvaus": {
                "fi": "<p>Ihminen verkostoissa kuvaus...</p>",
                "_id": "8624709"
              },
              "koodiUri": "VKA2",
              "koodiArvo": "lukionkurssit_vka2",
              "lokalisoituKoodi": {
                "fi": "VKA2",
                "_id": "8624771"
              },
              "oppiaineId": 8624205,
              "jarjestys": 2,
              "tyyppi": "PAKOLLINEN",
              "opetussuunnitelma": null,
              "tavoitteet": null,
              "keskeinenSisalto": null,
              "tavoitteetJaKeskeinenSisalto": null
            }, {
              "id": 8624435,
              "tunniste": "9887b0b3-88b7-45e5-af29-39633d4bff16",
              "nimi": {
                "fi": "Kieli ja maailmani",
                "_id": "8624707"
              },
              "kuvaus": {
                "fi": "<p>Kieli ja maailmani kuvaus...</p>",
                "_id": "8624706"
              },
              "koodiUri": "VKA1",
              "koodiArvo": "lukionkurssit_vka1",
              "lokalisoituKoodi": {
                "fi": "VKA1",
                "_id": "8624708"
              },
              "oppiaineId": 8624205,
              "jarjestys": 1,
              "tyyppi": "PAKOLLINEN",
              "opetussuunnitelma": null,
              "tavoitteet": null,
              "keskeinenSisalto": null,
              "tavoitteetJaKeskeinenSisalto": null
            }]
          }, {
            "id": 8624206,
            "tunniste": "a5021ee5-9411-4d5f-9b68-7752d1116972",
            "koodiUri": "oppiaineetyleissivistava2_b1",
            "koodiArvo": "B1",
            "koosteinen": false,
            "jarjestys": 2,
            "abstrakti": true,
            "nimi": {
              "fi": "Vieraat kielet, B1-oppimÃ¤Ã¤rÃ¤",
              "_id": "8624662"
            },
            "kuvaus": null,
            "pakollinenKurssiKuvaus": {
              "fi": "<p>Vieraat kielet, B1-oppimÃ¤Ã¤rÃ¤ pakollisten kurssien yleinen kuvaus..</p>",
              "_id": "8624663"
            },
            "syventavaKurssiKuvaus": {
              "fi": "<p>Vieraat kielet, B1-oppimÃ¤Ã¤rÃ¤ valtakunnallisten syventÃ¤vien kyrssien yleinen kuvaus</p>",
              "_id": "8624665"
            },
            "soveltavaKurssiKuvaus": {
              "fi": "<p>Vieraat kielet, B1-oppimÃ¤Ã¤rÃ¤ valtakunnallisten soveltavien kurssien yleinen kuvaus</p>",
              "_id": "8624664"
            },
            "tehtava": null,
            "tavoitteet": null,
            "arviointi": null,
            "oppimaarat": [],
            "kurssit": [{
              "id": 8624437,
              "tunniste": "e25662ea-9dee-4b67-a9be-8833638481e2",
              "nimi": {
                "fi": "Kieli ja maailmani",
                "_id": "8624773"
              },
              "kuvaus": {
                "fi": "<p>Kieli ja maailmani kuvaus...</p>",
                "_id": "8624772"
              },
              "koodiUri": "VKB1",
              "koodiArvo": "lukionkurssit_vkb1",
              "lokalisoituKoodi": {
                "fi": "VKB1",
                "_id": "8624774"
              },
              "oppiaineId": 8624206,
              "jarjestys": 1,
              "tyyppi": "PAKOLLINEN",
              "opetussuunnitelma": null,
              "tavoitteet": null,
              "keskeinenSisalto": null,
              "tavoitteetJaKeskeinenSisalto": null
            }, {
              "id": 8624438,
              "tunniste": "d102376a-7369-41b6-851e-c4d009d0cda1",
              "nimi": {
                "fi": "Hyvinvointi ja ihmissuhteet",
                "_id": "8624777"
              },
              "kuvaus": null,
              "koodiUri": "VKB2",
              "koodiArvo": "lukionkurssit_vkb2",
              "lokalisoituKoodi": {
                "fi": "VKB2",
                "_id": "8624778"
              },
              "oppiaineId": 8624206,
              "jarjestys": 2,
              "tyyppi": "PAKOLLINEN",
              "opetussuunnitelma": null,
              "tavoitteet": null,
              "keskeinenSisalto": null,
              "tavoitteetJaKeskeinenSisalto": null
            }]
          }],
          "kurssit": []
        }, {
          "id": 8624203,
          "tunniste": "187773f8-f7d8-4dd1-887a-208d28bef283",
          "koodiUri": "oppiaineetyleissivistava2_li",
          "koodiArvo": "LI",
          "koosteinen": false,
          "jarjestys": 3,
          "abstrakti": null,
          "nimi": {
            "fi": "Liikunta",
            "_id": "8624360"
          },
          "kuvaus": null,
          "pakollinenKurssiKuvaus": {
            "fi": "<p>Liikunnan pakollisten kurssien yleinen kuvaus...</p>",
            "_id": "8624361"
          },
          "syventavaKurssiKuvaus": {
            "fi": "<p>Liikunnan valtakunnalisten syventÃ¤vien kurssien yleinen kuvaus...</p>",
            "_id": "8624363"
          },
          "soveltavaKurssiKuvaus": {
            "fi": "<p>Liikunnan valtakunnallisten soveltavien kurssien yleinen kuvaus...</p>",
            "_id": "8624362"
          },
          "tehtava": {
            "id": null,
            "otsikko": {
              "_id": "8624366"
            },
            "teksti": {
              "_id": "8624367"
            }
          },
          "tavoitteet": {
            "id": null,
            "otsikko": {
              "fi": "Opetuksen tavoitteet",
              "_id": "8624365"
            },
            "teksti": {
              "fi": "<p>Liikunann tavoitteet...</p>",
              "_id": "8624368"
            }
          },
          "arviointi": {
            "id": null,
            "otsikko": {
              "fi": "Arviointi",
              "_id": "8624364"
            },
            "teksti": {
              "fi": "<p>Liikunnan arviointi...</p>",
              "_id": "8624369"
            }
          },
          "oppimaarat": [],
          "kurssit": [{
            "id": 8624430,
            "tunniste": "e084a1f5-4962-49ed-b667-fbb1a78b8f5a",
            "nimi": {
              "fi": "Energiaa liikunnasta",
              "_id": "8624441"
            },
            "kuvaus": {
              "fi": "<p>Liikunnan energiaa ja riemua!</p>",
              "_id": "8624440"
            },
            "koodiUri": "LI1",
            "koodiArvo": "lukionkurssit_li1",
            "lokalisoituKoodi": {
              "fi": "LI1",
              "_id": "8624444"
            },
            "oppiaineId": 8624203,
            "jarjestys": 1,
            "tyyppi": "PAKOLLINEN",
            "opetussuunnitelma": null,
            "tavoitteet": {
              "id": null,
              "otsikko": {
                "fi": "Tavoitteet",
                "_id": "8624445"
              },
              "teksti": {
                "fi": "<p>Energiaa liikunnasta tavoitteet....</p>",
                "_id": "8624446"
              }
            },
            "keskeinenSisalto": null,
            "tavoitteetJaKeskeinenSisalto": null
          }, {
            "id": 8624431,
            "tunniste": "37bac998-3cf8-4133-a797-ebdc61f6eae1",
            "nimi": {
              "fi": "Aktiivinen elÃ¤mÃ¤ntapa",
              "_id": "8624448"
            },
            "kuvaus": {
              "fi": "<p>Aktiivinen elÃ¤mÃ¤ntapa kuvaus...</p>",
              "_id": "8624447"
            },
            "koodiUri": "LI2",
            "koodiArvo": "lukionkurssit_li2",
            "lokalisoituKoodi": {
              "fi": "LI2",
              "_id": "8624449"
            },
            "oppiaineId": 8624203,
            "jarjestys": 2,
            "tyyppi": "VALTAKUNNALLINEN_SYVENTAVA",
            "opetussuunnitelma": null,
            "tavoitteet": null,
            "keskeinenSisalto": null,
            "tavoitteetJaKeskeinenSisalto": null
          }]
        }, {
          "id": 8624200,
          "tunniste": "c9400700-f311-4285-8ee0-42a47dd10ff2",
          "koodiUri": "oppiaineetyleissivistava2_ma",
          "koodiArvo": "MA",
          "koosteinen": true,
          "jarjestys": 2,
          "abstrakti": false,
          "nimi": {
            "fi": "Matematiikka",
            "_id": "8624174"
          },
          "kuvaus": null,
          "pakollinenKurssiKuvaus": null,
          "syventavaKurssiKuvaus": null,
          "soveltavaKurssiKuvaus": null,
          "tehtava": {
            "id": null,
            "otsikko": {
              "_id": "8624176"
            },
            "teksti": {
              "_id": "8624177"
            }
          },
          "tavoitteet": {
            "id": null,
            "otsikko": {
              "fi": "Opetuksen tavoitteet",
              "_id": "8624175"
            },
            "teksti": {
              "fi": "<p>Matematiikan opetuksen tavoitteet ovat...</p>",
              "_id": "8624178"
            }
          },
          "arviointi": {
            "id": null,
            "otsikko": {
              "fi": "Arviointi",
              "_id": "8624173"
            },
            "teksti": {
              "fi": "<p>Matematiikka arvioidaan...</p>",
              "_id": "8624179"
            }
          },
          "oppimaarat": [{
            "id": 8624201,
            "tunniste": "d7605085-39b6-44c7-954d-e2611ab1b94e",
            "koodiUri": "oppiaineetyleissivistava2_ma",
            "koodiArvo": "MA",
            "koosteinen": false,
            "jarjestys": 2,
            "abstrakti": null,
            "nimi": {
              "fi": "PitkÃ¤ matematiikka",
              "_id": "8624261"
            },
            "kuvaus": null,
            "pakollinenKurssiKuvaus": {
              "fi": "<p>PitkÃ¤n matematiikan pakolliset kurssien yleinen kuvaus...</p>",
              "_id": "8624262"
            },
            "syventavaKurssiKuvaus": {
              "fi": "<p>PitkÃ¤n matematiikan valtakunnallisten syventÃ¤vien kurssien yleinen kuvaus...</p > ",
              "_id": "8624264"
            },
            "soveltavaKurssiKuvaus": {
              "fi": "<p>PitkÃ¤n matematiikan valtakunnallisten soveltavien kurssien yleinen kuvaus....</p > ",
              "_id": "8624263"
            },
            "tehtava": {
              "id": null,
              "otsikko": {
                "_id": "8624266"
              },
              "teksti": {
                "_id": "8624267"
              }
            },
            "tavoitteet": {
              "id": null,
              "otsikko": {
                "fi": "Opetuksen tavoitteet",
                "_id": "8624265"
              },
              "teksti": {
                "fi": "<p>PitkÃ¤n matematiikan tavoitteet...</p>",
                "_id": "8624268"
              }
            },
            "arviointi": {
              "id": null,
              "otsikko": {
                "fi": "Arviointi",
                "_id": "8624260"
              },
              "teksti": {
                "fi": "<p>PitkÃ¤n matematiikan arviointi...</p>",
                "_id": "8624269"
              }
            },
            "oppimaarat": [],
            "kurssit": [{
              "id": 8624434,
              "tunniste": "df3f0aae-b76f-4a86-8c88-de8012bf8c90",
              "nimi": {
                "fi": "Polynomifunktiot ja -yhtÃ¤lÃ¶t",
                "_id": "8624493"
              },
              "kuvaus": {
                "fi": "<p>Polynomifunktiot ja -yhtÃ¤lÃ¶t kuvaus....</p>",
                "_id": "8624492"
              },
              "koodiUri": "MAA2",
              "koodiArvo": "lukionkurssit_maa2",
              "lokalisoituKoodi": {
                "fi": "MAA2",
                "_id": "8624494"
              },
              "oppiaineId": 8624201,
              "jarjestys": 2,
              "tyyppi": "PAKOLLINEN",
              "opetussuunnitelma": null,
              "tavoitteet": {
                "id": null,
                "otsikko": {
                  "fi": "Tavoitteet",
                  "_id": "8624497"
                },
                "teksti": {
                  "fi": "<p>Polynomifunktiot ja -yhtÃ¤lÃ¶t tavoitteet....</p>",
                  "_id": "8624498"
                }
              },
              "keskeinenSisalto": null,
              "tavoitteetJaKeskeinenSisalto": null
            }, {
              "id": 8624432,
              "tunniste": "bf9f3612-6841-4814-bd45-c0ea54e6be01",
              "nimi": {
                "fi": "Luvut ja lukujonot",
                "_id": "8624471"
              },
              "kuvaus": {
                "fi": "<p>Luvut ja lukujonot yhteinen kurssi matikoille.</p>",
                "_id": "8624470"
              },
              "koodiUri": "MAY1",
              "koodiArvo": "lukionkurssit_may1",
              "lokalisoituKoodi": {
                "fi": "MAY1",
                "_id": "8624472"
              },
              "oppiaineId": 8624201,
              "jarjestys": 1,
              "tyyppi": "PAKOLLINEN",
              "opetussuunnitelma": null,
              "tavoitteet": null,
              "keskeinenSisalto": null,
              "tavoitteetJaKeskeinenSisalto": null
            }]
          }, {
            "id": 8624202,
            "tunniste": "f14e93fa-20e5-49cf-9c5c-60404cb0f94d",
            "koodiUri": "oppiaineetyleissivistava2_ma",
            "koodiArvo": "MA",
            "koosteinen": false,
            "jarjestys": 1,
            "abstrakti": null,
            "nimi": {
              "fi": "Lyhyt matematiikka",
              "_id": "8624311"
            },
            "kuvaus": null,
            "pakollinenKurssiKuvaus": {
              "fi": "<p>Lyhyen matematiikan pakollisten kurssien yleinen kuvaus...</p>",
              "_id": "8624312"
            },
            "syventavaKurssiKuvaus": {
              "fi": "<p>Lyhyen matematiikan valtakunnallisten syventÃ¤vien kurssien yleinen kuvaus...</p > ",
              "_id": "8624314"
            },
            "soveltavaKurssiKuvaus": {
              "fi": "<p>Lyhyen matematiikan valtakunnallisten soveltavien kurssien yleinen kuvaus...</p > ",
              "_id": "8624313"
            },
            "tehtava": {
              "id": null,
              "otsikko": {
                "_id": "8624316"
              },
              "teksti": {
                "_id": "8624317"
              }
            },
            "tavoitteet": {
              "id": null,
              "otsikko": {
                "fi": "Opetuksen tavoitteet",
                "_id": "8624315"
              },
              "teksti": {
                "fi": "<p>Lyhyt matematiikka tavoitteet...</p>",
                "_id": "8624318"
              }
            },
            "arviointi": {
              "id": null,
              "otsikko": {
                "fi": "Arviointi",
                "_id": "8624310"
              },
              "teksti": {
                "fi": "<p>Lyhyt matematiikka arviointi....</p>",
                "_id": "8624319"
              }
            },
            "oppimaarat": [],
            "kurssit": [{
              "id": 8624432,
              "tunniste": "bf9f3612-6841-4814-bd45-c0ea54e6be01",
              "nimi": {
                "fi": "Luvut ja lukujonot",
                "_id": "8624471"
              },
              "kuvaus": {
                "fi": "<p>Luvut ja lukujonot yhteinen kurssi matikoille.</p>",
                "_id": "8624470"
              },
              "koodiUri": "MAY1",
              "koodiArvo": "lukionkurssit_may1",
              "lokalisoituKoodi": {
                "fi": "MAY1",
                "_id": "8624472"
              },
              "oppiaineId": 8624202,
              "jarjestys": 1,
              "tyyppi": "PAKOLLINEN",
              "opetussuunnitelma": null,
              "tavoitteet": null,
              "keskeinenSisalto": null,
              "tavoitteetJaKeskeinenSisalto": null
            }, {
              "id": 8624433,
              "tunniste": "a7b6a4e8-37f6-42f6-921e-3bc4dd72a8e0",
              "nimi": {
                "fi": "Lausekkeet ja yhtÃ¤lÃ¶t",
                "_id": "8624476"
              },
              "kuvaus": {
                "fi": "<p>Lausekkeet ja yhtÃ¤lÃ¶t kuvaus...</p>",
                "_id": "8624475"
              },
              "koodiUri": "MAB2",
              "koodiArvo": "lukionkurssit_mab2",
              "lokalisoituKoodi": {
                "fi": "MAB2",
                "_id": "8624479"
              },
              "oppiaineId": 8624202,
              "jarjestys": 2,
              "tyyppi": "PAKOLLINEN",
              "opetussuunnitelma": null,
              "tavoitteet": {
                "id": null,
                "otsikko": {
                  "fi": "Tavoitteet",
                  "_id": "8624490"
                },
                "teksti": {
                  "fi": "<p>Lausekkkeet ja yhtÃ¤lÃ¶t tavoittelevat...</p>",
                  "_id": "8624491"
                }
              },
              "keskeinenSisalto": null,
              "tavoitteetJaKeskeinenSisalto": null
            }]
          }],
          "kurssit": []
        }]
      },
      "oppiaineet": [{
        "perusteen": {
          "id": 8624203,
          "tunniste": "187773f8-f7d8-4dd1-887a-208d28bef283",
          "koodiUri": "oppiaineetyleissivistava2_li",
          "koodiArvo": "LI",
          "koosteinen": false,
          "jarjestys": 3,
          "abstrakti": null,
          "nimi": {
            "fi": "Liikunta",
            "_id": "8624360"
          },
          "kuvaus": null,
          "pakollinenKurssiKuvaus": {
            "fi": "<p>Liikunnan pakollisten kurssien yleinen kuvaus...</p>",
            "_id": "8624361"
          },
          "syventavaKurssiKuvaus": {
            "fi": "<p>Liikunnan valtakunnalisten syventÃ¤vien kurssien yleinen kuvaus...</p>",
            "_id": "8624363"
          },
          "soveltavaKurssiKuvaus": {
            "fi": "<p>Liikunnan valtakunnallisten soveltavien kurssien yleinen kuvaus...</p>",
            "_id": "8624362"
          },
          "tehtava": {
            "id": null,
            "otsikko": {
              "_id": "8624366"
            },
            "teksti": {
              "_id": "8624367"
            }
          },
          "tavoitteet": {
            "id": null,
            "otsikko": {
              "fi": "Opetuksen tavoitteet",
              "_id": "8624365"
            },
            "teksti": {
              "fi": "<p>Liikunann tavoitteet...</p>",
              "_id": "8624368"
            }
          },
          "arviointi": {
            "id": null,
            "otsikko": {
              "fi": "Arviointi",
              "_id": "8624364"
            },
            "teksti": {
              "fi": "<p>Liikunnan arviointi...</p>",
              "_id": "8624369"
            }
          },
          "oppimaarat": [],
          "kurssit": [{
            "id": 8624430,
            "tunniste": "e084a1f5-4962-49ed-b667-fbb1a78b8f5a",
            "nimi": {
              "fi": "Energiaa liikunnasta",
              "_id": "8624441"
            },
            "kuvaus": {
              "fi": "<p>Liikunnan energiaa ja riemua!</p>",
              "_id": "8624440"
            },
            "koodiUri": "LI1",
            "koodiArvo": "lukionkurssit_li1",
            "lokalisoituKoodi": {
              "fi": "LI1",
              "_id": "8624444"
            },
            "oppiaineId": 8624203,
            "jarjestys": 1,
            "tyyppi": "PAKOLLINEN",
            "opetussuunnitelma": null,
            "tavoitteet": {
              "id": null,
              "otsikko": {
                "fi": "Tavoitteet",
                "_id": "8624445"
              },
              "teksti": {
                "fi": "<p>Energiaa liikunnasta tavoitteet....</p>",
                "_id": "8624446"
              }
            },
            "keskeinenSisalto": null,
            "tavoitteetJaKeskeinenSisalto": null
          }, {
            "id": 8624431,
            "tunniste": "37bac998-3cf8-4133-a797-ebdc61f6eae1",
            "nimi": {
              "fi": "Aktiivinen elÃ¤mÃ¤ntapa",
              "_id": "8624448"
            },
            "kuvaus": {
              "fi": "<p>Aktiivinen elÃ¤mÃ¤ntapa kuvaus...</p>",
              "_id": "8624447"
            },
            "koodiUri": "LI2",
            "koodiArvo": "lukionkurssit_li2",
            "lokalisoituKoodi": {
              "fi": "LI2",
              "_id": "8624449"
            },
            "oppiaineId": 8624203,
            "jarjestys": 2,
            "tyyppi": "VALTAKUNNALLINEN_SYVENTAVA",
            "opetussuunnitelma": null,
            "tavoitteet": null,
            "keskeinenSisalto": null,
            "tavoitteetJaKeskeinenSisalto": null
          }]
        },
        "id": 1368,
        "muokattu": 1448008520601,
        "tunniste": "187773f8-f7d8-4dd1-887a-208d28bef283",
        "tila": "luonnos",
        "oma": true,
        "jarjestys": null,
        "tyyppi": "yhteinen",
        "laajuus": null,
        "koosteinen": false,
        "nimi": {
          "fi": "Liikunta",
          "_id": "1376"
        },
        "abstrakti": null,
        "tehtava": null,
        "tavoitteet": null,
        "arvioinnit": null,
        "kurssiTyyppiKuvaukset": {
          "PAIKALLINEN_SOVELTAVA": null,
          "PAIKALLINEN_SYVENTAVA": null,
          "VALTAKUNNALLINEN_SOVELTAVA": null,
          "VALTAKUNNALLINEN_SYVENTAVA": null,
          "PAIKALLINEN_PAKOLLINEN": null,
          "VALTAKUNNALLINEN_PAKOLLINEN": null
        },
        "oppimaarat": [],
        "koodiUri": "oppiaineetyleissivistava2_li",
        "koodiArvo": "LI",
        "kurssit": [{
          "perusteen": {
            "id": 8624430,
            "tunniste": "e084a1f5-4962-49ed-b667-fbb1a78b8f5a",
            "nimi": {
              "fi": "Energiaa liikunnasta",
              "_id": "8624441"
            },
            "kuvaus": {
              "fi": "<p>Liikunnan energiaa ja riemua!</p>",
              "_id": "8624440"
            },
            "koodiUri": "LI1",
            "koodiArvo": "lukionkurssit_li1",
            "lokalisoituKoodi": {
              "fi": "LI1",
              "_id": "8624444"
            },
            "oppiaineId": 8624203,
            "jarjestys": 1,
            "tyyppi": "PAKOLLINEN",
            "opetussuunnitelma": null,
            "tavoitteet": {
              "id": null,
              "otsikko": {
                "fi": "Tavoitteet",
                "_id": "8624445"
              },
              "teksti": {
                "fi": "<p>Energiaa liikunnasta tavoitteet....</p>",
                "_id": "8624446"
              }
            },
            "keskeinenSisalto": null,
            "tavoitteetJaKeskeinenSisalto": null
          },
          "id": 1402,
          "muokattu": 1448008520602,
          "tunniste": "e084a1f5-4962-49ed-b667-fbb1a78b8f5a",
          "nimi": {
            "fi": "Energiaa liikunnasta",
            "_id": "1375"
          },
          "kuvaus": null,
          "oma": true,
          "koodiUri": "LI1",
          "koodiArvo": "lukionkurssit_li1",
          "tyyppi": "VALTAKUNNALLINEN_PAKOLLINEN",
          "lokalisoituKoodi": null,
          "tavoitteet": null,
          "keskeinenSisalto": null,
          "tavoitteetJaKeskeinenSisalto": null
        }, {
          "perusteen": {
            "id": 8624431,
            "tunniste": "37bac998-3cf8-4133-a797-ebdc61f6eae1",
            "nimi": {
              "fi": "Aktiivinen elÃ¤mÃ¤ntapa",
              "_id": "8624448"
            },
            "kuvaus": {
              "fi": "<p>Aktiivinen elÃ¤mÃ¤ntapa kuvaus...</p>",
              "_id": "8624447"
            },
            "koodiUri": "LI2",
            "koodiArvo": "lukionkurssit_li2",
            "lokalisoituKoodi": {
              "fi": "LI2",
              "_id": "8624449"
            },
            "oppiaineId": 8624203,
            "jarjestys": 2,
            "tyyppi": "VALTAKUNNALLINEN_SYVENTAVA",
            "opetussuunnitelma": null,
            "tavoitteet": null,
            "keskeinenSisalto": null,
            "tavoitteetJaKeskeinenSisalto": null
          },
          "id": 1401,
          "muokattu": 1448008520600,
          "tunniste": "37bac998-3cf8-4133-a797-ebdc61f6eae1",
          "nimi": {
            "fi": "Aktiivinen elÃ¤mÃ¤ntapa",
            "_id": "1382"
          },
          "kuvaus": null,
          "oma": true,
          "koodiUri": "LI2",
          "koodiArvo": "lukionkurssit_li2",
          "tyyppi": "VALTAKUNNALLINEN_SYVENTAVA",
          "lokalisoituKoodi": null,
          "tavoitteet": null,
          "keskeinenSisalto": null,
          "tavoitteetJaKeskeinenSisalto": null
        }]
      }, {
        "perusteen": {
          "id": 8624204,
          "tunniste": "c0a849de-af72-47ec-8ef6-9740095f5718",
          "koodiUri": "oppiaineetyleissivistava2_vk",
          "koodiArvo": "VK",
          "koosteinen": true,
          "jarjestys": 1,
          "abstrakti": false,
          "nimi": {
            "fi": "Vieraat kielet",
            "_id": "8624522"
          },
          "kuvaus": null,
          "pakollinenKurssiKuvaus": null,
          "syventavaKurssiKuvaus": null,
          "soveltavaKurssiKuvaus": null,
          "tehtava": {
            "id": null,
            "otsikko": {
              "_id": "8624524"
            },
            "teksti": {
              "_id": "8624525"
            }
          },
          "tavoitteet": {
            "id": null,
            "otsikko": {
              "fi": "Opetuksen tavoitteet",
              "_id": "8624523"
            },
            "teksti": {
              "fi": "<p>Vieraat kielet kuvaus...</p>",
              "_id": "8624526"
            }
          },
          "arviointi": {
            "id": null,
            "otsikko": {
              "fi": "Arviointi",
              "_id": "8624521"
            },
            "teksti": {
              "fi": "<p>Vieraat kielet arviointi...</p>",
              "_id": "8624527"
            }
          },
          "oppimaarat": [{
            "id": 8624207,
            "tunniste": "2937b12f-277c-489f-8ba5-87fe9ab57771",
            "koodiUri": "oppiaineetyleissivistava2_b2",
            "koodiArvo": "B2",
            "koosteinen": false,
            "jarjestys": 1,
            "abstrakti": true,
            "nimi": {
              "fi": "Vieraat kielet, B2-oppimÃ¤Ã¤rÃ¤",
              "_id": "8624667"
            },
            "kuvaus": null,
            "pakollinenKurssiKuvaus": {
              "fi": "<p>Vieraat kielet, B2-oppimÃ¤Ã¤rÃ¤ pakollisten kurssien yleinen kuvaus...</p>",
              "_id": "8624668"
            },
            "syventavaKurssiKuvaus": {
              "fi": "<p>Vieraat kielet, B2-oppimÃ¤Ã¤rÃ¤ valtakunnallisten syventÃ¤vien kyrssien yleinen kuvaus</p>",
              "_id": "8624700"
            },
            "soveltavaKurssiKuvaus": {
              "fi": "<p>Vieraat kielet, B2-oppimÃ¤Ã¤rÃ¤ valtakunnallisten soveltavien kurssien yleinen kuvaus</p>",
              "_id": "8624669"
            },
            "tehtava": {
              "id": null,
              "otsikko": {
                "_id": "8624702"
              },
              "teksti": {
                "_id": "8624703"
              }
            },
            "tavoitteet": {
              "id": null,
              "otsikko": {
                "fi": "Opetuksen tavoitteet",
                "_id": "8624701"
              },
              "teksti": {
                "fi": "<p>Vieraat kielet, B2-oppimÃ¤Ã¤rÃ¤ tavoitteet...</p>",
                "_id": "8624704"
              }
            },
            "arviointi": {
              "id": null,
              "otsikko": {
                "fi": "Arviointi",
                "_id": "8624666"
              },
              "teksti": {
                "fi": "<p>Vieraat kielet, B2-oppimÃ¤Ã¤rÃ¤ arviointi...</p>",
                "_id": "8624705"
              }
            },
            "oppimaarat": [],
            "kurssit": [{
              "id": 8624439,
              "tunniste": "e0111e0c-564e-472e-8984-bf50792e69a6",
              "nimi": {
                "fi": "ElÃ¤mÃ¤n tÃ¤rkeitÃ¤ asioita",
                "_id": "8624811"
              },
              "kuvaus": null,
              "koodiUri": "VKB21",
              "koodiArvo": "lukionkurssit_vkb21",
              "lokalisoituKoodi": {
                "fi": "VKB21",
                "_id": "8624812"
              },
              "oppiaineId": 8624207,
              "jarjestys": 1,
              "tyyppi": "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma": null,
              "tavoitteet": null,
              "keskeinenSisalto": null,
              "tavoitteetJaKeskeinenSisalto": null
            }, {
              "id": 8624840,
              "tunniste": "04c6430c-701f-4964-88c6-2d5514f5275a",
              "nimi": {
                "fi": "Monenlaista elÃ¤mÃ¤Ã¤",
                "_id": "8624813"
              },
              "kuvaus": null,
              "koodiUri": "VKB22",
              "koodiArvo": "lukionkurssit_vkb22",
              "lokalisoituKoodi": {
                "fi": "VKB22",
                "_id": "8624814"
              },
              "oppiaineId": 8624207,
              "jarjestys": 2,
              "tyyppi": "VALTAKUNNALLINEN_SYVENTAVA",
              "opetussuunnitelma": null,
              "tavoitteet": null,
              "keskeinenSisalto": null,
              "tavoitteetJaKeskeinenSisalto": null
            }]
          }, {
            "id": 8624205,
            "tunniste": "f0ba922c-b44e-4ea2-8cd9-8f467c968608",
            "koodiUri": "oppiaineetyleissivistava2_a1",
            "koodiArvo": "A1",
            "koosteinen": false,
            "jarjestys": 3,
            "abstrakti": true,
            "nimi": {
              "fi": "Vieraat kielet, A-oppimÃ¤Ã¤rÃ¤",
              "_id": "8624529"
            },
            "kuvaus": null,
            "pakollinenKurssiKuvaus": {
              "fi": "<p>Vieraat kielet, A-oppimÃ¤Ã¤rÃ¤ kurssien yleinen kuvaus</p>",
              "_id": "8624610"
            },
            "syventavaKurssiKuvaus": {
              "fi": "<p>Vieraat kielet, A-oppimÃ¤Ã¤rÃ¤ valtakunnallisten syventÃ¤vien kurssien yleinen kuvaus < /p>",
              "_id": "8624612"
            },
            "soveltavaKurssiKuvaus": {
              "fi": "<p>Vieraat kielet, A-oppimÃ¤Ã¤rÃ¤ valtakunnallisten soveltavien kurssien yleinen kuvaus < /p>",
              "_id": "8624611"
            },
            "tehtava": {
              "id": null,
              "otsikko": {
                "_id": "8624614"
              },
              "teksti": {
                "_id": "8624615"
              }
            },
            "tavoitteet": {
              "id": null,
              "otsikko": {
                "fi": "Opetuksen tavoitteet",
                "_id": "8624613"
              },
              "teksti": {
                "fi": "<p>Vieraat kielet, A-oppimÃ¤Ã¤rÃ¤ opetuksen tavoitteet...</p>",
                "_id": "8624616"
              }
            },
            "arviointi": {
              "id": null,
              "otsikko": {
                "fi": "Arviointi",
                "_id": "8624528"
              },
              "teksti": {
                "fi": "<p>Vieraat kielet, A-oppimÃ¤Ã¤rÃ¤ arviointi...</p>",
                "_id": "8624617"
              }
            },
            "oppimaarat": [],
            "kurssit": [{
              "id": 8624436,
              "tunniste": "6cd3fbfa-e847-4a47-afab-29739f8b2891",
              "nimi": {
                "fi": "Ihminen verkostoissa",
                "_id": "8624770"
              },
              "kuvaus": {
                "fi": "<p>Ihminen verkostoissa kuvaus...</p>",
                "_id": "8624709"
              },
              "koodiUri": "VKA2",
              "koodiArvo": "lukionkurssit_vka2",
              "lokalisoituKoodi": {
                "fi": "VKA2",
                "_id": "8624771"
              },
              "oppiaineId": 8624205,
              "jarjestys": 2,
              "tyyppi": "PAKOLLINEN",
              "opetussuunnitelma": null,
              "tavoitteet": null,
              "keskeinenSisalto": null,
              "tavoitteetJaKeskeinenSisalto": null
            }, {
              "id": 8624435,
              "tunniste": "9887b0b3-88b7-45e5-af29-39633d4bff16",
              "nimi": {
                "fi": "Kieli ja maailmani",
                "_id": "8624707"
              },
              "kuvaus": {
                "fi": "<p>Kieli ja maailmani kuvaus...</p>",
                "_id": "8624706"
              },
              "koodiUri": "VKA1",
              "koodiArvo": "lukionkurssit_vka1",
              "lokalisoituKoodi": {
                "fi": "VKA1",
                "_id": "8624708"
              },
              "oppiaineId": 8624205,
              "jarjestys": 1,
              "tyyppi": "PAKOLLINEN",
              "opetussuunnitelma": null,
              "tavoitteet": null,
              "keskeinenSisalto": null,
              "tavoitteetJaKeskeinenSisalto": null
            }]
          }, {
            "id": 8624206,
            "tunniste": "a5021ee5-9411-4d5f-9b68-7752d1116972",
            "koodiUri": "oppiaineetyleissivistava2_b1",
            "koodiArvo": "B1",
            "koosteinen": false,
            "jarjestys": 2,
            "abstrakti": true,
            "nimi": {
              "fi": "Vieraat kielet, B1-oppimÃ¤Ã¤rÃ¤",
              "_id": "8624662"
            },
            "kuvaus": null,
            "pakollinenKurssiKuvaus": {
              "fi": "<p>Vieraat kielet, B1-oppimÃ¤Ã¤rÃ¤ pakollisten kurssien yleinen kuvaus..</p>",
              "_id": "8624663"
            },
            "syventavaKurssiKuvaus": {
              "fi": "<p>Vieraat kielet, B1-oppimÃ¤Ã¤rÃ¤ valtakunnallisten syventÃ¤vien kyrssien yleinen kuvaus</p>",
              "_id": "8624665"
            },
            "soveltavaKurssiKuvaus": {
              "fi": "<p>Vieraat kielet, B1-oppimÃ¤Ã¤rÃ¤ valtakunnallisten soveltavien kurssien yleinen kuvaus</p>",
              "_id": "8624664"
            },
            "tehtava": null,
            "tavoitteet": null,
            "arviointi": null,
            "oppimaarat": [],
            "kurssit": [{
              "id": 8624437,
              "tunniste": "e25662ea-9dee-4b67-a9be-8833638481e2",
              "nimi": {
                "fi": "Kieli ja maailmani",
                "_id": "8624773"
              },
              "kuvaus": {
                "fi": "<p>Kieli ja maailmani kuvaus...</p>",
                "_id": "8624772"
              },
              "koodiUri": "VKB1",
              "koodiArvo": "lukionkurssit_vkb1",
              "lokalisoituKoodi": {
                "fi": "VKB1",
                "_id": "8624774"
              },
              "oppiaineId": 8624206,
              "jarjestys": 1,
              "tyyppi": "PAKOLLINEN",
              "opetussuunnitelma": null,
              "tavoitteet": null,
              "keskeinenSisalto": null,
              "tavoitteetJaKeskeinenSisalto": null
            }, {
              "id": 8624438,
              "tunniste": "d102376a-7369-41b6-851e-c4d009d0cda1",
              "nimi": {
                "fi": "Hyvinvointi ja ihmissuhteet",
                "_id": "8624777"
              },
              "kuvaus": null,
              "koodiUri": "VKB2",
              "koodiArvo": "lukionkurssit_vkb2",
              "lokalisoituKoodi": {
                "fi": "VKB2",
                "_id": "8624778"
              },
              "oppiaineId": 8624206,
              "jarjestys": 2,
              "tyyppi": "PAKOLLINEN",
              "opetussuunnitelma": null,
              "tavoitteet": null,
              "keskeinenSisalto": null,
              "tavoitteetJaKeskeinenSisalto": null
            }]
          }],
          "kurssit": []
        },
        "id": 1470,
        "muokattu": 1448008520602,
        "tunniste": "c0a849de-af72-47ec-8ef6-9740095f5718",
        "tila": "luonnos",
        "oma": true,
        "jarjestys": null,
        "tyyppi": "yhteinen",
        "laajuus": null,
        "koosteinen": true,
        "nimi": {
          "fi": "Vieraat kielet",
          "_id": "1326"
        },
        "abstrakti": null,
        "tehtava": null,
        "tavoitteet": null,
        "arvioinnit": null,
        "kurssiTyyppiKuvaukset": {
          "PAIKALLINEN_SOVELTAVA": null,
          "PAIKALLINEN_SYVENTAVA": null,
          "VALTAKUNNALLINEN_SOVELTAVA": null,
          "VALTAKUNNALLINEN_SYVENTAVA": null,
          "PAIKALLINEN_PAKOLLINEN": null,
          "VALTAKUNNALLINEN_PAKOLLINEN": null
        },
        "oppimaarat": [],
        "koodiUri": "oppiaineetyleissivistava2_vk",
        "koodiArvo": "VK",
        "kurssit": []
      }, {
        "perusteen": {
          "id": 8624200,
          "tunniste": "c9400700-f311-4285-8ee0-42a47dd10ff2",
          "koodiUri": "oppiaineetyleissivistava2_ma",
          "koodiArvo": "MA",
          "koosteinen": true,
          "jarjestys": 2,
          "abstrakti": false,
          "nimi": {
            "fi": "Matematiikka",
            "_id": "8624174"
          },
          "kuvaus": null,
          "pakollinenKurssiKuvaus": null,
          "syventavaKurssiKuvaus": null,
          "soveltavaKurssiKuvaus": null,
          "tehtava": {
            "id": null,
            "otsikko": {
              "_id": "8624176"
            },
            "teksti": {
              "_id": "8624177"
            }
          },
          "tavoitteet": {
            "id": null,
            "otsikko": {
              "fi": "Opetuksen tavoitteet",
              "_id": "8624175"
            },
            "teksti": {
              "fi": "<p>Matematiikan opetuksen tavoitteet ovat...</p>",
              "_id": "8624178"
            }
          },
          "arviointi": {
            "id": null,
            "otsikko": {
              "fi": "Arviointi",
              "_id": "8624173"
            },
            "teksti": {
              "fi": "<p>Matematiikka arvioidaan...</p>",
              "_id": "8624179"
            }
          },
          "oppimaarat": [{
            "id": 8624201,
            "tunniste": "d7605085-39b6-44c7-954d-e2611ab1b94e",
            "koodiUri": "oppiaineetyleissivistava2_ma",
            "koodiArvo": "MA",
            "koosteinen": false,
            "jarjestys": 2,
            "abstrakti": null,
            "nimi": {
              "fi": "PitkÃ¤ matematiikka",
              "_id": "8624261"
            },
            "kuvaus": null,
            "pakollinenKurssiKuvaus": {
              "fi": "<p>PitkÃ¤n matematiikan pakolliset kurssien yleinen kuvaus...</p>",
              "_id": "8624262"
            },
            "syventavaKurssiKuvaus": {
              "fi": "<p>PitkÃ¤n matematiikan valtakunnallisten syventÃ¤vien kurssien yleinen kuvaus...</p > ",
              "_id": "8624264"
            },
            "soveltavaKurssiKuvaus": {
              "fi": "<p>PitkÃ¤n matematiikan valtakunnallisten soveltavien kurssien yleinen kuvaus....</p > ",
              "_id": "8624263"
            },
            "tehtava": {
              "id": null,
              "otsikko": {
                "_id": "8624266"
              },
              "teksti": {
                "_id": "8624267"
              }
            },
            "tavoitteet": {
              "id": null,
              "otsikko": {
                "fi": "Opetuksen tavoitteet",
                "_id": "8624265"
              },
              "teksti": {
                "fi": "<p>PitkÃ¤n matematiikan tavoitteet...</p>",
                "_id": "8624268"
              }
            },
            "arviointi": {
              "id": null,
              "otsikko": {
                "fi": "Arviointi",
                "_id": "8624260"
              },
              "teksti": {
                "fi": "<p>PitkÃ¤n matematiikan arviointi...</p>",
                "_id": "8624269"
              }
            },
            "oppimaarat": [],
            "kurssit": [{
              "id": 8624434,
              "tunniste": "df3f0aae-b76f-4a86-8c88-de8012bf8c90",
              "nimi": {
                "fi": "Polynomifunktiot ja -yhtÃ¤lÃ¶t",
                "_id": "8624493"
              },
              "kuvaus": {
                "fi": "<p>Polynomifunktiot ja -yhtÃ¤lÃ¶t kuvaus....</p>",
                "_id": "8624492"
              },
              "koodiUri": "MAA2",
              "koodiArvo": "lukionkurssit_maa2",
              "lokalisoituKoodi": {
                "fi": "MAA2",
                "_id": "8624494"
              },
              "oppiaineId": 8624201,
              "jarjestys": 2,
              "tyyppi": "PAKOLLINEN",
              "opetussuunnitelma": null,
              "tavoitteet": {
                "id": null,
                "otsikko": {
                  "fi": "Tavoitteet",
                  "_id": "8624497"
                },
                "teksti": {
                  "fi": "<p>Polynomifunktiot ja -yhtÃ¤lÃ¶t tavoitteet....</p>",
                  "_id": "8624498"
                }
              },
              "keskeinenSisalto": null,
              "tavoitteetJaKeskeinenSisalto": null
            }, {
              "id": 8624432,
              "tunniste": "bf9f3612-6841-4814-bd45-c0ea54e6be01",
              "nimi": {
                "fi": "Luvut ja lukujonot",
                "_id": "8624471"
              },
              "kuvaus": {
                "fi": "<p>Luvut ja lukujonot yhteinen kurssi matikoille.</p>",
                "_id": "8624470"
              },
              "koodiUri": "MAY1",
              "koodiArvo": "lukionkurssit_may1",
              "lokalisoituKoodi": {
                "fi": "MAY1",
                "_id": "8624472"
              },
              "oppiaineId": 8624201,
              "jarjestys": 1,
              "tyyppi": "PAKOLLINEN",
              "opetussuunnitelma": null,
              "tavoitteet": null,
              "keskeinenSisalto": null,
              "tavoitteetJaKeskeinenSisalto": null
            }]
          }, {
            "id": 8624202,
            "tunniste": "f14e93fa-20e5-49cf-9c5c-60404cb0f94d",
            "koodiUri": "oppiaineetyleissivistava2_ma",
            "koodiArvo": "MA",
            "koosteinen": false,
            "jarjestys": 1,
            "abstrakti": null,
            "nimi": {
              "fi": "Lyhyt matematiikka",
              "_id": "8624311"
            },
            "kuvaus": null,
            "pakollinenKurssiKuvaus": {
              "fi": "<p>Lyhyen matematiikan pakollisten kurssien yleinen kuvaus...</p>",
              "_id": "8624312"
            },
            "syventavaKurssiKuvaus": {
              "fi": "<p>Lyhyen matematiikan valtakunnallisten syventÃ¤vien kurssien yleinen kuvaus...</p > ",
              "_id": "8624314"
            },
            "soveltavaKurssiKuvaus": {
              "fi": "<p>Lyhyen matematiikan valtakunnallisten soveltavien kurssien yleinen kuvaus...</p > ",
              "_id": "8624313"
            },
            "tehtava": {
              "id": null,
              "otsikko": {
                "_id": "8624316"
              },
              "teksti": {
                "_id": "8624317"
              }
            },
            "tavoitteet": {
              "id": null,
              "otsikko": {
                "fi": "Opetuksen tavoitteet",
                "_id": "8624315"
              },
              "teksti": {
                "fi": "<p>Lyhyt matematiikka tavoitteet...</p>",
                "_id": "8624318"
              }
            },
            "arviointi": {
              "id": null,
              "otsikko": {
                "fi": "Arviointi",
                "_id": "8624310"
              },
              "teksti": {
                "fi": "<p>Lyhyt matematiikka arviointi....</p>",
                "_id": "8624319"
              }
            },
            "oppimaarat": [],
            "kurssit": [{
              "id": 8624432,
              "tunniste": "bf9f3612-6841-4814-bd45-c0ea54e6be01",
              "nimi": {
                "fi": "Luvut ja lukujonot",
                "_id": "8624471"
              },
              "kuvaus": {
                "fi": "<p>Luvut ja lukujonot yhteinen kurssi matikoille.</p>",
                "_id": "8624470"
              },
              "koodiUri": "MAY1",
              "koodiArvo": "lukionkurssit_may1",
              "lokalisoituKoodi": {
                "fi": "MAY1",
                "_id": "8624472"
              },
              "oppiaineId": 8624202,
              "jarjestys": 1,
              "tyyppi": "PAKOLLINEN",
              "opetussuunnitelma": null,
              "tavoitteet": null,
              "keskeinenSisalto": null,
              "tavoitteetJaKeskeinenSisalto": null
            }, {
              "id": 8624433,
              "tunniste": "a7b6a4e8-37f6-42f6-921e-3bc4dd72a8e0",
              "nimi": {
                "fi": "Lausekkeet ja yhtÃ¤lÃ¶t",
                "_id": "8624476"
              },
              "kuvaus": {
                "fi": "<p>Lausekkeet ja yhtÃ¤lÃ¶t kuvaus...</p>",
                "_id": "8624475"
              },
              "koodiUri": "MAB2",
              "koodiArvo": "lukionkurssit_mab2",
              "lokalisoituKoodi": {
                "fi": "MAB2",
                "_id": "8624479"
              },
              "oppiaineId": 8624202,
              "jarjestys": 2,
              "tyyppi": "PAKOLLINEN",
              "opetussuunnitelma": null,
              "tavoitteet": {
                "id": null,
                "otsikko": {
                  "fi": "Tavoitteet",
                  "_id": "8624490"
                },
                "teksti": {
                  "fi": "<p>Lausekkkeet ja yhtÃ¤lÃ¶t tavoittelevat...</p>",
                  "_id": "8624491"
                }
              },
              "keskeinenSisalto": null,
              "tavoitteetJaKeskeinenSisalto": null
            }]
          }],
          "kurssit": []
        },
        "id": 1369,
        "muokattu": 1448008520602,
        "tunniste": "c9400700-f311-4285-8ee0-42a47dd10ff2",
        "tila": "luonnos",
        "oma": true,
        "jarjestys": null,
        "tyyppi": "yhteinen",
        "laajuus": null,
        "koosteinen": true,
        "nimi": {
          "fi": "Matematiikka",
          "_id": "1372"
        },
        "abstrakti": null,
        "tehtava": null,
        "tavoitteet": null,
        "arvioinnit": null,
        "kurssiTyyppiKuvaukset": {
          "PAIKALLINEN_SOVELTAVA": null,
          "PAIKALLINEN_SYVENTAVA": null,
          "VALTAKUNNALLINEN_SOVELTAVA": null,
          "VALTAKUNNALLINEN_SYVENTAVA": null,
          "PAIKALLINEN_PAKOLLINEN": null,
          "VALTAKUNNALLINEN_PAKOLLINEN": null
        },
        "oppimaarat": [],
        "koodiUri": "oppiaineetyleissivistava2_ma",
        "koodiArvo": "MA",
        "kurssit": []
      }]
    };

    var aihekokonaisuudet = {
      perusteen: {
        uuidTunniste: "9b33b40a-3f8d-4874-9d7e-1771475dbd78",
        id: 8624100,
        otsikko: {
          fi: "Aihekokonaisuudet - OTSIKKO",
          _id: "8624117"
        },
        yleiskuvaus: {
          fi: "<p>Aihekokonaisuuksien yleiskuvaus ja sisÃ¤ltÃ¶ - SISÃ„LTÃ–</p>",
          _id: "8624118"
        },
        muokattu: 1447489558051,
        muokkaaja: "1.2.246.562.24.33447367959",
        parent: null,
        aihekokonaisuudet: [
          {
            tunniste: "f385c03c-cf28-4bc3-aea2-88accaeba8fb",
            id: 8624160,
            otsikko: {
              fi: "Aihekokonaisuus 1 - OTSIKKO",
              _id: "8624119"
            },
            yleiskuvaus: {
              fi: "<p>Aihekokonaisuus 1 sisÃ¤ltÃ¶Ã¤.</p>",
              _id: "8624170"
            },
            jnro: 1,
            parent: null,
            muokattu: null,
            muokkaaja: null
          },
          {
            tunniste: "57908cd5-5198-4edb-84ce-fc5f27e0ee24",
            id: 8624161,
            otsikko: {
              fi: "Aihekokonaisuus 2 - OTSIKKO",
              _id: "8624171"
            },
            yleiskuvaus: {
              fi: "<p>Aihekokonaisuus 2 sisÃ¤ltÃ¶Ã¤</p>",
              _id: "8624172"
            },
            jnro: 2,
            parent: null,
            muokattu: null,
            muokkaaja: null
          }
        ]
      },
      paikallinen: {
        uuidTunniste: "9b33b40a-3f8d-4874-9d7e-1771475dbd78",
        id: 1411,
        otsikko: null,
        yleiskuvaus: null,
        muokattu: 1448008520603,
        muokkaaja: "test",
        aihekokonaisuudet: [
          {
            tunniste: "f385c03c-cf28-4bc3-aea2-88accaeba8fb",
            id: 1433,
            otsikko: {
              fi: "Aihekokonaisuus 1 - OTSIKKO",
              _id: "1383"
            },
            yleiskuvaus: null,
            jnro: 2,
            parent: null,
            muokattu: 1448008520603,
            muokkaaja: "test",
            perusteen: {
              tunniste: "f385c03c-cf28-4bc3-aea2-88accaeba8fb",
              id: 8624160,
              otsikko: {
                fi: "Aihekokonaisuus 1 - OTSIKKO",
                _id: "8624119"
              },
              yleiskuvaus: {
                fi: "<p>Aihekokonaisuus 1 sisÃ¤ltÃ¶Ã¤.</p>",
                _id: "8624170"
              },
              jnro: 1,
              parent: null,
              muokattu: null,
              muokkaaja: null
            }
          },
          {
            tunniste: "57908cd5-5198-4edb-84ce-fc5f27e0ee24",
            id: 1432,
            otsikko: {
              fi: "Aihekokonaisuus 2 - OTSIKKO",
              _id: "1384"
            },
            yleiskuvaus: null,
            jnro: 1,
            parent: null,
            muokattu: 1448008520603,
            muokkaaja: "test",
            perusteen: {
              tunniste: "57908cd5-5198-4edb-84ce-fc5f27e0ee24",
              id: 8624161,
              otsikko: {
                fi: "Aihekokonaisuus 2 - OTSIKKO",
                _id: "8624171"
              },
              yleiskuvaus: {
                fi: "<p>Aihekokonaisuus 2 sisÃ¤ltÃ¶Ã¤</p>",
                _id: "8624172"
              },
              jnro: 2,
              parent: null,
              muokattu: null,
              muokkaaja: null
            }
          }
        ]
      },
      kommentti: null,
      tunniste: "9b33b40a-3f8d-4874-9d7e-1771475dbd78"
    };

    var otsikot = {
      "id" : 69555,
      "tekstiKappale" : null,
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
          "tila" : "luonnos",
          "tunniste" : "fd73cfa7-7796-42be-864f-4c9db72e7b7c",
          "pakollinen" : null,
          "valmis" : null
        },
        "omistussuhde" : "oma",
        "pakollinen" : false,
        "valmis" : false,
        "lapset" : [ ],
        "_tekstiKappale" : null
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
          "tila" : "luonnos",
          "tunniste" : "6cb528bc-20d4-493c-9dc7-72a24ee72672",
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

    return { lukioRakenne, aihekokonaisuudet, otsikot, yleisetTavoitteet, ops, teksti1, teksti2 }

  });
