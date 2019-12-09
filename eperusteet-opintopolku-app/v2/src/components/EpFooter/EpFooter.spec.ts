import { mount, createLocalVue } from '@vue/test-utils';
import EpFooter from './EpFooter.vue';
import { KieliStore } from '@shared/stores/kieli';
import { mocks, stubs } from '@shared/utils/jestutils';


describe('EpFooter', () => {
  const localVue = createLocalVue();
  KieliStore.setup(localVue);

  test('Renders', async () => {
    const wrapper = mount(EpFooter as any, {
      localVue,
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
      },
    });

    await localVue.nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
