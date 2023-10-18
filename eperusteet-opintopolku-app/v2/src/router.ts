import _ from 'lodash';
import Vue from 'vue';
import Router from 'vue-router';
import VueScrollTo from 'vue-scrollto';
import VueMeta from 'vue-meta';
import Root from '@/routes/Root.vue';
import EpErrorPage from '@shared/components/EpErrorPage/EpErrorPage.vue';
import Home from '@/routes/home/RouteHome.vue';
import RouteKooste from '@/routes/kooste/RouteKooste.vue';
import RouteKoosteAmmatillinen from '@/routes/kooste/RouteKoosteAmmatillinen.vue';
import RouteAmmatillinenSelaus from '@/routes/ammatillinen/RouteAmmatillinenSelaus.vue';
import RouteAmmatillinenKoulutuksenJarjestajat from '@/routes/ammatillinen/RouteAmmatillinenKoulutuksenJarjestajat.vue';
import RouteAmmatillinenValmisteillaOlevat from '@/routes/ammatillinen/RouteAmmatillinenValmisteillaOlevat.vue';
import RouteAmmatillinenOhjeet from '@/routes/ammatillinen/RouteAmmatillinenOhjeet.vue';
import RouteKoulutuksenJarjestaja from '@/routes/ammatillinen/RouteKoulutuksenJarjestaja.vue';
import RouteAmmatillinenMaaraykset from '@/routes/ammatillinen/RouteAmmatillinenMaaraykset.vue';
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
import RouteAipeLaajaAlaisetOsaamiset from '@/routes/perusteet/sisalto/aipe/RouteAipeLaajaAlaisetOsaamiset.vue';
import RouteOpintokokonaisuus from '@/routes/perusteet/sisalto/vapaasivistystyo/RouteOpintokokonaisuus.vue';
import RouteTavoitesisaltoalue from '@/routes/perusteet/sisalto/vapaasivistystyo/RouteTavoitesisaltoalue.vue';
import RouteKoulutuksenOsa from '@/routes/perusteet/sisalto/tutkintoonvalmentava/RouteKoulutuksenOsa.vue';
import RouteKotoKielitaitotaso from '@/routes/perusteet/sisalto/vapaasivistystyo/RouteKotoKielitaitotaso.vue';
import RouteKotoOpinto from '@/routes/perusteet/sisalto/vapaasivistystyo/RouteKotoOpinto.vue';
import RouteLaajaalainenOsaaminen from '@/routes/perusteet/sisalto/tutkintoonvalmentava/RouteLaajaalainenOsaaminen.vue';
import RouteYleisettavoitteet from '@/routes/perusteet/sisalto/lukio/RouteYleisettavoitteet.vue';
import RouteAihekokonaisuudet from '@/routes/perusteet/sisalto/lukio/RouteAihekokonaisuudet.vue';
import RouteLukioOppiaine from '@/routes/perusteet/sisalto/lukio/RouteLukioOppiaine.vue';
import RouteKurssi from '@/routes/perusteet/sisalto/lukio/RouteKurssi.vue';
import RouteOsaamiskokonaisuus from '@/routes/perusteet/sisalto/digi/RouteOsaamiskokonaisuus.vue';
import RouteOsaamiskokonaisuusPaaAlue from '@/routes/perusteet/sisalto/digi/RouteOsaamiskokonaisuusPaaAlue.vue';
import RouteOsaamismerkit from '@/routes/osaamismerkit/RouteOsaamismerkit.vue';
import RouteOpetussuunnitelma from '@/routes/opetussuunnitelmat/RouteOpetussuunnitelma.vue';
import RouteOpetussuunnitelmaTiedot from '@/routes/opetussuunnitelmat/tiedot/RouteOpetussuunnitelmaTiedot.vue';
import RouteOpetussuunnitelmaTekstikappale from '@/routes/opetussuunnitelmat/sisalto/tekstikappale/RouteOpetussuunnitelmaTekstikappale.vue';
import RouteToteutussuunnitelmaTiedot from '@/routes/toteutussuunnitelmat/RouteToteutussuunnitelmaTiedot.vue';
import RouteToteutussuunnitelmaSuorituspolut from '@/routes/toteutussuunnitelmat/RouteToteutussuunnitelmaSuorituspolut.vue';
import RouteToteutussuunnitelmaSisalto from '@/routes/toteutussuunnitelmat/RouteToteutussuunnitelmaSisalto.vue';
import RouteToteutussuunnitelmaOsaAlue from '@/routes/toteutussuunnitelmat/RouteToteutussuunnitelmaOsaAlue.vue';
import RouteToteutussuunnitelmaTutkinnonosat from '@/routes/toteutussuunnitelmat/RouteToteutussuunnitelmaTutkinnonosat.vue';
import RoutePerusopetusVuosiluokkakokonaisuus from '@/routes/opetussuunnitelmat/sisalto/perusopetus/RoutePerusopetusVuosiluokkakokonaisuus.vue';
import RouteOpetussuunnitelmaPerusopetusOppiaineet from '@/routes/opetussuunnitelmat/sisalto/perusopetus/RouteOpetussuunnitelmaPerusopetusOppiaineet.vue';
import RouteOpetussuunnitelmaPerusopetusOppiaine from '@/routes/opetussuunnitelmat/sisalto/perusopetus/RouteOpetussuunnitelmaPerusopetusOppiaine.vue';
import RouteOpetussuunnitelmaPerusopetusValinnaisetOppiaineet from '@/routes/opetussuunnitelmat/sisalto/perusopetus/RouteOpetussuunnitelmaPerusopetusValinnaisetOppiaineet.vue';
import RouteOsaamismerkkiTiedot from '@/routes/osaamismerkit/RouteOsaamismerkkiTiedot.vue';

