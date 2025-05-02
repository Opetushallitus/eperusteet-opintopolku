import { mount } from '@vue/test-utils';
import PerusteTile from './PerusteTile.vue';
import { globalStubs } from '@shared/utils/__tests__/stubs';
import { nextTick } from 'vue';

describe('PerusteTile ', () => {
  const julkaisu = {
    id: 42,
    nimi: {
      fi: 'peruste42',
    } as any,
    diaarinumero: '1234-1234',
    toteutus: 'yksinkertainen',
    voimassaoloAlkaa: 123456,
  } as any;

  test('Renders', async () => {
    const wrapper = mount(PerusteTile as any, {
      propsData: {
        julkaisu,
      },
      global: {
        ...globalStubs,
      },
    });

    nextTick();
    expect(wrapper.html()).toContain('peruste42');
    expect(wrapper.html()).toContain('123456');
  });
});
