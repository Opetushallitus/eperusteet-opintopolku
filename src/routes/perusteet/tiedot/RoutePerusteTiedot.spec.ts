import { mount } from '@vue/test-utils';
import RoutePerusteTiedot from './RoutePerusteTiedot.vue';
import { mocks, stubs } from '@shared/utils/jestutils';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { nextTick } from 'vue';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import { vi } from 'vitest';

vi.mock('@/stores/PerusteCacheStore', () => ({
  getCachedPerusteStore: vi.fn(),
}));

// Import the mocked function after mocking

describe('RoutePerusteTiedot', () => {

  test('Renders', async () => {
    const perusteDataStore = {
      peruste: {
        id: 42,
        nimi: {
          fi: 'perusteen nimi',
        } as any,
      },
      perusteId: 42,
      maarays: {
        id: 1,
        nimi: {
          fi: 'maarays X',
        } as any,
      },
    };

    perusteDataStore.kvLiitteet = { fi: 'kvliiteurl-fi' };

    (getCachedPerusteStore as any).mockReturnValue(perusteDataStore);

    const wrapper = mount(RoutePerusteTiedot as any, {
      propsData: {
        perusteDataStore,
      },
      global: {
        ...globalStubs,
      },
    });

    nextTick();

    expect(wrapper.html()).toContain('perusteen nimi');
    expect(wrapper.html()).toContain('maarays X');
    expect(wrapper.html()).toContain('kvliiteurl-fi');
    expect(wrapper.html()).toContain('lataa-kvliite-fi');
  });
});
