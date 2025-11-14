import { Computed } from '@shared/utils/interfaces';
import { PerusteenJulkaisuData, PerusteKevytDto } from '@shared/api/eperusteet';

export interface IPerusteKoosteStore {
  koulutustyyppi: Computed<string>;
  perusteJulkaisut: Computed<PerusteenJulkaisuData[]>;
  perusteJarjestykset: Computed<{ id: string | number }>;
  muutTilet?: Computed<any[]>;
  perusteJarjestykset: Computed<{ id: string | number }>;
  fetch: () => Promise<void>;
}
