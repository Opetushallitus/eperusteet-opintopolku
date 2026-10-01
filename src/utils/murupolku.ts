import { PerusteBaseDtoOpasTyyppiEnum } from '@shared/api/eperusteet';
import {
  isAmmatillinenKoulutustyyppi,
  isAmmatillinenKoulutustyyppiOrRyhma,
  koulutustyypinRyhma,
  koulutustyyppiRyhmaUrlParam,
  koulutustyyppiTheme,
  yleissivistavatKoulutustyypit,
} from '@shared/utils/perusteet';
import _ from 'lodash';

// Murupolku opetussuunnitelmille ja toteutussuunnitelmille
export function createOpetussuunnitelmaMurupolku(ops, koulutustyyppi) {
  const polut: any = [];
  if (koulutustyyppi) {
    polut.push(murupolkuOpetussuunnitelmaRoot(koulutustyyppi));

    if (isAmmatillinenKoulutustyyppi(koulutustyyppi) && ops.peruste) {
      polut.push(murupolkuAmmatillinenKooste(ops.peruste));
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

  if (peruste.opasTyyppi === _.toLower(PerusteBaseDtoOpasTyyppiEnum.TIETOAPALVELUSTA)) {
    return tietoapalvelustaMurupolut(peruste);
  }

  return [
    murupolkuPerusteRoot(koulutustyyppi, routeKoulutustyyppi),
    murupolkuPerusteTiedot(peruste, routeKoulutustyyppi),
  ];
}

function tietoapalvelustaMurupolut(peruste) {
  return [{
    label: peruste?.nimi,
  }];
}

export function murupolkuPerusteTiedot(peruste, koulutustyyppi) {
  return {
    label: peruste?.nimi,
    location: {
      name: 'perusteTiedot',
      params: {
        koulutustyyppi: koulutustyyppiRyhmaUrlParam(koulutustyyppi),
        perusteId: peruste?.id,
      },
    },
  };
}

export function murupolkuAmmatillinenKooste(peruste) {
  return {
    label: peruste?.nimi,
    location: {
      name: 'ammatillinenkooste',
      params: {
        koulutustyyppi: 'ammatillinen',
        perusteId: peruste?.perusteId,
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
    label: ops?.nimi,
    location: {
      name: 'opetussuunnitelmaTiedot',
      params: {
        koulutustyyppi: koulutustyyppiRyhmaUrlParam(koulutustyypinRyhma(koulutustyyppi)!),
        opetussuunnitelmaId: _.toString(ops?.id),
      },
    },
  };
}

export function murupolkuToteutussuunnitelma(totsu, koulutustyyppi) {
  return {
    label: totsu?.nimi,
    location: {
      name: 'toteutussuunnitelmaTiedot',
      params: {
        koulutustyyppi: isAmmatillinenKoulutustyyppiOrRyhma(koulutustyyppi) ? 'ammatillinen' : koulutustyyppiRyhmaUrlParam(koulutustyypinRyhma(koulutustyyppi)!),
        toteutussuunnitelmaId: _.toString(totsu?.id),
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
  if (isAmmatillinenKoulutustyyppiOrRyhma(koulutustyyppi)) {
    return {
      label: koulutustyyppi,
      location: {
        name: 'ammatillinenSelaus',
      },
    };
  }

  return {
    label: koulutustyyppi,
    location: {
      name: 'kooste',
      params: {
        koulutustyyppi: koulutustyyppiRyhmaUrlParam(koulutustyyppiTheme(koulutustyyppi)),
      },
    },
  };
}

export function murupolkuPerusteRoot(koulutustyyppi, routeKoulutustyyppi) {
  const kt = koulutustyyppi ? koulutustyypinRyhma(koulutustyyppi) : routeKoulutustyyppi;
  const isAmmatillinen = isAmmatillinenKoulutustyyppiOrRyhma(kt);
  return {
    label: kt,
    location: {
      name: isAmmatillinen ? 'ammatillinenSelaus' : 'kooste',
      params: {
        koulutustyyppi: isAmmatillinen ? kt : koulutustyyppiRyhmaUrlParam(kt),
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
    label: 'kansalliset-perustaitojen-osaamismerkit',
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
        params: {
          koulutustyyppi: koulutustyyppi,
        },
      },
    },
    {
      label: koulutustoimija?.nimi,
    },
  ];
}
