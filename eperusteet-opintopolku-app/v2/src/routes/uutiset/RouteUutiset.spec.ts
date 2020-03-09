import { mount, createLocalVue } from '@vue/test-utils';
import RouteUutiset from './RouteUutiset.vue';
import { tiedoteStoreMock } from '@/storeMocks';
import { mocks, stubs } from '@shared/utils/jestutils';
import { Kielet } from '@shared/stores/kieli';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';

describe('RouteUutinen', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders spinners and data', async () => {
    const tiedoteStore = tiedoteStoreMock();

    const wrapper = mount(RouteUutiset as any, {
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

