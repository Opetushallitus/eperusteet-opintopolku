import { mount, createLocalVue } from '@vue/test-utils';
import RouteOppiaine from './RouteOppiaine.vue';
import { mocks, stubs } from '@shared/utils/jestutils';
import { perusteDataStoreMock, lops2019OppiaineStoreMock } from '@/storeMocks';
import { Kielet } from '@shared/stores/kieli';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';

describe('RouteOppiaine', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders', async () => {
    const perusteDataStore = perusteDataStoreMock();
    perusteDataStore.getJulkaistuPerusteSisalto = () => {
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
    };

    const wrapper = mount(RouteOppiaine as any, {
      localVue,
      propsData: {
        perusteDataStore,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
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
