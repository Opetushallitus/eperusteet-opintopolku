import { mount, createLocalVue, RouterLinkStub } from '@vue/test-utils';
import EpValidPopover from './EpValidPopover.vue';
import BootstrapVue from 'bootstrap-vue';
import { Kielet } from '../../stores/kieli';
import { Kaannos } from '../../plugins/kaannos';
import VueI18n from 'vue-i18n';

describe('EpValidPopover component', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());
  localVue.use(BootstrapVue);

  test('Renders', async () => {
    const wrapper = mount(EpValidPopover, {
      localVue,
      propsData: {
        validoitava: {
          tila: 'luonnos',
          koulutustyyppi: 'koulutustyyppi_1',
        },
        validoinnit: {
          virheet: ['virhe1'],
        },
        julkaistava: false,
        julkaisemattomiaMuutoksia: false,
        tyyppi: 'peruste',
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
    expect(wrapper.html()).not.toContain('perusteessa-on-julkaisemattomia-muutoksia');
    expect(wrapper.html()).toContain('aseta-valmiiksi');

    wrapper.setProps(
      {
        ...wrapper.props,
        julkaisemattomiaMuutoksia: true,
        julkaistava: true,
      }
    );

    expect(wrapper.html()).toContain('perusteessa-on-julkaisemattomia-muutoksia');
    expect(wrapper.html()).toContain('siirry-julkaisunakymaan');
  });

  xtest('popup opens', async () => {
    const wrapper = mount(EpValidPopover, {
      localVue,
      propsData: {
        validoitava: {
          tila: 'luonnos',
          koulutustyyppi: 'koulutustyyppi_1',
        },
        validoinnit: {
          virheet: [],
          huomautukset: [],
        },
        julkaistava: true,
        julkaisemattomiaMuutoksia: true,
        tyyppi: 'peruste',
      },
      mocks: {
        $t: x => x,
        $sd: x => x,
      },
      stubs: {
        'router-link': RouterLinkStub,
      },
    });

    expect(wrapper.html()).not.toContain('ei-julkaisua-estavia-virheita');
    // expect(wrapper.find({ ref: 'ep-progress-popover' }).exists()).toBe(true);
    // (wrapper.vm.$refs['ep-progress-popover'] as any).show();

    await localVue.nextTick();

    expect(wrapper.html()).toContain('ei-julkaisua-estavia-virheita');
  });
});
