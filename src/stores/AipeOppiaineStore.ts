import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import _ from 'lodash';
import { Aipeopetuksensisalto, AIPEOppiaineDto, AIPEOppiaineSuppeaDto, LaajaalainenOsaaminenDto } from '@shared/api/eperusteet';

Vue.use(VueCompositionApi);

export class AipeOppiaineStore {
  private state = reactive({
    oppiaine: null as AIPEOppiaineDto | null,
    oppimaarat: null as AIPEOppiaineSuppeaDto[] | null,
    laajaAlaisetOsaamiset: null as LaajaalainenOsaaminenDto[] | null,
  })

  public static async create(perusteId: number, vaiheId: number, oppiaineId: number) {
    const result = new AipeOppiaineStore(perusteId, vaiheId, oppiaineId);
    await result.init();
    return result;
  }

  constructor(private perusteId: number, private vaiheId: number, private oppiaineId: number) {
  }

  public readonly oppiaine = computed(() => this.state.oppiaine);
  public readonly oppimaarat = computed(() => this.state.oppimaarat);
  public readonly laajaAlaisetOsaamiset = computed(() => this.state.laajaAlaisetOsaamiset);

  public async init() {
    this.state.oppiaine = (await Aipeopetuksensisalto.getAipeOppiaine(this.perusteId, this.vaiheId, this.oppiaineId)).data;
    this.state.oppimaarat = (await Aipeopetuksensisalto.getAipeOppimaarat(this.perusteId, this.vaiheId, this.oppiaineId)).data;
    this.state.laajaAlaisetOsaamiset = (await Aipeopetuksensisalto.getAipeOsaamiset(this.perusteId)).data;
  }
}
