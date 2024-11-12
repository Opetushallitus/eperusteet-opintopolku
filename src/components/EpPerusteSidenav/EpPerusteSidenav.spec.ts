import { mount, createLocalVue } from '@vue/test-utils';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpPerusteSidenav from './EpPerusteSidenav.vue';
import EpSidenavNode from '../EpSidenav/EpSidenavNode.vue';
import EpPreviousNextNavigation from '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';
import { Kielet } from '@shared/stores/kieli';
import { mocks, stubs } from '@shared/utils/jestutils';
import VueI18n from 'vue-i18n';
import { Kaannos } from '@shared/plugins/kaannos';

const navigationData = {
  type: 'root' as any,
  meta: { },
  children: [],
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

describe('EpPerusteSidenav', () => {
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

  describe('Rendering Root and spinners', () => {
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
      perusteDataStore.perusteKaikki = perusteData;
      perusteDataStore.navigation = {
        ...navigationData,
        children: [],
      };

      expect(wrapper.html()).not.toContain('oph-spinner');
    });

    test('Works with simple root node', () => {
      const nodes = wrapper.findAll(EpSidenavNode);
      expect(nodes.at(1).text()).toEqual('Perusteen tiedot');
    });

    test('Works with complex data', () => {
      perusteDataStore.navigation = {
        ...navigationData,
        children: navigationDataViitteet as any,
      };

      const nodes = wrapper.findAll(EpSidenavNode);
      expect(nodes.at(1).text()).toEqual('Perusteen tiedot');
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

      const nodes = wrapper.findAll(EpSidenavNode);

      expect(nodes.length).toEqual(4);
      expect(nodes.at(1).text()).toEqual('Perusteen tiedot');
      expect(nodes.at(2).text()).toContain('Päätaso');
      expect(nodes.at(3).text()).toContain('Oppiaineet');
    });
  });

  describe('SidenavNode', () => {
    const perusteDataStore = new PerusteDataStore(42);

    perusteDataStore.perusteKaikki = perusteData;
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

      const nodes = wrapper.findAll(EpSidenavNode);
      expect(nodes.length).toEqual(5);
      expect(nodes.at(1).text()).toContain('Perusteen tiedot');
      expect(nodes.at(2).text()).toContain('Muutoshistoria');
      expect(nodes.at(3).text()).toContain('Päätaso');
      expect(nodes.at(4).text()).toContain('Oppiaineet');
    });

    test('Navigation with viite active', async () => {
      perusteDataStore.currentRoute = {
        name: 'perusteTekstikappale',
        params: {
          perusteId: '42',
          viiteId: '1',
        },
      };

      const nodes = wrapper.findAll(EpSidenavNode);
      expect(nodes.length).toEqual(6);
      expect(nodes.at(1).text()).toContain('Perusteen tiedot');
      expect(nodes.at(2).text()).toContain('Päätaso');
      expect(nodes.at(3).text()).toContain('Alitaso 1');
      expect(nodes.at(4).text()).toContain('Alitaso 2');
      expect(nodes.at(5).text()).toContain('Oppiaineet');
    });
  });

  describe('Navigation to previous and next', () => {
    const perusteDataStore = new PerusteDataStore(42);

    perusteDataStore.perusteKaikki = perusteData;
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
      expect(wrapper.html()).toContain('Muutoshistoria');

      perusteDataStore.currentRoute = {
        name: 'perusteTekstikappale',
        params: {
          perusteId: '42',
          viiteId: '1',
        },
      };
      wrapper.setProps({ activeNode: perusteDataStore.current });

      expect(wrapper.html()).toContain('Perusteen tiedot');
      expect(wrapper.html()).toContain('Oppiaineet');

      perusteDataStore.currentRoute = {
        name: 'perusteTekstikappale',
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
