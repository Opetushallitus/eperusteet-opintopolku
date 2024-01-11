import { createLocalVue, mount } from '@vue/test-utils';
import EpCollapse from './EpCollapse.vue';
import '../../config/bootstrap';

describe('EpCollapse component', () => {
  const localVue = createLocalVue();

  function createOptions(options = {}) {
    return {
      slots: {
        header: '<h3>Hello world</h3>',
        default: '<b>Foobar</b>',
      },
      propsData: {
        expandedByDefault: true,
        ...options,
      },
      localVue,
    };
  }

  it('Renders header and content with alternative default state', async () => {
    const options = createOptions({
      expandedByDefault: false,
    });
    const wrapper = mount(EpCollapse, options);
    await localVue.nextTick();
    expect(wrapper.html()).toContain(options.slots.header);
    expect(wrapper.html()).not.toContain(options.slots.default);
  });

  it('Renders header and content', async () => {
    const options = createOptions();
    const wrapper = mount(EpCollapse, options);
    await localVue.nextTick();
    expect(wrapper.html()).toContain(options.slots.header);
    expect(wrapper.html()).toContain(options.slots.default);
  });

  it('Renders header only when collapsed', async () => {
    const options = createOptions();
    const wrapper = mount(EpCollapse, options);
    wrapper.find('.collapse-button').trigger('click');
    expect(wrapper.html()).toContain(options.slots.header);
    expect(wrapper.html()).not.toContain(options.slots.default);
  });
});
