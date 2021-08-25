import { mount, createLocalVue } from '@vue/test-utils';
import PerusteTile from './PerusteTile.vue';
import { Kielet } from '@shared/stores/kieli';
import { mocks, stubs } from '@shared/utils/jestutils';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';

describe('PerusteTile ', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

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
      localVue,
      propsData: {
        julkaisu,
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
    expect(wrapper.html()).toContain('sd_123456');
  });
});
