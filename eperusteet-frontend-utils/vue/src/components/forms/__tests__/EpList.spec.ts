import { mount, createLocalVue } from '@vue/test-utils';
import EpList from '../EpList.vue';
import VueI18n from 'vue-i18n';
import { Kielet } from '../../../stores/kieli';
import BootstrapVue from 'bootstrap-vue';

describe('EpList component', () => {
  const localVue = createLocalVue();
  localVue.use(BootstrapVue);
  localVue.use(VueI18n);
  const valueMock = [{ id: 1, kentta: 'arvo1' }, { id: 2, kentta: 'arvo2' }];

  Kielet.install(localVue, {
    messages: {
      fi: {
        'lisaa-sisalto': 'lisaasisalto',
      },
    },
  });

  const i18n = Kielet.i18n;

  function mountWrapper() {
    return mount(localVue.extend({
      components: {
        EpList,
      },
      props: ['isEditing'],
      data() {
        return {
          value: valueMock,
        };
      },
      template: '<ep-list :is-editable="isEditing" kentta="kentta" v-model="value" />',
    }), {
      localVue,
      i18n,
    });
  };

  test('Renders list with content', async () => {
    const wrapper = mountWrapper();

    expect(wrapper.html()).toContain('arvo1');
    expect(wrapper.html()).toContain('arvo2');
  });

  test('Delete list content', async () => {
    const wrapper = mountWrapper();

    wrapper.setProps({ isEditing: true });
    await localVue.nextTick();

    expect(wrapper.findAll('div.arvo')).toHaveLength(2);
    expect(wrapper.vm.value).toHaveLength(2);

    wrapper.findAll('button.btn-link').at(0)
      .trigger('click');

    expect(wrapper.vm.value).toHaveLength(1);
    expect(wrapper.findAll('div.arvo')).toHaveLength(1);
  });

  test('Add list content', async () => {
    const wrapper = mountWrapper();

    wrapper.setProps({ isEditing: true });
    await localVue.nextTick();

    expect(wrapper.vm.value).toHaveLength(2);
    expect(wrapper.findAll('div.arvo')).toHaveLength(2);

    wrapper.find('.ep-button button').trigger('click');

    expect(wrapper.vm.value).toHaveLength(3);
    expect(wrapper.findAll('div.arvo')).toHaveLength(3);
  });
});
