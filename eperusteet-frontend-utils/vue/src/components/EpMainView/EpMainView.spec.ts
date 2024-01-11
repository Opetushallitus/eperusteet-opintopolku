import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import { findContaining } from '../../utils/jestutils';
import EpMainView from './EpMainView.vue';
import { Kieli } from '../../tyypit';
import { Kaannos } from '../../plugins/kaannos';
import VueI18n from 'vue-i18n';
import { delay } from '../../utils/delay';
import { Kielet } from '../../stores/kieli';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

describe('EpMainView component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders', async () => {
    const wrapper = mount(EpMainView, {
      localVue,
      slots: {
        default: 'DEFAULT SLOT',
        'custom-content': 'CUSTOM CONTENT',
        after: 'AFTER CONTENT',
      },
      mocks: {
        $t: x => x,
      },
    });

    expect(wrapper.html()).toContain('DEFAULT SLOT');
    expect(wrapper.html()).toContain('CUSTOM CONTENT');
    expect(wrapper.html()).toContain('AFTER CONTENT');
  });
});
