import EpPerusteNotificationBar from './EpPerusteNotificationBar.vue';
import { createMount } from '@shared/utils/__tests__/stubs';
import { vi, beforeEach, describe, test, expect } from 'vitest';
import { useRoute } from 'vue-router';
import { nextTick } from 'vue';
import { wrap } from '../../../eperusteet-frontend-utils/vue/src/utils/jestutils';

export const mockRoute: any = {
  params: {},
};

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: vi.fn(),
}));

describe('EpPerusteNotificationBar', () => {

  beforeEach(() => {
    // Reset before each test
    mockRoute.params = {};
  });

  const datePlusDays = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };

  const peruste = {
    voimassaoloAlkaa: datePlusDays(0).getTime(),
    kielet: ['fi', 'sv'],
  };

  const emptyResultTrue = (wrapper: any) => {
    expect(wrapper.html()).not.toContain('katselet-tulevaisuudessa-voimaantulevaa-perustetta');
    expect(wrapper.html()).not.toContain('katselet-talla-hetkella-voimassaolevaa-perustetta');
  };

  const createMountWithProps = (revision, props: any) => {
    mockRoute.params.revision = revision;
    return createMount(EpPerusteNotificationBar as any, {
      propsData: {
        peruste,
        ...props,
      },
    });
  };

  describe('ilman muutosmaarayksia', () => {
    const propsData = {
      peruste,
      julkaisut: [
        {
          revision: 1,
        },
        {
          revision: 2,
        },
      ],
    };

    test('current julkaisu', async () => {
      let wrapper = createMountWithProps('2', propsData);
      emptyResultTrue(wrapper);

      wrapper = createMountWithProps('1', propsData);
      emptyResultTrue(wrapper);
    });
  });

  describe('muutosmaarays voimassa', () => {
    const currentRoute = {
      params: {
        lang: 'fi',
      },
    };
    const propsData = {
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
    };

    test('current julkaisu', async () => {
      let wrapper = createMountWithProps('2', propsData);
      emptyResultTrue(wrapper);

      wrapper = createMountWithProps('1', propsData);
      emptyResultTrue(wrapper);
    });
  });

  describe('muutosmaarays tulossa voimaan', () => {
    const propsData = {
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
    };

    test('one julkaisu', async () => {
      let wrapper = createMountWithProps('2', propsData);
      expect(wrapper.html()).toContain('katselet-tulevaisuudessa-voimaantulevaa-perustetta');

      wrapper = createMountWithProps('1', propsData);
      expect(wrapper.html()).toContain('katselet-talla-hetkella-voimassaolevaa-perustetta');
    });
  });

  describe('muutosmaarays tulossa voimaan, selataan aiempaa', () => {
    const currentRoute = {
      params: {
        lang: 'fi',
      },
    };
    const propsData= {
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
    };

    test('ensimmainen julkaisu', async () => {
      let wrapper = createMountWithProps('3', propsData);
      expect(wrapper.html()).toContain('katselet-tulevaisuudessa-voimaantulevaa-perustetta');

      wrapper = createMountWithProps('2', propsData);
      expect(wrapper.html()).toContain('katselet-talla-hetkella-voimassaolevaa-perustetta');

      wrapper = createMountWithProps('1', propsData);
      emptyResultTrue(wrapper);
    });
  });

  describe('muutosmaarays voimassa ja tulossa voimaan, selataan aiempia', () => {
    const currentRoute = {
      params: {
        lang: 'fi',
      },
    };

    const propsData = {
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
    };

    test('muutosmaarays 6 julkaisua', async () => {
      let wrapper = createMountWithProps('6', propsData);
      expect(wrapper.html()).toContain('katselet-tulevaisuudessa-voimaantulevaa-perustetta');

      wrapper = createMountWithProps('5', propsData);
      expect(wrapper.html()).toContain('katselet-tulevaisuudessa-voimaantulevaa-perustetta');

      wrapper = createMountWithProps('4', propsData);
      expect(wrapper.html()).toContain('katselet-talla-hetkella-voimassaolevaa-perustetta');

      wrapper = createMountWithProps('3', propsData);
      emptyResultTrue(wrapper);

      wrapper = createMountWithProps('2', propsData);
      emptyResultTrue(wrapper);

      wrapper = createMountWithProps('1', propsData);
      emptyResultTrue(wrapper);
    });
  });
});

