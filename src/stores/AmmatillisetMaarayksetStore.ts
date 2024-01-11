import Vue from 'vue';
import VueCompositionApi, { reactive, computed } from '@vue/composition-api';
import { MaaraysDto, MuutMaaraykset } from '@shared/api/eperusteet';
import _ from 'lodash';

Vue.use(VueCompositionApi);

export class AmmatillisetMaarayksetStore {
  public state = reactive({
    maaraykset: null as MaaraysDto[] | null,
  })

  constructor() {
    this.fetch();
  }

  public readonly maaraykset = computed(() => this.state.maaraykset);

  public async fetch() {
    this.state.maaraykset = (await MuutMaaraykset.getMuutMaaraykset()).data;
  }
}
