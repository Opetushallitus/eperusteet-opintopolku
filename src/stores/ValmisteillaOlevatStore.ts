import  { reactive, computed } from'vue';
import _ from 'lodash';
import { PerusteBaseDto, Perusteet } from '@shared/api/eperusteet';
import { Page } from '@shared/tyypit';

export class ValmisteillaOlevatStore {
  public state = reactive({
    perusteet: null as Page<PerusteBaseDto> | null,
  });

  public readonly perusteet = computed(() => this.state.perusteet);

  public async fetch(sivu, sivukoko, koulutustyypit) {
    this.state.perusteet = null;
    this.state.perusteet = (await Perusteet.getJulkaisuAikatauluPerusteet(sivu, sivukoko, koulutustyypit)).data as Page<PerusteBaseDto>;
  }
}
