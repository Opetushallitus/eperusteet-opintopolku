import { mount, createLocalVue } from '@vue/test-utils';
import RouteUutiset from './RouteUutiset.vue';
import { tiedoteStoreMock } from '@/storeMocks';
import { mock, mocks, stubs } from '@shared/utils/jestutils';
import { Kielet } from '@shared/stores/kieli';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';
import { JulkaistutKoulutustyypitStore } from '@/stores/JulkaistutKoulutustyypitStore';
import { TiedoteStore } from '@/stores/TiedoteStore';
import { vi } from 'vitest';

describe('RouteUutinen', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders spinners and data', async () => {
    const JulkaistutKoulutustyypitStore = vi.fn();
    JulkaistutKoulutustyypitStore.prototype.koulutustyyppiLukumaarat = vi.fn();
    JulkaistutKoulutustyypitStore.prototype.julkaistutKoulutustyypit = vi.fn();
    JulkaistutKoulutustyypitStore.prototype.muuLukumaarat = vi.fn();
    const julkaistutKoulutustyypitStore = new JulkaistutKoulutustyypitStore();

    const TiedoteStore = vi.fn();
    TiedoteStore.prototype.updateFilter = vi.fn();
    const tiedoteStore = new TiedoteStore();

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
