import RouteReroute from '@/routes/kooste/RouteReroute.vue';
import RouteOpintokokonaisuusReroute from '@/routes/toteutussuunnitelmat/RouteOpintokokonaisuusReroute.vue';

export const redirects = [
  {
    path: 'kooste/:perusteId(\\d+)',
    name: 'koosteReroute',
    component: RouteReroute,
  },
  {
    path: 'opintokokonaisuus/:koodiarvo',
    name: 'opintokokonaisuusReroute',
    component: RouteOpintokokonaisuusReroute,
  },
  {
    path: 'esitys/:perusteId(\\d+)/*/tutkinnonosat/:tutkinnonOsaViiteId',
    redirect: (to) => {
      return {
        name: 'tutkinnonosa',
        params: {
          ...to.params,
          koulutustyyppi: 'ammatillinen',
        },
      };
    },
  },
  {
    path: 'esitys/:perusteId(\\d+)/*/tutkinnonosat',
    redirect: (to) => {
      return {
        name: 'tutkinnonosat',
        params: {
          ...to.params,
          koulutustyyppi: 'ammatillinen',
        },
      };
    },
  },
  {
    path: 'esitys/:perusteId(\\d+)/*/rakenne',
    redirect: (to) => {
      return {
        name: 'perusteenRakenne',
        params: {
          ...to.params,
          koulutustyyppi: 'ammatillinen',
        },
      };
    },
  },
  {
    path: 'esitys/:perusteId(\\d+)/*/sisalto/:viiteId',
    redirect: (to) => {
      return {
        name: 'perusteTekstikappale',
        params: {
          ...to.params,
          koulutustyyppi: 'ammatillinen',
        },
      };
    },
  },
  {
    path: 'esitys/:perusteId(\\d+)/*',
    redirect: (to) => {
      return {
        name: 'perusteTiedot',
        params: {
          ...to.params,
          koulutustyyppi: 'ammatillinen',
        },
      };
    },
  },
  {
    path: 'amops/:toteutussuunnitelmaId/osa/:sisaltoviiteId',
    redirect: (to) => {
      return {
        name: 'toteutussuunnitelmaSisalto',
        params: {
          ...to.params,
          koulutustyyppi: 'ammatillinen',
        },
      };
    },
  },
  {
    path: 'amops/:toteutussuunnitelmaId',
    alias: 'amops/:toteutussuunnitelmaId/*',
    redirect: (to) => {
      return {
        name: 'toteutussuunnitelmaTiedot',
        params: {
          ...to.params,
          koulutustyyppi: 'ammatillinen',
        },
      };
    },
  },
];
