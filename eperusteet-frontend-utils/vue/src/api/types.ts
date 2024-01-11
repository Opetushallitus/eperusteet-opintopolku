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
  jarjestys?: string;
  jarjestysNouseva?: boolean;
};
