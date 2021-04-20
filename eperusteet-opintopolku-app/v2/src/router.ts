import _ from 'lodash';
import Vue from 'vue';
import Router from 'vue-router';
import VueScrollTo from 'vue-scrollto';
import VueMeta from 'vue-meta';

import Root from '@/routes/Root.vue';
import Home from '@/routes/home/RouteHome.vue';
import RouteKooste from '@/routes/kooste/RouteKooste.vue';
import RouteKoosteAmmatillinen from '@/routes/kooste/RouteKoosteAmmatillinen.vue';
import RouteAmmatillinenSelaus from '@/routes/ammatillinen/RouteAmmatillinenSelaus.vue';
import RouteAmmatillinenKoulutuksenJarjestajat from '@/routes/ammatillinen/RouteAmmatillinenKoulutuksenJarjestajat.vue';
import RouteAmmatillinenValmisteillaOlevat from '@/routes/ammatillinen/RouteAmmatillinenValmisteillaOlevat.vue';
import RouteAmmatillinenKoulutusviennit from '@/routes/ammatillinen/RouteAmmatillinenKoulutusviennit.vue';
import RouteAmmatillinenOhjeet from '@/routes/ammatillinen/RouteAmmatillinenOhjeet.vue';
import RouteAmmatillinenTyopajat from '@/routes/ammatillinen/RouteAmmatillinenTyopajat.vue';
import RouteKoulutuksenJarjestaja from '@/routes/ammatillinen/RouteKoulutuksenJarjestaja.vue';

import RouteUutiset from '@/routes/uutiset/RouteUutiset.vue';
import RouteUutinen from '@/routes/uutiset/RouteUutinen.vue';

import RoutePeruste from '@/routes/perusteet/RoutePeruste.vue';
import RoutePerusteTiedot from '@/routes/perusteet/tiedot/RoutePerusteTiedot.vue';
import RouteTekstikappale from '@/routes/perusteet/sisalto/tekstikappale/RouteTekstikappale.vue';
import RouteTekstikappaleOsa from '@/routes/perusteet/sisalto/tekstikappale/RouteTekstikappaleOsa.vue';
import RouteLaajaAlaiset from '@/routes/perusteet/sisalto/lops2019/laajaalaiset/RouteLaajaAlaiset.vue';
import RouteOppiaineet from '@/routes/perusteet/sisalto/lops2019/oppiaineet/RouteOppiaineet.vue';
import RouteOppiaine from '@/routes/perusteet/sisalto/lops2019/oppiaineet/RouteOppiaine.vue';
import RouteModuuli from '@/routes/perusteet/sisalto/lops2019/oppiaineet/RouteModuuli.vue';
import RouteTutkinnonosat from '@/routes/perusteet/sisalto/ammatillinen/RouteTutkinnonosat.vue';
import RouteTutkinnonosa from '@/routes/perusteet/sisalto/ammatillinen/RouteTutkinnonosa.vue';
import RouteRakenne from '@/routes/perusteet/sisalto/ammatillinen/RouteRakenne.vue';
import RouteVuosiluokkakokonaisuus from '@/routes/perusteet/sisalto/perusopetus/RouteVuosiluokkakokonaisuus.vue';
import RoutePerusopetusOppiaine from '@/routes/perusteet/sisalto/perusopetus/RoutePerusopetusOppiaine.vue';
import RoutePerusopetusOppiaineet from '@/routes/perusteet/sisalto/perusopetus/RoutePerusopetusOppiaineet.vue';
import RouteAipeKurssi from '@/routes/perusteet/sisalto/aipe/RouteAipeKurssi.vue';
import RouteAipeOppiaine from '@/routes/perusteet/sisalto/aipe/RouteAipeOppiaine.vue';
import RouteAipeVaihe from '@/routes/perusteet/sisalto/aipe/RouteAipeVaihe.vue';
import RouteOpintokokonaisuus from '@/routes/perusteet/sisalto/vapaasivistystyo/RouteOpintokokonaisuus.vue';
import RouteTavoitesisaltoalue from '@/routes/perusteet/sisalto/vapaasivistystyo/RouteTavoitesisaltoalue.vue';
import RouteKoulutuksenOsa from '@/routes/perusteet/sisalto/tutkintoonvalmentava/RouteKoulutuksenOsa.vue';
import RouteKotoKielitaitotaso from '@/routes/perusteet/sisalto/vapaasivistystyo/RouteKotoKielitaitotaso.vue';
import RouteKotoOpinto from '@/routes/perusteet/sisalto/vapaasivistystyo/RouteKotoOpinto.vue';

