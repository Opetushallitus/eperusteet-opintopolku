import { mount, createLocalVue } from '@vue/test-utils';
import Root from './Root.vue';
import { Kielet } from '@shared/stores/kieli';
import { mock, mocks, stubs } from '@shared/utils/jestutils';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';
import { JulkaistutKoulutustyypitStore } from '@/stores/JulkaistutKoulutustyypitStore';
import { TietoapalvelustaStore } from '@/stores/TietoapalvelustaStore';
import { OsaamismerkitStore } from '@/stores/OsaamismerkitStore';
import { vi } from 'vitest';

describe('Root', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());
  const julkaistutKoulutustyypitStore = mock(JulkaistutKoulutustyypitStore, {
    fetch: async () => {},
    koulutustyyppiLukumaarat: vi.fn() as any,
    julkaistutKoulutustyypit: vi.fn() as any,
    muuLukumaarat: vi.fn() as any,
    digitaalinenOsaaminen: vi.fn() as any,
  });
  const tietoapalvelustaStore = mock(TietoapalvelustaStore, {
    tietoapalvelusta: vi.fn() as any,
    fetch: async () => {},
  });
  const osaamismerkitStore = mock(OsaamismerkitStore);

  test('Renders', async () => {
    const wrapper = mount(Root as any, {
      localVue,
      propsData: {
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
