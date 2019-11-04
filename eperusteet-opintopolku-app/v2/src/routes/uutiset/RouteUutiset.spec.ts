import { mount, createLocalVue } from '@vue/test-utils';
import RouteUutiset from './RouteUutiset.vue';
import { tiedoteStoreMock } from '@/storeMocks';
import { mocks, stubs } from '@shared/utils/jestutils';
import { KieliStore } from '@shared/stores/kieli';

describe('RouteUutinen', () => {
  const localVue = createLocalVue();
  KieliStore.setup(localVue);

  test('Renders spinners and data', async () => {
    const tiedoteStore = tiedoteStoreMock();

    const wrapper = mount(RouteUutiset as any, {
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

