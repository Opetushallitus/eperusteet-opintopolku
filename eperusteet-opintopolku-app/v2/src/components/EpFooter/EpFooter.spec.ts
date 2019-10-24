import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import EpFooter from './EpFooter.vue';
import { mocks, stubs, tiedoteStoreMock, perusteKoosteStoreMock } from '@/jestutils';
import { Kielet, KieliStore } from '@shared/stores/kieli';
import { Kieli } from '@shared/tyypit';


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
