import BootstrapVue from 'bootstrap-vue';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueRouter from 'vue-router';
import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import Arviointi2020Taulukko from './Arviointi2020Taulukko.vue';

Vue.use(BootstrapVue);

describe('Arviointi 2020', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  localVue.use(VueRouter);

  test('Renders', async () => {
    const wrapper = mount(Arviointi2020Taulukko, {
      localVue,
      propsData: {
        arviointi: {
          osaamistasonKriteerit: [{
            osaamistaso: {
              otsikko: {
                fi: 'otsikko',
              },
            },
            kriteerit: [{
              fi: 'kriteeri',
            }],
          }],
        },
      },
      mocks: {
        $t: x => x,
        $kaanna: x => x && x.fi,
      },
      stubs: {
        PortalTarget: '<div />',
        'router-link': RouterLinkStub,
      },
    });

    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.html()).toContain('otsikko');
    expect(wrapper.html()).toContain('kriteeri');
  });
});
