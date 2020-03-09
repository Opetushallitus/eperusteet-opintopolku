import { mount, createLocalVue } from '@vue/test-utils';
import RouteUutinen from './RouteUutinen.vue';
import { tiedoteStoreMock } from '@/storeMocks';
import { mocks, stubs } from '@shared/utils/jestutils';
import { Kielet } from '@shared/stores/kieli';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';

describe('RouteHome', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders spinners and data', async () => {
    const tiedoteStore = tiedoteStoreMock();

    const wrapper = mount(RouteUutinen as any, {
      localVue,
      propsData: {
        tiedoteStore,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
      },
    });

    await localVue.nextTick();
  });

});

