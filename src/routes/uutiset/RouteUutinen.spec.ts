import {mount} from '@vue/test-utils';
import RouteUutinen from './RouteUutinen.vue';
import {createPinia, setActivePinia} from 'pinia';
import {globalStubs} from '@shared/utils/__tests__/stubs';
import {nextTick} from 'vue';
import {createHead} from '@unhead/vue/client';
import {createRouter, createMemoryHistory } from 'vue-router';

describe('RouteUutinen', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('Renders spinners and data', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        {
          path: '/uutiset',
          name: 'uutiset',
          component: { template: '<div />' },
        },
        {
          path: '/uutinen/:tiedoteId',
          name: 'uutinen',
          component: RouteUutinen,
        },
      ],
    });

    await router.push({
      name: 'uutinen',
      params: { tiedoteId: '1' },
    });
    await router.isReady();

    const wrapper = mount(RouteUutinen as any, {
      global: {
        ...globalStubs,
        plugins: [createHead(), router],
      },
    });

    await nextTick();
    expect(wrapper.exists()).toBe(true);

    wrapper.unmount();
  });
});
