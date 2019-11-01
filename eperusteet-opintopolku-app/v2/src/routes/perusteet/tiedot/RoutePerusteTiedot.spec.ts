import { mount, createLocalVue } from '@vue/test-utils';
import RoutePerusteTiedot from './RoutePerusteTiedot.vue';
import { perusteDataStoreMock } from '@/storeMocks';
import { KieliStore } from '@shared/stores/kieli';
import { mocks, stubs } from '@shared/utils/jestutils';


describe('RoutePerusteTiedot', async () => {
  const localVue = createLocalVue();
  KieliStore.setup(localVue);

  test('Renders', async () => {
    const perusteDataStore = perusteDataStoreMock({
      async getKorvaavatPerusteet() {},
    });

    perusteDataStore.peruste = {
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
        }
      }],
    };

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
    await localVue.nextTick();
    await localVue.nextTick();
    await localVue.nextTick();
    await localVue.nextTick();

    expect(perusteDataStore.getKorvaavatPerusteet).toHaveBeenCalledTimes(1);
    expect(wrapper.html()).toContain('perusteen nimi');

  });
});
