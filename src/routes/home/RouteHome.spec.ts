import { mount, createLocalVue } from '@vue/test-utils';
import RouteHome from './RouteHome.vue';
import { createMockedStore, mock, mocks, stubs } from '@shared/utils/jestutils';
import { tiedoteStoreMock, perusteStoreMock } from '@/storeMocks';
import { JulkaistutKoulutustyypitStore } from '@/stores/JulkaistutKoulutustyypitStore';
import { TietoapalvelustaStore } from '@/stores/TietoapalvelustaStore';
import { OsaamismerkitStore } from '@/stores/OsaamismerkitStore';
import { vi } from 'vitest';
import { BrowserStore } from '@shared/stores/BrowserStore';
import { computedValue } from '@shared/utils/interfaces';

describe('RouteHome', () => {
  const localVue = createLocalVue();

  const $route = {
    params: {
      lang: 'fi',
    },
  };

  test('Renders spinners and data', async () => {

    const perusteStore = perusteStoreMock();
    const tiedoteStore = tiedoteStoreMock();

    const osaamismerkitStore = createMockedStore(OsaamismerkitStore, {
      kategoriat: computedValue(() => []),
      fetchKategoriat: () => Promise.resolve(),
    });

    const tietoapalvelustaStore = createMockedStore(TietoapalvelustaStore, {
      tietoapalvelusta: computedValue(() => ({})),
      tiedotteet: computedValue(() => []),
    });

    const julkaistutKoulutustyypitStore = createMockedStore(JulkaistutKoulutustyypitStore, {
      julkaistutKoulutustyypit: computedValue(() => ['koulutustyyppi_muu']),
      muuLukumaarat: computedValue(() => 1),
      digitaalinenOsaaminen: computedValue(() => []),
      koulutustyyppiLukumaarat: computedValue(() => [{ koulutustyyppi: 'koulutust', lukumaara: 1 }]),
    });


    const wrapper = mount(RouteHome as any, {
      localVue,
      propsData: {
        perusteStore,
        tiedoteStore,
        julkaistutKoulutustyypitStore,
        tietoapalvelustaStore,
        osaamismerkitStore,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
        $route,
      },
    });

    expect(tiedoteStore.getUusimmat).toBeCalledTimes(1);
    expect(wrapper.findAll('.oph-spinner').length).toEqual(1);

    tiedoteStore.uusimmatTiedotteet = [{
      luotu: 'aikaleima_1234' as any,
      otsikko: {
        fi: 'uutinen_1234',
      } as any,
    }];

    await localVue.nextTick();

    expect(wrapper.findAll('.oph-spinner').length).toEqual(0);
  });
});
