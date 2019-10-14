import { mount, createLocalVue } from '@vue/test-utils';
import RouteUutiset from './RouteUutiset.vue';
import { mocks, stubs, tiedoteStoreMock } from '@/jestutils';


describe('RouteHome', () => {
  const localVue = createLocalVue();

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
