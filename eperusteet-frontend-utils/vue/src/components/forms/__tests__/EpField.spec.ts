import { mount, createLocalVue } from '@vue/test-utils';
import EpField from '../EpField.vue';

describe('EpInput component', () => {
  const localVue = createLocalVue();

  test('Renders field with content', async () => {
    const wrapper = mount(EpField, {
      propsData: {
        value: 'arvo',
      },
      localVue,
    });

    await localVue.nextTick();

    expect(wrapper.html()).toContain('arvo');
  });
});
