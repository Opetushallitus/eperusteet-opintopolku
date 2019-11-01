import _ from 'lodash';
import Vue from 'vue';
import Router from 'vue-router';
import VueScrollTo from 'vue-scrollto';

import Root from '@/routes/Root.vue';
import Home from '@/routes/home/RouteHome.vue';
import RouteKooste from '@/routes/kooste/RouteKooste.vue';
import RouteAmmatillinenSelaus from '@/routes/ammatillinen/RouteAmmatillinenSelaus.vue';

import RouteUutiset from '@/routes/uutiset/RouteUutiset.vue';

import RoutePeruste from '@/routes/perusteet/RoutePeruste.vue';
import RoutePerusteTiedot from '@/routes/perusteet/tiedot/RoutePerusteTiedot.vue';
import RouteTekstikappale from '@/routes/perusteet/sisalto/tekstikappale/RouteTekstikappale.vue';
import RouteLaajaAlaiset from '@/routes/perusteet/sisalto/lops2019/laajaalaiset/RouteLaajaAlaiset.vue';
import RouteOppiaineet from '@/routes/perusteet/sisalto/lops2019/oppiaineet/RouteOppiaineet.vue';
import RouteOppiaine from '@/routes/perusteet/sisalto/lops2019/oppiaineet/RouteOppiaine.vue';
import RouteModuuli from '@/routes/perusteet/sisalto/lops2019/oppiaineet/RouteModuuli.vue';

import RouteOpetussuunnitelma from '@/routes/opetussuunnitelmat/RouteOpetussuunnitelma.vue';
import RouteOpetussuunnitelmaTiedot from '@/routes/opetussuunnitelmat/tiedot/RouteOpetussuunnitelmaTiedot.vue';

import { PerusteStore } from '@/stores/PerusteStore';
import { TiedoteStore } from '@/stores/TiedoteStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';


import { changeTitleAndLang, resolveRouterMetaProps } from '@shared/utils/router';
import { stateToKoulutustyyppi } from '@shared/utils/perusteet';

import { Virheet } from '@shared/stores/virheet';
import { SovellusVirhe } from '@shared/tyypit';

import { createLogger } from '@shared/utils/logger';
import { Lops2019LaajaAlaisetStore } from '@/stores/Lops2019LaajaAlaisetStore';
import { Lops2019OppiaineStore } from '@/stores/Lops2019OppiaineStore';
import { Lops2019ModuuliStore } from '@/stores/Lops2019ModuuliStore';
import { Lops2019OppiaineetStore } from '@/stores/Lops2019OppiaineetStore';

Vue.use(Router);
const logger = createLogger('Router');

const perusteStore = new PerusteStore();
const tiedoteStore = new TiedoteStore();


export const router = new Router({
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }

    const hashAnchorElement = document.getElementById(to.hash.substring(1));
    if (hashAnchorElement) {
      VueScrollTo.scrollTo(to.hash);
      return { selector: to.hash };
    }

    const anchorElement = document.getElementById('scroll-anchor');
    if (anchorElement) {
      VueScrollTo.scrollTo('#scroll-anchor');
      return { selector: '#scroll-anchor' };
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
                  _.parseInt(route.params.perusteId)),
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
                perusteDataStore: await PerusteDataStore.create(_.parseInt(route.params.perusteId)),
              },
            };
          },
        },
      },
      children: [{
        path: 'tiedot',
        component: RoutePerusteTiedot,
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
        meta: {
          resolve: {
            cacheBy: ['perusteId'],
            async props(route) {
              return {
                default: {
                  lops2019LaajaAlaisetStore: await Lops2019LaajaAlaisetStore.create(
                    _.parseInt(route.params.perusteId),
                  ),
                },
              };
            },
          },
        },
      }, {
        path: 'oppiaine',
        component: RouteOppiaineet,
        name: 'lops2019oppiaineet',
        meta: {
          resolve: {
            cacheBy: ['perusteId'],
            async props(route) {
              return {
                default: {
                  lops2019oppiaineetStore: await Lops2019OppiaineetStore.create(
                    _.parseInt(route.params.perusteId),
                  ),
                },
              };
            },
          },
        },
      }, {
        path: 'oppiaine/:oppiaineId',
        component: RouteOppiaine,
        name: 'lops2019oppiaine',
        meta: {
          resolve: {
            cacheBy: ['perusteId', 'oppiaineId'],
            async props(route) {
              return {
                default: {
                  lops2019oppiaineStore: await Lops2019OppiaineStore.create(
                    _.parseInt(route.params.perusteId),
                    _.parseInt(route.params.oppiaineId),
                  ),
                },
              };
            },
          },
        },
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
    }, {
      path: 'ops/:opetussuunnitelmaId/:koulutustyyppi',
      name: 'opetussuunnitelma',
      component: RouteOpetussuunnitelma,
      redirect(to) {
        return {
          name: 'opetussuunnitelmaTiedot',
        };
      },
      meta: {
        resolve: {
          cacheBy: ['opetussuunnitelmaId'],
          async props(route) {
            return {
              default: {
                opetussuunnitelmaDataStore: await OpetussuunnitelmaDataStore.create(
                  _.parseInt(route.params.opetussuunnitelmaId)),
              },
            };
          },
        },
      },
      children: [{
        path: 'tiedot',
        component: RouteOpetussuunnitelmaTiedot,
        name: 'opetussuunnitelmaTiedot',
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

router.beforeEach((to, from, next) => {
  changeTitleAndLang(to);
  next();
});

router.beforeEach(async (to, from, next) => {
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
