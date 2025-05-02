import { mount } from '@vue/test-utils';
import RouteUutiset from './RouteUutiset.vue';
import { createPinia, setActivePinia } from 'pinia';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { nextTick } from 'vue';
import { createHead } from '@unhead/vue/client';

describe('RouteUutinen', () => {

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('Renders spinners and data', async () => {
    const wrapper = mount(RouteUutiset as any, {
      global: {
        ...globalStubs,
        plugins: [createHead()],
      },
    });

    nextTick();
    expect(wrapper).toBeTruthy();
  });
});
