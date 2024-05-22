import { mount, createLocalVue } from '@vue/test-utils';
import RouteHome from './RouteHome.vue';
import { mock, mocks, stubs } from '@shared/utils/jestutils';
import { tiedoteStoreMock, perusteStoreMock } from '@/storeMocks';
import { JulkaistutKoulutustyypitStore } from '@/stores/JulkaistutKoulutustyypitStore';
import { TietoapalvelustaStore } from '@/stores/TietoapalvelustaStore';

describe('RouteHome', () => {
  const localVue = createLocalVue();
  const julkaistutKoulutustyypitStore = mock(JulkaistutKoulutustyypitStore);

  const $route = {
    params: {
      lang: 'fi',
    },
  };

  test('Renders spinners and data', async () => {
    const perusteStore = perusteStoreMock();
    const tiedoteStore = tiedoteStoreMock();
    const tietoapalvelustaStore = mock(TietoapalvelustaStore);
    tietoapalvelustaStore.state.tietoapalvelusta = null;

    const wrapper = mount(RouteHome as any, {
      localVue,
      propsData: {
        perusteStore,
        tiedoteStore,
        julkaistutKoulutustyypitStore,
        tietoapalvelustaStore,
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
