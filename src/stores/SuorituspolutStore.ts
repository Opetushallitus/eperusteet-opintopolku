import  { reactive, computed } from '@vue/composition-api';
import _ from 'lodash';
import { JulkinenApi, Perusteet, Sisaltoviitteet, Opetussuunnitelmat, OpetussuunnitelmaDto } from '@shared/api/amosaa';
import { SuorituspolkuRakenneDto } from '@shared/generated/amosaa';

export class SuorituspolutStore {
  private state = reactive({
    suorituspolut: null as any[] | null,
    suorituspolutRakenteella: null as SuorituspolkuRakenneDto[] | null,
    perusteenRakenteet: null as any[] | null,
  });

  constructor(private opetussuunnitelma: OpetussuunnitelmaDto) {
    this.fetch();
  }

  public readonly suorituspolut = computed(() => _.map(this.state.suorituspolut, suorituspolku => {
    return {
      ...suorituspolku,
      perusteenLaajuus: _.get(_.head(this.state.perusteenRakenteet), 'rakenne.muodostumisSaanto'),
    };
  }));
  public readonly suorituspolutRakenteella = computed(() => this.state.suorituspolutRakenteella);
  public readonly perusteenRakenteet = computed(() => this.state.perusteenRakenteet);

  public async fetch() {
    this.state.perusteenRakenteet = (await Perusteet.getPerusteRakenteet(this.opetussuunnitelma.peruste!.id!)).data as any[];
    this.state.suorituspolut = (await Sisaltoviitteet.getSuorituspolut(this.opetussuunnitelma.id!, _.toString(this.opetussuunnitelma.koulutustoimija!.id))).data;
    this.state.suorituspolutRakenteella = (await Sisaltoviitteet.getSuorituspolutRakenteella(this.opetussuunnitelma.id!, _.toString(this.opetussuunnitelma.koulutustoimija!.id))).data;
  }
}
