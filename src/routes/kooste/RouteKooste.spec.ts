import '@/test/testInit';
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
import { createMount } from '@shared/utils/__tests__/stubs';
import { nextTick } from 'vue';
import { getCachedPerusteStore, usePerusteCacheStore } from '@/stores/PerusteCacheStore';
import { getKoosteOpasStore, getKoostePaikallinenComponent, getKoostePaikallinenStore, getKoostePerusteStore, getKoosteTiedotteetStore } from '@/utils/toteutustypes';
import { useRoute } from 'vue-router';

vi.mocked(useRoute).mockReturnValue({ params: {
  koulutustyyppi: 'koulutustyyppi_2',
} } as any);

vi.mock('@/utils/toteutustypes', () => ({
  getKoostePerusteStore: vi.fn(),
  getKoosteOpasStore: vi.fn(),
  getKoosteTiedotteetStore: vi.fn(),
  getKoostePaikallinenStore: vi.fn(),
  getKoostePaikallinenComponent: vi.fn(),
  getKoosteKuvaus: () => null,
  getKoosteSubheader: vi.fn(() => 'tile-perusteet'),
  getKoostePerusteHeader: vi.fn(() => 'tile-perusteet'),
}));

describe('RouteKooste', () => {

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

  (getCachedPerusteStore as any).mockReturnValue({});
  (usePerusteCacheStore as any).mockReturnValue({});

  test('Renders', async () => {
    const perusteKoosteStore: IPerusteKoosteStore = {
      koulutustyyppi: computed(() => ('koulutustyyppi_2')),
      perusteJulkaisut: computed(() => ([{
        nimi: {
          fi: 'peruste42',
        } as any,
        peruste: {
          diaarinumero: '1234-1234',
          id: 42,
        },
        voimassaoloAlkaa: 123456,
      }])),
      fetch: () => new Promise<void>(resolve => resolve()),
      perusteJarjestykset: computed(() => []),
    };

    (getKoostePerusteStore as any).mockReturnValue(perusteKoosteStore);

    const OpasStore = vi.fn();
    OpasStore.prototype.oppaat = computed(() => [{
      nimi: {
        fi: 'ohje1',
      } as any,
      id: 1,
    }]);
    const opasStore = new OpasStore();

    const paikallinenStore: IPaikallinenStore = {
      opetussuunnitelmatPaged: computed(() => ({
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

    (getKoostePaikallinenStore as any).mockReturnValue(paikallinenStore);
    (getKoostePaikallinenComponent as any).mockReturnValue(Paikalliset);
    (getKoosteOpasStore as any).mockReturnValue(opasStore);
    (getKoosteTiedotteetStore as any).mockReturnValue(koosteTiedotteetStore);

    const wrapper = createMount(RouteKooste as any);

    await nextTick();

    expect(_.map((wrapper.vm as any).tiedotteet, 'id')).toEqual([200, 100]);
    expect(wrapper.html()).toContain('peruste42');
    expect(wrapper.html()).toContain('ops100');
    expect(wrapper.html()).toContain('tiedote101');
    expect(wrapper.html()).toContain('tiedote102');
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
      opetussuunnitelmat: computed(() => (opetussuunnitelmat)),
      opetussuunnitelmatPaged: computed(() => ({
        data: opetussuunnitelmat,
        sivu: 0,
        kokonaismäärä: 1,
      })),
      fetch: (id) => new Promise<void>(resolve => resolve()),
      fetchQuery: (query) => new Promise<void>(resolve => resolve()),
    };

    (getKoostePerusteStore as any).mockReturnValue(null);
    (getKoostePaikallinenStore as any).mockReturnValue(paikallinenStore);
    (getKoostePaikallinenComponent as any).mockReturnValue(JotpaPaikalliset);
    (getKoosteTiedotteetStore as any).mockReturnValue(koosteTiedotteetStore);



    const wrapper = createMount(RouteKooste as any);

    nextTick();

    expect(wrapper.html()).not.toContain(' perusteet ');
    expect(wrapper.html()).toContain('ajankohtaista');
    expect(wrapper.html()).toContain('ohjeet-ja-materiaalit');

    expect(wrapper.html()).toContain('ops100');
    expect(wrapper.html()).toContain('Toimijan nimi');
    expect(wrapper.html()).toContain('tiedote101');
    expect(wrapper.html()).toContain('tiedote102');
  });
});
