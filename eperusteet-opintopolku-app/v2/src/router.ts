import _ from 'lodash';
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
import RouteLaajaAlaiset from '@/routes/perusteet/sisalto/lops2019/laajaalaiset/RouteLaajaAlaiset.vue';
import RouteOppiaineet from '@/routes/perusteet/sisalto/lops2019/oppiaineet/RouteOppiaineet.vue';
import RouteOppiaine from '@/routes/perusteet/sisalto/lops2019/oppiaineet/RouteOppiaine.vue';
import RouteModuuli from '@/routes/perusteet/sisalto/lops2019/oppiaineet/RouteModuuli.vue';

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
import { Lops2019LaajaAlaisetStore } from '@/stores/Lops2019LaajaAlaisetStore';
import { Lops2019OppiaineStore } from '@/stores/Lops2019OppiaineStore';
import { Lops2019ModuuliStore } from '@/stores/Lops2019ModuuliStore';

Vue.use(Router);
const logger = createLogger('Router');


const perusteStore = new PerusteStore();
const tiedoteStore = new TiedoteStore();
const lops2019Store = new Lops2019OppiaineStore();


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
                ...await PerusteDataStore.create(_.parseInt(route.params.perusteId)),
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
                  perusteenOsaStore: await PerusteenOsaStore.create(
                    _.parseInt(route.params.viiteId)),
                },
              };
            },
          },
        },
      }, {
        path: 'laajaalaiset',
        component: RouteLaajaAlaiset,
        name: 'lops2019laajaalaiset',
        props: {
          lops2019LaajaAlaisetStore: Lops2019LaajaAlaisetStore.create(),
        }
      }, {
        path: 'oppiaine',
        component: RouteOppiaineet,
        name: 'lops2019oppiaineet',
      }, {
        path: 'oppiaine/:oppiaineId',
        component: RouteOppiaine,
        name: 'lops2019oppiaine',
        props: {
          lops2019oppiaineStore: lops2019Store,
        }
      }, {
        path: 'oppiaine/:oppiaineId/moduuli/:moduuliId',
        component: RouteModuuli,
        name: 'lops2019moduuli',
        meta: {
          resolve: {
            cacheBy: ['perusteId', 'oppiaineId', 'moduuliId'],
            async props(route) {
              return {
                default: {
                  lops2019moduuliStore: await Lops2019ModuuliStore.create(
                    _.parseInt(route.params.perusteId),
                    _.parseInt(route.params.oppiaineId),
                    _.parseInt(route.params.moduuliId)
                  ),
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
