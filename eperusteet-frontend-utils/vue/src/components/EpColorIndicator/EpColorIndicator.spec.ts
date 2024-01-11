import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
import EpColorIndicator from './EpColorIndicator.vue';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

describe('EpToggle component', () => {
  const localVue = createLocalVue();

  test('Renders toggle and change changes value', async () => {
    const wrapper = mount(EpColorIndicator, {
      localVue,
      mocks: {
        $t: x => x,
      },
      propsData: {},
    });

    expect(wrapper.html()).toContain('normaali');

    wrapper.setProps({
      kind: 'julkaistu',
      tooltip: 'tooltipviesti',
      size: 20,
    });

    expect(wrapper.html()).toContain('julkaistu');
    expect(wrapper.html()).toContain('circle');

    expect(wrapper.element.style.color).toMatchSnapshot();

    wrapper.setProps({
      kind: 'esiopetus',
      tooltip: 'tooltipviesti',
      size: 20,
    });

    expect(wrapper.element.style.color).toMatchSnapshot();
  });
});
