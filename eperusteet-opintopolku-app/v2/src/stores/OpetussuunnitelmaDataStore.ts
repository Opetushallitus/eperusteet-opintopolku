import _ from 'lodash';
import { Store, State } from '@shared/stores/store';
import { Location } from 'vue-router';
import { OpetussuunnitelmaKevytDto } from '@shared/api/tyypit';
import { baseURL, Opetussuunnitelmat, Dokumentit, DokumentitParam } from '@shared/api/ylops';
import { Kielet } from '@shared/stores/kieli';


@Store
export class OpetussuunnitelmaDataStore {
  @State() public opetussuunnitelma: OpetussuunnitelmaKevytDto | null = null;
  @State() public opetussuunnitelmaId: number;
  @State() public dokumentit: any = {};
  @State() public currentRoute: Location | null = null;

  public static async create(opetussuunnitelmaId: number) {
    const result = new OpetussuunnitelmaDataStore(opetussuunnitelmaId);
    await result.init();
    return result;
  }

  constructor(opetussuunnitelmaId: number) {
    this.opetussuunnitelmaId = opetussuunnitelmaId;
  }

  // Fixme: ota huomioon kielen vaihtaminen
  public async getDokumentit() {
    if (!this.opetussuunnitelma) {
      return;
    }
    const sisaltoKieli = Kielet.getSisaltoKieli;
    const dokumenttiId = (await Dokumentit.getDokumenttiId(this.opetussuunnitelmaId, sisaltoKieli)).data;
    if (dokumenttiId) {
      this.dokumentit[sisaltoKieli] = baseURL + DokumentitParam.get(_.toString(dokumenttiId)).url;
    }
  }

  public async updateRoute(route) {
    this.currentRoute = route;
  }

  private async init() {
    this.opetussuunnitelma = (await Opetussuunnitelmat.getOpetussuunnitelma(this.opetussuunnitelmaId)).data;
  }

}
