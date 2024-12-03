import Vue from 'vue';
import VueCompositionApi, { reactive, computed } from '@vue/composition-api';
import _ from 'lodash';
import { OpetussuunnitelmaJulkinenDto, OpetussuunnitelmatJulkiset } from '@shared/api/ylops';
import { IPaikallinenStore } from './IPaikallinenStore';
import { useOpetussuunnitelmaCacheStore } from '@/stores/OpetussuunnitelmaCacheStore';
import { Page } from '@shared/tyypit';
import { Debounced } from '@shared/utils/delay';
import { Kielet } from '@shared/stores/kieli';

Vue.use(VueCompositionApi);

export class YleissivistavatPaikallisetStore implements IPaikallinenStore {
  public state = reactive({
    opetussuunnitelmat: null as Page<OpetussuunnitelmaJulkinenDto> | null,
  });

  public readonly opetussuunnitelmatPaged = computed(() => this.state.opetussuunnitelmat);

  @Debounced()
  public async fetchQuery(query) {
    this.state.opetussuunnitelmat = null;
    this.state.opetussuunnitelmat = (await OpetussuunnitelmatJulkiset.getAllJulkaistutOpetussuunnitelmat(
      query.koulutustyypit,
      query.query,
      Kielet.getSisaltoKieli.value,
      query.peruste?.diaarinumero,
      query.page,
      10,
    )).data as any;
  }

  @Debounced(1000)
  public async addToCache(opetussuunnitelmaId) {
    useOpetussuunnitelmaCacheStore().addOpetussuunnitelmaStore(opetussuunnitelmaId);
  }
}
