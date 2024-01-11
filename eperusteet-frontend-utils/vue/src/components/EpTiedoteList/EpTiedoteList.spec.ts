import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import EpTiedoteList from './EpTiedoteList.vue';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import { Kielet } from '../../stores/kieli';
import { Kaannos } from '../../plugins/kaannos';
import VueI18n from 'vue-i18n';

Vue.use(BootstrapVue);

describe('EpTiedoteList component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders', async () => {
    const wrapper = mount(EpTiedoteList, {
      localVue,
      propsData: {
        tiedotteet: [{
        }],
      },
      mocks: {
        $t: x => x,
        $sdt: x => x,
      },
      stubs: {
        'router-link': RouterLinkStub,
      },
    });

    expect(wrapper.html()).toBeTruthy();
  });
});
