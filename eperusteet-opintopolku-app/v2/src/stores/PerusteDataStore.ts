import { Store, State } from '@shared/stores/store';
import { PerusteenOsaViiteDtoObject, PerusteDto } from '@shared/api/tyypit';
import { Perusteet, Sisallot } from '@shared/api/eperusteet';


@Store
export class PerusteDataStore {
  @State() public peruste: PerusteDto | null = null;
  @State() public perusteId: number | null = null;
  @State() public sisalto: PerusteenOsaViiteDtoObject | null = null;
  @State() public suoritustapa: string | null = null;

  constructor(perusteId?: number) {
    this.perusteId = perusteId || null;
  }

  async init() {
    if (this.perusteId) {
      this.peruste = (await Perusteet.getPerusteenTiedot(this.perusteId)).data;
    } else {
      throw new Error('peruste-id-puuttuu');
    }
  }

  async initSisalto() {
    if (this.perusteId && this.peruste) {
      const suoritustavat = this.peruste.suoritustavat;
      console.log(suoritustavat);
      this.sisalto = (await Sisallot.getSuoritustapaSisaltoUUSI(this.perusteId, 'LUKIOKOULUTUS2019')).data;
    } else {
      throw new Error('peruste-id-tai-peruste-puuttuu');
    }
  }
}
