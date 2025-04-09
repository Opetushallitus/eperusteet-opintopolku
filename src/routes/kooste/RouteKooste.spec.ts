import { mount, createLocalVue } from '@vue/test-utils';
import RouteKooste from './RouteKooste.vue';
import { createMockedStore, mock, mocks, stubs } from '@shared/utils/jestutils';
import * as _ from 'lodash';
import { OpasStore } from '@/stores/OpasStore';
import { IPaikallinenStore } from '@/stores/IPaikallinenStore';
import Paikalliset from '@/routes/kooste/Paikalliset.vue';
import JotpaPaikalliset from '@/routes/kooste/JotpaPaikalliset.vue';
import { KoosteTiedotteetStore } from '@/stores/KoosteTiedotteetStore';
import { IPerusteKoosteStore } from '@/stores/IPerusteKoosteStore';
import Vue, { computed } from 'vue';
import { vi } from 'vitest';
import { computedValue } from '@shared/utils/interfaces';

describe('RouteKooste', () => {
  const localVue = createLocalVue();
  const $route = {
    params: { lang: 'fi' },
  };

  const koosteTiedotteetStore = createMockedStore(KoosteTiedotteetStore, {
    tiedotteet: {
      value: [{
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
      }],
    },
    fetch: () => new Promise<void>(resolve => resolve()),
    fetchTiedotteet: () => new Promise<void>(resolve => resolve()),
  });

  test('Renders', async () => {
    const perusteKoosteStore: IPerusteKoosteStore = {
      koulutustyyppi: computedValue(() => 'koulutustyyppi_2'),
      perusteJulkaisut: computedValue(() => [{
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

    const OpasStore = vi.fn();
    OpasStore.prototype.oppaat = computed(() => [{
      nimi: {
        fi: 'ohje1',
      } as any,
      id: 1,
    }]);
    const opasStore = new OpasStore();

    // const opasStore = vi.fn();
    // opasStore.oppaat = computed(() => [{
    //   nimi: {
    //     fi: 'ohje1',
    //   } as any,
    //   id: 1,
    // }]);
    // const opasStore = createMockedStore(OpasStore, {
    //   oppaat: computed(() => [{
    //     nimi: {
    //       fi: 'ohje1',
    //     } as any,
    //   }] as any,
    //   ),
    //   fetch: async () => {},
    // });

    const paikallinenStore: IPaikallinenStore = {
      opetussuunnitelmatPaged: computedValue(() => ({
        data: [{
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
        }],
        sivu: 0,
        kokonaismäärä: 1,
      })),
      perusteId: computed(() => 0),
      fetchQuery: () => new Promise<void>(resolve => resolve()),
      addToCache: () => new Promise<void>(resolve => resolve()),
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

    await Vue.nextTick();
    await Vue.nextTick();

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
      opetussuunnitelmat: computedValue(() => opetussuunnitelmat),
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
