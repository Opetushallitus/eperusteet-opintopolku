import { mount, createLocalVue } from '@vue/test-utils';
import Root from './Root.vue';
import { mocks, stubs } from '@/jestutils';


describe('Root', () => {
  const localVue = createLocalVue();

  test('Renders', async () => {
    const wrapper = mount(Root as any, {
      localVue,
      stubs: {
        ...stubs,
        RouterView: true,
      },
      mocks: {
        ...mocks,
      },
    });

    await localVue.nextTick();
  });

});

