import { mount, createLocalVue } from '@vue/test-utils';
import { PerusteDataStore } from '@/stores/PerusteDataStore.ts';
import EpPerusteSidenav from './EpPerusteSidenav.vue';
import EpPerusteSidenavNode from './EpPerusteSidenavNode.vue';
import EpPreviousNextNavigation from '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';
import { KieliStore } from '@shared/stores/kieli';
import { mocks, stubs } from '@shared/utils/jestutils';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';


const navigationData = {
  type: 'root' as any,
  meta: { },
  children: []
};

const navigationDataViitteet = {
  id: 1,
  label: {
    fi: 'Päätaso',
  },
  type: 'viite',
  meta: { },
  children: [{
    id: 2,
    label: {
      fi: 'Alitaso 1',
    },
    type: 'viite',
    meta: { },
    children: [],
  }, {
    id: 3,
    label: {
      fi: 'Alitaso 2',
    },
    type: 'viite',
    meta: { },
    children: [],
  }],
};

const navigationDataLoput = [{
  id: 4,
  type: 'oppiaineet',
  meta: { },
  children: [{
    id: 5,
    label: {
      fi: 'OA1',
    },
    type: 'oppiaine',
    meta: { },
    children: [{
      id: 6,
      type: 'oppimaarat',
      meta: { },
      children: [{
        id: 7,
        type: 'oppimaara',
        meta: { },
        label: {
          fi: 'OM1',
        },
        children: [{
          id: 8,
          type: 'moduulit',
          meta: { },
          children: [{
            id: 9,
            type: 'moduuli',
            label: {
              fi: 'M1',
            },
            meta: { },
            children: [],
          }],
        }],
      }],
    }],
  }],
}];

const perusteData = {
  id: 42,
  nimi: {
    fi: 'peruste42',
  } as any,
  diaarinumero: '1234-1234',
  toteutus: 'yksinkertainen',
  voimassaoloAlkaa: 123456,
} as any;

