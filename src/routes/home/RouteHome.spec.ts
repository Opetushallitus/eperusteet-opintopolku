import '@/test/testInit';
import { mount } from '@vue/test-utils';
import RouteHome from './RouteHome.vue';
import { createMockedStore, mock, mocks, stubs } from '@shared/utils/jestutils';
import { createPinia, setActivePinia } from 'pinia';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { nextTick } from 'vue';
import { useJulkaistutKoulutustyypitStore } from '@/stores/JulkaistutKoulutustyypitStore';
import { useTietoapalvelustaStore } from '@/stores/TietoapalvelustaStore';
import { useOsaamismerkitStore } from '@/stores/OsaamismerkitStore';
import { useTiedoteStore } from '@/stores/TiedoteStore';
import { createHead } from '@unhead/vue/client';
import { vi } from 'vitest';

// Mock the store methods before using vi.mocked()
vi.mock('@/stores/OsaamismerkitStore', () => ({
  useOsaamismerkitStore: () => ({
    fetchKategoriat: vi.fn(),
    kategoriat: [],
  }),
}));

vi.mock('@/stores/TiedoteStore', () => ({
  useTiedoteStore: () => ({
    getUusimmat: vi.fn(),
    uusimmatTiedotteet: [{
      luotu: 'aikaleima_1234' as any,
      otsikko: {
        fi: 'uutinen_1234',
      } as any,
    }],
  }),
}));

vi.mock('@/stores/JulkaistutKoulutustyypitStore', () => ({
  useJulkaistutKoulutustyypitStore: () => ({
    koulutustyyppiLukumaarat: [],
    muuLukumaarat: 0,
    digitaalinenOsaaminen: [],
    julkaistutKoulutustyypit: [],
    fetch: vi.fn(),
  }),
}));

describe('RouteHome', () => {

  const $route = {
    params: {
      lang: 'fi',
    },
  };

  const pinia = createPinia();
  setActivePinia(pinia);

  test('Renders spinners and data', async () => {

    const wrapper = mount(RouteHome as any, {
      global: {
        ...globalStubs,
      },
    });

    nextTick();

    const julkaistutKoulutustyypitStore = useJulkaistutKoulutustyypitStore(pinia);
    const tietoapalvelustaStore = useTietoapalvelustaStore(pinia);
    const osaamismerkitStore = useOsaamismerkitStore(pinia);
    const tiedoteStore = useTiedoteStore(pinia);

    await nextTick();

    expect(wrapper.findAll('.oph-spinner').length).toEqual(0);
  });
});
