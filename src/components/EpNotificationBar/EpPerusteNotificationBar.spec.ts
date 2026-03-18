import EpPerusteNotificationBar from './EpPerusteNotificationBar.vue';
import { createMount } from '@shared/utils/__tests__/stubs';
import { vi, beforeEach, describe, test, expect } from 'vitest';

export const mockRoute: any = {
  params: {},
  matched: [{ name: 'peruste' }],
};

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: vi.fn(),
}));

describe('EpPerusteNotificationBar', () => {

  beforeEach(() => {
    mockRoute.params = {};
    mockRoute.matched = [{ name: 'peruste' }];
  });

  const datePlusDays = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.getTime();
  };

  const ts = {
    [-1]: datePlusDays(-1),
    [0]: datePlusDays(0),
    [1]: datePlusDays(1),
    [2]: datePlusDays(2),
    [3]: datePlusDays(3),
    [4]: datePlusDays(4),
    [5]: datePlusDays(5),
    [6]: datePlusDays(6),
  };

  const peruste = {
    voimassaoloAlkaa: ts[0],
    kielet: ['fi', 'sv'],
    viimeisinJulkaisuAika: ts[-1],
  };

  const perusteet = [
    { ...peruste },
    { ...peruste, viimeisinJulkaisuAika: ts[0] },
    { ...peruste, viimeisinJulkaisuAika: ts[1] },
    { ...peruste, viimeisinJulkaisuAika: ts[2] },
    { ...peruste, viimeisinJulkaisuAika: ts[3] },
    { ...peruste, viimeisinJulkaisuAika: ts[4] },
    { ...peruste, viimeisinJulkaisuAika: ts[5] },
    { ...peruste, viimeisinJulkaisuAika: ts[6] },
  ];

  const emptyResultTrue = (wrapper: any) => {
    expect(wrapper.html()).not.toContain('katselet-tulevaisuudessa-voimaantulevaa-perustetta');
    expect(wrapper.html()).not.toContain('katselet-talla-hetkella-voimassaolevaa-perustetta');
  };

  const createMountWithProps = (peruste: any, props: any) => {
    return createMount(EpPerusteNotificationBar as any, {
      propsData: {
        ...props,
        peruste,
      },
    });
  };

  describe('ilman muutosmaarayksia', () => {
    const propsData = {
      peruste: perusteet[0],
      perusteenJulkaisut: [
        {
          revision: 1,
        },
        {
          revision: 2,
        },
      ],
    };

    test('current julkaisu', async () => {
      let wrapper = createMountWithProps(perusteet[1], propsData);
      emptyResultTrue(wrapper);

      wrapper = createMountWithProps(perusteet[0], propsData);
      emptyResultTrue(wrapper);
    });
  });

  describe('muutosmaarays voimassa', () => {
    const propsData = {
      peruste: perusteet[0],
      perusteenJulkaisut: [
        { revision: 1, luotu: ts[0] },
        {
          revision: 2,
          muutosmaarays: { voimassaoloAlkaa: ts[-1] },
          luotu: ts[-1],
        },
      ],
    };

    test('current julkaisu', async () => {
      let wrapper = createMountWithProps(perusteet[1], propsData);
      emptyResultTrue(wrapper);

      wrapper = createMountWithProps(perusteet[0], propsData);
      emptyResultTrue(wrapper);
    });
  });

  describe('muutosmaarays tulossa voimaan', () => {
    const propsData = {
      peruste: perusteet[0],
      perusteenJulkaisut: [
        { revision: 1, luotu: ts[0] },
        {
          revision: 2,
          muutosmaarays: { voimassaoloAlkaa: datePlusDays(5) },
          luotu: ts[1],
        },
      ],
    };

    test('one julkaisu', async () => {
      let wrapper = createMountWithProps(perusteet[2], propsData);
      expect(wrapper.html()).toContain('katselet-tulevaisuudessa-voimaantulevaa-perustetta');

      wrapper = createMountWithProps(perusteet[1], propsData);
      expect(wrapper.html()).toContain('katselet-talla-hetkella-voimassaolevaa-perustetta');
    });
  });

  describe('muutosmaarays tulossa voimaan, selataan aiempaa', () => {
    const propsData = {
      peruste: perusteet[0],
      perusteenJulkaisut: [
        { revision: 1, luotu: ts[0] },
        { revision: 2, luotu: ts[1] },
        {
          revision: 3,
          luotu: ts[2],
          muutosmaarays: { voimassaoloAlkaa: ts[1] },
        },
      ],
    };

    test('ensimmainen julkaisu', async () => {
      let wrapper = createMountWithProps(perusteet[3], propsData);
      expect(wrapper.html()).toContain('katselet-tulevaisuudessa-voimaantulevaa-perustetta');

      wrapper = createMountWithProps(perusteet[2], propsData);
      expect(wrapper.html()).toContain('katselet-talla-hetkella-voimassaolevaa-perustetta');

      wrapper = createMountWithProps(perusteet[1], propsData);
      emptyResultTrue(wrapper);
    });
  });

  describe('muutosmaarays voimassa ja tulossa voimaan, selataan aiempia', () => {
    const propsData = {
      peruste: perusteet[0],
      perusteenJulkaisut: [
        { revision: 1, luotu: ts[0] },
        {
          revision: 2,
          luotu: ts[1],
          muutosmaarays: { voimassaoloAlkaa: ts[-1] },
        },
        { revision: 3, luotu: ts[2] },
        { revision: 4, luotu: ts[3] },
        {
          revision: 5,
          luotu: ts[4],
          muutosmaarays: { voimassaoloAlkaa: ts[2] },
        },
        { revision: 6, luotu: ts[5] },
      ],
    };

    test('muutosmaarays 6 julkaisua', async () => {
      let wrapper = createMountWithProps(perusteet[6], propsData);
      expect(wrapper.html()).toContain('katselet-tulevaisuudessa-voimaantulevaa-perustetta');

      wrapper = createMountWithProps(perusteet[5], propsData);
      expect(wrapper.html()).toContain('katselet-tulevaisuudessa-voimaantulevaa-perustetta');

      wrapper = createMountWithProps(perusteet[4], propsData);
      expect(wrapper.html()).toContain('katselet-talla-hetkella-voimassaolevaa-perustetta');

      wrapper = createMountWithProps(perusteet[3], propsData);
      emptyResultTrue(wrapper);

      wrapper = createMountWithProps(perusteet[2], propsData);
      emptyResultTrue(wrapper);

      wrapper = createMountWithProps(perusteet[1], propsData);
      emptyResultTrue(wrapper);
    });
  });

  describe('opetussuunnitelmanJulkaisut', () => {
    const perusteenJulkaisutTuleva = [
      { revision: 1, luotu: ts[0] },
      {
        revision: 2,
        luotu: ts[1],
        muutosmaarays: { voimassaoloAlkaa: datePlusDays(5) },
      },
    ];

    test('shows voimassaolevaan-opetussuunnitelmaan link when matching opetussuunnitelmanJulkaisut', () => {
      mockRoute.matched = [{ name: 'opetussuunnitelma' }];
      const opetussuunnitelmanJulkaisut = [
        { revision: 1, luotu: ts[0], perusteJulkaisuAika: ts[0] },
      ];
      const wrapper = createMountWithProps(perusteet[2], {
        peruste: perusteet[0],
        perusteenJulkaisut: perusteenJulkaisutTuleva,
        opetussuunnitelmanJulkaisut,
      });
      expect(wrapper.html()).toContain('katselet-tulevaisuudessa-voimaantulevaa-opetussuunnitelmaa');
      expect(wrapper.html()).toContain('voimassaolevaan-opetussuunnitelmaan');
    });

    test('hides voimassaolevaan link when no matching opetussuunnitelmanJulkaisut', () => {
      mockRoute.matched = [{ name: 'opetussuunnitelma' }];
      const wrapper = createMountWithProps(perusteet[2], {
        peruste: perusteet[0],
        perusteenJulkaisut: perusteenJulkaisutTuleva,
        opetussuunnitelmanJulkaisut: [],
      });
      expect(wrapper.html()).toContain('katselet-tulevaisuudessa-voimaantulevaa-opetussuunnitelmaa');
      expect(wrapper.html()).not.toContain('voimassaolevaan-opetussuunnitelmaan');
    });
  });
});

