import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import { PerusteQuery, MaaraysDto, Maaraykset } from '@shared/api/eperusteet';
import _ from 'lodash';

Vue.use(VueCompositionApi);

export class MaarayksetStore {
  public state = reactive({
    maaraykset: null as MaaraysDto[] | null,
  })

  constructor() {
    this.fetch();
  }

  public readonly maaraykset = computed(() => this.state.maaraykset);

  public async fetch() {
    this.state.maaraykset = (await Maaraykset.getMaaraykset()).data;
  }
}
