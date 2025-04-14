import { mount, createLocalVue } from '@vue/test-utils';
import EpPerusteRakenne from '../EpPerusteRakenne.vue';
import { mocks, stubs, mock } from '@shared/utils/jestutils';
import { Kielet } from '@shared/stores/kieli';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';
import { mockRakenne } from './data';
import { delay } from '@shared/utils/delay';

describe('EpPerusteRakenne', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  function createWrapper() {
    const rakenneOsat = mockRakenne().osat;
    return mount(EpPerusteRakenne as any, {
      localVue,
      propsData: {
        rakenneOsat,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
      },
    });
  }

  test('Renders', async () => {
    const wrapper = createWrapper();

    expect(wrapper.html()).toContain('Ammatilliset tutkinnon osat');
    expect(wrapper.find('.rakenne').html()).toContain('145');

    expect(wrapper.html()).toContain('Yhteiset tutkinnon osat');
    expect(wrapper.html()).not.toContain('Elektroniikka-asentaja');
    expect(wrapper.html()).not.toContain('Pakolliset tutkinnon osat');
    expect(wrapper.html()).not.toContain('Elektroniikan ja ICT:n perustehtävät');
  });

  test('avaa-sulje && kuvaus', async () => {
    const wrapper = createWrapper();

    wrapper.find('.rakennetoggle button').trigger('click');
    await delay();

    expect(wrapper.html()).toContain('Ammatilliset tutkinnon osat');
    expect(wrapper.html()).toContain('Yhteiset tutkinnon osat');
    expect(wrapper.html()).toContain('Elektroniikka-asentaja');
    expect(wrapper.html()).toContain('Pakolliset tutkinnon osat');
    expect(wrapper.html()).toContain('Elektroniikan ja ICT:n perustehtävät');

    expect(wrapper.html()).not.toContain('Viestintä- ja vuorovaikutusosaamisen laajuus on vähintään 11 osaamispistettä');

    wrapper.find('.kuvaustoggle button').trigger('click');
    await delay();
    expect(wrapper.html()).toContain('Viestintä- ja vuorovaikutusosaamisen laajuus on vähintään 11 osaamispistettä');
  });

  test('nimifilter', async () => {
    const wrapper = createWrapper();

    wrapper.find('.rakennetoggle button').trigger('click');
    await delay();

    expect(wrapper.html()).toContain('Pakolliset tutkinnon osat');
    expect(wrapper.html()).toContain('Elektroniikan ja ICT:n perustehtävät');
    expect(wrapper.html()).toContain('Ammattielektroniikka');
    expect(wrapper.html()).toContain('Valinnaiset tutkinnon osat');
    expect(wrapper.html()).toContain('Yhteisen tutkinnon osien valinnaiset');

    wrapper.find('.query input').setValue('elektroniikka-asentaja');
    await delay();

    expect(wrapper.html()).toContain('Pakolliset tutkinnon osat');
    expect(wrapper.html()).toContain('Elektroniikan ja ICT:n perustehtävät');
    expect(wrapper.html()).toContain('Ammattielektroniikka');
    expect(wrapper.html()).toContain('Valinnaiset tutkinnon osat');
    expect(wrapper.html()).not.toContain('Yhteisen tutkinnon osien valinnaiset');

    wrapper.find('.query input').setValue('ammattielektroniikka');
    await delay();

    expect(wrapper.html()).toContain('Pakolliset tutkinnon osat');
    expect(wrapper.html()).toContain('Ammattielektroniikka');
    expect(wrapper.html()).not.toContain('Elektroniikan ja ICT:n perustehtävät');
    expect(wrapper.html()).not.toContain('Valinnaiset tutkinnon osat');
    expect(wrapper.html()).not.toContain('Yhteisen tutkinnon osien valinnaiset');
  });
});
