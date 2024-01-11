import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import EpViimeaikainenToiminta from './EpViimeaikainenToiminta.vue';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import { Kielet } from '@shared/stores/kieli';
import { MuokkaustietoStore } from '@shared/stores/MuokkaustietoStore';
import { Kaannos } from '@shared/plugins/kaannos';
import { mock } from '@shared/utils/jestutils';
import VueI18n from 'vue-i18n';

Vue.use(BootstrapVue);

describe('EpViimeaikainenToiminta component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders', async () => {
    const store = mock(MuokkaustietoStore);

    const wrapper = mount(EpViimeaikainenToiminta, {
      localVue,
      propsData: {
        muokkaustietoStore: store,
      },
      mocks: {
        $t: x => x,
      },
      stubs: {
        'router-link': RouterLinkStub,
      },
    });

    expect(wrapper.html()).toBeTruthy();
  });
});
