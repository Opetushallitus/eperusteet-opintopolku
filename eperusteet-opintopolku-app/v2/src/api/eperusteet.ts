import { Perusteet, Tiedotteet } from '@shared/api/eperusteet';

interface PerusteQuery {
  sivu?: number;
  sivukoko?: number;
  tuleva?: boolean;
  siirtyma?: boolean;
  voimassaolo?: boolean;
  poistunut?: boolean;
  nimi?: string;
  koulutusala?: Array<string>;
  koulutustyyppi?: Array<string>;
  kieli?: Array<string>;
  opintoala?: Array<string>;
  suoritustapa?: string;
  koulutuskoodi?: string;
  diaarinumero?: string;
  muokattu?: number;
  tutkintonimikkeet?: boolean;
  tutkinnonosat?: boolean;
  osaamisalat?: boolean;
  koulutusvienti?: boolean;
}

interface TiedoteQuery {
  sivu?: number;
  sivukoko?: number;
  kieli?: Array<string>;
  nimi?: string;
  perusteId?: number;
  perusteeton?: boolean;
  julkinen?: boolean;
  yleinen?: boolean;
}

export async function tiedoteQuery(query: TiedoteQuery = {
  julkinen: true,
  kieli: ['fi'],
}, options?: any) {
  return ((await Tiedotteet.findTiedotteetBy(
    query.sivu,
    query.sivukoko,
    query.kieli,
    query.nimi,
    query.perusteId,
    query.perusteeton,
    query.julkinen,
    query.yleinen,
    options)).data as any).data;
}


export async function perusteetQuery(query: PerusteQuery = {
}, options?: any) {
  return ((await Perusteet.getAllPerusteet(
    query.sivu,
    query.sivukoko,
    query.tuleva,
    query.siirtyma,
    query.voimassaolo,
    query.poistunut,
    query.nimi,
    query.koulutusala,
    query.koulutustyyppi,
    query.kieli,
    query.opintoala,
    query.suoritustapa,
    query.koulutuskoodi,
    query.diaarinumero,
    query.muokattu,
    query.tutkintonimikkeet,
    query.tutkinnonosat,
    query.osaamisalat,
    query.koulutusvienti,
    options)).data as any).data;
}
