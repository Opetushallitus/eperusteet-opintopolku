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

    propsData.murupolku = [{
      'to': { name: 'root' },
      label: 'parent jolla todella pitkä teksti',
    }];
    expect(wrapper.html()).toContain('parent jolla todella pitkä teksti');

    propsData.murupolku = [...propsData.murupolku, {
      'to': { name: 'root' },
      label: 'uusi alikappale',
    }];

    expect(wrapper.html()).toContain('parent jolla todella pitkä teksti');
    expect(wrapper.html()).toContain('uusi alikappale');
  });
});

