import  { reactive, computed } from'vue';
import { TiedoteDto } from '@shared/api/eperusteet';
import _ from 'lodash';
import { ryhmat } from '@shared/utils/perusteet';
import { tiedoteQuery } from '@/api/eperusteet';

export class KieliKaantajaTutkintoTiedotteetStore {
  public state = reactive({
    tiedotteet: null as TiedoteDto[] | null,
  });

  public readonly tiedotteet = computed(() => this.state.tiedotteet);

  public async fetch(perusteJulkaisut?) {
    this.state.tiedotteet = null;
    let tiedotteet: TiedoteDto[] = [];

    if (perusteJulkaisut) {
      tiedotteet = [...tiedotteet,
        ...(await tiedoteQuery({
          sivukoko: 100,
          perusteIds: _.map(perusteJulkaisut, julkaisu => julkaisu.id) as number[],
        })),
      ];
    }

    this.state.tiedotteet = _.chain(tiedotteet)
      .uniqBy('id')
      .filter('otsikko')
      .value();
  }
}
