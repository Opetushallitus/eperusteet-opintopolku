import { UnwrappedOpsOppiaineDtoTyyppiEnum } from '@shared/generated/ylops';
import { Kielet } from '@shared/stores/kieli';
import _ from 'lodash';

export function oppiaineenVuosiluokkakokonaisuudenRakennin(
  oppiaine,
  perusteOppiaine,
  laajaalaisetOsaamiset,
  oppiaineenVuosiluokkakokonaisuus,
  opetussuunnitelmanVuosiluokkakokonaisuus,
  perusteenOppiaineenVlk,
  oppiaineenPohjanVuosiluokkakokonaisuus,
  perusteenVuosiluokkakokonaisuus) {
  if (oppiaine.tyyppi === _.toLower(UnwrappedOpsOppiaineDtoTyyppiEnum.YHTEINEN && perusteOppiaine)) {
    return {
      vuosiluokkakokonaisuus: opetussuunnitelmanVuosiluokkakokonaisuus,
      perusteenOppiaineenVlk,
      oppiaineenVuosiluokkakokonaisuus: {
        ...oppiaineenVuosiluokkakokonaisuus,
        vuosiluokat: _.map(oppiaineenVuosiluokkakokonaisuus?.vuosiluokat, vuosiluokka => {
          return {
            ...vuosiluokka,
            tavoitteet: setVuosiluokanTavoitteet(
              perusteOppiaine,
              laajaalaisetOsaamiset,
              vuosiluokka,
              perusteenOppiaineenVlk,
              perusteenVuosiluokkakokonaisuus,
              opetussuunnitelmanVuosiluokkakokonaisuus,
            ),
          };
        }),
      },
      oppiaineenPohjanVuosiluokkakokonaisuus,
    };
  }
  else {
    return {
      vuosiluokkakokonaisuus: opetussuunnitelmanVuosiluokkakokonaisuus,
      oppiaineenVuosiluokkakokonaisuus,
      oppiaine,
    };
  }
}

function setVuosiluokanTavoitteet(perusteenOppiaine: any, laajaalaisetOsaamiset: any, vuosiluokka:any, perusteenOppiaineenVlk: any, perusteenVuosiluokkakokonaisuus: any, opetussuunnitelmanVuosiluokkakokonaisuus: any) {
  const sisaltoalueetMap = _.keyBy(perusteenOppiaineenVlk.sisaltoalueet, 'id');
  const laajaalaisetOsaamisetMapById = _.keyBy(laajaalaisetOsaamiset, 'id');
  const perusteenVlkLaajaalaisetOsaamisetMap = _.keyBy(perusteenVuosiluokkakokonaisuus?.laajaalaisetOsaamiset, '_laajaalainenOsaaminen');
  const paikallisetLaajaalaisetOsaamisetMap = _.keyBy(opetussuunnitelmanVuosiluokkakokonaisuus?.laajaalaisetosaamiset, '_laajaalainenosaaminen');
  const vuosiluokanTavoitteet = _.keyBy(vuosiluokka.tavoitteet, 'tunniste');
  const vuosiluokanSisaltoalueet = _.keyBy(vuosiluokka.sisaltoalueet, 'tunniste');
  const kohdealueetById = _.keyBy(perusteenOppiaine.kohdealueet, 'id');
  let kohdealueGlobalIndex = 0;

  return _.chain(perusteenOppiaineenVlk.tavoitteet)
    .filter(tavoite => _.includes(_.map(vuosiluokka.tavoitteet, 'tunniste'), tavoite.tunniste))
    .map(tavoite => {
      return {
        ...tavoite,
        sisaltoalueet: _.chain(tavoite.sisaltoalueet)
          .map((sisaltoalue: string) => sisaltoalueetMap[sisaltoalue])
          .filter((sisaltoalue:any) => vuosiluokanSisaltoalueet[sisaltoalue.tunniste] && !vuosiluokanSisaltoalueet[sisaltoalue.tunniste].piilotettu)
          .map((sisaltoalue: any) => {
            return {
              ...sisaltoalue,
              vuosiluokanSisaltoalue: _.chain(_.get(vuosiluokanTavoitteet[(tavoite.tunniste as string)], 'sisaltoalueet'))
                .filter(vlSisaltoalue => vlSisaltoalue.sisaltoalueet.tunniste === sisaltoalue.tunniste)
                .map(vlSisaltoalue => {
                  return {
                    ...vlSisaltoalue,
                    kaytaOmaaKuvausta: vlSisaltoalue.omaKuvaus !== null,
                  } as any;
                })
                .sortBy('id')
                .head()
                .value(),
            };
          })
          .sortBy([(sisaltoalue: any) => sisaltoalue.nimi[Kielet.getSisaltoKieli.value]])
          .value(),
        laajaalaisetosaamiset: _.chain(tavoite.laajattavoitteet)
          .map((lao: string) => {
            const perusteenLao = laajaalaisetOsaamisetMapById[lao];
            return {
              perusteenLao,
              perusteenVlkLao: perusteenVlkLaajaalaisetOsaamisetMap[lao],
              paikallinenLao: paikallisetLaajaalaisetOsaamisetMap[perusteenLao.tunniste],
            };
          })
          .sortBy([(lao: any) => {
            return lao.perusteenLao.nimi[Kielet.getSisaltoKieli.value];
          }])
          .value(),
        kohdealueet: _.map(tavoite.kohdealueet, kohdealue => {
          return {
            ...kohdealueetById[kohdealue as string],
            index: kohdealueGlobalIndex++,
          };
        }),
        vuosiluokanTavoite: vuosiluokanTavoitteet[(tavoite.tunniste as string)],
        hyvanOsaamisenKuvaus: _.find(tavoite.arvioinninkohteet, kohde => kohde.arvosana === 8),
      };
    })
    .value();
}
