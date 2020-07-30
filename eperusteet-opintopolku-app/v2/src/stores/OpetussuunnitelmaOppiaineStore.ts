import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import { Opetussuunnitelmat, OppiaineenVuosiluokat, PerusteOppiaineDto, Oppiaineet, UnwrappedOpsOppiaineDto,
  OppiaineenVuosiluokkakokonaisuudet, PerusteOppiaineenVuosiluokkakokonaisuusDto,
  OpetussuunnitelmaKevytDto, Vuosiluokkakokonaisuudet, UnwrappedOpsOppiaineDtoTyyppiEnum } from '@shared/api/ylops';
import * as _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';

Vue.use(VueCompositionApi);

export class OpetussuunnitelmaOppiaineStore {
  public state = reactive({
    oppiaine: null as UnwrappedOpsOppiaineDto | null,
    perusteOppiaine: null as PerusteOppiaineDto | null,
    oppiaineenVuosiluokkakokonaisuudet: null as any[] | null,
  })

  public static async create(opetussuunnitelma: OpetussuunnitelmaKevytDto, opsId: number, oppiaineId: number, vlkId?: number) {
    const result = new OpetussuunnitelmaOppiaineStore(opetussuunnitelma, oppiaineId, vlkId);
    await result.init();
    return result;
  }

  constructor(private opetussuunnitelma: OpetussuunnitelmaKevytDto, private oppiaineId: number, private vlkId?: number) {
  }

  public readonly oppiaine = computed(() => this.state.oppiaine);
  public readonly perusteOppiaine = computed(() => this.state.perusteOppiaine);
  public readonly oppiaineenVuosiluokkakokonaisuudet = computed(() => this.state.oppiaineenVuosiluokkakokonaisuudet);

  public async init() {
    this.state.oppiaine = (await Oppiaineet.getOppiaine(this.opetussuunnitelma.id!, this.oppiaineId)).data;
    const laajaalaisetOsaamiset = (await Opetussuunnitelmat.getLaajalaisetosamiset(this.opetussuunnitelma.id!)).data;

    if (this.state.oppiaine.tyyppi === _.toLower(UnwrappedOpsOppiaineDtoTyyppiEnum.YHTEINEN)) {
      this.state.perusteOppiaine = (await Oppiaineet.getPerusteSisalto(this.opetussuunnitelma.id!, this.oppiaineId)).data;
    }

    this.state.oppiaine!.vuosiluokkakokonaisuudet = _.filter(this.state.oppiaine!.vuosiluokkakokonaisuudet, vlk =>
      _.includes(_.map(this.opetussuunnitelma.vuosiluokkakokonaisuudet, 'vuosiluokkakokonaisuus._tunniste'), _.get(vlk, '_vuosiluokkakokonaisuus')));

    this.state.oppiaineenVuosiluokkakokonaisuudet = await Promise.all(_.map(this.state.oppiaine!.vuosiluokkakokonaisuudet, async (oppiaineenVuosiluokkakokonaisuus) => {
      const vuosiluokkakokonaisuus = _.head(_.filter(this.opetussuunnitelma.vuosiluokkakokonaisuudet, vlk => _.get(vlk.vuosiluokkakokonaisuus, '_tunniste') === _.get(oppiaineenVuosiluokkakokonaisuus, '_vuosiluokkakokonaisuus')));

      if (this.state.oppiaine!.tyyppi === _.toLower(UnwrappedOpsOppiaineDtoTyyppiEnum.YHTEINEN)) {
        const oppiaineenPerusteenVuosiluokkakokonaisuus = (await OppiaineenVuosiluokkakokonaisuudet
          .getOppiaineenVuosiluokkakokonaisuudenPerusteSisalto(this.opetussuunnitelma.id!, this.oppiaineId, oppiaineenVuosiluokkakokonaisuus.id!)).data;

        return {
          vuosiluokkakokonaisuus: _.get(vuosiluokkakokonaisuus, 'vuosiluokkakokonaisuus'),
          oppiaineenPerusteenVuosiluokkakokonaisuus,
          oppiaineenVuosiluokkakokonaisuus: {
            ...oppiaineenVuosiluokkakokonaisuus,
            vuosiluokat: _.map(oppiaineenVuosiluokkakokonaisuus.vuosiluokat, vuosiluokka => {
              return {
                ...vuosiluokka,
                tavoitteet: this.setVuosiluokanTavoitteet(
                  this.state.perusteOppiaine,
                  laajaalaisetOsaamiset,
                  vuosiluokka,
                  _.get(vuosiluokkakokonaisuus, 'vuosiluokkakokonaisuus')),
              };
            }),
          },
        };
      }
      else {
        return {
          vuosiluokkakokonaisuus: _.get(vuosiluokkakokonaisuus, 'vuosiluokkakokonaisuus'),
          oppiaineenVuosiluokkakokonaisuus,
          oppiaine: this.state.oppiaine,
        };
      }
    }));
  }

  private setVuosiluokanTavoitteet(perusteenOppiaine: any, laajaalaisetOsaamiset: any, vuosiluokka:any, vuosiluokkakokonaisuus: any) {
    const perusteenVlk = _.find(perusteenOppiaine.vuosiluokkakokonaisuudet, vlk =>
      vlk._vuosiluokkakokonaisuus === (vuosiluokkakokonaisuus as any)._tunniste) as PerusteOppiaineenVuosiluokkakokonaisuusDto;
    const sisaltoalueetMap = _.keyBy(perusteenVlk.sisaltoalueet, 'tunniste');
    const laajaalaisetOsaamisetMap = _.keyBy(laajaalaisetOsaamiset, 'tunniste');
    const vuosiluokanTavoitteet = _.keyBy(vuosiluokka.tavoitteet, 'tunniste');
    let kohdealueGlobalIndex = 0;

    return _.map(perusteenVlk.tavoitteet, tavoite => {
      return {
        ...tavoite,
        sisaltoalueet: _.chain(tavoite.sisaltoalueet)
          .map((sisaltoalue: string) => sisaltoalueetMap[sisaltoalue])
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
                .head()
                .value(),
            };
          })
          .filter(sisaltoalue => !sisaltoalue.vuosiluokanSisaltoalue || !sisaltoalue.vuosiluokanSisaltoalue.sisaltoalueet.piilotettu)
          .sortBy([(sisaltoalue: any) => {
            return sisaltoalue.nimi[Kielet.getSisaltoKieli.value];
          }])
          .value(),
        laajaalaisetosaamiset: _.chain(tavoite.laajaalaisetosaamiset)
          .map((lao: string) => laajaalaisetOsaamisetMap[lao])
          .sortBy([(lao: any) => {
            return lao.nimi[Kielet.getSisaltoKieli.value];
          }])
          .value(),
        kohdealueet: _.map(tavoite.kohdealueet, kohdealue => {
          return {
            ...kohdealue,
            index: kohdealueGlobalIndex++,
          };
        }),
        vuosiluokanTavoite: vuosiluokanTavoitteet[(tavoite.tunniste as string)],
        hyvanOsaamisenKuvaus: _.find(tavoite.arvioinninkohteet, kohde => kohde.arvosana === 8),
      };
    });
  }
}
