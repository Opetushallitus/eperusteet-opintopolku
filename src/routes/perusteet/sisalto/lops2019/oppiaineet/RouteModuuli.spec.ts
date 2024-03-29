import { mount, createLocalVue } from '@vue/test-utils';
import RouteModuuli from './RouteModuuli.vue';
import { mocks, stubs } from '@shared/utils/jestutils';
import { lops2019ModuuliStoreMock, perusteDataStoreMock } from '@/storeMocks';
import { Kielet } from '@shared/stores/kieli';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';

describe('RouteModuuli', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders', async () => {
    const perusteDataStore = perusteDataStoreMock();
    perusteDataStore.getJulkaistuPerusteSisalto = () => {
      return {
        nimi: {
          fi: 'Luvut ja yhtälöt',
        } as any,
        koodi: {
          arvo: 'MAY',
        },
        pakollinen: true,
        laajuus: 2,
        tavoitteet: {
          kohde: {
            fi: 'Tavoitteiden kohde',
          } as any,
          tavoitteet: [
            {
              fi: 'Tavoitteiden tavoite',
            } as any,
          ],
        },
        sisallot: [
          {
            kohde: {
              fi: 'Sisältöjen kohde',
            } as any,
            sisallot: [
              {
                fi: 'Sisältöjen sisältö',
              } as any,
            ],
          },
        ],
      };
    };

    const wrapper = mount(RouteModuuli as any, {
      localVue,
      propsData: {
        perusteDataStore,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
        $route: {
          params: {},
        },
      },
    });

    expect(wrapper.html()).toContain('Luvut ja yhtälöt');
    expect(wrapper.html()).toContain('MAY');
    // expect(wrapper.html()).toContain('pakollinen');
    // expect(wrapper.html()).toContain('<div><strong>laajuus</strong> <p>2</p></div>');
    expect(wrapper.html()).toContain('Tavoitteiden kohde');
    expect(wrapper.html()).toContain('Tavoitteiden tavoite');
    expect(wrapper.html()).toContain('Sisältöjen kohde');
    expect(wrapper.html()).toContain('Sisältöjen sisältö');
  });
});
