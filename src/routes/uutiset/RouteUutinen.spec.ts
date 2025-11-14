import { mount } from '@vue/test-utils';
import RouteUutinen from './RouteUutinen.vue';
import { tiedoteStoreMock } from '@/storeMocks';
import { mock, mocks, stubs } from '@shared/utils/jestutils';
import { createPinia, setActivePinia } from 'pinia';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { nextTick } from 'vue';
import { createHead } from '@unhead/vue/client';

describe('RouteHome', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('Renders spinners and data', async () => {
    const wrapper = mount(RouteUutinen as any, {
      global: {
        ...globalStubs,
        plugins: [createHead()],
      },
    });

    nextTick();
    expect(wrapper).toBeTruthy();
  });
});
