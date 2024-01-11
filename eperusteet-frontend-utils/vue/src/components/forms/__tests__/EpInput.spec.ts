import { mount, createLocalVue } from '@vue/test-utils';
import EpInput from '../EpInput.vue';
import VueI18n from 'vue-i18n';
import { Kielet } from '../../../stores/kieli';

describe('EpInput component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);

  Kielet.install(localVue, {
    messages: {
      fi: {
        'apua': 'aputarve',
      },
    },
  });

  const i18n = Kielet.i18n;

  test('Renders input with content', async () => {
    const wrapper = mount(EpInput, {
      propsData: {
        help: 'apua',
        value: 'arvo',
      },
      localVue,
      i18n,
    });

    await localVue.nextTick();

    expect(wrapper.html()).not.toContain('apua');

    wrapper.setProps({ isEditing: true });
    await localVue.nextTick();

    expect(wrapper.html()).toContain('aputarve');
  });

  test('Editing string', async () => {
    const wrapper = mount(localVue.extend({
      components: {
        EpInput,
      },
      props: ['isEditing'],
      data() {
        return {
          value: '123',
        };
      },
      template: '<ep-input :is-editing="isEditing" type="string" v-model="value" />',
    }), {
      propsData: {
        value: '123',

      },
      localVue,
      i18n,
    });

    await localVue.nextTick();
    expect(wrapper.html()).toContain('123');

    wrapper.setProps({ isEditing: true });
    await localVue.nextTick();

    wrapper.find('input[type="text"]').setValue('321');

    wrapper.setProps({ isEditing: false });
    await localVue.nextTick();

    expect(wrapper.text()).toContain('321');
    expect(wrapper.text()).not.toContain('123');
  });
});
