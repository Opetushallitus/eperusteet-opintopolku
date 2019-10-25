import _ from 'lodash';
import { Store, State } from '@shared/stores/store';
import { Lops2019 } from '@shared/api/eperusteet';
import { Lops2019LaajaAlainenOsaaminenKokonaisuusDto } from '@shared/api/tyypit';
import { handleLabel, SidenavNode } from "@/utils/NavigationBuilder";

@Store
export class Lops2019LaajaAlaisetStore {
  @State() public perusteId: number;
  @State() public laajaAlaisetKokonaisuus: Lops2019LaajaAlainenOsaaminenKokonaisuusDto | null = null;

  private sidenavNodeBuilderFunction: ([SidenavNode]) => void = _.noop;

  public static async create(perusteId: number, sidenavNodeBuilderFunction) {
    const store = new Lops2019LaajaAlaisetStore(perusteId, sidenavNodeBuilderFunction);
    store.getLaajaAlaisetKokonaisuus();
    return store;
  }

  constructor(perusteId: number, sidenavNodeBuilderFunction) {
    this.perusteId = perusteId;
    this.sidenavNodeBuilderFunction = sidenavNodeBuilderFunction;
  }

  async getLaajaAlaisetKokonaisuus() {
    this.laajaAlaisetKokonaisuus = null;
    this.laajaAlaisetKokonaisuus = (await Lops2019.getLaajaAlainenOsaaminenKokonaisuus(this.perusteId)).data;
    this.sidenavNodeBuilderFunction([{
      type: 'laajaalaiset',
      label: handleLabel('laaja-alaiset-osaamiset'),
      path: [],
      location: {
        name: 'lops2019laajaalaiset',
      },
      children: [
        /*
        ..._.map(this.laajaAlaisetKokonaisuus.laajaAlaisetOsaamiset, lao => {
          return {
            type: 'laajaalaiset',
            label: handleLabel(lao.nimi),
            path: [],
            children: [],
          };
        })
        */
      ],
    }]);
  }
}
