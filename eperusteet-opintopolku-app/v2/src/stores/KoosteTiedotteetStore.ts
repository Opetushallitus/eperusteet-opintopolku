import Vue from 'vue';
import VueCompositionApi, { reactive, computed, ref, watch } from '@vue/composition-api';
import { TiedoteDto } from '@shared/api/eperusteet';
import _ from 'lodash';
import { ryhmat } from '@shared/utils/perusteet';
import { tiedoteQuery } from '@/api/eperusteet';

Vue.use(VueCompositionApi);

export class KoosteTiedotteetStore {
  public state = reactive({
    tiedotteet: null as TiedoteDto[] | null,
  })

  constructor(private koulutustyyppi: string) {
  }

  public readonly tiedotteet = computed(() => this.state.tiedotteet);

  public async fetch(perusteJulkaisut?) {
    this.state.tiedotteet = null;
    let tiedotteet: TiedoteDto[] = [];

    if (perusteJulkaisut) {
      for (const julkaisu of perusteJulkaisut || []) {
        tiedotteet = [...tiedotteet,
          ...(await tiedoteQuery({
            sivukoko: 100,
            perusteId: julkaisu.id,
          })),
        ];
        tiedotteet = [...tiedotteet,
          ...(await tiedoteQuery({
            sivukoko: 100,
            perusteIds: _.map(perusteJulkaisut, julkaisu => julkaisu.id) as number[],
          })),
        ];
      }
    }

    tiedotteet = [...tiedotteet,
      ...(await tiedoteQuery({
        sivukoko: 100,
        koulutusTyyppi: ryhmat(this.koulutustyyppi),
      })),
    ];

    this.state.tiedotteet = _.chain(tiedotteet)
      .uniqBy('id')
      .filter('otsikko')
      .value();
  }
}
