import { Store, State } from '@shared/stores/store';
import { Matala, PerusteDto } from '@shared/api/tyypit';
import { Perusteet, Sisallot } from '@shared/api/eperusteet';
import _ from 'lodash';


@Store
export class PerusteDataStore {
  @State() public peruste: PerusteDto | null = null;
  @State() public perusteId: number | null = null;
  @State() public sisalto: Matala | null = null;
  @State() public suoritustapa: string | null = null;

  public static readonly create = _.memoize(async (perusteId: number) => {
    try {
      const result = new PerusteDataStore(perusteId);
      await result.init();
      await result.initSisalto();
      return result;
    }
    catch (err) {
      console.error(err);
    }
  });

  constructor(perusteId: number) {
    this.perusteId = perusteId;
  }

  async init() {
    if (this.perusteId) {
      this.peruste = (await Perusteet.getPerusteenTiedot(this.perusteId)).data;
    }
    else {
      throw new Error('peruste-id-puuttuu');
    }
  }

  async initSisalto() {
    if (this.perusteId && this.peruste) {
      // Todo: erikoisammattitutkinto vaatii oikean suoritustapakoodin
      this.sisalto = (await Sisallot.getSuoritustapaSisaltoUUSI(this.perusteId, 'LUKIOKOULUTUS2019')).data;
    }
    else {
      throw new Error('peruste-id-tai-peruste-puuttuu');
    }
  }

}
