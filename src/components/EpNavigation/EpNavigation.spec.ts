import { mount, createLocalVue } from '@vue/test-utils';
import EpNavigation from './EpNavigation.vue';
import { Kielet } from '@shared/stores/kieli';
import { findAllContaining, findContaining, mock, mocks, stubs } from '@shared/utils/jestutils';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';
import { JulkaistutKoulutustyypitStore } from '@/stores/JulkaistutKoulutustyypitStore';
import { EperusteetKoulutustyyppiRyhmat } from '@shared/utils/perusteet';

describe('EpNavigation', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders spinners and data', async () => {
    const julkaistutKoulutustyypitStore = mock(JulkaistutKoulutustyypitStore);

    const wrapper = mount(EpNavigation as any, {
      localVue,
      propsData: {
        julkaistutKoulutustyypitStore,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
      },
    });

    julkaistutKoulutustyypitStore.state.koulutustyyppiLukumaarat = [
      { koulutustyyppi: EperusteetKoulutustyyppiRyhmat.esiopetus[0], lukumaara: 1 },
      { koulutustyyppi: EperusteetKoulutustyyppiRyhmat.lukiokoulutus[0], lukumaara: 1 },
      { koulutustyyppi: EperusteetKoulutustyyppiRyhmat.varhaiskasvatus[0], lukumaara: 1 },
      { koulutustyyppi: EperusteetKoulutustyyppiRyhmat.perusopetus[0], lukumaara: 1 },
      { koulutustyyppi: EperusteetKoulutustyyppiRyhmat.vapaasivistystyo[0], lukumaara: 1 },
    ];
    julkaistutKoulutustyypitStore.state.muuLukumaarat = 1;
    julkaistutKoulutustyypitStore.state.digitaalinenOsaaminen = [{
      id: 1,
    }];

    await localVue.nextTick();
    const links = wrapper.contains;
    expect(findContaining(wrapper, 'a', 'esiopetus')).toBeTruthy();
    expect(findContaining(wrapper, 'a', 'lukiokoulutus')).toBeTruthy();
    expect(findContaining(wrapper, 'a', 'varhaiskasvatus')).toBeTruthy();
    expect(findAllContaining(wrapper, 'a', 'perusopetus').length).toBeGreaterThanOrEqual(1);
    expect(findContaining(wrapper, 'a', 'ammatillinen')).toBeFalsy();
    expect(findContaining(wrapper, 'a', 'vapaasivistystyo')).toBeTruthy();
    expect(findContaining(wrapper, 'a', 'muukoulutus')).toBeTruthy();
    expect(findContaining(wrapper, 'a', 'digitaalinen-osaaminen')).toBeTruthy();
  });
});
