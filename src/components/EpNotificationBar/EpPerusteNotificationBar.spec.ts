import { mount, createLocalVue } from '@vue/test-utils';
import EpPerusteNotificationBar from './EpPerusteNotificationBar.vue';
import { Kielet } from '@shared/stores/kieli';
import { mocks, stubs } from '@shared/utils/jestutils';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';
import { Kieli } from '@shared/tyypit';

describe('EpPerusteNotificationBar', () => {
  const localVue = createLocalVue();
  localVue.use(VueI18n);
  localVue.use(Kielet, {
    messages: {
      fi: {
        ...require('@shared/translations/locale-fi.json'),
      },
      sv: {
        ...require('@shared/translations/locale-sv.json'),
      },
    },
  });
  localVue.use(new Kaannos());

  Kielet.setUiKieli(Kieli.fi);

  const datePlusDays = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };

  const peruste = {
    voimassaoloAlkaa: datePlusDays(0).getTime(),
    kielet: ['fi', 'sv'],
  };

  const komponenttiStubit = {
    ...stubs,
    EpNotificationBar: true,
  };

  const emptyResultTrue = (wrapper: any) => {
    expect(wrapper.html()).not.toContain('katselet-tulevaisuudessa-voimaantulevaa-perustetta');
    expect(wrapper.html()).not.toContain('katselet-talla-hetkella-voimassaolevaa-perustetta');
  };

  describe('ilman muutosmaarayksia', () => {
    const currentRoute = {
      params: {
        lang: 'fi',
      },
    };
    const wrapper = mount(EpPerusteNotificationBar as any, {
      localVue,
      propsData: {
        peruste,
        julkaisut: [
          {
            revision: 1,
          },
          {
            revision: 2,
          },
        ],
      },
      stubs: {
        ...komponenttiStubit,
      },
      mocks: {
        ...mocks,
        $route: currentRoute,
        $router: {
          async push(route) {
            currentRoute.params = route.params || {};
            wrapper.vm.$forceUpdate();
          },
        },
      },
    });

    test('current julkaisu', async () => {
      emptyResultTrue(wrapper);

      await wrapper.vm.$router.push({ params: { revision: '1' } });
      await wrapper.vm.$nextTick();

      emptyResultTrue(wrapper);
    });
  });

  describe('muutosmaarays voimassa', () => {
    const currentRoute = {
      params: {
        lang: 'fi',
      },
    };
    const wrapper = mount(EpPerusteNotificationBar as any, {
      localVue,
      propsData: {
        peruste,
        julkaisut: [
          {
            revision: 1,
          },
          {
            revision: 2,
            muutosmaarays: {
              voimassaoloAlkaa: datePlusDays(-1).getTime(),
            },
          },
        ],
      },
      stubs: {
        ...komponenttiStubit,
      },
      mocks: {
        ...mocks,
        $route: currentRoute,
        $router: {
          async push(route) {
            currentRoute.params = route.params || {};
            wrapper.vm.$forceUpdate();
          },
        },
      },
    });

    test('current julkaisu', async () => {
      emptyResultTrue(wrapper);

      await wrapper.vm.$router.push({ params: { revision: '1' } });
      await wrapper.vm.$nextTick();

      emptyResultTrue(wrapper);
    });
  });

  describe('muutosmaarays tulossa voimaan', () => {
    const currentRoute = {
      params: {
        lang: 'fi',
      },
    };
    const wrapper = mount(EpPerusteNotificationBar as any, {
      localVue,
      propsData: {
        peruste,
        julkaisut: [
          {
            revision: 1,
          },
          {
            revision: 2,
            muutosmaarays: {
              voimassaoloAlkaa: datePlusDays(5).getTime(),
            },
          },
        ],
      },
      stubs: {
        ...komponenttiStubit,
      },
      mocks: {
        ...mocks,
        $route: currentRoute,
        $router: {
          async push(route) {
            currentRoute.params = route.params || {};
            wrapper.vm.$forceUpdate();
          },
        },
      },
    });

    test('one julkaisu', async () => {
      await wrapper.vm.$router.push({ params: { revision: '2' } });
      await wrapper.vm.$nextTick();

      expect(wrapper.html()).toContain('katselet-tulevaisuudessa-voimaantulevaa-perustetta');

      await wrapper.vm.$router.push({ params: { revision: '1' } });
      await wrapper.vm.$nextTick();

      expect(wrapper.html()).toContain('katselet-talla-hetkella-voimassaolevaa-perustetta');
    });
  });

  describe('muutosmaarays tulossa voimaan, selataan aiempaa', () => {
    const currentRoute = {
      params: {
        lang: 'fi',
      },
    };
    const wrapper = mount(EpPerusteNotificationBar as any, {
      localVue,
      propsData: {
        peruste,
        julkaisut: [
          {
            revision: 1,
          },
          {
            revision: 2,
          },
          {
            revision: 3,
            muutosmaarays: {
              voimassaoloAlkaa: datePlusDays(1).getTime(),
            },
          },
        ],
      },
      stubs: {
        ...komponenttiStubit,
      },
      mocks: {
        ...mocks,
        $route: currentRoute,
        $router: {
          async push(route) {
            currentRoute.params = route.params || {};
            wrapper.vm.$forceUpdate();
          },
        },
      },
    });

    test('ensimmainen julkaisu', async () => {
      await wrapper.vm.$router.push({ params: { revision: '3' } });
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toContain('katselet-tulevaisuudessa-voimaantulevaa-perustetta');

      await wrapper.vm.$router.push({ params: { revision: '2' } });
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toContain('katselet-talla-hetkella-voimassaolevaa-perustetta');

      await wrapper.vm.$router.push({ params: { revision: '1' } });
      await wrapper.vm.$nextTick();

      emptyResultTrue(wrapper);
    });
  });

  describe('muutosmaarays voimassa ja tulossa voimaan, selataan aiempia', () => {
    const currentRoute = {
      params: {
        lang: 'fi',
      },
    };

    const wrapper = mount(EpPerusteNotificationBar as any, {
      localVue,
      propsData: {
        peruste,
        julkaisut: [
          {
            revision: 1,
          },
          {
            revision: 2,
            muutosmaarays: {
              voimassaoloAlkaa: datePlusDays(-1).getTime(),
            },
          },
          {
            revision: 3,
          },
          {
            revision: 4,
          },
          {
            revision: 5,
            muutosmaarays: {
              voimassaoloAlkaa: datePlusDays(2).getTime(),
            },
          },
          {
            revision: 6,
          },
        ],
      },
      stubs: {
        ...komponenttiStubit,
      },
      mocks: {
        ...mocks,
        $route: currentRoute,
        $router: {
          async push(route) {
            currentRoute.params = route.params || {};
            wrapper.vm.$forceUpdate();
          },
        },
      },
    });

    test('muutosmaarays 6 julkaisua', async () => {
      await wrapper.vm.$router.push({ params: { revision: '6' } });
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toContain('katselet-tulevaisuudessa-voimaantulevaa-perustetta');

      await wrapper.vm.$router.push({ params: { revision: '5' } });
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toContain('katselet-tulevaisuudessa-voimaantulevaa-perustetta');

      await wrapper.vm.$router.push({ params: { revision: '4' } });
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toContain('katselet-talla-hetkella-voimassaolevaa-perustetta');

      await wrapper.vm.$router.push({ params: { revision: '3' } });
      await wrapper.vm.$nextTick();
      emptyResultTrue(wrapper);

      await wrapper.vm.$router.push({ params: { revision: '2' } });
      await wrapper.vm.$nextTick();
      emptyResultTrue(wrapper);

      await wrapper.vm.$router.push({ params: { revision: '1' } });
      await wrapper.vm.$nextTick();
      emptyResultTrue(wrapper);
    });
  });
});
