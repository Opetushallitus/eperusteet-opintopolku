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
      if (!_.isInteger(perusteId)) {
        throw Error('error-peruste-id-invalid');
      }
      const result = new PerusteDataStore(perusteId);
      await result.init();
      await result.initSisalto();
      console.log('returning', result);
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
    } else {
      throw new Error('peruste-id-puuttuu');
    }
  }

  async initSisalto() {
    if (this.perusteId && this.peruste) {
      const suoritustavat = this.peruste.suoritustavat;
      console.log(suoritustavat);
      this.sisalto = null;
      // this.sisalto = (await Sisallot.getSuoritustapaSisaltoUUSI(this.perusteId, 'LUKIOKOULUTUS2019')).data;
    } else {
      throw new Error('peruste-id-tai-peruste-puuttuu');
    }
  }

}
