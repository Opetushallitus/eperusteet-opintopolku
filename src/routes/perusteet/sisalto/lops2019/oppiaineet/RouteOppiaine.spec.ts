import { mount } from '@vue/test-utils';
import RouteOppiaine from './RouteOppiaine.vue';
import { vi } from 'vitest';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { useRoute, useRouter } from 'vue-router';

vi.mock('@/stores/PerusteCacheStore', () => ({
  getCachedPerusteStore: vi.fn(),
}));

vi.mock('vue-router', () => ({ useRoute: vi.fn(), useRouter: vi.fn() }));
vi.mocked(useRoute).mockReturnValue({ params: {} } as any);

describe('RouteOppiaine', () => {
  test('Renders', async () => {
    const perusteDataStore = {
      getJulkaistuPerusteSisalto: () => {
        return {
          nimi: {
            fi: 'Matematiikka',
          } as any,
          koodi: {
            arvo: 'MA',
          },
          tehtava: {
            kuvaus: {
              fi: 'Oppiaineen tehtavä',
            } as any,
          },
          laajaAlaisetOsaamiset: {
            kuvaus: {
              fi: 'Oppiaineen laaja-alaiset osaamiset',
            } as any,
          },
          tavoitteet: {
            kuvaus: {
              fi: 'Oppiaineen tavoitteet',
            } as any,
            tavoitealueet: [
              {
                kohde: {
                  fi: 'Tavoitealueen kohde',
                } as any,
                nimi: {
                  fi: 'Tavoitealueen nimi',
                } as any,
                tavoitteet: [
                  {
                    fi: 'Tavoite 1',
                  } as any,
                ],
              },
            ],
          },
          arviointi: {
            kuvaus: {
              fi: 'Oppiaineen arviointi',
            } as any,
          },
          moduulit: [
            {
              nimi: {
                fi: 'Pakollinen moduuli',
              } as any,
              pakollinen: true,
              koodi: {
                arvo: 'a',
              },
            },
            {
              nimi: {
                fi: 'Valinnainen moduuli',
              } as any,
              pakollinen: false,
              koodi: {
                arvo: 'b',
              },
            },
          ],
          oppimaarat: [
            {
              nimi: {
                fi: 'Oppimaara',
              } as any,
            },
          ],
        };
      },
    };

    (getCachedPerusteStore as any).mockReturnValue(perusteDataStore);

    const wrapper = mount(RouteOppiaine as any, {
      global: {
        ...globalStubs,
      },
    });

    expect(wrapper.html()).toContain('Matematiikka');
    expect(wrapper.html()).toContain('MA');
    expect(wrapper.html()).toContain('Oppiaineen tehtavä');
    expect(wrapper.html()).toContain('Oppiaineen laaja-alaiset osaamiset');
    expect(wrapper.html()).toContain('Oppiaineen tavoitteet');
    expect(wrapper.html()).toContain('Tavoitealueen kohde');
    expect(wrapper.html()).toContain('Tavoitealueen nimi');
    expect(wrapper.html()).toContain('Tavoite 1');
    expect(wrapper.html()).toContain('Oppiaineen arviointi');
    expect(wrapper.html()).toContain('Pakollinen moduuli');
    expect(wrapper.html()).toContain('Valinnainen moduuli');
    expect(wrapper.html()).toContain('Oppimaara');
  });
});
