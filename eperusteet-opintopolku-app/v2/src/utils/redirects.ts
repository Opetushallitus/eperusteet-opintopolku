export const redirects = [
  {
    path: 'kooste/:perusteId(\\d+)',
    redirect: (to) => {
      console.log('ammatillinenkooste redirect, ', to);
      return {
        name: 'ammatillinenkooste',
        params: {
          ...to.params,
        },
      };
    },
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
    path: 'amops/:toteutussuunnitelmaId/tiedot',
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
