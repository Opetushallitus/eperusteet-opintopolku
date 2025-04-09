import { mount, createLocalVue } from '@vue/test-utils';
import EpNavigation from './EpNavigation.vue';
import { Kielet } from '@shared/stores/kieli';
import { createMockedStore, findAllContaining, findContaining, mock, mocks, stubs } from '@shared/utils/jestutils';
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
    const julkaistutKoulutustyypitStore = createMockedStore(JulkaistutKoulutustyypitStore, {
      julkaistutKoulutustyypit: {
        value: [
          EperusteetKoulutustyyppiRyhmat.esiopetus[0],
          EperusteetKoulutustyyppiRyhmat.lukiokoulutus[0],
          EperusteetKoulutustyyppiRyhmat.varhaiskasvatus[0],
          EperusteetKoulutustyyppiRyhmat.perusopetus[0],
          EperusteetKoulutustyyppiRyhmat.vapaasivistystyo[0],
        ],
      },
      muuLukumaarat: {
        value: 1,
      },
      digitaalinenOsaaminen: {
        value: [
          {
            id: 1,
          },
        ],
      },
    });

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
