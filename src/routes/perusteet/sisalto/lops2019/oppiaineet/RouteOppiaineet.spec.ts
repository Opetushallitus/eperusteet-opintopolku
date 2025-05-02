import { mount } from '@vue/test-utils';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import RouteOppiaineet from './RouteOppiaineet.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';

// Mock the module that provides getCachedPerusteStore
vi.mock('@/stores/PerusteCacheStore', () => ({
  getCachedPerusteStore: vi.fn(),
}));

// Import the mocked function after mocking
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';

describe('RouteOppiaineet', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Renders', async () => {
    // Create the mock store
    const perusteDataStore = {
      current: {
        children: [
          {
            label: {
              fi: 'Matematiikka',
            },
            location: '/matematiikka',
          },
          {
            label: {
              fi: 'Äidinkieli ja kirjallisuus',
            },
            location: '/aidinkieli',
          },
        ],
      } as any,
    };

    // Make getCachedPerusteStore return our mock
    (getCachedPerusteStore as any).mockReturnValue(perusteDataStore);

    const wrapper = mount(RouteOppiaineet as any, {
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toContain('Matematiikka');
    expect(wrapper.html()).toContain('Äidinkieli ja kirjallisuus');
  });
});