describe('EpPerusteSidenav', async () => {
  const localVue = createLocalVue();
  KieliStore.setup(localVue);

  describe('Rendering Root and spinners', async () => {
    const perusteDataStore = new PerusteDataStore(42);

    const wrapper = mount(EpPerusteSidenav as any, {
      localVue,
      propsData: {
        perusteDataStore,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
      },
    });

    test('Works with incomplete data', async () => {
      expect(wrapper.html()).toContain('oph-spinner');
    });

    test('Hides spinner', () => {
      perusteDataStore.peruste = perusteData;
      perusteDataStore.navigation = {
        ...navigationData,
        children: [],
      };

      expect(wrapper.html()).not.toContain('oph-spinner');
    });

    test('Works with simple root node', () => {
      const nodes = wrapper.findAll(EpPerusteSidenavNode);
      expect(nodes.at(1).text()).toEqual('Tiedot');
    });

    test('Works with complex data', () => {
      perusteDataStore.navigation = {
        ...navigationData,
        children: navigationDataViitteet as any,
      };

      const nodes = wrapper.findAll(EpPerusteSidenavNode);
      expect(nodes.at(1).text()).toEqual('Tiedot');
      expect(nodes.length).toEqual(7);
    });

    test('Works with oppiaineet', () => {
      perusteDataStore.navigation = {
        ...navigationData,
        children: [
          navigationDataViitteet as any,
          ...navigationDataLoput as any,
        ],
      };

      const nodes = wrapper.findAll(EpPerusteSidenavNode);
      expect(nodes.at(1).text()).toEqual('Tiedot');
      expect(nodes.at(5).text()).toContain('Oppiaineet');
      expect(nodes.at(6).text()).toContain('OA1');
      expect(nodes.at(7).text()).toContain('Oppimäärät');
      expect(nodes.at(8).text()).toContain('OM1');
      expect(nodes.at(9).text()).toContain('Moduulit');
      expect((nodes.at(10).vm as any).node.location).not.toBeFalsy();
      expect(nodes.at(10).text()).toContain('M1');
      expect(nodes.length).toEqual(11);
    });

  });

  describe('SidenavNode', async () => {
    const perusteDataStore = new PerusteDataStore(42);

    perusteDataStore.peruste = perusteData;
    perusteDataStore.navigation = {
      ...navigationData,
      children: [
        navigationDataViitteet as any,
        ...navigationDataLoput as any,
      ],
    };

    const wrapper = mount(EpPerusteSidenav as any, {
      localVue,
      propsData: {
        perusteDataStore,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
      },
    });

    test('Navigation with tiedot active', async () => {
      perusteDataStore.currentRoute = {
        name: 'perusteTiedot',
        params: {
          perusteId: '42',
        },
      };

      const nodes = wrapper.findAll(EpPerusteSidenavNode);
      expect(nodes.length).toEqual(4);
      expect(nodes.at(1).text()).toContain('Tiedot');
      expect(nodes.at(2).text()).toContain('Päätaso');
      expect(nodes.at(3).text()).toContain('Oppiaineet');
    });

    test('Navigation with viite active', async () => {
      perusteDataStore.currentRoute = {
        name: 'tekstikappale',
        params: {
          perusteId: '42',
          viiteId: '1',
        },
      };

      const nodes = wrapper.findAll(EpPerusteSidenavNode);
      expect(nodes.length).toEqual(6);
      expect(nodes.at(1).text()).toContain('Tiedot');
      expect(nodes.at(2).text()).toContain('Päätaso');
      expect(nodes.at(3).text()).toContain('Alitaso 1');
      expect(nodes.at(4).text()).toContain('Alitaso 2');
      expect(nodes.at(5).text()).toContain('Oppiaineet');
    });

    test('Navigation with tiedot and filter', async () => {
      perusteDataStore.currentRoute = {
        name: 'perusteTiedot',
        params: {
          perusteId: '42',
        },
      };

      perusteDataStore.sidenavFilter = {
        label: 'OM1',
        isEnabled: true,
      };

      const nodes = wrapper.findAll(EpPerusteSidenavNode);
      expect(nodes.length).toEqual(5);
      expect(nodes.at(1).text()).toContain('Oppiaineet');
      expect(nodes.at(2).text()).toContain('OA1');
      expect(nodes.at(3).text()).toContain('Oppimäärät');
      expect(nodes.at(4).text()).toContain('OM1');
    });

  });

  describe('Navigation to previous and next', async () => {
    const perusteDataStore = new PerusteDataStore(42);

    perusteDataStore.peruste = perusteData;
    perusteDataStore.navigation = {
      ...navigationData,
      children: [
        navigationDataViitteet as any,
        ...navigationDataLoput as any,
      ],
    };

    perusteDataStore.currentRoute = {
      name: 'perusteTiedot',
      params: {
        perusteId: '42',
      },
    };

    const wrapper = mount(EpPreviousNextNavigation as any, {
      localVue,
      propsData: {
        activeNode: perusteDataStore.current,
        flattenedSidenav: perusteDataStore.flattenedSidenav,
      },
      stubs: {
        ...stubs,
      },
      mocks: {
        ...mocks,
      },
    });

    test('Navigation next and previous', async () => {
      expect(wrapper.html()).toContain('Päätaso');

      perusteDataStore.currentRoute = {
        name: 'tekstikappale',
        params: {
          perusteId: '42',
          viiteId: '1',
        },
      };
      wrapper.setProps({ activeNode: perusteDataStore.current });

      expect(wrapper.html()).toContain('Tiedot');
      expect(wrapper.html()).toContain('Oppiaineet');

      perusteDataStore.currentRoute = {
        name: 'tekstikappale',
        params: {
          perusteId: '42',
          viiteId: '3',
        },
      };
      wrapper.setProps({ activeNode: perusteDataStore.current });

      expect(wrapper.html()).toContain('Alitaso 1');
      expect(wrapper.html()).toContain('Oppiaineet');

    });

  });

});
