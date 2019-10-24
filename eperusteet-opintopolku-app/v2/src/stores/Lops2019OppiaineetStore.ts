import _ from 'lodash';
import { Store, State } from '@shared/stores/store';
import { Lops2019 } from '@shared/api/eperusteet';
import { Lops2019OppiaineDto } from '@shared/api/tyypit';
import { handleLabel } from '@/utils/NavigationBuilder';

@Store
export class Lops2019OppiaineetStore {
  @State() public perusteId: number;
  @State() public oppiaineet: Array<Lops2019OppiaineDto> | null = null;

  private sidenavNodeBuilderFunction = _.noop;

  public static async create(perusteId: number, sidenavNodeBuilderFunction) {
    const store = new Lops2019OppiaineetStore(perusteId, sidenavNodeBuilderFunction);
    store.fetchOppiaineet();
    return store;
  }

  constructor(perusteId: number, sidenavNodeBuilderFunction) {
    this.perusteId = perusteId;
    this.sidenavNodeBuilderFunction = sidenavNodeBuilderFunction;
  }

  /**
   * Haetaan oppiaineet jos perusteId on muuttunut
   */
  async fetchOppiaineet() {
    this.oppiaineet = null;
    this.oppiaineet = (await Lops2019.getOppiaineet(this.perusteId)).data;
    this.sidenavNodeBuilderFunction([{
      type: 'oppiaineet',
      label: handleLabel('oppiaineet'),
      path: [],
      location: {
        name: 'lops2019oppiaineet',
      },
      children: [
        ..._.map(this.oppiaineet, oa => {
          return {
            type: 'oppiaine',
            label: handleLabel(oa.nimi),
            path: [],
            location: {
              name: 'lops2019oppiaine',
              params: {
                oppiaineId: oa.id,
              }
            },
            children: [

            ],
          };
        })
      ],
    }]);
  }

}
