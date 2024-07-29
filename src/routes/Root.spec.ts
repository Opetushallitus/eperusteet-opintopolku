import { mount, createLocalVue } from '@vue/test-utils';
import Root from './Root.vue';
import { Kielet } from '@shared/stores/kieli';
import { mock, mocks, stubs } from '@shared/utils/jestutils';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';
import { PalauteStore } from '@/stores/PalauteStore';
import { JulkaistutKoulutustyypitStore } from '@/stores/JulkaistutKoulutustyypitStore';
import { TietoapalvelustaStore } from '@/stores/TietoapalvelustaStore';
import { OsaamismerkitStore } from '@/stores/OsaamismerkitStore';

describe('Root', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());
  const palauteStore = mock(PalauteStore);
  const julkaistutKoulutustyypitStore = mock(JulkaistutKoulutustyypitStore);
  const tietoapalvelustaStore = mock(TietoapalvelustaStore);
  tietoapalvelustaStore.state.tietoapalvelusta = null;
  const osaamismerkitStore = mock(OsaamismerkitStore);

  test('Renders', async () => {
    const wrapper = mount(Root as any, {
      localVue,
      propsData: {
        palauteStore,
        julkaistutKoulutustyypitStore,
        tietoapalvelustaStore,
        osaamismerkitStore,
      },
      stubs: {
        ...stubs,
        RouterView: true,
      },
      mocks: {
        ...mocks,
      },
    });

    await localVue.nextTick();
  });
});
