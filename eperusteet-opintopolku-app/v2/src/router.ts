import _ from 'lodash';
import Vue from 'vue';
import Router from 'vue-router';
import VueScrollTo from 'vue-scrollto';
import VueMeta from 'vue-meta';

import Root from '@/routes/Root.vue';
import Home from '@/routes/home/RouteHome.vue';
import RouteKooste from '@/routes/kooste/RouteKooste.vue';
import RouteAmmatillinenSelaus from '@/routes/ammatillinen/RouteAmmatillinenSelaus.vue';

import RouteUutiset from '@/routes/uutiset/RouteUutiset.vue';
import RouteUutinen from '@/routes/uutiset/RouteUutinen.vue';

import RoutePeruste from '@/routes/perusteet/RoutePeruste.vue';
import RoutePerusteTiedot from '@/routes/perusteet/tiedot/RoutePerusteTiedot.vue';
import RouteTekstikappale from '@/routes/perusteet/sisalto/tekstikappale/RouteTekstikappale.vue';
import RouteLaajaAlaiset from '@/routes/perusteet/sisalto/lops2019/laajaalaiset/RouteLaajaAlaiset.vue';
import RouteOppiaineet from '@/routes/perusteet/sisalto/lops2019/oppiaineet/RouteOppiaineet.vue';
import RouteOppiaine from '@/routes/perusteet/sisalto/lops2019/oppiaineet/RouteOppiaine.vue';
import RouteModuuli from '@/routes/perusteet/sisalto/lops2019/oppiaineet/RouteModuuli.vue';

import RouteOpetussuunnitelma from '@/routes/opetussuunnitelmat/RouteOpetussuunnitelma.vue';
import RouteOpetussuunnitelmaTiedot from '@/routes/opetussuunnitelmat/tiedot/RouteOpetussuunnitelmaTiedot.vue';
import RouteOpetussuunnitelmaTekstikappale from '@/routes/opetussuunnitelmat/sisalto/tekstikappale/RouteOpetussuunnitelmaTekstikappale.vue';

import { PerusteStore } from '@/stores/PerusteStore';
import { TiedoteStore } from '@/stores/TiedoteStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { OpetussuunnitelmaTekstikappaleStore } from '@/stores/OpetussuunnitelmaTekstikappaleStore';


import { changeLang, resolveRouterMetaProps, removeQueryParam } from '@shared/utils/router';
import { stateToKoulutustyyppi } from '@shared/utils/perusteet';

import { Virheet } from '@shared/stores/virheet';
import { SovellusVirhe } from '@shared/tyypit';

import { createLogger } from '@shared/utils/logger';
import { Lops2019LaajaAlaisetStore } from '@/stores/Lops2019LaajaAlaisetStore';
import { Lops2019OppiaineStore } from '@/stores/Lops2019OppiaineStore';
import { Lops2019ModuuliStore } from '@/stores/Lops2019ModuuliStore';
import { Lops2019OppiaineetStore } from '@/stores/Lops2019OppiaineetStore';
import RouteOpetussuunnitelmaOppiaineet
  from '@/routes/opetussuunnitelmat/sisalto/lops2019/oppiaineet/RouteOpetussuunnitelmaOppiaineet.vue';
import RouteOpetussuunnitelmaOppiaine
  from '@/routes/opetussuunnitelmat/sisalto/lops2019/oppiaineet/RouteOpetussuunnitelmaOppiaine.vue';
import RouteOpetussuunnitelmaModuuli
  from '@/routes/opetussuunnitelmat/sisalto/lops2019/oppiaineet/RouteOpetussuunnitelmaModuuli.vue';
import RouteOpetussuunnitelmaOpintojakso
  from '@/routes/opetussuunnitelmat/sisalto/lops2019/opintojaksot/RouteOpetussuunnitelmaOpintojakso.vue';
import { Lops2019OpetussuunnitelmaOppiaineStore } from '@/stores/Lops2019OpetussuunnitelmaOppiaineStore';
import { Lops2019OpetussuunnitelmaModuuliStore } from '@/stores/Lops2019OpetussuunnitelmaModuuliStore';
import { Lops2019OpetussuunnitelmaPoppiaineStore } from '@/stores/Lops2019OpetussuunnitelmaPoppiaineStore';
import RouteOpetussuunnitelmaPoppiaine
  from '@/routes/opetussuunnitelmat/sisalto/lops2019/oppiaineet/RouteOpetussuunnitelmaPoppiaine.vue';


Vue.use(Router);
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
});

const logger = createLogger('Router');

const perusteStore = new PerusteStore();
const tiedoteStore = new TiedoteStore();

