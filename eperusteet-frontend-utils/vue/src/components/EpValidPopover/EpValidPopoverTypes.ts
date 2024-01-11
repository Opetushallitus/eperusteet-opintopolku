export enum ValidoitavatTilat {
  LUONNOS = 'luonnos',
  VALMIS = 'valmis',
  POISTETTU = 'poistettu',
  JULKAISTU = 'julkaistu',
}

export interface ValidableObject {
  tila: string,
  koulutustyyppi?: string,
  peruste?: {
    koulutustyyppi? :string,
  },
  viimeisinJulkaisuAika?: number;
}

export interface Validoinnit {
  virheet?: string[];
  huomautukset?: string[];
  ok?: string[];
}

export enum ValidoitavatTyypit {
  PERUSTE = 'peruste',
  TOTEUTUSSUUNNITELMA = 'toteutussuunnitelma',
  OPETUSSUUNNITELMA = 'opetussuunnitelma',
}
