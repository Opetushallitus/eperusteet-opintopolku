import { mount, createLocalVue } from '@vue/test-utils';
import RouteLaajaAlaiset from './RouteLaajaAlaiset.vue';
import { mocks, stubs } from '@shared/utils/jestutils';
import { perusteDataStoreMock, lops2019LaajaAlaisetStoreMock } from '@/storeMocks';
import { KieliStore } from '@shared/stores/kieli';


describe('RouteLaajaAlaiset', async () => {
  const localVue = createLocalVue();
  KieliStore.setup(localVue);
  test('Renders', async () => {
    const perusteDataStore = perusteDataStoreMock();
    const lops2019LaajaAlaisetStore = lops2019LaajaAlaisetStoreMock();

    lops2019LaajaAlaisetStore.laajaAlaisetKokonaisuus = {
      laajaAlaisetOsaamiset: [
        {
          nimi: {
            fi: 'Hyvinvointiosaaminen'
          } as any,
          koodi: {
            arvo: '01'
          },
          kuvaus: {
            fi: 'Hyvinvointiosaaminen kuvaus'
          } as any
        },
        {
          nimi: {
            fi: 'Vuorovaikutusosaaminen'
          } as any,
          koodi: {
            arvo: '02'
          },
          kuvaus: {
            fi: 'Vuorovaikutusosaaminen kuvaus'
          } as any
        }
      ]
    };

    const wrapper = mount(RouteLaajaAlaiset as any, {
      localVue,
      propsData: {
        perusteDataStore,
        lops2019LaajaAlaisetStore,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
      },
    });

    expect(wrapper.html()).toContain('Hyvinvointiosaaminen');
    expect(wrapper.html()).toContain('01');
    expect(wrapper.html()).toContain('Hyvinvointiosaaminen kuvaus');

    expect(wrapper.html()).toContain('Vuorovaikutusosaaminen');
    expect(wrapper.html()).toContain('02');
    expect(wrapper.html()).toContain('Vuorovaikutusosaaminen kuvaus');
  });
});
