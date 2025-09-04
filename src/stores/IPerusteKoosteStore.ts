import { Computed } from '@shared/utils/interfaces';
import { PerusteenJulkaisuData } from '@shared/api/eperusteet';

export interface IPerusteKoosteStore {
  koulutustyyppi: Computed<string>;
  perusteJulkaisut: Computed<PerusteenJulkaisuData[]>;
  muutTilet?: Computed<any[]>;
  perusteJarjestykset: Computed<{ id: string | number }>;
  fetch: () => Promise<void>;
}
