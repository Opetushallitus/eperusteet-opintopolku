import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
import EpToggle from '../EpToggle.vue';
import { KieliStore } from '../../../stores/kieli';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

describe('EpToggle component', () => {
  const localVue = createLocalVue();

  function mountWrapper() {
    return mount(localVue.extend({
      components: {
        EpToggle,
      },
      data() {
        return {
          arvo: false,
        };
      },
      template: '<ep-toggle v-model="arvo" />',
    }), {
      localVue,
    });
  };

  test('Renders toggle and change changes value', async () => {
    const wrapper = mountWrapper();
    expect(wrapper.vm.arvo).toBe(false);

    wrapper.find('input[type=checkbox]').trigger('click');
    expect(wrapper.vm.arvo).toBe(true);

    wrapper.find('input[type=checkbox]').trigger('click');

    expect(wrapper.vm.arvo).toBe(false);
  });
});
