import { mount, createLocalVue } from '@vue/test-utils';
import Vue from 'vue';
import EpHeader from './EpHeader.vue';
import { Kielet } from '@shared/stores/kieli';
import { mocks, stubs } from '@shared/utils/jestutils';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';

describe('EpHeader', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue, {
    messages: {
      fi: {
        'parent-jolla-todella-pitka-teksti': 'Parent jolla todella pitkä teksti',
        'uusi-alikappale': 'Uusi alikappale',
      },
    },
  });
  localVue.use(new Kaannos());

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

    expect(wrapper.html()).toContain('home');

    propsData.murupolku = [{
      label: 'parent-jolla-todella-pitka-teksti',
      location: { name: 'root' },
    }];

    wrapper.setProps({ murupolku: [{
      label: 'parent-jolla-todella-pitka-teksti',
      location: { name: 'root' },
    }] });

    await Vue.nextTick();

    expect(wrapper.html()).toContain('home');
    expect(wrapper.html()).toContain('Parent jolla todella pitkä teksti');

    wrapper.setProps({ murupolku: [
      ...propsData.murupolku,
      {
        label: 'uusi-alikappale',
        location: { name: 'root' },
      },
    ]});

    await Vue.nextTick();

    expect(wrapper.html()).toContain('home');
    expect(wrapper.html()).toContain('Parent jolla todella pitkä teksti');
    expect(wrapper.html()).toContain('Uusi alikappale');
  });
});
