import EpPerusteSidenav from './EpPerusteSidenav.vue';
import EpPreviousNextNavigation from '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';
import { createMount, globalStubs } from '@shared/utils/__tests__/stubs';
import { getCachedPerusteStore, usePerusteCacheStore } from '@/stores/PerusteCacheStore';
import { nextTick } from 'vue';
import { usePerusteDataStore } from '@/stores/PerusteDataStore';
import { beforeEach, expect, test, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { pinia } from '@/pinia';
import { useRoute } from 'vue-router';
import { ref } from 'vue';


vi.mock('vue-router', () => ({ useRoute: vi.fn(), useRouter: vi.fn() }));
vi.mocked(useRoute).mockReturnValue({ params: {
  perusteId: '42',
  viiteId: '1',
  revision: '1',
} } as any);

vi.mock('@/stores/PerusteCacheStore', () => ({
  getCachedPerusteStore: vi.fn(),
  usePerusteCacheStore: vi.fn(),
}));

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
  tyyppi: 'normaali',
} as any;

describe('EpPerusteSidenav', () => {

  const pinia = createPinia();
  beforeEach(() => {
    setActivePinia(pinia);
  });

  const perusteDataStore = usePerusteDataStore('42-1');

  (getCachedPerusteStore as any).mockReturnValue(perusteDataStore);

  describe('Rendering Root and spinners', () => {

    const wrapper = mount(EpPerusteSidenav as any, {
      global: {
        ...globalStubs,
        plugins: [
          pinia,
          ...globalStubs.plugins || [],
        ],
      },
    });

    test('Works with incomplete data', async () => {
      perusteDataStore.$patch({
        perusteKaikki: null,
      });
      await nextTick();
      expect(wrapper.html()).toContain('oph-spinner');
    });

    test('Hides spinner', async () => {

      perusteDataStore.$patch({
        perusteKaikki: perusteData,
        navigation: {
          ...navigationData,
          children: [],
        }});

      await nextTick();

      expect(wrapper.html()).not.toContain('oph-spinner');
    });

    test('Works with simple root node', () => {
      expect(wrapper.html()).toContain('perusteen-tiedot');
    });

    test('Works with complex data', async () => {
      perusteDataStore.$patch({
        perusteKaikki: perusteData,
        navigation: {
          ...navigationData,
          children: [
            navigationDataViitteet as any,
            ...navigationDataLoput as any,
          ],
        },
      });

      await nextTick();

      expect(wrapper.html()).toContain('perusteen-tiedot');
      expect(wrapper.findAll('.node')).toHaveLength(4);
    });

    test('Works with oppiaineet', async () => {
      perusteDataStore.$patch({
        perusteKaikki: perusteData,
        navigation: {
          ...navigationData,
          children: [
            navigationDataViitteet as any,
            ...navigationDataLoput as any,
          ],
        },
      });

      await nextTick();

      expect(wrapper.findAll('.node')).toHaveLength(4);
      expect(wrapper.findAll('.node').at(1)
        ?.html()).toContain('perusteen-tiedot');
      expect(wrapper.findAll('.node').at(2)
        ?.html()).toContain('Päätaso');
      expect(wrapper.findAll('.node').at(3)
        ?.html()).toContain('oppiaineet');
    });
  });

  describe('SidenavNode', async () => {
    perusteDataStore.$patch({
      perusteKaikki: {},
      navigation: {
        ...navigationData,
        children: [
          navigationDataViitteet as any,
          ...navigationDataLoput as any,
        ],
      },
    });

    const wrapper = createMount(EpPerusteSidenav as any, {
    });

    await nextTick();

    test('Navigation with tiedot active', async () => {
      perusteDataStore.$patch({
        currentRoute: {
          name: 'perusteTiedot',
          params: {
            perusteId: '42',
          },
        }});

      await nextTick();

      expect(wrapper.findAll('.node')).toHaveLength(4);
      expect(wrapper.findAll('.node').at(1)
        ?.html()).toContain('perusteen-tiedot');
      expect(wrapper.findAll('.node').at(2)
        ?.html()).toContain('Päätaso');
      expect(wrapper.findAll('.node').at(3)
        ?.html()).toContain('oppiaineet');
    });

    test('Navigation with viite active', async () => {
      perusteDataStore.$patch({
        perusteKaikki: perusteData,
        navigation: {
          ...navigationData,
          children: [
            navigationDataViitteet as any,
            ...navigationDataLoput as any,
          ],
        },
        currentRoute: {
          name: 'perusteTekstikappale',
          params: {
            perusteId: '42',
            viiteId: '1',
          },
        }});

      await nextTick();

      expect(wrapper.findAll('.node')).toHaveLength(6);
      expect(wrapper.findAll('.node').at(1)
        ?.html()).toContain('perusteen-tiedot');
      expect(wrapper.findAll('.node').at(2)
        ?.html()).toContain('Päätaso');
      expect(wrapper.findAll('.node').at(3)
        ?.html()).toContain('Alitaso 1');
      expect(wrapper.findAll('.node').at(4)
        ?.html()).toContain('Alitaso 2');
      expect(wrapper.findAll('.node').at(5)
        ?.html()).toContain('oppiaineet');
    });
  });

  describe('Navigation to previous and next', async () => {

    test('Navigation next and previous', async () => {

      perusteDataStore.$patch({
        perusteKaikki: perusteData,
        navigation: {
          ...navigationData,
          children: [
            navigationDataViitteet as any,
            ...navigationDataLoput as any,
          ],
        },
        currentRoute: {
          name: 'perusteTiedot',
          params: {
            perusteId: '42',
          },
        },
      });

      const wrapper = createMount(EpPreviousNextNavigation as any, {
        props: {
          activeNode: perusteDataStore.current,
          flattenedSidenav: perusteDataStore.flattenedSidenav,
        },
      });

      await nextTick();

      expect(wrapper.html()).toContain('Päätaso');

      perusteDataStore.$patch({
        currentRoute: {
          name: 'perusteTekstikappale',
          params: {
            perusteId: '42',
            viiteId: '1',
          },
        },
      });

      wrapper.setProps({ activeNode: perusteDataStore.current });

      await nextTick();

      expect(wrapper.html()).toContain('perusteen-tiedot');
      expect(wrapper.html()).toContain('oppiaineet');

      perusteDataStore.$patch({
        currentRoute: {
          name: 'perusteTekstikappale',
          params: {
            perusteId: '42',
            viiteId: '3',
          },
        },
      });

      wrapper.setProps({ activeNode: perusteDataStore.current });

      await nextTick();

      expect(wrapper.html()).toContain('Alitaso 1');
      expect(wrapper.html()).toContain('oppiaineet');
    });
  });
});
