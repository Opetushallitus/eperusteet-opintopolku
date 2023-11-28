import { mount, createLocalVue } from '@vue/test-utils';
import RouteKooste from './RouteKooste.vue';
import { mock, mocks, stubs } from '@shared/utils/jestutils';
import * as _ from 'lodash';
import { OpasStore } from '@/stores/OpasStore';
import { IPaikallinenStore } from '@/stores/IPaikallinenStore';
import { computed } from '@vue/composition-api';
import Paikalliset from '@/routes/kooste/Paikalliset.vue';
import JotpaPaikalliset from '@/routes/kooste/JotpaPaikalliset.vue';
import { KoosteTiedotteetStore } from '@/stores/KoosteTiedotteetStore';
import { IPerusteKoosteStore } from '@/stores/IPerusteKoosteStore';

describe('RouteKooste', () => {
  const localVue = createLocalVue();
  const $route = {
    params: { lang: 'fi' },
  };

  const koosteTiedotteetStore = mock(KoosteTiedotteetStore);
  koosteTiedotteetStore.state.tiedotteet = [{
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

  test('Renders', async () => {
    const perusteKoosteStore: IPerusteKoosteStore = {
      koulutustyyppi: computed(() => 'koulutustyyppi_2'),
      perusteJulkaisut: computed(() => [{
        nimi: {
          fi: 'peruste42',
        } as any,
        peruste: {
          diaarinumero: '1234-1234',
          id: 42,
        },
        voimassaoloAlkaa: 123456,
      }]),
      fetch: () => new Promise<void>(resolve => resolve()),
    };

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
        tiedotteetStore: koosteTiedotteetStore,
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

  test('Test without perusteet', async () => {
    const opetussuunnitelmat = [{
      id: 100,
      nimi: {
        fi: 'ops100',
      } as any,
      koulutustoimija: {
        nimi: {
          fi: 'Toimijan nimi',
        } as any,
      },
    }];
    const paikallinenStore: IPaikallinenStore = {
      opetussuunnitelmat: computed(() => opetussuunnitelmat),
      opetussuunnitelmatPaged: computed(() => ({
        data: opetussuunnitelmat,
        sivu: 0,
        kokonaismäärä: 1,
      })),
      fetch: (id) => new Promise<void>(resolve => resolve()),
      fetchQuery: (query) => new Promise<void>(resolve => resolve()),
    };

    const wrapper = mount(RouteKooste as any, {
      localVue,
      propsData: {
        paikallinenStore,
        paikallinenComponent: JotpaPaikalliset,
        tiedotteetStore: koosteTiedotteetStore,
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

    await localVue.nextTick();
    expect(wrapper.html()).not.toContain(' perusteet ');
    expect(wrapper.html()).toContain('ajankohtaista');
    expect(wrapper.html()).toContain('ohjeet-ja-materiaalit');

    expect(wrapper.html()).toContain('ops100');
    expect(wrapper.html()).toContain('Toimijan nimi');
    expect(wrapper.html()).toContain('tiedote101');
    expect(wrapper.html()).toContain('tiedote102');
  });
});
