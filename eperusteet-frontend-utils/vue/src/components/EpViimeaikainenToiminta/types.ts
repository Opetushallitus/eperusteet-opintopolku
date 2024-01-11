import { Computed } from '@shared/utils/interfaces';
import { IEsitysnimi } from '@shared/utils/kayttaja';

export interface IMuokkaustietoProvider {
  muokkaustiedot: Computed<any[]>;
  viimeinenHaku: Computed<any[]>;
  hakuLukumaara: Computed<number>;
  update: () => Promise<void>;
}

export interface Muokkaustieto {
  id?: number;
  nimi?: { [key: string]: string; };
  tapahtuma?: string;
  parentId?: number;
  kohdeId?: number;
  kohde?: string;
  luotu?: Date;
  muokkaaja?: string;
  lisatieto?: string;
  poistettu?: boolean;
  kayttajanTieto?: IEsitysnimi;
  route?: any;
  lisaparametrit?: Array<any>
}