import { PerusteStore } from '@/stores/PerusteStore';
import { TiedoteStore } from '@/stores/TiedoteStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { changeLang, resolveRouterMetaProps, removeQueryParam } from '@shared/utils/router';
import { stateToKoulutustyyppi } from '@shared/utils/perusteet';
import { Virheet } from '@shared/stores/virheet';
import { SovellusVirhe } from '@shared/tyypit';
import { createLogger } from '@shared/utils/logger';
import RouteOpetussuunnitelmaOppiaineet
  from '@/routes/opetussuunnitelmat/sisalto/lops2019/oppiaineet/RouteOpetussuunnitelmaOppiaineet.vue';
import RouteOpetussuunnitelmaOppiaine
  from '@/routes/opetussuunnitelmat/sisalto/lops2019/oppiaineet/RouteOpetussuunnitelmaOppiaine.vue';
import RouteOpetussuunnitelmaModuuli
  from '@/routes/opetussuunnitelmat/sisalto/lops2019/oppiaineet/RouteOpetussuunnitelmaModuuli.vue';
import RouteOpetussuunnitelmaOpintojakso
  from '@/routes/opetussuunnitelmat/sisalto/lops2019/opintojaksot/RouteOpetussuunnitelmaOpintojakso.vue';
import RouteOpetussuunnitelmaPoppiaine
  from '@/routes/opetussuunnitelmat/sisalto/lops2019/oppiaineet/RouteOpetussuunnitelmaPoppiaine.vue';
import RouteOpetussuunnitelmaOppiaine2015 from '@/routes/opetussuunnitelmat/sisalto/lops/RouteOpetussuunnitelmaOppiaine2015.vue';
import RouteOpetussuunnitelmaKurssi from '@/routes/opetussuunnitelmat/sisalto/lops/RouteOpetussuunnitelmaKurssi.vue';
import { AmmatillistenTiedoteStore } from '@/stores/AmmatillistenTiedoteStore';
import { KoulutuksenJarjestajatStore } from '@/stores/KoulutuksenJarjestajatStore';
import { AmmatillinenPerusteKoosteStore } from '@/stores/AmmatillinenPerusteKoosteStore';
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';
import { KoulutuksenJarjestajaStore } from '@/stores/KoulutuksenJarjestajaStore';
import {
  getKoosteKuvaus,
  getKoosteOpasStore,
  getKoostePaikallinenComponent,
  getKoostePaikallinenStore,
  getKoostePerusteHeader,
  getKoostePerusteStore,
  getKoosteSubheader,
  getKoosteTiedotteetStore,
  getOsaamismerkitStore,
} from '@/utils/toteutustypes';
import { ValmisteillaOlevatStore } from '@/stores/ValmisteillaOlevatStore';
import { PalauteStore } from '@/stores/PalauteStore';
import { JulkaistutKoulutustyypitStore } from './stores/JulkaistutKoulutustyypitStore';
import { MaarayksetStore } from './stores/MaarayksetStore';
import RouteKotoLaajaAlainenOsaaminen
  from '@/routes/perusteet/sisalto/vapaasivistystyo/RouteKotoLaajaAlainenOsaaminen.vue';
