import {
  Api,
  Julkaisut,
  Julkinen,
  PerusteenJulkaisuData,
  Tiedotteet,
  JulkiEtusivuDto,
} from '@shared/api/eperusteet';
import { Page } from '@shared/tyypit';

export interface PerusteQuery {
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
  perusteTyyppi?: string;
  tutkinnonosat?: boolean;
  osaamisalat?: boolean;
  koulutusvienti?: boolean;
  julkaistu?: boolean;
}

export interface TiedoteQuery {
  sivu?: number;
  sivukoko?: number;
  kieli?: Array<string>;
  nimi?: string;
  perusteId?: number;
  perusteeton?: boolean;
  julkinen?: boolean;
  yleinen?: boolean;
  tiedoteJulkaisuPaikka?: Array<string>;
  perusteIds?: Array<number>;
  koulutusTyyppi?: Array<string>;
}

export interface JulkaistutPerusteetQuery {
  sivu?: number;
  sivukoko?: number;
  kieli?: string;
  nimi?: string;
  nimiTaiKoodi?: string;
  koulutustyyppi?: Array<string>;
  tuleva?: boolean;
  siirtyma?: boolean;
  voimassaolo?: boolean;
  poistunut?: boolean;
  tyyppi?: string;
  diaarinumero?: string;
  koodi?: string;
  perusteet?: boolean;
  tutkinnonosat?: boolean;
}

export interface JulkiEtusivuQuery {
  sivu?: number;
  sivukoko?: number;
  kieli?: string;
  nimi?: string;
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
    query.tiedoteJulkaisuPaikka,
    query.perusteIds,
    query.koulutusTyyppi,
    options)).data as any).data;
}

export async function perusteetQuery(query: PerusteQuery = {
}, options?: any) {
  const response = await Api.get('/api/perusteet', {
    params: query,
  });
  return response.data;
}

export async function julkaistutPerusteet(query: JulkaistutPerusteetQuery) {
  query = {
    sivukoko: 100,
    ...query,
  };

  return (await Julkaisut.getKoulutustyyppienJulkaisut(
    query.koulutustyyppi || [],
    query.nimi,
    query.nimiTaiKoodi,
    query.kieli,
    query.tuleva,
    query.voimassaolo,
    query.siirtyma,
    query.poistunut,
    query.tyyppi,
    query.diaarinumero,
    query.koodi,
    query.perusteet,
    query.tutkinnonosat,
    query.sivu,
    query.sivukoko)).data as Page<PerusteenJulkaisuData>;
}

export async function julkaistutOpsitJaPerusteet(query: JulkiEtusivuQuery) {
  return (await Julkinen.getOpetussuunnitelmatJaPerusteet(
    query.nimi,
    query.kieli,
    query.sivu,
    query.sivukoko)).data as Page<JulkiEtusivuDto>;
}
