import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import EpLinkki from './EpLinkki.vue';
import { Kaannos } from '../../plugins/kaannos';
import VueI18n from 'vue-i18n';
import { Kielet } from '../../stores/kieli';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

describe('EpLinkki component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders', async () => {
    const wrapper = mount(EpLinkki, {
      localVue,
      propsData: {
        url: 'https://eperusteet.opintopolku.fi',
      },
      mocks: {
        $t: x => x,
      },
      stubs: {
        'router-link': RouterLinkStub,
      },
    });

    const el = wrapper.find('a');
    expect(el.attributes('rel')).toEqual('noopener noreferrer');
    expect(wrapper.text()).toEqual('eperusteet.opintopolku.fi');
    expect(el.attributes('href')).toEqual('https://eperusteet.opintopolku.fi');
  });
});
