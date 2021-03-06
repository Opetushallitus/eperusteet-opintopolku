import { mount, createLocalVue } from '@vue/test-utils';
import RouteKooste from './RouteKooste.vue';
import { tiedoteStoreMock, perusteKoosteStoreMock } from '@/storeMocks';
import { Kielet } from '@shared/stores/kieli';
import { mock, mocks, stubs } from '@shared/utils/jestutils';
import * as _ from 'lodash';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';
import { OpasStore } from '@/stores/OpasStore';
import { IPaikallinenStore } from '@/stores/IPaikallinenStore';
import { computed } from '@vue/composition-api';
import Paikalliset from '@/routes/kooste/Paikalliset.vue';

describe('RouteKooste', () => {
  const localVue = createLocalVue();
  // localVue.use(VueI18n);
  // Kielet.install(localVue, {
  //   messages: {
  //     fi: {
  //       'kooste': 'Kooste',
  //     },
  //   },
  // });
  // localVue.use(new Kaannos());

  const $route = {
    params: { lang: 'fi' },
  };

  test('Renders', async () => {
    const perusteKoosteStore = perusteKoosteStoreMock();

    const opasStore = mock(OpasStore);
    opasStore.state.oppaat = [{
      nimi: {
        fi: 'ohje1',
      } as any,
    }] as any;

    const paikallinenStore: IPaikallinenStore = {
      opetussuunnitelmat: computed(() => [{
        id: 100,
        nimi: {
          fi: 'ops100',
        } as any,
        organisaatiot: [{
          tyypit: ['Oppilaitos'],
          nimi: {
            fi: 'Oppilaitoksen nimi',
          } as any,
        }, {
          tyypit: ['Koulutustoimija'],
          nimi: {
            fi: 'Toimijan nimi',
          } as any,
        }],
      }]),
      perusteId: computed(() => 0),
      fetch: (id) => new Promise<void>(resolve => resolve()),
    };

    const wrapper = mount(RouteKooste as any, {
      localVue,
      propsData: {
        perusteKoosteStore,
        opasStore,
        paikallinenStore,
        paikallinenComponent: Paikalliset,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
        $sd: (x) => 'sd_' + x,
        $t: x => x,
        $kaannaOlioTaiTeksti: x => x,
        $route,
      },
    });

    perusteKoosteStore.koulutustyyppi = 'koulutustyyppi_2';

    perusteKoosteStore.tiedotteet = [{
      luotu: new Date(100),
      id: 100,
      otsikko: {
        fi: 'tiedote101',
      } as any,
    }, {
      luotu: new Date(200),
      id: 200,
      otsikko: {
        fi: 'tiedote102',
      } as any,
    }];

    perusteKoosteStore.perusteet = [{
      id: 42,
      nimi: {
        fi: 'peruste42',
      } as any,
      diaarinumero: '1234-1234',
      toteutus: 'yksinkertainen',
      voimassaoloAlkaa: 123456,
    }] as any;

    await localVue.nextTick();
    expect(_.map((wrapper.vm as any).tiedotteet, 'id')).toEqual([200, 100]);
    expect(wrapper.html()).toContain('ops100');
    expect(wrapper.html()).toContain('tiedote101');
    expect(wrapper.html()).toContain('tiedote102');
    expect(wrapper.html()).toContain('peruste42');
    expect(wrapper.html()).toContain('sd_123456');
    expect(wrapper.html()).toContain('peruste42');
    expect(wrapper.html()).toContain('Oppilaitoksen nimi');
    expect(wrapper.html()).toContain('Toimijan nimi');
    expect(wrapper.html()).toContain('ohje1');
  });
});
