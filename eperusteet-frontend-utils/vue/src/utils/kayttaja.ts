export interface IEsitysnimi {
  kutsumanimi?: string;
  sukunimi?: string;
  oidHenkilo?: string;
  oid?: string;
  muokkaajaOid?: string;
}

export function parsiEsitysnimi(tiedot: IEsitysnimi): string {
  if (!tiedot) {
    return '';
  }
  else if (tiedot.kutsumanimi && tiedot.sukunimi) {
    return tiedot.kutsumanimi + ' ' + tiedot.sukunimi;
  }
  else {
    return tiedot.oidHenkilo || tiedot.oid || tiedot.muokkaajaOid || '';
  }
}
