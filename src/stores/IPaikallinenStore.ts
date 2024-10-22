import { Page } from '@shared/tyypit';
import { Computed } from '@shared/utils/interfaces';

export interface IPaikallinenStore {
  perusteId?: Computed<number>;
  opetussuunnitelmat?: Computed<any[]>;
  opetussuunnitelmatPaged?: Computed<Page<any>>;
  fetch?: (id?: number, diaarinumero?: string, koulutustyypit?: string[], sivu?: number) => Promise<void>
  fetchQuery?: (query: any) => Promise<void>;
  addToCache?: (opetussuunnitelmaId: number) => Promise<void>;
}
