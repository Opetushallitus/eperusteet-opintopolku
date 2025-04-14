import  { reactive, computed } from '@vue/composition-api';
import { PerusopetuksenPerusteenSisalto, OppiaineDto, LaajaalainenOsaaminenDto } from '@shared/api/eperusteet';
import * as _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';

export class PerusopetusOppiaineStore {
  public state = reactive({
    oppiaine: null as OppiaineDto | null,
  });

  public static async create(perusteId: number, oppiaineId: number) {
    const result = new PerusopetusOppiaineStore(perusteId, oppiaineId);
    await result.init();
    return result;
  }

  constructor(private perusteId: number, private oppiaineId: number) {
  }

  public readonly oppiaine = computed(() => this.state.oppiaine);

  public async init() {
    const vuosiluokkakokonaisuudetById = _.keyBy((await PerusopetuksenPerusteenSisalto.getVuosiluokkaKokonaisuudet(this.perusteId)).data, 'id');
    const laajaalaisetOsaamiset = _.keyBy((await (PerusopetuksenPerusteenSisalto.getOsaamiset(this.perusteId))).data, 'id');

    this.state.oppiaine = (await PerusopetuksenPerusteenSisalto.getPerusopetusOppiaine(this.perusteId, this.oppiaineId)).data;
    this.state.oppiaine = {
      ...this.state.oppiaine,
      vuosiluokkakokonaisuudet: _.chain(this.state.oppiaine.vuosiluokkakokonaisuudet)
        .map(vlk => {
          const vlkSisaltoalueetById = _.keyBy(vlk.sisaltoalueet, 'id');
          return {
            ...vlk,
            nimi: _.get(vuosiluokkakokonaisuudetById[_.get(vlk, '_vuosiluokkaKokonaisuus')!], 'nimi'),
            vuosiluokat: _.get(vuosiluokkakokonaisuudetById[_.get(vlk, '_vuosiluokkaKokonaisuus')!], 'vuosiluokat') as any,
            tavoitteet: _.map(vlk.tavoitteet, tavoite => {
              return {
                ...tavoite,
                laajattavoitteet: _.chain(tavoite.laajattavoitteet)
                  .map((laajatavoitet: string) => {
                    return laajaalaisetOsaamiset[laajatavoitet] as LaajaalainenOsaaminenDto;
                  })
                  .sortBy((ltavoite: any) => ltavoite.nimi[Kielet.getSisaltoKieli.value])
                  .value() as any,
                sisaltoalueet: _.chain(tavoite.sisaltoalueet)
                  .map((sisaltoalue: string) => {
                    return vlkSisaltoalueetById[sisaltoalue];
                  })
                  .sortBy((sisaltoalue: any) => sisaltoalue.nimi[Kielet.getSisaltoKieli.value])
                  .value() as any,
              };
            }),
          };
        })
        .sortBy('vuosiluokat')
        .value(),
    };
  }
}
