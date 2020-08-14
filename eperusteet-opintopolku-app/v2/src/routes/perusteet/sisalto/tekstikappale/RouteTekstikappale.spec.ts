import { mount, createLocalVue } from '@vue/test-utils';
import RouteTekstikappale from './RouteTekstikappale.vue';
import { mocks, stubs } from '@shared/utils/jestutils';
import { perusteDataStoreMock, perusteenOsaStoreMock } from '@/storeMocks';
import { Kielet } from '@shared/stores/kieli';
import { ViiteLaaja } from '@shared/api/eperusteet';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';

describe('RouteTekstikappale', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders', async () => {
    const perusteDataStore = perusteDataStoreMock({});
    const perusteenOsaStore = perusteenOsaStoreMock({});

    perusteenOsaStore.perusteenOsaId = 2;
    perusteenOsaStore.perusteenOsa = {
      id: 2,
      nimi: {
        fi: 'tekstikappaleen nimi',
      },
      teksti: {
        fi: 'tekstikappaleen teksti',
      },
    } as any;

    const wrapper = mount(RouteTekstikappale as any, {
      localVue,
      propsData: {
        perusteDataStore,
        perusteenOsaStore,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
      },
    });

    expect(wrapper.html()).toContain('tekstikappaleen nimi');
    expect(wrapper.html()).toContain('tekstikappaleen teksti');
  });

  test('Renders alikappaleet', async () => {
    const perusteDataStore = perusteDataStoreMock();
    const perusteenOsaStore = perusteenOsaStoreMock();

    perusteenOsaStore.perusteenOsaId = 2;
    perusteenOsaStore.perusteenOsa = {
      id: 2,
      nimi: {
        fi: 'tekstikappaleen nimi',
      },
      teksti: {
        fi: 'tekstikappaleen teksti',
      },
    } as any;
    perusteenOsaStore.perusteenOsaViite = {
      perusteenOsa: {
        id: 2,
        nimi: {
          fi: 'tekstikappaleen nimi',
        },
        teksti: {
          fi: 'tekstikappaleen teksti',
        },
      },
      lapset: [
        {
          perusteenOsa: {
            nimi: {
              fi: 'aliluvun nimi',
            },
            teksti: {
              fi: 'aliluvun teksti',
            },
          },
          lapset: [
            {
              perusteenOsa: {
                nimi: {
                  fi: 'alialiluvun nimi',
                },
                teksti: {
                  fi: 'alialiluvun teksti',
                },
              },
            },
          ],
        },
      ],
    } as ViiteLaaja;

    const wrapper = mount(RouteTekstikappale as any, {
      localVue,
      propsData: {
        perusteDataStore,
        perusteenOsaStore,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
      },
    });

    expect(wrapper.html()).toContain('tekstikappaleen nimi');
    expect(wrapper.html()).toContain('tekstikappaleen teksti');
    expect(wrapper.html()).toContain('aliluvun nimi');
    expect(wrapper.html()).toContain('aliluvun teksti');
    expect(wrapper.html()).toContain('alialiluvun nimi');
    expect(wrapper.html()).toContain('alialiluvun teksti');
  });
});