import RouteOpetussuunnitelma from '@/routes/opetussuunnitelmat/RouteOpetussuunnitelma.vue';
import RouteOpetussuunnitelmaTiedot from '@/routes/opetussuunnitelmat/tiedot/RouteOpetussuunnitelmaTiedot.vue';
import RouteOpetussuunnitelmaTekstikappale from '@/routes/opetussuunnitelmat/sisalto/tekstikappale/RouteOpetussuunnitelmaTekstikappale.vue';
import RouteToteutussuunnitelmaTiedot from '@/routes/toteutussuunnitelmat/RouteToteutussuunnitelmaTiedot.vue';
import RouteToteutussuunnitelmaSuorituspolut from '@/routes/toteutussuunnitelmat/RouteToteutussuunnitelmaSuorituspolut.vue';
import RouteToteutussuunnitelmaSisalto from '@/routes/toteutussuunnitelmat/RouteToteutussuunnitelmaSisalto.vue';
import RouteToteutussuunnitelmaTutkinnonosat from '@/routes/toteutussuunnitelmat/RouteToteutussuunnitelmaTutkinnonosat.vue';
import RoutePerusopetusVuosiluokkakokonaisuus from '@/routes/opetussuunnitelmat/sisalto/perusopetus/RoutePerusopetusVuosiluokkakokonaisuus.vue';
import RouteOpetussuunnitelmaPerusopetusOppiaineet from '@/routes/opetussuunnitelmat/sisalto/perusopetus/RouteOpetussuunnitelmaPerusopetusOppiaineet.vue';
import RouteOpetussuunnitelmaPerusopetusOppiaine from '@/routes/opetussuunnitelmat/sisalto/perusopetus/RouteOpetussuunnitelmaPerusopetusOppiaine.vue';
import RouteOpetussuunnitelmaPerusopetusValinnaisetOppiaineet from '@/routes/opetussuunnitelmat/sisalto/perusopetus/RouteOpetussuunnitelmaPerusopetusValinnaisetOppiaineet.vue';

import { PerusteStore } from '@/stores/PerusteStore';
import { TiedoteStore } from '@/stores/TiedoteStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { OpetussuunnitelmaTekstikappaleStore } from '@/stores/OpetussuunnitelmaTekstikappaleStore';

import { changeLang, resolveRouterMetaProps, removeQueryParam } from '@shared/utils/router';
import { stateToKoulutustyyppi, perusteenSuoritustapa } from '@shared/utils/perusteet';

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
import { AmmatillistenTiedoteStore } from '@/stores/AmmatillistenTiedoteStore';
import { KoulutuksenJarjestajatStore } from '@/stores/KoulutuksenJarjestajatStore';
import { OpasStore } from '@/stores/OpasStore';
import { AmmatillinenPerusteKoosteStore } from '@/stores/AmmatillinenPerusteKoosteStore';
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';
import { KoulutuksenJarjestajaStore } from '@/stores/KoulutuksenJarjestajaStore';
import { PerusteenTutkinnonosatStore } from '@/stores/PerusteenTutkinnonosatStore';
import { PerusteenTutkinnonosaStore } from '@/stores/PerusteenTutkinnonosaStore';
import { PerusteRakenneStore } from '@/stores/PerusteRakenneStore';
import { PerusteVuosiluokkakokonaisuusStore } from '@/stores/PerusteVuosiluokkakokonaisuusStore';
import { PerusopetusOppiaineStore } from '@/stores/PerusopetusOppiaineStore';
import { OpetussuunnitelmaVuosiluokkakokonaisuusStore } from '@/stores/OpetussuunnitelmaVuosiluokkakokonaisuusStore';
import { OpetussuunnitelmaOppiaineStore } from '@/stores/OpetussuunnitelmaOppiaineStore';
import { AipeVaiheStore } from '@/stores/AipeVaiheStore';
import { AipeOppiaineStore } from '@/stores/AipeOppiaineStore';
import { AipeKurssiStore } from '@/stores/AipeKurssiStore';
import { getKoostePaikallinenComponent, getKoostePaikallinenStore } from '@/utils/toteutustypes';
import { ValmisteillaOlevatStore } from '@/stores/ValmisteillaOlevatStore';
import { PalauteStore } from '@/stores/PalauteStore';

