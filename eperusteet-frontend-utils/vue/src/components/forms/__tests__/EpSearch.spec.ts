import { mount, createLocalVue } from '@vue/test-utils';
import EpSearch from '../EpSearch.vue';
import VueI18n from 'vue-i18n';
import { Kielet } from '../../../stores/kieli';

describe('EpFormContent component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue, {
    messages: {
      fi: {
        'etsi': 'Etsi',
      },
    },
  });

  const i18n = Kielet.i18n;

  function mountWrapper(updateSearch, propsit) {
    return mount(localVue.extend({
      components: {
        EpSearch,
      },
      methods: {
        updateSearch,
      },
      data() {
        return propsit;
      },
      template: '<ep-search v-model="rajain" @input="updateSearch" :placeholder="placeholder" :sr-placeholder="srPlaceholder"/>',
    }), {
      localVue,
      i18n,
    });
  };

  test('Renders content with content', async () => {
    const testMethod = jest.fn();
    const wrapper = mountWrapper(testMethod, { placeholder: null, rajain: '' });
    expect(wrapper.html()).toContain('Etsi');
  });

  test('Renders content with content and props', async () => {
    const testMethod = jest.fn();
    const wrapper = mountWrapper(testMethod, { placeholder: 'etsi-teksti', rajain: '', srPlaceholder: 'etsi-tietoja-sivulta-haku' });
    wrapper.setProps({ placeholder: 'etsi-teksti', srPlaceholder: 'etsi-tietoja-sivulta-haku' });
    await localVue.nextTick();
    expect(wrapper.find('input').html()).toContain('etsi-teksti');
    expect(wrapper.find('label').html()).toContain('etsi-tietoja-sivulta-haku');
  });

  test('Renders content with content and props', async () => {
    const testMethod = jest.fn();
    const testrajain = '';
    const wrapper = mountWrapper(testMethod, { placeholder: 'etsi-teksti', rajain: testrajain });

    wrapper.find('input').setValue('arvoa');
    await localVue.nextTick();
    expect(testMethod).toBeCalled();
  });
});
