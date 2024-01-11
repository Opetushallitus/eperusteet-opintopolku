import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import EpAikataulu from './EpAikataulu.vue';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import { Kielet } from '../../stores/kieli';
import { delay } from '../../utils/delay';
import { Kaannos } from '../../plugins/kaannos';
import VueI18n from 'vue-i18n';

Vue.use(BootstrapVue);

describe('EpAikataulu component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders', async () => {
    const wrapper = mount(EpAikataulu, {
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
