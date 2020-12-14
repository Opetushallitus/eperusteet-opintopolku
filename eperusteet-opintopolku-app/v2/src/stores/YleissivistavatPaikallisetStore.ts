import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import { PerusopetuksenPerusteenSisalto, OppiaineDto } from '@shared/api/eperusteet';
import _ from 'lodash';
import { OpetussuunnitelmaJulkinenDto, OpetussuunnitelmatJulkiset } from '@shared/api/ylops';
import { IPaikallinenStore } from './IPaikallinenStore';

Vue.use(VueCompositionApi);

export class YleissivistavatPaikallisetStore implements IPaikallinenStore {
  public state = reactive({
    opetussuunnitelmat: null as OpetussuunnitelmaJulkinenDto[] | null,
    perusteId: null as number | null,
  })

  public readonly opetussuunnitelmat = computed(() => this.state.opetussuunnitelmat);
  public readonly perusteId = computed(() => this.state.perusteId);

  public async fetch(perusteId?: number) {
    this.state.perusteId = perusteId!;
    this.state.opetussuunnitelmat = null;
    this.state.opetussuunnitelmat = (await OpetussuunnitelmatJulkiset.getAllJulkiset(
      undefined,
      undefined,
      undefined,
      _.toString(perusteId)
    )).data;
  }
}
