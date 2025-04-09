import Vue, { computed, reactive } from 'vue';
import _ from 'lodash';
import { Sisaltoviitteet, SisaltoViiteDto } from '@shared/api/amosaa';

export class KoulutuksenOsatStore {
  public state = reactive({
    koulutuksenosat: [] as SisaltoViiteDto[] | null,
  });

  public readonly koulutuksenosat = computed(() => this.state.koulutuksenosat);

  async fetch(opsId, ktId) {
    this.state.koulutuksenosat = null;
    this.state.koulutuksenosat = (await Sisaltoviitteet.getSisaltoviitteeTyypilla(opsId, 'koulutuksenosa', ktId)).data;
  }
}
