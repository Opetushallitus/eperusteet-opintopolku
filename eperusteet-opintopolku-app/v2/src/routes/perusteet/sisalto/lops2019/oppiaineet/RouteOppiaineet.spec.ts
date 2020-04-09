import { mount, createLocalVue } from '@vue/test-utils';
import RouteOppiaineet from './RouteOppiaineet.vue';
import { lops2019OppiaineetStoreMock, perusteDataStoreMock } from '@/storeMocks';
import { Kielet } from '@shared/stores/kieli';
import { mocks, stubs } from '@shared/utils/jestutils';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';

describe('RouteOppiaineet', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  Kielet.install(localVue);
  localVue.use(new Kaannos());

  test('Renders', async () => {
    const perusteDataStore = perusteDataStoreMock({
      current: {
        children: [
          {
            label: {
              fi: 'Matematiikka',
            },
          },
          {
            label: {
              fi: 'Äidinkieli ja kirjallisuus',
            },
          },
        ],
      } as any,
    });
    const lops2019OppiaineetStore = lops2019OppiaineetStoreMock();

    const wrapper = mount(RouteOppiaineet as any, {
      localVue,
      propsData: {
        perusteDataStore,
        lops2019OppiaineetStore,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
      },
    });

    expect(wrapper.html()).toContain('Matematiikka');
    expect(wrapper.html()).toContain('Äidinkieli ja kirjallisuus');
  });
});
