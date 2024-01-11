import { Store, State } from '@shared/stores/store';
import { KoodistoKoodiDto, Lops2019PaikallinenOppiaineDto, Opetussuunnitelmat, Lops2019Oppiaineet, Lops2019Perusteet, Lops2019OppiaineKaikkiDto } from '@shared/api/ylops';

import { KoodistoLops2019LaajaAlaiset } from '@shared/utils/perusteet';

@Store
export class Lops2019OpetussuunnitelmaPoppiaineStore {
  @State() public opsId: number;
  @State() public oppiaineId: number;
  @State() public oppiaine: Lops2019PaikallinenOppiaineDto | null = null;
  @State() public koodit: KoodistoKoodiDto[] = [];
  @State() public perusteenOppiaine: Lops2019OppiaineKaikkiDto | null = null;

  public static async create(opsId: number, oppiaineId: number) {
    const store = new Lops2019OpetussuunnitelmaPoppiaineStore(opsId, oppiaineId);
    store.fetchPoppiaine();
    return store;
  }

  constructor(opsId: number, oppiaineId: number) {
    this.opsId = opsId;
    this.oppiaineId = oppiaineId;
  }

  async fetchPoppiaine() {
    this.oppiaine = null;
    this.koodit = [];
    this.oppiaine = (await Lops2019Oppiaineet.getLops2019PaikallinenOppiaine(this.opsId, this.oppiaineId)).data;
    this.koodit = (await Opetussuunnitelmat.getKoodistonKoodit(this.opsId, KoodistoLops2019LaajaAlaiset)).data;
    if (this.oppiaine.perusteenOppiaineUri) {
      this.perusteenOppiaine = (await Lops2019Perusteet.getAllLops2019PerusteOppiaine(this.opsId, this.oppiaine.perusteenOppiaineUri)).data;
    }
  }
}
