import '@/test/testInit';
import RouteTekstikappale from './RouteTekstikappale.vue';
import { createMount } from '@shared/utils/__tests__/stubs';
import { createPerusteOsaStore } from '@/stores/PerusteenOsaStore';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';

describe('RouteTekstikappale', () => {

  test('Renders', async () => {

    const perusteenOsaStore = {
      perusteenOsaId: 2,
      perusteenOsa: {
        id: 2,
        nimi: {
          fi: 'tekstikappaleen nimi',
        },
        teksti: {
          fi: 'tekstikappaleen teksti',
        },
      },
    };

    const perusteDataStore = {
      current: {},
    };

    (createPerusteOsaStore as any).mockReturnValue(perusteenOsaStore);
    (getCachedPerusteStore as any).mockReturnValue(perusteDataStore);

    const wrapper = createMount(RouteTekstikappale);

    expect(wrapper.html()).toContain('tekstikappaleen nimi');
    expect(wrapper.html()).toContain('tekstikappaleen teksti');
  });

  test('Renders alikappaleet', async () => {

    const perusteenOsaStore = {
      perusteenOsaId: 2,
      perusteenOsa: {
        id: 2,
        nimi: {
          fi: 'tekstikappaleen nimi',
        },
        teksti: {
          fi: 'tekstikappaleen teksti',
        },
      },
      perusteenOsaViite: {
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
      },
    };

    const perusteDataStore = {
      current: {},
    };

    (createPerusteOsaStore as any).mockReturnValue(perusteenOsaStore);
    (getCachedPerusteStore as any).mockReturnValue(perusteDataStore);

    const wrapper = createMount(RouteTekstikappale);

    expect(wrapper.html()).toContain('tekstikappaleen nimi');
    expect(wrapper.html()).toContain('tekstikappaleen teksti');
    expect(wrapper.html()).toContain('aliluvun nimi');
    expect(wrapper.html()).toContain('aliluvun teksti');
    expect(wrapper.html()).toContain('alialiluvun nimi');
    expect(wrapper.html()).toContain('alialiluvun teksti');
  });
});
