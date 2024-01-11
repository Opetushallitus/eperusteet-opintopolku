import { mount, createLocalVue } from '@vue/test-utils';
import EpFooter from './EpFooter.vue';
import { Kaannos } from '../../plugins/kaannos';
import VueI18n from 'vue-i18n';
import { Kielet } from '../../stores/kieli';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

describe('EpFooter component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders', async () => {
    const wrapper = mount(EpFooter, {
      localVue,
      mocks: {
        $t: x => x,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
