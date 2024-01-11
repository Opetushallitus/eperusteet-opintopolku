import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import EpAikatauluModal from './EpAikatauluModal.vue';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import { Kielet } from '../../stores/kieli';
import { Kaannos } from '../../plugins/kaannos';
import VueI18n from 'vue-i18n';
import { Oikeustarkastelu } from '@shared/plugins/oikeustarkastelu';

Vue.use(BootstrapVue);

describe('EpAikatauluModal component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());
  localVue.use(Oikeustarkastelu, {
    oikeusProvider: {
      async hasOikeus() {
        return true;
      },
    },
  });

  test('Renders', async () => {
    const wrapper = mount(EpAikatauluModal, {
      localVue,
      propsData: {
        aikataulut: [{
          id: 42,
          tapahtuma: 'luominen',
          tapahtumapaiva: new Date(),
          tavoite: 'test',
        }],
      },
      mocks: {
        $t: x => x,
        $sd: x => x,
      },
      stubs: {
        'router-link': RouterLinkStub,
      },
    });

    expect(wrapper.html()).toBeTruthy();
  });
});
