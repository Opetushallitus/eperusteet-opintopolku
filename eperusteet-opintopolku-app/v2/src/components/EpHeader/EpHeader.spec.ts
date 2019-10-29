import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import EpHeader from './EpHeader.vue';
import { mocks, stubs, tiedoteStoreMock, perusteKoosteStoreMock } from '@/jestutils';
import { KieliStore } from '@shared/stores/kieli';


describe('EpHeader', () => {
  const localVue = createLocalVue();
  KieliStore.setup(localVue);

  test('Renders spinners and data', async () => {
    const propsData = Vue.observable({
      murupolku: [] as any[],
      koulutustyyppi: undefined,
    });

    const wrapper = mount(EpHeader as any, {
      localVue,
      propsData,
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
      },
    });

    expect(wrapper.html()).toContain('eperusteet');

    propsData.murupolku = [{
      label: 'parent jolla todella pitkä teksti',
      location: { name: 'root' },
    }];
    expect(wrapper.html()).toContain('eperusteet');
    expect(wrapper.html()).toContain('parent jolla todella pitkä teksti');

    propsData.murupolku = [
      ...propsData.murupolku,
      {
        label: 'uusi alikappale',
        location: { name: 'root' },
      }
    ];

    expect(wrapper.html()).toContain('eperusteet');
    expect(wrapper.html()).toContain('parent jolla todella pitkä teksti');
    expect(wrapper.html()).toContain('uusi alikappale');
  });
});
