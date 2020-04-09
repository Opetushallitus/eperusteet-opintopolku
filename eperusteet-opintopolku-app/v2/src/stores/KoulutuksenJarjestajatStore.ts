import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import _ from 'lodash';
import { KoulutustoimijaJulkinenDto, JulkinenApi } from '@shared/api/amosaa';

Vue.use(VueCompositionApi);

export class KoulutuksenJarjestajatStore {
  private state = reactive({
    koulutustoimijat: null as KoulutustoimijaJulkinenDto[] | null,
  })

  public readonly koulutustoimijat = computed(() => this.state.koulutustoimijat);

  public async fetch() {
    const res = (await JulkinenApi.findKoulutustoimijat(
      0,
      9999)).data as any;
    this.state.koulutustoimijat = res.data;
  }
}
