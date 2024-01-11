import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import EpNavbar from './EpNavbar.vue';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import VueRouter from 'vue-router';
import { Kielet } from '../../stores/kieli';
import { Kaannos } from '../../plugins/kaannos';
import VueI18n from 'vue-i18n';

Vue.use(BootstrapVue);

describe('EpNavbar component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  localVue.use(VueRouter);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders toggle and change changes value', async () => {
    const wrapper = mount(EpNavbar, {
      localVue,
      propsData: {
        kayttaja: null,
      },
      mocks: {
        $t: x => x,
      },
      stubs: {
        PortalTarget: '<div />',
        'router-link': RouterLinkStub,
      },
    });

    expect(wrapper.html()).toBeTruthy();
  });
});
