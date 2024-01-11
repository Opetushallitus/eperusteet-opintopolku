import BootstrapVue from 'bootstrap-vue';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueRouter from 'vue-router';
import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import Osaamistavoitteet from './Osaamistavoitteet.vue';

Vue.use(BootstrapVue);

describe('Osaamistavoitteet', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  localVue.use(VueRouter);

  test('Renders', async () => {
    const wrapper = mount(Osaamistavoitteet, {
      localVue,
      propsData: {
        isEditing: false,
        tyyppi: 'pakollinen',
        value: {
          tavatjaymparisto: {
            fi: 'tavatjaymparisto',
          },
          arvioinnista: {
            fi: 'arvioinnista',
          },
          piilotettu: false,
        },
        perusteData: {},
      },
      mocks: {
        $t: x => x,
        $kaanna: x => x && x.fi,
      },
      stubs: {
        PortalTarget: '<div />',
        GeneerinenArviointiTaulukko: '<div />',
        Arviointi2020Taulukko: '<div />',
        EpOsaamistavoite: '<div />',
        EpContent: '<div />',
        'router-link': RouterLinkStub,
      },
    });

    expect(wrapper.html()).toBeTruthy();
  });
});
