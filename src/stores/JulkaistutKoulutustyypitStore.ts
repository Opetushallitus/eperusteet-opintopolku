import  { reactive, computed } from '@vue/composition-api';
import _ from 'lodash';
import { Perusteet, KoulutustyyppiLukumaara, findAllJulkaisut, PerusteenJulkaisuData } from '@shared/api/eperusteet';
import { createLogger } from '@shared/utils/logger';
import { getJulkisetOpetussuunnitelmat, OpetussuunnitelmaDto } from '@shared/api/amosaa';
import { Page } from '@shared/tyypit';

const logger = createLogger('Main');

export class JulkaistutKoulutustyypitStore {
  public state = reactive({
    koulutustyyppiLukumaarat: null as KoulutustyyppiLukumaara[] | null,
    muuLukumaarat: null as number | null,
    digitaalinenOsaaminen: null as PerusteenJulkaisuData[] | null,
  });

  public readonly koulutustyyppiLukumaarat = computed(() => this.state.koulutustyyppiLukumaarat);
  public readonly julkaistutKoulutustyypit = computed(() => {
    if (!this.state.koulutustyyppiLukumaarat || _.isNil(this.state.muuLukumaarat) || !this.state.digitaalinenOsaaminen) {
      return null;
    }

    return _.filter([
      ..._.map(this.state.koulutustyyppiLukumaarat, 'koulutustyyppi'),
      ...(!!this.state.muuLukumaarat && this.state.muuLukumaarat > 0 ? ['koulutustyyppi_muu'] : []),
      ...(!!this.state.digitaalinenOsaaminen && this.state.digitaalinenOsaaminen.length > 0 ? ['koulutustyyppi_digi'] : []),
    ]);
  });
  public readonly muuLukumaarat = computed(() => this.state.muuLukumaarat);
  public readonly digitaalinenOsaaminen = computed(() => this.state.digitaalinenOsaaminen);

  public async fetch(kieli) {
    this.state.koulutustyyppiLukumaarat = null;
    this.state.muuLukumaarat = null;
    this.state.digitaalinenOsaaminen = null;

    try {
      this.state.koulutustyyppiLukumaarat = (await Perusteet.getJulkaistutKoulutustyyppiLukumaarat(kieli)).data;
      this.state.muuLukumaarat = (((await getJulkisetOpetussuunnitelmat({ jotpatyyppi: ['MUU', 'VST'], kieli, sivukoko: 1 })).data) as Page<OpetussuunnitelmaDto>).kokonaismäärä;
      this.state.digitaalinenOsaaminen = ((((await findAllJulkaisut({ tyyppi: 'digitaalinen_osaaminen' })).data) as Page<PerusteenJulkaisuData>).data);
    }
    catch (e) {
      logger.error(e);
      this.state.koulutustyyppiLukumaarat = [];
    }
  }
}
