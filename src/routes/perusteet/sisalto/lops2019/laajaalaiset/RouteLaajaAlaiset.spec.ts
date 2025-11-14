import { mount } from '@vue/test-utils';
import RouteLaajaAlaiset from './RouteLaajaAlaiset.vue';
import { mocks, stubs } from '@shared/utils/jestutils';
import { Kielet } from '@shared/stores/kieli';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { vi } from 'vitest';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';

vi.mock('@/stores/PerusteCacheStore', () => ({
  getCachedPerusteStore: vi.fn(),
}));

describe('RouteLaajaAlaiset', () => {
  test('Renders', async () => {

    const perusteDataStore = {
      getJulkaistuPerusteSisalto: () => {
        return {
          laajaAlaisetOsaamiset: [
            {
              nimi: {
                fi: 'Hyvinvointiosaaminen',
              } as any,
              koodi: {
                arvo: '01',
              },
              kuvaus: {
                fi: 'Hyvinvointiosaaminen kuvaus',
              } as any,
            },
            {
              nimi: {
                fi: 'Vuorovaikutusosaaminen',
              } as any,
              koodi: {
                arvo: '02',
              },
              kuvaus: {
                fi: 'Vuorovaikutusosaaminen kuvaus',
              } as any,
            },
          ],
        };
      },
    };

    (getCachedPerusteStore as any).mockReturnValue(perusteDataStore);

    const wrapper = mount(RouteLaajaAlaiset as any, {
      propsData: {
        perusteDataStore,
      },
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toContain('Hyvinvointiosaaminen');
    expect(wrapper.html()).toContain('01');
    expect(wrapper.html()).toContain('Hyvinvointiosaaminen kuvaus');

    expect(wrapper.html()).toContain('Vuorovaikutusosaaminen');
    expect(wrapper.html()).toContain('02');
    expect(wrapper.html()).toContain('Vuorovaikutusosaaminen kuvaus');
  });
});
