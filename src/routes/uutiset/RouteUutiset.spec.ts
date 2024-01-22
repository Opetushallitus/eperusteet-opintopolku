import { mount, createLocalVue } from '@vue/test-utils';
import RouteUutiset from './RouteUutiset.vue';
import { tiedoteStoreMock } from '@/storeMocks';
import { mock, mocks, stubs } from '@shared/utils/jestutils';
import { Kielet } from '@shared/stores/kieli';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';
import { JulkaistutKoulutustyypitStore } from '@/stores/JulkaistutKoulutustyypitStore';
import { TiedoteStore } from '@/stores/TiedoteStore';

describe('RouteUutinen', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders spinners and data', async () => {
    const julkaistutKoulutustyypitStore = mock(JulkaistutKoulutustyypitStore);
    const tiedoteStore = mock(TiedoteStore);

    const wrapper = mount(RouteUutiset as any, {
      localVue,
      propsData: {
        tiedoteStore,
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
  });
});
