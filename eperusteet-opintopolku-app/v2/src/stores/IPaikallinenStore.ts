import { Computed } from '@shared/utils/interfaces';

export interface IPaikallinenStore {
  perusteId?: Computed<number>;
  opetussuunnitelmat: Computed<any[]>;
  opetussuunnitelmatPaged?: Computed<any>;
  fetch: (id?: number, diaarinumero?: string, koulutustyypit?: any[]) => Promise<void>
  fetchQuery?: (query: any) => Promise<void>;
}
