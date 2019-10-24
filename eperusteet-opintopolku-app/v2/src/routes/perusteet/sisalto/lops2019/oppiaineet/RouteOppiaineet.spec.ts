import { mount, createLocalVue } from '@vue/test-utils';
import RouteOppiaineet from './RouteOppiaineet.vue';
import { mocks, stubs, lops2019OppiaineetStoreMock } from '@/jestutils';
import { KieliStore } from '@shared/stores/kieli';


describe('RouteOppiaineet', () => {
  const localVue = createLocalVue();
  KieliStore.setup(localVue);

  test('Renders', async () => {
    const lops2019oppiaineetStore = lops2019OppiaineetStoreMock();

    const wrapper = mount(RouteOppiaineet as any, {
      localVue,
      propsData: {
        lops2019oppiaineetStore,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
      },
    });

    expect(wrapper.findAll('.oph-spinner').length).toEqual(1);

    lops2019oppiaineetStore.perusteId = 42;
    lops2019oppiaineetStore.oppiaineet = [];

    expect(wrapper.findAll('.oph-spinner').length).toEqual(0);

    lops2019oppiaineetStore.oppiaineet = [{
      id: 1,
      nimi: {
        fi: 'Matematiikka'
      } as any
    }];

    expect(wrapper.html()).toContain('Matematiikka');

  });
});
