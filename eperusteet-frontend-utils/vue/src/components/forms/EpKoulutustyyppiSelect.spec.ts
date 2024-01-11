import { mount, createLocalVue } from '@vue/test-utils';
import EpKoulutustyyppiSelect from './EpKoulutustyyppiSelect.vue';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

describe('EpKoulutustyyppiSelect', () => {
  const localVue = createLocalVue();

  it('Renders', () => {
    const wrapper = mount(EpKoulutustyyppiSelect, {
      propsData: {
        value: null,
      },
      mocks: {
        $t: x => x,
      },
      localVue,
    });
  });

  it('value not set', () => {
    const wrapper = mount(EpKoulutustyyppiSelect, {
      propsData: {
        value: null,
        isEditing: true,
      },
      mocks: {
        $t: x => x,
      },
      localVue,
    });

    expect(wrapper.find('.multiselect__placeholder').html()).toContain('kaikki');
    expect(wrapper.html()).not.toContain('.multiselect__single');
  });

  it('value set', () => {
    const wrapper = mount(EpKoulutustyyppiSelect, {
      propsData: {
        value: 'koulutustyyppi_20',
        isEditing: true,
      },
      mocks: {
        $t: x => x,
      },
      localVue,
    });

    expect(wrapper.find('.multiselect__single').html()).toContain('koulutustyyppi_20');
    expect(wrapper.html()).not.toContain('.multiselect__placeholder');
  });
});
