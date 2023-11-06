import {
  isAmmatillinenKoulutustyyppi,
  koulutustyypinRyhma,
  yleissivistavatKoulutustyypit,
} from '@shared/utils/perusteet';
import _ from 'lodash';

// Murupolku opetussuunnitelmille ja toteutussuunnitelmille
export function createOpetussuunnitelmaMurupolku(ops, koulutustyyppi) {
  let polut: any = [];
  if (koulutustyyppi) {
    polut.push(murupolkuOpetussuunnitelmaRoot(koulutustyyppi));

    if (isAmmatillinenKoulutustyyppi(koulutustyyppi)) {
      polut.push(murupolkuAmmatillinenKooste(ops.peruste, koulutustyyppi));
    }

    polut.push(murupolkuTiedot(ops, koulutustyyppi));
  }
  return polut;
}

// Murupolku perusteille ja oppaille
export function createPerusteMurupolku(peruste, koulutustyyppi, routeKoulutustyyppi) {
  if (routeKoulutustyyppi === 'digiosaaminen') {
    return [];
  }
  let polut: any = [];
  polut.push(murupolkuPerusteRoot(koulutustyyppi, routeKoulutustyyppi));
  polut.push(murupolkuPerusteTiedot(peruste, routeKoulutustyyppi));
  return polut;
}

export function murupolkuPerusteTiedot(peruste, koulutustyyppi) {
  return {
    label: peruste.nimi,
    location: {
      name: 'perusteTiedot',
      params: {
        koulutustyyppi: koulutustyyppi,
        perusteId: peruste.id,
      },
    },
  };
}

export function murupolkuAmmatillinenKooste(peruste, koulutustyyppi) {
  return {
    label: peruste.nimi,
    location: {
      name: 'ammatillinenkooste',
      params: {
        koulutustyyppi: koulutustyypinRyhma(koulutustyyppi),
        perusteId: peruste.perusteId,
      },
    },
  };
}

export function murupolkuTiedot(ops, koulutustyyppi) {
  // opetussuunnitelma vai toteutussuunnitelma
  if (_.includes(yleissivistavatKoulutustyypit, koulutustyyppi)) {
    return murupolkuOpetussuunnitelma(ops, koulutustyyppi);
  }
  else {
    return murupolkuToteutussuunnitelma(ops, koulutustyyppi);
  }
}

export function murupolkuOpetussuunnitelma(ops, koulutustyyppi) {
  return {
    label: ops.nimi,
    location: {
      name: 'opetussuunnitelmaTiedot',
      params: {
        koulutustyyppi: koulutustyypinRyhma(koulutustyyppi),
        opetussuunnitelmaId: _.toString(ops.id),
      },
    },
  };
}

export function murupolkuToteutussuunnitelma(totsu, koulutustyyppi) {
  return {
    label: totsu.nimi,
    location: {
      name: 'toteutussuunnitelmaTiedot',
      params: {
        koulutustyyppi: koulutustyypinRyhma(koulutustyyppi),
        toteutussuunnitelmaId: _.toString(totsu.id),
      },
    },
  };
}

export function murupolkuAmmatillinenRoot(koulutustyyppi) {
  return {
    label: koulutustyyppi,
    location: {
      name: 'ammatillinenSelaus',
      params: {
        koulutustyyppi: koulutustyyppi,
      },
    },
  };
}

export function murupolkuOpetussuunnitelmaRoot(koulutustyyppi) {
  return {
    label: koulutustyyppi,
    location: {
      name: isAmmatillinenKoulutustyyppi(koulutustyyppi) ? 'ammatillinenSelaus' : 'kooste',
    },
  };
}

export function murupolkuKoulutuksenJarjestajat(ops) {
  return {
    label: ops.nimi,
    location: {
      name: 'ammatillinenKoulutuksenjarjestaja',
      params: {
        koulutuksenjarjestajaId: ops,
      },
    },
  };
}

export function murupolkuPerusteRoot(koulutustyyppi, routeKoulutustyyppi) {
  let kt = koulutustyyppi ? koulutustyypinRyhma(koulutustyyppi) : routeKoulutustyyppi;
  let pathName = isAmmatillinenKoulutustyyppi(koulutustyyppi) || routeKoulutustyyppi === 'ammatillinen' ? 'ammatillinenSelaus' : 'kooste';
  return {
    label: kt,
    location: {
      name: pathName,
      params: {
        koulutustyyppi: kt,
      },
    },
  };
}

// Murupolku osaamismerkeille
export function murupolkuOsaamismerkkiRoot(koulutustyyppi) {
  return [{
    label: koulutustyyppi,
    location: {
      name: 'kooste',
      params: {
        koulutustyyppi: koulutustyyppi,
      },
    },
  }, {
    label: 'kansalliset-osaamismerkit',
    location: {
      name: 'osaamismerkit',
    },
  }];
}

export function murupolkuOsaamismerkkiTiedot(koulutustyyppi, osaamismerkki) {
  return [
    ...murupolkuOsaamismerkkiRoot(koulutustyyppi),
    {
      label: osaamismerkki?.nimi,
    },
  ];
}

export function murupolkuKoulutuksenJarjestaja(koulutustyyppi, koulutustoimija) {
  return [
    {
      label: 'ammatillinen-koulutus',
      location: {
        name: 'ammatillinenSelaus',
        params: {
          koulutustyyppi: koulutustyyppi,
        },
      },
    },
    {
      label: 'koulutuksen-jarjestajat',
      location: {
        name: 'ammatillinenKoulutuksenjarjestajat',
      },
    },
    {
      label: koulutustoimija.nimi,
    },
  ];
}
