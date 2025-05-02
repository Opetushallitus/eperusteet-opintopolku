import { mount } from '@vue/test-utils';
import EpPerusteRakenne from '../EpPerusteRakenne.vue';
import { mockRakenne } from './data';
import { delay } from '@shared/utils/delay';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { nextTick } from 'vue';

describe('EpPerusteRakenne', () => {

  function createWrapper() {
    const rakenneOsat = mockRakenne().osat;
    return mount(EpPerusteRakenne as any, {
      propsData: {
        rakenneOsat,
      },
      global: {
        ...globalStubs,
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

    (wrapper.vm as any).toggleRakenne();
    await delay();

    expect(wrapper.html()).toContain('Ammatilliset tutkinnon osat');
    expect(wrapper.html()).toContain('Yhteiset tutkinnon osat');
    expect(wrapper.html()).toContain('Elektroniikka-asentaja');
    expect(wrapper.html()).toContain('Pakolliset tutkinnon osat');
    expect(wrapper.html()).toContain('Elektroniikan ja ICT:n perustehtävät');

    expect(wrapper.html()).not.toContain('Viestintä- ja vuorovaikutusosaamisen laajuus on vähintään 11 osaamispistettä');

    (wrapper.vm as any).toggleKuvaukset();
    await delay();
    expect(wrapper.html()).toContain('Viestintä- ja vuorovaikutusosaamisen laajuus on vähintään 11 osaamispistettä');
  });

  test('nimifilter', async () => {
    const wrapper = createWrapper();

    (wrapper.vm as any).toggleRakenne();
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
