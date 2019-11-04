import { mount, createLocalVue } from '@vue/test-utils';
import RouteUutinen from './RouteUutinen.vue';
import { tiedoteStoreMock } from '@/storeMocks';
import { mocks, stubs } from '@shared/utils/jestutils';
import { KieliStore } from '@shared/stores/kieli';

describe('RouteHome', () => {
  const localVue = createLocalVue();
  KieliStore.setup(localVue);

  test('Renders spinners and data', async () => {
    const tiedoteStore = tiedoteStoreMock();

    const wrapper = mount(RouteUutinen as any, {
      localVue,
      propsData: {
        tiedoteStore,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
      },
    });

    await localVue.nextTick();
  });

});

