import _ from 'lodash';
import Vue from 'vue';
import VueScrollTo from 'vue-scrollto';
import VueMeta from 'vue-meta';
import Root from '@/routes/Root.vue';
import EpErrorPage from '@shared/components/EpErrorPage/EpErrorPage.vue';
import RouteHome from '@/routes/home/RouteHome.vue';
import RouteKooste from '@/routes/kooste/RouteKooste.vue';
import RouteKoosteAmmatillinen from '@/routes/kooste/RouteKoosteAmmatillinen.vue';
import RouteMaarayskokoelma from '@/routes/maarays/RouteMaarayskokoelma.vue';
import RouteMaarays from '@/routes/maarays/RouteMaarays.vue';
import RouteAmmatillinenSelaus from '@/routes/ammatillinen/RouteAmmatillinenSelaus.vue';
import RouteAmmatillinenKoulutuksenJarjestajat from '@/routes/ammatillinen/RouteAmmatillinenKoulutuksenJarjestajat.vue';
import RouteAmmatillinenValmisteillaOlevat from '@/routes/ammatillinen/RouteAmmatillinenValmisteillaOlevat.vue';
import RouteAmmatillinenOhjeet from '@/routes/ammatillinen/RouteAmmatillinenOhjeet.vue';
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
import RouteTutkinnonosaTutke from '@/routes/perusteet/sisalto/ammatillinen/RouteTutkinnonosaTutke.vue';
import RoutePerusteMuutoshistoria from '@/routes/perusteet/tiedot/RoutePerusteMuutoshistoria.vue';

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
import { useKoulutuksenJarjestajatStore } from '@/stores/KoulutuksenJarjestajatStore';
import { useAmmatillinenPerusteKoosteStore } from '@/stores/AmmatillinenPerusteKoosteStore';
import { useKoulutuksenJarjestajaStore } from '@/stores/KoulutuksenJarjestajaStore';
import RouteKotoLaajaAlainenOsaaminen from '@/routes/perusteet/sisalto/vapaasivistystyo/RouteKotoLaajaAlainenOsaaminen.vue';
import RouteLinkkisivu from '@/routes/perusteet/sisalto/linkkisivu/RouteLinkkisivu.vue';
import { redirects } from './utils/redirects';
import { useOsaamismerkkiStore } from '@/stores/OsaamismerkkiStore';
import RoutePerusteKoosteEng from '@/routes/perusteet/tiedot/RoutePerusteKoosteEng.vue';
import RouteTavoitteetSisallotArviointi from './routes/opetussuunnitelmat/sisalto/perusopetus/RouteTavoitteetSisallotArviointi.vue';
import { BrowserStore } from '@shared/stores/BrowserStore';
import { usePerusteCacheStore } from '@/stores/PerusteCacheStore';
import { pinia } from '@/pinia';
import { useOpetussuunnitelmaCacheStore, useToteutussuunnitelmaCacheStore } from '@/stores/OpetussuunnitelmaCacheStore';
import { createRouter, createWebHashHistory, useRoute } from 'vue-router';
import { useLoading } from 'vue-loading-overlay';
import { loadingOptions } from './utils/loading';
import { useTiedoteStore } from './stores/TiedoteStore';

const logger = createLogger('Router');

const perusteCacheStore = usePerusteCacheStore(pinia);
const opetussuunnitelmaCacheStore = useOpetussuunnitelmaCacheStore(pinia);
const toteutussuunnitelmaCacheStore = useToteutussuunnitelmaCacheStore(pinia);

const routeProps = (route: any) => {
  return {
    ...route.params,
    ...route.query,
  };
};

