import { mount, createLocalVue } from '@vue/test-utils';
import PerusteTile from './PerusteTile.vue';
import { KieliStore } from '@shared/stores/kieli';
import { mocks, stubs } from '@shared/utils/jestutils';


describe('PerusteTile ', () => {
  const localVue = createLocalVue();
  KieliStore.setup(localVue);

  const peruste = {
    id: 42,
    nimi: {
      fi: 'peruste42',
    } as any,
    diaarinumero: '1234-1234',
    toteutus: 'yksinkertainen',
    voimassaoloAlkaa: 123456,
  } as any;

  test('Renders', async () => {
    const wrapper = mount(PerusteTile  as any, {
      localVue,
      propsData: {
        peruste,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
        $sd: (x) => 'sd_' + x,
      },
    });

    await localVue.nextTick();
    expect(wrapper.html()).toContain('peruste42');
    expect(wrapper.html()).toContain('1234-1234');
    expect(wrapper.html()).toContain('sd_123456');
  });
});

