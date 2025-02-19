import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import { PerusopetuksenPerusteenSisalto, VuosiluokkaKokonaisuusDto } from '@shared/api/eperusteet';
import _ from 'lodash';

Vue.use(VueCompositionApi);

export class PerusteVuosiluokkakokonaisuusStore {
  public state = reactive({
    vuosiluokkakokonaisuus: null as VuosiluokkaKokonaisuusDto | null,
  });

  public static async create(perusteId: number, vlkId: number) {
    const result = new PerusteVuosiluokkakokonaisuusStore(perusteId, vlkId);
    await result.init();
    return result;
  }

  constructor(private perusteId: number, private vlkId: number) {
  }

  public readonly vuosiluokkakokonaisuus = computed(() => this.state.vuosiluokkakokonaisuus);

  public async init() {
    const laajaAlaisetOsaamisetById = _.keyBy((await PerusopetuksenPerusteenSisalto.getOsaamiset(this.perusteId)).data, 'id');

    this.state.vuosiluokkakokonaisuus = (await PerusopetuksenPerusteenSisalto.getVuosiluokkaKokonaisuus(this.perusteId, this.vlkId)).data;
    this.state.vuosiluokkakokonaisuus = {
      ...this.state.vuosiluokkakokonaisuus,
      laajaalaisetOsaamiset: _.map(this.state.vuosiluokkakokonaisuus.laajaalaisetOsaamiset, lao => {
        return {
          ...lao,
          nimi: _.get(laajaAlaisetOsaamisetById[_.get(lao, '_laajaalainenOsaaminen')!], 'nimi'),
        };
      }),
    };
  }
}