Vue.use(Router);
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true,
});

const logger = createLogger('Router');

const perusteStore = new PerusteStore();
const tiedoteStore = new TiedoteStore();
const ammatillistenTiedotteetStore = new AmmatillistenTiedoteStore();
const koulutuksenJarjestajatStore = new KoulutuksenJarjestajatStore();
const valmisteillaOlevatStore = new ValmisteillaOlevatStore();
const palauteStore = new PalauteStore();

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
        offset: {
          x: 0,
          y: navbarHeight,
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
        offset: {
          x: 0,
          y: navbarHeight,
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
    props: {
      palauteStore,
    },
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
      path: 'kooste/ammmatillinen/:perusteId',
      name: 'ammatillinenkooste',
      component: RouteKoosteAmmatillinen,
      meta: {
        resolve: {
          async props(route) {
            return {
              default: {
                ammatillinenPerusteKoosteStore: new AmmatillinenPerusteKoosteStore(_.parseInt(route.params.perusteId)),
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
                opasStore: new OpasStore(stateToKoulutustyyppi(route.params.koulutustyyppi)),
                paikallinenStore: getKoostePaikallinenStore(route.params.koulutustyyppi)(),
                paikallinenComponent: getKoostePaikallinenComponent(route.params.koulutustyyppi),
              },
            };
          },
        },
      },
    }, {
      path: 'selaus/:koulutustyyppi',
      name: 'ammatillinenSelaus',
      component: RouteAmmatillinenSelaus,
      meta: {
        resolve: {
          cacheBy: ['koulutustyyppi'],
          async props(route) {
            return {
              default: {
                ammatillistenTiedotteetStore,
              },
            };
          },
        },
      },
      children: [
        {
          path: 'koulutuksenjarjestajat',
          component: RouteAmmatillinenKoulutuksenJarjestajat,
          name: 'ammatillinenKoulutuksenjarjestajat',
          props: { koulutuksenJarjestajatStore },
        },
        {
          path: 'koulutusviennit',
          component: RouteAmmatillinenKoulutusviennit,
          name: 'ammatillinenKoulutusviennit',
        }, {
          path: 'ohjeet',
          component: RouteAmmatillinenOhjeet,
          name: 'ammatillinenOhjeet',
        }, {
          path: 'tyopajat',
          component: RouteAmmatillinenTyopajat,
          name: 'ammatillinenTyopajat',
        }, {
          path: 'valmisteilla',
          component: RouteAmmatillinenValmisteillaOlevat,
          name: 'ammatillinenValmisteillaOlevat',
          props: { valmisteillaOlevatStore },
        },
      ],
    }, {
      path: 'selaus/koulutuksenjarjestajat/:koulutuksenjarjestajaId',
      name: 'ammatillinenKoulutuksenjarjestaja',
      component: RouteKoulutuksenJarjestaja,
      meta: {
        resolve: {
          cacheBy: ['koulutuksenjarjestajaId'],
          async props(route) {
            return {
              default: {
                koulutuksenJarjestajaStore: new KoulutuksenJarjestajaStore(route.params.koulutuksenjarjestajaId),
              },
            };
          },
        },
      },
    }, {
      path: 'ajankohtaista',
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
      path: 'ajankohtaista/:tiedoteId',
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
      path: 'toteutussuunnitelma/:toteutussuunnitelmaId/:koulutustyyppi',
      name: 'toteutussuunnitelma',
      component: RouteOpetussuunnitelma,
      redirect(to) {
        return {
          name: 'toteutussuunnitelmaTiedot',
        };
      },
      meta: {
        resolve: {
          cacheBy: ['toteutussuunnitelmaId'],
          async props(route) {
            return {
              default: {
                opetussuunnitelmaDataStore: await ToteutussuunnitelmaDataStore.create(
                  _.parseInt(route.params.toteutussuunnitelmaId),
                ),
              },
            };
          },
        },
      },
      children: [{
        path: 'tiedot',
        component: RouteToteutussuunnitelmaTiedot,
        name: 'toteutussuunnitelmaTiedot',
      }, {
        path: 'sisalto/:sisaltoviiteId',
        component: RouteToteutussuunnitelmaSisalto,
        name: 'toteutussuunnitelmaSisalto',
      }, {
        path: 'tutkinnonosat',
        component: RouteToteutussuunnitelmaTutkinnonosat,
        name: 'toteutussuunnitelmaTutkinnonosat',
      }, {
        path: 'suorituspolut/:sisaltoviiteId',
        component: RouteToteutussuunnitelmaSuorituspolut,
        name: 'toteutussuunnitelmaSuorituspolut',
      }],
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
        children: [{
          path: 'osa/:osa',
          component: RouteTekstikappaleOsa,
          name: 'tekstikappaleOsa',
        }],
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
      }, {
        path: 'tutkinnonosat',
        component: RouteTutkinnonosat,
        name: 'tutkinnonosat',
        meta: {
          resolve: {
            cacheBy: ['perusteId'],
            async props(route) {
              const perusteDataStore = getRouteStore(route, 'peruste', 'perusteDataStore');
              return {
                default: {
                  tutkinnonosatStore: await new PerusteenTutkinnonosatStore(
                    perusteDataStore.peruste,
                  ),
                },
              };
            },
          },
        },
      }, {
        path: 'vuosiluokkakokonaisuus/:vlkId',
        component: RouteVuosiluokkakokonaisuus,
        name: 'vuosiluokkakokonaisuus',
        meta: {
          resolve: {
            cacheBy: ['perusteId', 'vlkId'],
            async props(route) {
              return {
                default: {
                  perusteVuosiluokkakokonaisuusStore: await PerusteVuosiluokkakokonaisuusStore.create(
                    _.parseInt(route.params.perusteId),
                    _.parseInt(route.params.vlkId),
                  ),
                },
              };
            },
          },
        },
        children: [{
          path: 'oppiaine/:oppiaineId',
          component: RoutePerusopetusOppiaine,
          name: 'vuosiluokanoppiaine',
          meta: {
            resolve: {
              cacheBy: ['perusteId', 'vlkId', 'oppiaineId'],
              async props(route) {
                return {
                  default: {
                    perusopetusOppiaineStore: await PerusopetusOppiaineStore.create(
                      _.parseInt(route.params.perusteId),
                      _.parseInt(route.params.oppiaineId),
                    ),
                  },
                };
              },
            },
          },
        }],
      }, {
        path: 'tutkinnonosat/:tutkinnonOsaViiteId',
        component: RouteTutkinnonosa,
        name: 'tutkinnonosa',
        meta: {
          resolve: {
            cacheBy: ['perusteId', 'tutkinnonOsaViiteId'],
            async props(route) {
              const perusteDataStore = getRouteStore(route, 'peruste', 'perusteDataStore');
              return {
                default: {
                  tutkinnonosaStore: await new PerusteenTutkinnonosaStore(
                    perusteDataStore.peruste,
                    _.parseInt(route.params.tutkinnonOsaViiteId),
                  ),
                },
              };
            },
          },
        },
      }, {
        path: 'rakenne',
        component: RouteRakenne,
        name: 'perusteenRakenne',
        meta: {
          resolve: {
            cacheBy: ['perusteId'],
            async props(route) {
              const perusteDataStore = getRouteStore(route, 'peruste', 'perusteDataStore');
              return {
                default: {
                  rakenneStore: await new PerusteRakenneStore(
                    perusteDataStore.peruste.id,
                    perusteenSuoritustapa(perusteDataStore.peruste),
                  ),
                },
              };
            },
          },
        },
      }, {
        path: 'oppiaineet',
        component: RoutePerusopetusOppiaineet,
        name: 'perusopetusoppiaineet',
      }, {
        path: 'oppiaineet/:oppiaineId',
        component: RoutePerusopetusOppiaine,
        name: 'perusopetusoppiaine',
        meta: {
          resolve: {
            cacheBy: ['perusteId', 'oppiaineId'],
            async props(route) {
              return {
                default: {
                  perusopetusOppiaineStore: await PerusopetusOppiaineStore.create(
                    _.parseInt(route.params.perusteId),
                    _.parseInt(route.params.oppiaineId),
                  ),
                },
              };
            },
          },
        },
      }, {
        path: 'vaihe/:vaiheId',
        component: RouteAipeVaihe,
        name: 'aipevaihe',
        meta: {
          resolve: {
            cacheBy: ['perusteId', 'vaiheId'],
            async props(route) {
              return {
                default: {
                  aipeVaiheStore: await AipeVaiheStore.create(
                    _.parseInt(route.params.perusteId),
                    _.parseInt(route.params.vaiheId),
                  ),
                },
              };
            },
          },
        },
        children: [{
          path: 'oppiaine/:oppiaineId',
          component: RouteAipeOppiaine,
          name: 'aipeoppiaine',
          meta: {
            resolve: {
              cacheBy: ['perusteId', 'vaiheId', 'oppiaineId'],
              async props(route) {
                return {
                  default: {
                    aipeOppiaineStore: await AipeOppiaineStore.create(
                      _.parseInt(route.params.perusteId),
                      _.parseInt(route.params.vaiheId),
                      _.parseInt(route.params.oppiaineId),
                    ),
                  },
                };
              },
            },
          },
          children: [{
            path: 'kurssi/:kurssiId',
            component: RouteAipeKurssi,
            name: 'aipekurssi',
            meta: {
              resolve: {
                cacheBy: ['perusteId', 'vaiheId', 'oppiaineId', 'kurssiId'],
                async props(route) {
                  return {
                    default: {
                      aipeKurssiStore: await AipeKurssiStore.create(
                        _.parseInt(route.params.perusteId),
                        _.parseInt(route.params.vaiheId),
                        _.parseInt(route.params.oppiaineId),
                        _.parseInt(route.params.kurssiId),
                      ),
                    },
                  };
                },
              },
            },
          }],
        }],
      }, {
        path: 'osaamiskokonaisuus/:opintokokonaisuusId',
        component: RouteOpintokokonaisuus,
        name: 'perusteOpintokokonaisuus',
        meta: {
          resolve: {
            cacheBy: ['opintokokonaisuusId'],
            async props(route) {
              return {
                default: {
                  perusteenOsaStore: await PerusteenOsaStore.create(
                    _.parseInt(route.params.opintokokonaisuusId),
                  ),
                },
              };
            },
          },
        },
      }, {
        path: 'tavoitesisaltoalue/:tavoitesisaltoalueId',
        component: RouteTavoitesisaltoalue,
        name: 'perusteTavoitesisaltoalue',
        meta: {
          resolve: {
            cacheBy: ['tavoitesisaltoalueId'],
            async props(route) {
              return {
                default: {
                  perusteenOsaStore: await PerusteenOsaStore.create(
                    _.parseInt(route.params.tavoitesisaltoalueId),
                  ),
                },
              };
            },
          },
        },
      }, {
        path: 'koulutuksenosa/:koulutuksenosaId',
        component: RouteKoulutuksenOsa,
        name: 'perusteKoulutuksenOsa',
        meta: {
          resolve: {
            cacheBy: ['koulutuksenosaId'],
            async props(route) {
              return {
                default: {
                  perusteenOsaStore: await PerusteenOsaStore.create(
                    _.parseInt(route.params.koulutuksenosaId),
                  ),
                },
              };
            },
          },
        },

      }, {
        path: 'koto/kielitaitotaso/:kotokielitaitotasoId',
        component: RouteKotoKielitaitotaso,
        name: 'perusteKotoKielitaitotaso',
        meta: {
          resolve: {
            cacheBy: ['kotokielitaitotasoId'],
            async props(route) {
              return {
                default: {
                  perusteenOsaStore: await PerusteenOsaStore.create(
                    _.parseInt(route.params.kotokielitaitotasoId),
                  ),
                },
              };
            },
          },
        },

      }, {
        path: 'koto/opinto/:kotoOpintoId',
        component: RouteKotoOpinto,
        name: 'perusteKotoOpinto',
        meta: {
          resolve: {
            cacheBy: ['kotoOpintoId'],
            async props(route) {
              return {
                default: {
                  perusteenOsaStore: await PerusteenOsaStore.create(
                    _.parseInt(route.params.kotoOpintoId),
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
                    route.params.koulutustyyppi,
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
      }, {
        path: 'vuosiluokkakokonaisuus/:vlkId',
        component: RoutePerusopetusVuosiluokkakokonaisuus,
        name: 'opetussuunnitelmanvuosiluokkakokonaisuus',
        meta: {
          resolve: {
            cacheBy: ['opetussuunnitelmaId', 'vlkId'],
            async props(route) {
              return {
                default: {
                  opetussuunnitelmaVuosiluokkakokonaisuusStore: await OpetussuunnitelmaVuosiluokkakokonaisuusStore.create(
                    _.parseInt(route.params.opetussuunnitelmaId),
                    _.parseInt(route.params.vlkId),
                  ),
                },
              };
            },
          },
        },
        children: [{
          path: 'oppiaine/:oppiaineId',
          component: RouteOpetussuunnitelmaPerusopetusOppiaine,
          name: 'opetussuunnitelmaperusopetusvuosiluokanoppiaine',
          meta: {
            resolve: {
              cacheBy: ['opetussuunnitelmaId', 'vlkId', 'oppiaineId'],
              async props(route) {
                const opetussuunnitelmaDataStore = getRouteStore(route, 'opetussuunnitelma', 'opetussuunnitelmaDataStore');
                return {
                  default: {
                    opetussuunnitelmaOppiaineStore: await OpetussuunnitelmaOppiaineStore.create(
                      opetussuunnitelmaDataStore.opetussuunnitelma,
                      _.parseInt(route.params.opetussuunnitelmaId),
                      _.parseInt(route.params.oppiaineId),
                      _.parseInt(route.params.vlkId),
                    ),
                  },
                };
              },
            },
          },
        }],
      }, {
        path: 'oppiaineet',
        component: RouteOpetussuunnitelmaPerusopetusOppiaineet,
        name: 'opetussuunnitelmaperusopetusoppiaineet',
      }, {
        path: 'valinnaisetoppiaineet',
        component: RouteOpetussuunnitelmaPerusopetusValinnaisetOppiaineet,
        name: 'opetussuunnitelmaperusopetusvalinnaisetoppiaineet',
        alias: 'valinnaisetoppiaineet/:vlkId',
      }, {
        path: 'oppiaineet/:oppiaineId',
        component: RouteOpetussuunnitelmaPerusopetusOppiaine,
        name: 'opetussuunnitelmaperusopetusoppiaine',
        meta: {
          resolve: {
            cacheBy: ['opetussuunnitelmaId', 'oppiaineId'],
            async props(route) {
              const opetussuunnitelmaDataStore = getRouteStore(route, 'opetussuunnitelma', 'opetussuunnitelmaDataStore');
              return {
                default: {
                  opetussuunnitelmaOppiaineStore: await OpetussuunnitelmaOppiaineStore.create(
                    opetussuunnitelmaDataStore.opetussuunnitelma,
                    _.parseInt(route.params.opetussuunnitelmaId),
                    _.parseInt(route.params.oppiaineId),
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

router.beforeEach((to, from, next) => {
  changeLang(to, from);
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

function getRouteStore(route: any, routeName: string, store: string) {
  const filteredRoute = _.head(_.filter(route.matched, match => match.name === routeName));
  return _.get(filteredRoute, 'props.default.' + store);
}
