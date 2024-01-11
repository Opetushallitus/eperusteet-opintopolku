import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
import EpSpinner from './EpSpinner.vue';
import VueI18n from 'vue-i18n';
import { Kielet } from '../../stores/kieli';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

describe('EpSpinner component', () => {
  const localVue = createLocalVue();

  test('Renders', async () => {
    const wrapper = mount(EpSpinner);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