import RouteLinkkisivu from '@/routes/perusteet/sisalto/linkkisivu/RouteLinkkisivu.vue';
import { redirects } from './utils/redirects';
import { AmmatillinenPerusteHakuStore } from './stores/AmmatillinenPerusteHakuStore';
import { OsaamismerkitStore } from '@/stores/OsaamismerkitStore';
import { OsaamismerkkiStore } from '@/stores/OsaamismerkkiStore';

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
const julkaistutKoulutustyypitStore = new JulkaistutKoulutustyypitStore();
const ammatillinenPerusteHakuStore = new AmmatillinenPerusteHakuStore();
const osaamismerkitStore = new OsaamismerkitStore();

const routeProps = (route: any) => {
  return {
    ...route.params,
    ...route.query,
  };
};

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
      julkaistutKoulutustyypitStore,
    },
    children: [
      ...redirects,
      {
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
                  julkaistutKoulutustyypitStore,
                },
              };
            },
          },
        },
      }, {
        path: 'virhe',
        name: 'virhe',
        component: EpErrorPage,
        props: routeProps,
      }, {
        path: 'kooste/ammatillinen/:perusteId(\\d+)',
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
        path: 'kooste/:koulutustyyppi([a-z]+)/:perusteId(\\d+)?',
        name: 'kooste',
        component: RouteKooste,
        meta: {
          resolve: {
            cacheBy: ['koulutustyyppi'],
            async props(route) {
              return {
                default: {
                  perusteKoosteStore: getKoostePerusteStore(stateToKoulutustyyppi(route.params.koulutustyyppi)),
                  opasStore: getKoosteOpasStore(stateToKoulutustyyppi(route.params.koulutustyyppi)),
                  tiedotteetStore: getKoosteTiedotteetStore(stateToKoulutustyyppi(route.params.koulutustyyppi)),
                  paikallinenStore: getKoostePaikallinenStore(route.params.koulutustyyppi)(),
                  osaamismerkitStore: getOsaamismerkitStore(route.params.koulutustyyppi),
                  paikallinenComponent: getKoostePaikallinenComponent(route.params.koulutustyyppi),
                  kuvaus: getKoosteKuvaus(route.params.koulutustyyppi),
                  subheader: getKoosteSubheader(route.params.koulutustyyppi),
                  perusteetHeader: getKoostePerusteHeader(route.params.koulutustyyppi),
                },
              };
            },
          },
        },
      }, {
        path: 'osaamismerkit',
        name: 'osaamismerkit',
        component: RouteOsaamismerkit,
        meta: {
          resolve: {
            async props() {
              return {
                default: {
                  osaamismerkitStore: osaamismerkitStore,
                },
              };
            },
          },
        },
      }, {
        path: 'osaamismerkki/tiedot/:osaamismerkkiId(\\d+)?',
        name: 'osaamismerkkiTiedot',
        component: RouteOsaamismerkkiTiedot,
        meta: {
          resolve: {
            cacheBy: ['osaamismerkkiId'],
            async props(route) {
              return {
                default: {
                  osaamismerkkiStore: await OsaamismerkkiStore.create(route.params.osaamismerkkiId),
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
                  ammatillinenPerusteHakuStore,
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
          }, {
            path: 'ohjeet',
            component: RouteAmmatillinenOhjeet,
            name: 'ammatillinenOhjeet',
          }, {
            path: 'valmisteilla',
            component: RouteAmmatillinenValmisteillaOlevat,
            name: 'ammatillinenValmisteillaOlevat',
            props: { valmisteillaOlevatStore },
          }, {
            path: 'maaraykset',
            component: RouteAmmatillinenMaaraykset,
            name: 'ammatillinenMaaraykset',
            meta: {
              resolve: {
                async props(route) {
                  return {
                    default: {
                      maarayksetStore: new MaarayksetStore(),
                    },
                  };
                },
              },
            },
          },
        ],
      }, {
        path: 'selaus/koulutuksenjarjestajat/:koulutuksenjarjestajaId(\\d+)',
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
                  julkaistutKoulutustyypitStore,
                },
              };
            },
          },
        },
      }, {
        path: 'ajankohtaista/:tiedoteId(\\d+)',
        name: 'uutinen',
        component: RouteUutinen,
        meta: {
          resolve: {
            async props() {
              return {
                default: {
                  perusteStore,
                  tiedoteStore,
                  julkaistutKoulutustyypitStore,
                },
              };
            },
          },
        },
      }, {
        path: 'toteutussuunnitelma/:toteutussuunnitelmaId(\\d+)/:revision(\\d+)?/:koulutustyyppi',
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
                    route.params.revision,
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
        }, {
          path: 'sisalto/:sisaltoviiteId/osaalue/:osaalueId',
          component: RouteToteutussuunnitelmaOsaAlue,
          name: 'toteutussuunnitelmaOsaAlue',
        }],
      }, {
        path: 'ops/:opetussuunnitelmaId(\\d+)/:revision(\\d+)?/:koulutustyyppi*',
        name: 'ops',
        component: RouteOpetussuunnitelma,
        redirect(to) {
          return {
            name: 'opetussuunnitelma',
          };
        },
      }, {
        path: 'opetussuunnitelma/:opetussuunnitelmaId(\\d+)/:revision(\\d+)?/:koulutustyyppi',
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
                    route.params.revision,
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
        }, {
          path: 'oppiaine',
          component: RouteOpetussuunnitelmaOppiaineet,
          name: 'lops2019OpetussuunnitelmaOppiaineet',
        }, {
          path: 'oppiaine/:oppiaineId',
          component: RouteOpetussuunnitelmaOppiaine,
          name: 'lops2019OpetussuunnitelmaOppiaine',
        }, {
          path: 'poppiaine/:oppiaineId',
          component: RouteOpetussuunnitelmaPoppiaine,
          name: 'lops2019OpetussuunnitelmaPoppiaine',
        }, {
          path: 'oppiaine/:oppiaineId/moduuli/:moduuliId',
          component: RouteOpetussuunnitelmaModuuli,
          name: 'lops2019OpetussuunnitelmaModuuli',
        }, {
          path: 'opintojakso/:opintojaksoId',
          component: RouteOpetussuunnitelmaOpintojakso,
          name: 'lops2019OpetussuunnitelmaOpintojakso',
        }, {
          path: 'lukiooppiaine/:oppiaineId',
          component: RouteOpetussuunnitelmaOppiaine2015,
          name: 'lopsOpetussuunnitelmaOppiaine',
          children: [{
            path: 'kurssi/:kurssiId',
            component: RouteOpetussuunnitelmaKurssi,
            name: 'lopsOpetussuunnitelmaKurssi',
          }],
        }, {
          path: 'vuosiluokkakokonaisuus/:vlkId',
          component: RoutePerusopetusVuosiluokkakokonaisuus,
          name: 'opetussuunnitelmanvuosiluokkakokonaisuus',
          children: [{
            path: 'oppiaine/:oppiaineId',
            component: RouteOpetussuunnitelmaPerusopetusOppiaine,
            name: 'opetussuunnitelmaperusopetusvuosiluokanoppiaine',
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
        }],
      }, {
        path: ':koulutustyyppi/:perusteId(\\d+)/:revision(\\d+)?',
        name: 'peruste',
        component: RoutePeruste,
        meta: {
          resolve: {
            cacheBy: ['perusteId'],
            async props(route) {
              return {
                default: {
                  perusteDataStore: await PerusteDataStore.create(_.parseInt(route.params.perusteId), route.params.revision),
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
                  default: await createPerusteOsaStore(route, route.params.viiteId),
                };
              },
            },
          },
          children: [{
            path: 'osa/:osa',
            component: RouteTekstikappaleOsa,
            name: 'tekstikappaleOsa',
          },
          {
            path: 'vapaaOsa/:vapaatekstiId',
            component: RouteTekstikappaleOsa,
            name: 'tekstikappaleVapaaOsa',
          },
          ],
        }, {
          path: 'laajaalaiset',
          component: RouteLaajaAlaiset,
          name: 'lops2019laajaalaiset',
        }, {
          path: 'oppiaine',
          component: RouteOppiaineet,
          name: 'lukioOppiaineet',
        }, {
          path: 'oppiaine/:oppiaineId',
          component: RouteOppiaine,
          name: 'lops2019oppiaine',
        }, {
          path: 'oppiaine/:oppiaineId/moduuli/:moduuliId',
          component: RouteModuuli,
          name: 'lops2019moduuli',
        }, {
          path: 'lukiooppiaine/:oppiaineId',
          component: RouteLukioOppiaine,
          name: 'lukioOppiaine',
          children: [{
            path: 'lukiokurssi/:kurssiId',
            component: RouteKurssi,
            name: 'lukiokurssi',
          }],
        }, {
          path: 'tutkinnonosat',
          component: RouteTutkinnonosat,
          name: 'tutkinnonosat',
        }, {
          path: 'vuosiluokkakokonaisuus/:vlkId',
          component: RouteVuosiluokkakokonaisuus,
          name: 'vuosiluokkakokonaisuus',
          children: [{
            path: 'oppiaine/:oppiaineId',
            component: RoutePerusopetusOppiaine,
            name: 'vuosiluokanoppiaine',
          }],
        }, {
          path: 'tutkinnonosat/:tutkinnonOsaViiteId',
          component: RouteTutkinnonosa,
          name: 'tutkinnonosa',
        }, {
          path: 'rakenne',
          component: RouteRakenne,
          name: 'perusteenRakenne',
        }, {
          path: 'oppiaineet',
          component: RoutePerusopetusOppiaineet,
          name: 'perusopetusoppiaineet',
        }, {
          path: 'oppiaineet/:oppiaineId',
          component: RoutePerusopetusOppiaine,
          name: 'perusopetusoppiaine',
        }, {
          path: 'aipelaajaalainenosaaminen',
          component: RouteAipeLaajaAlaisetOsaamiset,
          name: 'aipeLaajaalainenOsaaminen',
        }, {
          path: 'vaihe/:vaiheId',
          component: RouteAipeVaihe,
          name: 'aipevaihe',
          children: [{
            path: 'oppiaine/:oppiaineId',
            component: RouteAipeOppiaine,
            name: 'aipeoppiaine',
            children: [{
              path: 'kurssi/:kurssiId',
              component: RouteAipeKurssi,
              name: 'aipekurssi',
            }],
          }],
        }, {
          path: 'opintokokonaisuus/:opintokokonaisuusId',
          component: RouteOpintokokonaisuus,
          name: 'perusteOpintokokonaisuus',
          meta: {
            resolve: {
              cacheBy: ['opintokokonaisuusId'],
              async props(route) {
                return {
                  default: await createPerusteOsaStore(route, route.params.opintokokonaisuusId),
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
                  default: await createPerusteOsaStore(route, route.params.tavoitesisaltoalueId),
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
                  default: await createPerusteOsaStore(route, route.params.koulutuksenosaId),
                };
              },
            },
          },
        }, {
          path: 'laajaalainenosaaminen/:laajaalainenosaaminenId',
          component: RouteLaajaalainenOsaaminen,
          name: 'perusteLaajaalainenOsaaminen',
          meta: {
            resolve: {
              cacheBy: ['laajaalainenosaaminenId'],
              async props(route) {
                return {
                  default: await createPerusteOsaStore(route, route.params.laajaalainenosaaminenId),
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
                  default: await createPerusteOsaStore(route, route.params.kotokielitaitotasoId),
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
                  default: await createPerusteOsaStore(route, route.params.kotoOpintoId),
                };
              },
            },
          },
        }, {
          path: 'koto/laajaalainenosaaminen/:kotoLaajaalainenOsaaminenId',
          component: RouteKotoLaajaAlainenOsaaminen,
          name: 'perusteKotoLaajaalainenOsaaminen',
          meta: {
            resolve: {
              cacheBy: ['kotoLaajaalainenOsaaminenId'],
              async props(route) {
                return {
                  default: await createPerusteOsaStore(route, route.params.kotoLaajaalainenOsaaminenId),
                };
              },
            },
          },
        }, {
          path: 'linkkisivu/:linkkisivuId',
          component: RouteLinkkisivu,
          name: 'linkkisivu',
          meta: {
            resolve: {
              cacheBy: ['linkkisivuId'],
              async props(route) {
                return {
                  default: await createPerusteOsaStore(route, route.params.linkkisivuId),
                };
              },
            },
          },
        }, {
          path: 'yleisettavoitteet/:yleistavoiteId',
          component: RouteYleisettavoitteet,
          name: 'perusteYleisettavoitteet',
          meta: {
            resolve: {
              cacheBy: ['yleistavoiteId'],
              async props(route) {
                return {
                  default: await createPerusteOsaStore(route, route.params.yleistavoiteId),
                };
              },
            },
          },
        }, {
          path: 'aihekokonaisuudet/:aihekokonaisuudetId',
          component: RouteAihekokonaisuudet,
          name: 'perusteAihekokonaisuudet',
          meta: {
            resolve: {
              cacheBy: ['aihekokonaisuudetId'],
              async props(route) {
                return {
                  default: await createPerusteOsaStore(route, route.params.aihekokonaisuudetId),
                };
              },
            },
          },
        }, {
          path: 'osaamiskokonaisuus/:osaamiskokonaisuusId',
          component: RouteOsaamiskokonaisuus,
          name: 'perusteOsaamiskokonaisuus',
          meta: {
            resolve: {
              cacheBy: ['osaamiskokonaisuusId'],
              async props(route) {
                return {
                  default: await createPerusteOsaStore(route, route.params.osaamiskokonaisuusId),
                };
              },
            },
          },
        }, {
          path: 'osaamiskokonaisuuspaaalue/:osaamiskokonaisuusPaaAlueId',
          component: RouteOsaamiskokonaisuusPaaAlue,
          name: 'perusteOsaamiskokonaisuusPaaAlue',
          meta: {
            resolve: {
              cacheBy: ['osaamiskokonaisuusPaaAlueId'],
              async props(route) {
                return {
                  default: await createPerusteOsaStore(route, route.params.osaamiskokonaisuusPaaAlueId),
                };
              },
            },
          },
        }],
      },
    ],
  },
  {
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
          virhekoodi: '404',
        },
      };
    },
  }],
});

