import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import EpJulkaisuHistoria from './EpJulkaisuHistoria.vue';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import { Kielet } from '@shared/stores/kieli';
import { Kaannos } from '@shared/plugins/kaannos';
import { mocks } from '@shared/utils/jestutils';
import VueI18n from 'vue-i18n';

Vue.use(BootstrapVue);

describe('EpJulkaisuHistoria component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders', async () => {
    const wrapper = mount(EpJulkaisuHistoria, {
      localVue,
      propsData: {
        julkaisut: [],
      },
      mocks,
    });

    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.html()).toContain('ei-julkaisuja');
  });

  test('Renders with data', async () => {
    const wrapper = mount(EpJulkaisuHistoria, {
      localVue,
      propsData: {
        julkaisut: [
          {
            revision: 1,
            tiedote: { fi: 'tiedote' },
            luotu: '1614073923059',
            luoja: 'testi',
            tila: 'JULKAISTU',
          },
          {
            revision: 2,
            tiedote: { fi: 'tiedote' },
            luotu: '1614073923052',
            luoja: 'testi2',
            tila: 'JULKAISTU',
          },
          {
            revision: 3,
            tiedote: { fi: 'tiedote' },
            luotu: '1614073923053',
            luoja: 'testi2',
            tila: 'KESKEN',
          },
        ],
        palauta: () => {},
      },
      mocks,
    });

    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.html()).not.toContain('ei-julkaisuja');
    expect(wrapper.html()).toContain('julkaistu-versio');
    expect(wrapper.html()).toContain('julkaisu-kesken');
    expect(wrapper.html()).toContain('palauta');
  });
});
