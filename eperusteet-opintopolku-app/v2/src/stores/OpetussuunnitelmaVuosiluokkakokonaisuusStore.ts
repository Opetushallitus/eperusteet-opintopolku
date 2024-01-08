import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import { Vuosiluokkakokonaisuudet, UnwrappedOpsVuosiluokkakokonaisuusDto, PerusteVuosiluokkakokonaisuusDto, Opetussuunnitelmat, PerusteLaajaalainenosaaminenDto } from '@shared/api/ylops';
import _ from 'lodash';

Vue.use(VueCompositionApi);

export class OpetussuunnitelmaVuosiluokkakokonaisuusStore {
  public state = reactive({
    vuosiluokkakokonaisuus: null as UnwrappedOpsVuosiluokkakokonaisuusDto | null,
    perusteenVuosiluokkakokonaisuus: null as PerusteVuosiluokkakokonaisuusDto | null,
    perusteenLaajaalaisetOsaamiset: null as PerusteLaajaalainenosaaminenDto[] | null,
  });

  public static async create(opsId: number, vlkId: number) {
    const result = new OpetussuunnitelmaVuosiluokkakokonaisuusStore(opsId, vlkId);
    await result.init();
    return result;
  }

  constructor(private opsId: number, private vlkId: number) {
  }

  public readonly vuosiluokkakokonaisuus = computed(() => this.state.vuosiluokkakokonaisuus);
  public readonly perusteenVuosiluokkakokonaisuus = computed(() => this.state.perusteenVuosiluokkakokonaisuus);
  public readonly perusteenLaajaalaisetOsaamiset = computed(() => this.state.perusteenLaajaalaisetOsaamiset);

  public async init() {
    this.state.vuosiluokkakokonaisuus = (await Vuosiluokkakokonaisuudet.getVuosiluokkakokonaisuus(this.opsId, this.vlkId)).data;
    const opetussuunnitelmanLaot = _.keyBy(this.state.vuosiluokkakokonaisuus.laajaalaisetosaamiset, '_laajaalainenosaaminen');

    this.state.perusteenLaajaalaisetOsaamiset = _.map((await Opetussuunnitelmat.getLaajalaisetosamiset(this.opsId)).data, lao => {
      return {
        ...lao,
        opetussuunnitelmanLao: opetussuunnitelmanLaot[lao.tunniste!],
      };
    });

    this.state.perusteenVuosiluokkakokonaisuus = (await Vuosiluokkakokonaisuudet.getVuosiluokkakokonaisuudenPerusteSisalto(this.opsId, this.vlkId)).data;
  }
}
