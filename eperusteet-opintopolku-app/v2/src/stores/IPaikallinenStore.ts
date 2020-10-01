import { Computed } from '@shared/utils/interfaces';
import { OpetussuunnitelmaJulkinenDto } from '@shared/api/ylops';

export interface IPaikallinenStore {
  perusteId: Computed<number>;
  opetussuunnitelmat: Computed<any[]>;
  setPerusteId: (id: number) => Promise<void>
};
