import { mount, createLocalVue } from '@vue/test-utils';
import EpButton from './EpButton.vue';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

describe('EpButton component', () => {
  const localVue = createLocalVue();

  it('Renders button with content', () => {
    const wrapper = mount(EpButton, {
      localVue,
      slots: {
        default: 'Test',
      },
    });
    expect(wrapper.html()).toContain('Test');
  });

  it('Renders button with spinner', () => {
    const wrapper = mount(EpButton, {
      localVue,
      slots: {
        default: 'Test',
      },
      propsData: {
        showSpinner: true,
      },
    });
    expect(wrapper.html()).toContain('oph-spinner');
  });
});
