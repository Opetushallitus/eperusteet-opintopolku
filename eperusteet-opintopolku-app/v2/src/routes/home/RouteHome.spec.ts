import Vue from 'vue';
import { mount, createLocalVue } from '@vue/test-utils';
import RouteHome from './RouteHome.vue';
import { mocks, stubs, tiedoteStoreMock, perusteStoreMock } from '@/jestutils';


describe('RouteHome', () => {
  const localVue = createLocalVue();

  test('Renders spinners and data', async () => {
    const perusteStore = perusteStoreMock();
    const tiedoteStore = tiedoteStoreMock();

    const wrapper = mount(RouteHome as any, {
      localVue,
      propsData: {
        perusteStore,
        tiedoteStore,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
      },
    });

    expect(wrapper.findAll('.oph-spinner').length).toEqual(3);

    tiedoteStore.uusimmatTiedotteet = [{
      luotu: 'aikaleima_1234' as any,
      otsikko: {
        fi: 'uutinen_1234',
      } as any,
    }];

    perusteStore.uusimmat = [{
      id: 1,
      koulutustyyppi: 'koulutustyyppi_2',
      nimi: {
        fi: 'peruste1',
      } as any,
    }];

    perusteStore.perusteet = [{
      id: 2,
      koulutustyyppi: 'koulutustyyppi_2',
      nimi: {
        fi: 'peruste2',
      } as any,
    }];

    await localVue.nextTick();

    expect(wrapper.findAll('.oph-spinner').length).toEqual(0);
    expect(wrapper.html()).toContain('peruste1');
    expect(wrapper.html()).toContain('peruste2');
    expect(wrapper.html()).toContain('uutinen_1234');
    expect(perusteStore.getYleisetPerusteet).toBeCalledTimes(1);
    expect(perusteStore.getUusimmat).toBeCalledTimes(1);
    expect(tiedoteStore.getUusimmat).toBeCalledTimes(1);
  });

  test('Throws on wrong koulutustyyppi', async () => {
    const consoleSpy = jest.spyOn(console, 'error');
    consoleSpy.mockImplementation(() => {});

    const perusteStore = perusteStoreMock();
    const tiedoteStore = tiedoteStoreMock();

    const wrapper = mount(RouteHome as any, {
      localVue,
      propsData: {
        perusteStore,
        tiedoteStore,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
      },
    });

    expect(consoleSpy).not.toHaveBeenCalled();

    perusteStore.perusteet = [{
      id: 2,
      nimi: {
        fi: 'peruste2',
      } as any,
    }];

    expect(consoleSpy).toHaveBeenCalled();

  });

});
