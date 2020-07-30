import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import { PerusopetuksenPerusteenSisalto, OppiaineDto } from '@shared/api/eperusteet';
import _ from 'lodash';

Vue.use(VueCompositionApi);

export class PerusopetusOppiaineStore {
  public state = reactive({
    oppiaine: null as OppiaineDto | null,
  })

  public static async create(perusteId: number, oppiaineId: number) {
    const result = new PerusopetusOppiaineStore(perusteId, oppiaineId);
    await result.init();
    return result;
  }

  constructor(private perusteId: number, private oppiaineId: number) {
  }

  public readonly oppiaine = computed(() => this.state.oppiaine);

  public async init() {
    const vuosiluokkakokonaisuudetById = _.keyBy((await PerusopetuksenPerusteenSisalto.getVuosiluokkaKokonaisuudet(this.perusteId)).data, 'id');

    this.state.oppiaine = (await PerusopetuksenPerusteenSisalto.getPerusopetusOppiaine(this.perusteId, this.oppiaineId)).data;
    this.state.oppiaine = {
      ...this.state.oppiaine,
      vuosiluokkakokonaisuudet: _.chain(this.state.oppiaine.vuosiluokkakokonaisuudet)
        .map(vlk => {
          return {
            ...vlk,
            nimi: _.get(vuosiluokkakokonaisuudetById[_.get(vlk, '_vuosiluokkaKokonaisuus')], 'nimi'),
            vuosiluokat: _.get(vuosiluokkakokonaisuudetById[_.get(vlk, '_vuosiluokkaKokonaisuus')], 'vuosiluokat'),
          };
        })
        .sortBy('vuosiluokat')
        .value(),
    };
  }
}
