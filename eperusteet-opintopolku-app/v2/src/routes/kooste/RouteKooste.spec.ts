import { mount, createLocalVue } from '@vue/test-utils';
import RouteKooste from './RouteKooste.vue';
import { tiedoteStoreMock, perusteKoosteStoreMock } from '@/storeMocks';
import { KieliStore } from '@shared/stores/kieli';
import { mocks, stubs } from '@shared/utils/jestutils';


describe('RouteKooste', () => {
  const localVue = createLocalVue();
  KieliStore.setup(localVue, {
    messages: {
      fi: {
        'kooste': 'Kooste',
      }
    },
  });

  test('Renders', async () => {
    const perusteKoosteStore = perusteKoosteStoreMock();
    const tiedoteStore = tiedoteStoreMock();

    const wrapper = mount(RouteKooste as any, {
      localVue,
      propsData: {
        perusteKoosteStore,
        tiedoteStore,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
      },
    });

    perusteKoosteStore.koulutustyyppi = 'koulutustyyppi_2';

    perusteKoosteStore.tiedotteet = [{
      id: 100,
      otsikko: {
        fi: 'tiedote100',
      } as any,
    }];

    perusteKoosteStore.opetussuunnitelmat = [{
      id: 100,
      nimi: {
        fi: 'ops100',
      } as any,
      organisaatiot: [{
        tyypit: ['Oppilaitos'],
        nimi: {
          fi: 'Oppilaitoksen nimi',
        } as any,
      }, {
        tyypit: ['Koulutustoimija'],
        nimi: {
          fi: 'Toimijan nimi',
        } as any,
      }],
    }];

    perusteKoosteStore.perusteet = [{
      id: 42,
      nimi: {
        fi: 'peruste42',
      } as any,
    }];

    await localVue.nextTick();
    expect(wrapper.html()).toContain('ops100');
    expect(wrapper.html()).toContain('tiedote100');
    expect(wrapper.html()).toContain('peruste42');
    expect(wrapper.html()).toContain('Oppilaitoksen nimi');
    expect(wrapper.html()).toContain('Toimijan nimi');
  });
});
