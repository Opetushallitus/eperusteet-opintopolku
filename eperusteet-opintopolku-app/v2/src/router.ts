import Vue from 'vue';
import Router from 'vue-router';

import Root from '@/routes/Root.vue';
import Home from '@/routes/home/RouteHome.vue';
import RouteKooste from '@/routes/kooste/RouteKooste.vue';
import RouteAmmatillinenSelaus from '@/routes/ammatillinen/RouteAmmatillinenSelaus.vue';
import RouteUutiset from '@/routes/uutiset/RouteUutiset.vue';
import RoutePeruste from '@/routes/perusteet/RoutePeruste.vue';
import RouteTiedot from '@/routes/perusteet/tiedot/RouteTiedot.vue';
import RouteTekstikappale from '@/routes/perusteet/sisalto/tekstikappale/RouteTekstikappale.vue';

import { PerusteStore } from '@/stores/PerusteStore';
import { TiedoteStore } from '@/stores/TiedoteStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';

import { changeTitleAndLang, resolveRouterMetaProps } from '@shared/utils/router';
import { stateToKoulutustyyppi } from '@/utils/perusteet';

import { Virheet } from '@shared/stores/virheet';
import { SovellusVirhe } from '@shared/tyypit';

import { createLogger } from '@shared/utils/logger';
import _ from 'lodash';

Vue.use(Router);
const logger = createLogger('Router');


const perusteStore = new PerusteStore();
const tiedoteStore = new TiedoteStore();


export const router = new Router({
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    else if (to.hash) {
      return {
        selector: to.hash
      };
    }
    else if (to.name === 'tekstikappale') {
      return {
        selector: '#tekstikappale-otsikko'
      };
    }
    else {
      return { x: 0, y: 0 };
    }
  },
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
        resolve: {
          async props() {
            return {
              default: {
                perusteStore,
                tiedoteStore,
              },
            };
          },
        },
      },
    }, {
      path: 'kooste/:koulutustyyppi/:perusteId?',
      name: 'kooste',
      component: RouteKooste,
      meta: {
        resolve: {
          cacheBy: ['koulutustyyppi'],
          async props(route) {
            return {
              default: {
                perusteKoosteStore: new PerusteKoosteStore(
                  stateToKoulutustyyppi(route.params.koulutustyyppi),
                  route.params.perusteId ? _.parseInt(route.params.perusteId) : undefined),
              },
            };
          },
        },
      },
    }, {
      path: 'selaus',
      name: 'ammatillinenSelaus',
      component: RouteAmmatillinenSelaus,
    }, {
      path: 'uutiset',
      name: 'uutiset',
      component: RouteUutiset,
      meta: {
        resolve: {
          async props() {
            return {
              default: {
                perusteStore,
                tiedoteStore,
              },
            };
          },
        },
      },
    }, {
      path: ':koulutustyyppi/:perusteId',
      name: 'peruste',
      component: RoutePeruste,
      redirect(to) {
        return {
          name: 'perusteTiedot',
        };
      },
      meta: {
        resolve: {
          cacheBy: ['perusteId'],
          async props(route) {
            return {
              default: {
                perusteDataStore: await PerusteDataStore.create(
                  _.parseInt(route.params.perusteId)),
              },
            };
          },
        },
      },
      children: [{
        path: 'tiedot',
        component: RouteTiedot,
        name: 'perusteTiedot',
      }, {
        path: 'tekstikappale/:viiteId',
        component: RouteTekstikappale,
        name: 'tekstikappale',
        meta: {
          resolve: {
            cacheBy: ['viiteId'],
            async props(route) {
              return {
                default: {
                  viiteId: _.parseInt(route.params.viiteId),
                  perusteenOsaStore: await PerusteenOsaStore.create(
                    _.parseInt(route.params.viiteId)),
                },
              };
            },
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
  changeTitleAndLang(to);
  await resolveRouterMetaProps(to);
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
