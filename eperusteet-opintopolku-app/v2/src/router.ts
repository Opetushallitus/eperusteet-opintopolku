import Vue from 'vue';
import Router from 'vue-router';

import Root from '@/routes/Root.vue';
import Home from "@/routes/home/RouteHome.vue";
import RouteKooste from "@/routes/kooste/RouteKooste.vue";
import RouteUutiset from "@/routes/uutiset/RouteUutiset.vue";
import RoutePeruste from "@/routes/perusteet/RoutePeruste.vue";
import RouteTiedot from "@/routes/perusteet/tiedot/RouteTiedot.vue";

import { stateToKoulutustyyppi } from '@/utils/perusteet';

import { PerusteStore } from "@/stores/PerusteStore";
import { TiedoteStore } from "@/stores/TiedoteStore";
import { PerusteDataStore } from "@/stores/PerusteDataStore";
import { PerusteKoosteStore } from "@/stores/PerusteKoosteStore";

import { Virheet } from 'eperusteet-frontend-utils/vue/src/stores/virheet';
import { SovellusVirhe } from 'eperusteet-frontend-utils/vue/src/tyypit';

import { createLogger } from 'eperusteet-frontend-utils/vue/src/utils/logger';
import _ from 'lodash';

Vue.use(Router);
const logger = createLogger('Router');

const perusteStore = new PerusteStore();
const tiedoteStore = new TiedoteStore();
const props = {
  perusteStore,
  tiedoteStore,
};

function perusteProps(route) {
  return {
    perusteDataStore: new PerusteDataStore(
      route.params.perusteId ? _.parseInt(route.params.perusteId) : undefined
    ),
  };
}


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
      props: {
        ...props,
      },
    }, {
      path: 'kooste/:koulutustyyppi/:perusteId?',
      name: 'kooste',
      component: RouteKooste,
      props(route) {
        return {
          perusteKoosteStore: new PerusteKoosteStore(
            stateToKoulutustyyppi(route.params.koulutustyyppi),
            route.params.perusteId ? _.parseInt(route.params.perusteId) : undefined),
        };
      },
    }, {
      path: 'uutiset',
      name: 'uutiset',
      component: RouteUutiset,
      props: {
        ...props,
      }
    }, {
      path: 'peruste/:perusteId',
      name: 'peruste',
      component: RoutePeruste,
      props: perusteProps,
      children: [{
        path: 'tiedot',
        component: RouteTiedot,
        name: 'perusteTiedot',
        props: perusteProps,
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

Virheet.onError((virhe: SovellusVirhe) => {
  logger.error('Route error', virhe);
  router.push({
    name: 'virhe',
    query: {
      // virhe: JSON.stringify(virhe),
    },
  });
});
