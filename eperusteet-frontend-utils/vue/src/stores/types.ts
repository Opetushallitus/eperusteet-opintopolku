import { Computed } from '@shared/utils/interfaces';
import { PalauteDtoStatusEnum, TiedoteDto } from '@shared/api/eperusteet';
import { TiedoteQuery } from '@shared/api/types';

export interface ITiedotteetProvider {
  options: Computed<TiedoteQuery>;
  tiedotteet: Computed<TiedoteDto[]>;
  kokonaismaara: Computed<number>;
  isLoading: Computed<boolean>;
  init: (options: TiedoteQuery) => Promise<void>;
  fetch: () => Promise<void>;
  save?: (tiedote: TiedoteDto) => Promise<void>;
  delete?: (tiedote: TiedoteDto) => Promise<void>;
}

export interface Palaute {
  stars: number;
  feedback: string;
  'user_agent': string;
  key?: string,
  status?: PalauteDtoStatusEnum;
}

export interface ITPalauteProvider {
  sendPalaute: (palaute: Palaute) => Promise<void>;
  tutkintorakennepalaute: Computed<boolean>;
  fetch?: () => Promise<void>;
  palautteet?: Computed<{[key: string]: Palaute[] | null}>;
  updatePalaute?: (palaute: Palaute) => Promise<void>;
}
