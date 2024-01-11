import { mount, createLocalVue } from '@vue/test-utils';
import EpAlert from './EpAlert.vue';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

describe('EpToggle component', () => {
  const localVue = createLocalVue();

  test('Renders toggle and change changes value', async () => {
    const wrapper = mount(EpAlert, {
      localVue,
      propsData: {
        text: 'tässä tekstiä',
        ops: false,
      },
    });

    const old = wrapper.html();
    expect(old).toContain('tässä tekstiä');

    wrapper.setProps({
      text: 'tässä tekstiä',
      ops: true,
    });
    expect(wrapper.html()).not.toEqual(old);
  });
});