export const router = createRouter({
  history: createWebHashHistory(),
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
      const offsetHeight = (getElementHeighById('navigation-bar') + getElementHeighById('notification-bar') + 20) * -1;
      VueScrollTo.scrollTo('#scroll-anchor', {
        offset: offsetHeight,
        x: false,
        y: true,
      });
      return {
        selector: '#scroll-anchor',
        offset: {
          x: 0,
          y: offsetHeight,
        },
      };
    }
    return { x: 0, y: 0 };
  },
  routes: [{
    path: '/',
    redirect: () => '/fi',
  }, {
    path: '/:lang',
    component: Root,
    children: [
      ...redirects,
      {
        path: '',
        name: 'root',
        component: RouteHome,
      }, {
        path: 'virhe',
        name: 'virhe',
        component: EpErrorPage,
        props: routeProps,
      }, {
        path: 'maaraykset',
        name: 'maaraykset',
        component: RouteMaarayskokoelma,
      }, {
        path: 'maaraykset/:maaraysId(\\d+)',
        name: 'maarays',
        component: RouteMaarays,
      }, {
        path: 'kooste/ammatillinen/:perusteId(\\d+)',
        name: 'ammatillinenkooste',
        component: RouteKoosteAmmatillinen,
        beforeEnter: async (to, from, next) => {
          await useAmmatillinenPerusteKoosteStore(pinia).fetch(_.parseInt(to.params.perusteId as string));
          next();
        },
      }, {
        path: 'kooste/:koulutustyyppi([a-z]+)/:perusteId(\\d+)?',
        name: 'kooste',
        component: RouteKooste,
      }, {
        path: 'osaamismerkki/:koodi',
        name: 'osaamismerkki',
        component: RouteOsaamismerkkiTiedot,
        beforeEnter: async (to, from, next) => {
          await useOsaamismerkkiStore(pinia).init(null, _.parseInt(to.params.koodi as string));
          next();
        },
      }, {
        path: 'osaamismerkit',
        name: 'osaamismerkit',
        component: RouteOsaamismerkit,
        children: [{
          path: 'osaamismerkki/:osaamismerkkiId(\\d+)?',
          name: 'osaamismerkkiTiedot',
          component: RouteOsaamismerkkiTiedot,
          beforeEnter: async (to, from, next) => {
            await useOsaamismerkkiStore(pinia).init(_.parseInt(to.params.osaamismerkkiId as string));
            next();
          },
        }],
      }, {
        path: 'selaus/:koulutustyyppi',
        name: 'ammatillinenSelaus',
        component: RouteAmmatillinenSelaus,
        children: [
          {
            path: 'koulutuksenjarjestajat',
            component: RouteAmmatillinenKoulutuksenJarjestajat,
            name: 'ammatillinenKoulutuksenjarjestajat',
            beforeEnter: async (to, from, next) => {
              await useKoulutuksenJarjestajatStore(pinia).fetch();
              next();
            },
          }, {
            path: 'ohjeet',
            component: RouteAmmatillinenOhjeet,
            name: 'ammatillinenOhjeet',
          }, {
            path: 'valmisteilla',
            component: RouteAmmatillinenValmisteillaOlevat,
            name: 'ammatillinenValmisteillaOlevat',
          },
        ],
      }, {
        path: 'selaus/koulutuksenjarjestajat/:koulutuksenjarjestajaId(\\d+)',
        name: 'ammatillinenKoulutuksenjarjestaja',
        component: RouteKoulutuksenJarjestaja,
        beforeEnter: async (to, from, next) => {
          await useKoulutuksenJarjestajaStore(pinia).init(_.parseInt(to.params.koulutuksenjarjestajaId as string));
          next();
        },
      }, {
        path: 'ajankohtaista',
        name: 'uutiset',
        component: RouteUutiset,
      }, {
        path: 'ajankohtaista/:tiedoteId(\\d+)',
        name: 'uutinen',
        component: RouteUutinen,
        beforeEnter: async (to, from, next) => {
          await useTiedoteStore(pinia).fetchUutinen(_.parseInt(to.params.tiedoteId as string));
          next();
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
        beforeEnter: async (to, from, next) => {
          await toteutussuunnitelmaCacheStore.addToteutussuunnitelmaStore(to.params.toteutussuunnitelmaId, to.params.revision);
          next();
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
        path: 'yhteinentutkinnonosa/:koodi',
        component: RouteTutkinnonosaTutke,
        name: 'yhteinentutkinnonosa',
      }, {
        path: 'ops/:opetussuunnitelmaId(\\d+)/:revision(\\d+)?/:koulutustyyppi*',
        name: 'ops',
        component: RouteOpetussuunnitelma,
        redirect(to) {
          return {
            name: 'opetussuunnitelma',
          };
        },
        children: [],
      }, {
        path: 'opetussuunnitelma/:opetussuunnitelmaId(\\d+)/:revision(\\d+)?/:koulutustyyppi',
        name: 'opetussuunnitelma',
        component: RouteOpetussuunnitelma,
        redirect(to) {
          return {
            name: 'opetussuunnitelmaTiedot',
          };
        },
        beforeEnter: async (to, from, next) => {
          await opetussuunnitelmaCacheStore.addOpetussuunnitelmaStore(to.params.opetussuunnitelmaId, to.params.revision);
          next();
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
        }, {
          path: 'tavoitesisaltoarvioinnit/:vuosiluokka?/:oppiaineId?',
          component: RouteTavoitteetSisallotArviointi,
          name: 'tavoitteetSisallotArviointi',
        }],
      }, {
        path: ':koulutustyyppi/:perusteId(\\d+)/:revision(\\d+)?',
        name: 'peruste',
        component: RoutePeruste,
        beforeEnter: async (to, from, next) => {
          await perusteCacheStore.addPerusteStore(to.params.perusteId, to.params.revision);
          next();
        },
        children: [{
          path: 'tiedot',
          component: RoutePerusteTiedot,
          name: 'perusteTiedot',
        }, {
          path: 'muutoshistoria',
          component: RoutePerusteMuutoshistoria,
          name: 'perusteMuutoshistoria',
        }, {
          path: 'kooste',
          component: RoutePerusteKoosteEng,
          name: 'perusteKoosteEng',
        }, {
          path: 'tekstikappale/:viiteId',
          component: RouteTekstikappale,
          name: 'perusteTekstikappale',
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
          path: 'koulutuksenosat',
          component: RouteTutkinnonosat,
          name: 'koulutuksenosat',
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
        }, {
          path: 'tavoitesisaltoalue/:tavoitesisaltoalueId',
          component: RouteTavoitesisaltoalue,
          name: 'perusteTavoitesisaltoalue',
        }, {
          path: 'koulutuksenosa/:koulutuksenosaId',
          component: RouteKoulutuksenOsa,
          name: 'perusteKoulutuksenOsa',
        }, {
          path: 'laajaalainenosaaminen/:laajaalainenosaaminenId',
          component: RouteLaajaalainenOsaaminen,
          name: 'perusteLaajaalainenOsaaminen',
        }, {
          path: 'koto/kielitaitotaso/:kotokielitaitotasoId',
          component: RouteKotoKielitaitotaso,
          name: 'perusteKotoKielitaitotaso',
        }, {
          path: 'koto/opinto/:kotoOpintoId',
          component: RouteKotoOpinto,
          name: 'perusteKotoOpinto',
        }, {
          path: 'koto/laajaalainenosaaminen/:kotoLaajaalainenOsaaminenId',
          component: RouteKotoLaajaAlainenOsaaminen,
          name: 'perusteKotoLaajaalainenOsaaminen',
        }, {
          path: 'linkkisivu/:linkkisivuId',
          component: RouteLinkkisivu,
          name: 'linkkisivu',
        }, {
          path: 'yleisettavoitteet/:yleistavoiteId',
          component: RouteYleisettavoitteet,
          name: 'perusteYleisettavoitteet',
        }, {
          path: 'aihekokonaisuudet/:aihekokonaisuudetId',
          component: RouteAihekokonaisuudet,
          name: 'perusteAihekokonaisuudet',
        }, {
          path: 'osaamiskokonaisuus/:osaamiskokonaisuusId',
          component: RouteOsaamiskokonaisuus,
          name: 'perusteOsaamiskokonaisuus',
        }, {
          path: 'osaamiskokonaisuuspaaalue/:osaamiskokonaisuusPaaAlueId',
          component: RouteOsaamiskokonaisuusPaaAlue,
          name: 'perusteOsaamiskokonaisuusPaaAlue',
        }],
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
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
  },
  ],
});



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

const $loading = useLoading(loadingOptions);
let loader: any = null;

router.beforeEach((to, from, next) => {
  loader = $loading.show();
  next();
});

router.afterEach(() => {
  hideLoading();
  BrowserStore.changeLocation(location.href);
});

router.beforeEach((to, from, next) => {
  changeLang(to, from);
  next();
});

// router.afterEach((to, from) => {
//   removeQueryParam(to, router, 'paluuosoite');
// });

Virheet.onError((virhe: SovellusVirhe) => {
  logger.error('Route error', virhe);
  hideLoading();
  if (router.currentRoute.name !== 'virhe') {
    router.replace({
      name: 'virhe',
      query: {
        virhekoodi: virhe.err,
        ...(virhe.path && { kohdeUrl: virhe.path }),
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

function getElementHeighById(id: string) {
  const element = document.getElementById(id);
  return element ? element.getBoundingClientRect().height : 0;
}