export const router = new Router({
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    const elementId = to.hash.substring(1);
    if (elementId && document.getElementById(elementId)) {
      const navbar = document.getElementById('navigation-bar');
      const navbarHeight = navbar ? (-1 * navbar.getBoundingClientRect().height) : 0;
      VueScrollTo.scrollTo(to.hash, {
        offset: navbarHeight,
        x: false,
        y: true,
      });
      return {
        selector: to.hash,
        offset : {
          x: 0,
          y: navbarHeight
        },
      };
    }

    const anchorElement = document.getElementById('scroll-anchor');
    if (anchorElement) {
      const navbar = document.getElementById('navigation-bar');
      const navbarHeight = navbar ? (-1 * navbar.getBoundingClientRect().height) : 0;
      VueScrollTo.scrollTo('#scroll-anchor', {
        offset: navbarHeight,
        x: false,
        y: true,
      });
      return {
        selector: '#scroll-anchor',
        offset : {
          x: 0,
          y: navbarHeight
        },
      };
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
      path: 'uutiset/:tiedoteId',
      name: 'uutinen',
      component: RouteUutinen,
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
        name: 'perusteTekstikappale',
        meta: {
          resolve: {
            cacheBy: ['viiteId'],
            async props(route) {
              return {
                default: {
                  perusteenOsaStore: await PerusteenOsaStore.create(
                    _.parseInt(route.params.viiteId),
                  ),
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
                  lops2019OppiaineetStore: await Lops2019OppiaineetStore.create(
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
                  lops2019OppiaineStore: await Lops2019OppiaineStore.create(
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
                  lops2019ModuuliStore: await Lops2019ModuuliStore.create(
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
      path: 'ops/:opetussuunnitelmaId/:koulutustyyppi*',
      name: 'ops',
      component: RouteOpetussuunnitelma,
      redirect(to) {
        return {
          name: 'opetussuunnitelma',
        };
      },
    }, {
      path: 'opetussuunnitelma/:opetussuunnitelmaId/:koulutustyyppi',
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
                  _.parseInt(route.params.opetussuunnitelmaId),
                ),
              },
            };
          },
        },
      },
      children: [{
        path: 'tiedot',
        component: RouteOpetussuunnitelmaTiedot,
        name: 'opetussuunnitelmaTiedot',
      }, {
        path: 'tekstikappale/:viiteId',
        component: RouteOpetussuunnitelmaTekstikappale,
        name: 'opetussuunnitelmaTekstikappale',
        meta: {
          resolve: {
            cacheBy: ['opetussuunnitelmaId', 'viiteId'],
            async props(route) {
              return {
                default: {
                  opetussuunnitelmaTekstikappaleStore: await OpetussuunnitelmaTekstikappaleStore.create(
                    _.parseInt(route.params.opetussuunnitelmaId),
                    _.parseInt(route.params.viiteId),
                  ),
                },
              };
            },
          },
        },
      }, {
        path: 'oppiaine',
        component: RouteOpetussuunnitelmaOppiaineet,
        name: 'lops2019OpetussuunnitelmaOppiaineet',
      }, {
        path: 'oppiaine/:oppiaineId',
        component: RouteOpetussuunnitelmaOppiaine,
        name: 'lops2019OpetussuunnitelmaOppiaine',
        meta: {
          resolve: {
            cacheBy: ['opetussuunnitelmaId', 'oppiaineId'],
            async props(route) {
              return {
                default: {
                  lops2019OpetussuunnitelmaOppiaineStore: await Lops2019OpetussuunnitelmaOppiaineStore.create(
                    _.parseInt(route.params.opetussuunnitelmaId),
                    _.parseInt(route.params.oppiaineId),
                  ),
                },
              };
            },
          },
        },
      }, {
        path: 'poppiaine/:oppiaineId',
        component: RouteOpetussuunnitelmaPoppiaine,
        name: 'lops2019OpetussuunnitelmaPoppiaine',
        meta: {
          resolve: {
            cacheBy: ['opetussuunnitelmaId', 'oppiaineId'],
            async props(route) {
              return {
                default: {
                  lops2019OpetussuunnitelmaPoppiaineStore: await Lops2019OpetussuunnitelmaPoppiaineStore.create(
                      _.parseInt(route.params.opetussuunnitelmaId),
                      _.parseInt(route.params.oppiaineId),
                  ),
                },
              };
            },
          },
        },
      }, {
        path: 'oppiaine/:oppiaineId/moduuli/:moduuliId',
        component: RouteOpetussuunnitelmaModuuli,
        name: 'lops2019OpetussuunnitelmaModuuli',
        meta: {
          resolve: {
            cacheBy: ['opetussuunnitelmaId', 'oppiaineId', 'moduuliId'],
            async props(route) {
              return {
                default: {
                  lops2019OpetussuunnitelmaModuuliStore: await Lops2019OpetussuunnitelmaModuuliStore.create(
                    _.parseInt(route.params.opetussuunnitelmaId),
                    _.parseInt(route.params.oppiaineId),
                    _.parseInt(route.params.moduuliId)
                  ),
                },
              };
            },
          },
        },
      }, {
        path: 'opintojakso/:opintojaksoId',
        component: RouteOpetussuunnitelmaOpintojakso,
        name: 'lops2019OpetussuunnitelmaOpintojakso',
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
  changeLang(to);
  next();
});

router.beforeEach(async (to, from, next) => {
  await resolveRouterMetaProps(to);
  next();
});

router.afterEach((to, from) => {
  removeQueryParam(to, router, 'paluuosoite');
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
