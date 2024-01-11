import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import EpAikatauluListaus from './EpAikatauluListaus.vue';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import { Kielet } from '../../stores/kieli';
import { Kaannos } from '../../plugins/kaannos';
import VueI18n from 'vue-i18n';

Vue.use(BootstrapVue);

describe('EpAikatauluListaus component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders', async () => {
    const wrapper = mount(EpAikatauluListaus, {
      localVue,
      propsData: {
        aikataulutProp: [{
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

  test('julkivalinta', async () => {
    const wrapper = mount(EpAikatauluListaus, {
      localVue,
      propsData: {
        aikataulutProp: [{
          id: 42,
          tapahtuma: 'luominen',
          tapahtumapaiva: new Date(),
          tavoite: 'test',
        }, {
          id: 43,
          tapahtuma: 'tavoite',
          tapahtumapaiva: new Date(),
          tavoite: 'test',
          julkinen: true,
        }],
        julkinenValinta: true,
      },
      mocks: {
        $t: x => x,
        $sd: x => x,
      },
      stubs: {
        'router-link': RouterLinkStub,
      },
    });

    expect(wrapper.findAll('.paatavoite')).toHaveLength(0);
    expect(wrapper.findAll('.yleistavoite')).toHaveLength(1);

    const julkiChkbox = wrapper.find('.yleistavoite input[type="checkbox"]').element as any;
    expect(julkiChkbox.value).toBeTruthy();
  });
});
