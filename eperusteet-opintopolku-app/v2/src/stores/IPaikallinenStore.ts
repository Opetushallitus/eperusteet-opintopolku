import { Computed } from '@shared/utils/interfaces';
import { OpetussuunnitelmaJulkinenDto } from '@shared/api/ylops';

export interface IPaikallinenStore {
  perusteId?: Computed<number>;
  opetussuunnitelmat: Computed<any[]>;
  opetussuunnitelmatPaged?: Computed<any>;
  fetch: (id?: number, diaarinumero?: string) => Promise<void>
  fetchQuery?: (query: any) => Promise<void>;
};
