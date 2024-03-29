import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import _ from 'lodash';
import { Aipeopetuksensisalto, AIPEVaiheDto } from '@shared/api/eperusteet';

Vue.use(VueCompositionApi);

export class AipeVaiheStore {
  private state = reactive({
    vaihe: null as AIPEVaiheDto | null,
  });

  public static async create(perusteId: number, vaiheId: number) {
    const result = new AipeVaiheStore(perusteId, vaiheId);
    await result.init();
    return result;
  }

  constructor(private perusteId: number, private vaiheId: number) {
  }

  public readonly vaihe = computed(() => this.state.vaihe);

  public async init() {
    this.state.vaihe = (await Aipeopetuksensisalto.getVaihe(this.perusteId, this.vaiheId)).data;
  }
}
