import  { reactive, computed } from'vue';
import _ from 'lodash';
import { Aipeopetuksensisalto, AIPEOppiaineDto, AIPEKurssiDto } from '@shared/api/eperusteet';

export class AipeKurssiStore {
  private state = reactive({
    oppiaine: null as AIPEOppiaineDto | null,
    kurssi: null as AIPEKurssiDto | null,
  });

  public static async create(perusteId: number, vaiheId: number, oppiaineId: number, kurssiId: number) {
    const result = new AipeKurssiStore(perusteId, vaiheId, oppiaineId, kurssiId);
    await result.init();
    return result;
  }

  constructor(private perusteId: number, private vaiheId: number, private oppiaineId: number, private kurssiId: number) {
  }

  public readonly kurssi = computed(() => this.state.kurssi);
  public readonly oppiaine = computed(() => this.state.oppiaine);

  public async init() {
    this.state.kurssi = (await Aipeopetuksensisalto.getAipeKurssi(this.perusteId, this.vaiheId, this.oppiaineId, this.kurssiId)).data;
    this.state.oppiaine = (await Aipeopetuksensisalto.getAipeOppiaine(this.perusteId, this.vaiheId, this.oppiaineId)).data;
  }
}
