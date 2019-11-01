import { mount, createLocalVue } from '@vue/test-utils';
import RouteOppiaineet from './RouteOppiaineet.vue';
import { lops2019OppiaineetStoreMock, perusteDataStoreMock } from '@/storeMocks';
import { KieliStore } from '@shared/stores/kieli';
import { mocks, stubs } from '@shared/utils/jestutils';


describe('RouteOppiaineet', () => {
  const localVue = createLocalVue();
  KieliStore.setup(localVue);

  test('Renders', async () => {
    const perusteDataStore = perusteDataStoreMock({
      current: {
        children: [
          {
            label: 'Matematiikka',
          },
        ],
      } as any
    });
    const lops2019oppiaineetStore = lops2019OppiaineetStoreMock();

    const wrapper = mount(RouteOppiaineet as any, {
      localVue,
      propsData: {
        perusteDataStore,
        lops2019oppiaineetStore,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
      },
    });

    expect(wrapper.html()).toContain('Matematiikka');

  });
});
