import Vue from 'vue';
import Router from 'vue-router';

import Root from '@/routes/Root.vue';
import Home from '@/routes/home/RouteHome.vue';
import RouteKooste from '@/routes/kooste/RouteKooste.vue';
import RouteUutiset from '@/routes/uutiset/RouteUutiset.vue';
import RoutePeruste from '@/routes/perusteet/RoutePeruste.vue';
import RouteTiedot from '@/routes/perusteet/tiedot/RouteTiedot.vue';
import RouteTekstikappale from '@/routes/perusteet/sisalto/tekstikappale/RouteTekstikappale.vue';

import { PerusteStore } from '@/stores/PerusteStore';
import { TiedoteStore } from '@/stores/TiedoteStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';

import { stateToKoulutustyyppi } from '@/utils/perusteet';


import { Virheet } from 'eperusteet-frontend-utils/vue/src/stores/virheet';
import { SovellusVirhe } from 'eperusteet-frontend-utils/vue/src/tyypit';

import { createLogger } from 'eperusteet-frontend-utils/vue/src/utils/logger';
import _ from 'lodash';

Vue.use(Router);
const logger = createLogger('Router');


const perusteStore = new PerusteStore();
const tiedoteStore = new TiedoteStore();

export const router = new Router({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes: [{
    path: '/',
    redirect: () => '/fi',
  }, {
    path: '/:lang',
    component: Root,
    children: [{
      path: '',
      name: 'root',
      component: Home,
      meta: {
        async props() {
          return {
            perusteStore,
            tiedoteStore,
          };
        },
      },
    }, {
      path: 'kooste/:koulutustyyppi/:perusteId?',
      name: 'kooste',
      component: RouteKooste,
      meta: {
        async props(route) {
          return {
            perusteKoosteStore: new PerusteKoosteStore(
              stateToKoulutustyyppi(route.params.koulutustyyppi),
              route.params.perusteId ? _.parseInt(route.params.perusteId) : undefined),
          };
        },
      },
    }, {
      path: 'uutiset',
      name: 'uutiset',
      component: RouteUutiset,
    }, {
      path: 'peruste/:perusteId',
      name: 'peruste',
      component: RoutePeruste,
      meta: {
        props: async (route) => {
          return {
            perusteDataStore: await PerusteDataStore.create(_.parseInt(route.params.perusteId)),
          };
        },
      },
      children: [{
        path: 'tiedot',
        component: RouteTiedot,
        name: 'perusteTiedot',
      }, {
        path: 'tekstikappaleet/:viiteId',
        component: RouteTekstikappale,
        name: 'tekstikappale',
        meta: {
          props: async (route) => {
            return {
              perusteenOsaStore: await PerusteenOsaStore.create(_.parseInt(route.params.viiteId)),
            };
          },
        },
      }],
    }],
  }, {
    path: '*',
    redirect: (to) => {
      logger.error('Unknown route', to);
      return {
        name: 'virhe',
        params: {
          lang: 'fi',
          ...to.params,
        },
        query: {
          // virhe: JSON.stringify({}),
        },
      };
    },
  }],
});

router.beforeEach(async (to, from, next) => {
  let props = {};
  for (const record of to.matched) {
    if (_.isFunction(record.meta.props)) {
      const recordParams = await record.meta.props(to);
      props = {
        ...props,
        ...recordParams,
      };
      if (_.isFunction((record.props as any).default)) {
        props = {
          ...props,
          ...await (record.props as any).default(to),
        };
      }
    }
    record.props = {
      default: props,
    };
  }
  next();
});

Virheet.onError((virhe: SovellusVirhe) => {
  logger.error('Route error', virhe);
  router.push({
    name: 'virhe',
    query: {
      // virhe: JSON.stringify(virhe),
    },
  });
});