let loader = null;

router.beforeEach((to, from, next) => {
  const { pathname, origin, hash } = window.location;
  if (pathname === '/beta/') {
    window.location.assign(origin + '/' + hash);
  }
  else {
    next();
  }
});

router.beforeEach(async (to, from, next) => {
  if (from.params.revision && !to.params.revision && _.some(to.matched, match => _.includes(match.path, ':revision'))) {
    router.replace({
      ...to,
      params: {
        ...to.params,
        revision: from.params.revision,
      },
    } as any);
  }

  next();
});

router.beforeEach((to, from, next) => {
  loader = (Vue as any).$loading.show();
  next();
});

router.afterEach(() => {
  hideLoading();
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
  hideLoading();
  if (router.currentRoute.name !== 'virhe') {
    router.replace({
      name: 'virhe',
      query: {
        virhekoodi: virhe.err,
        kohdeUrl: virhe.path,
      },
    });
  }
});

function getRouteStore(route: any, routeName: string, store: string) {
  const filteredRoute = _.head(_.filter(route.matched, match => match.name === routeName));
  return _.get(filteredRoute, 'props.default.' + store);
}

function hideLoading() {
  if (loader !== null) {
    (loader as any).hide();
    loader = null;
  }
}

async function createPerusteOsaStore(route, perusteenOsaId) {
  return {
    perusteenOsaStore: await PerusteenOsaStore.create(
      _.parseInt(perusteenOsaId),
      getRouteStore(route, 'peruste', 'perusteDataStore').getJulkaistuPerusteSisalto({ id: _.parseInt(perusteenOsaId) }),
    ),
  };
}
