import { mount, createLocalVue } from '@vue/test-utils';
import RoutePerusteTiedot from './RoutePerusteTiedot.vue';
import { perusteDataStoreMock } from '@/storeMocks';
import { Kielet } from '@shared/stores/kieli';
import { mocks, stubs } from '@shared/utils/jestutils';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';
import { Kieli } from '@shared/tyypit';

describe('RoutePerusteTiedot', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders', async () => {
    const perusteDataStore = perusteDataStoreMock({
      async getKorvaavatPerusteet() {},
      peruste: {
        id: 42,
        nimi: {
          fi: 'perusteen nimi',
        } as any,
        muutosmaaraykset: [{
          id: 1234,
          nimi: {
            fi: 'muutosmaarays',
          } as any,
          url: {
            fi: 'maarayksenosoite',
          } as any,
          liitteet: {
            liite: {
              id: '123',
              nimi: {
                fi: 'liite',
              } as any,
            },
          },
        }],
      },
      perusteId: 42,
    });

    perusteDataStore.kvLiitteet = { fi: 'kvliiteurl-fi' };

    const wrapper = mount(RoutePerusteTiedot as any, {
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

    await localVue.nextTick();

    expect(perusteDataStore.getKorvaavatPerusteet).toHaveBeenCalledTimes(1);
    expect(wrapper.html()).toContain('perusteen nimi');

    expect(wrapper.html()).toContain('kvliiteurl-fi');
    expect(wrapper.html()).toContain('lataa-kvliite-fi');
  });
});
