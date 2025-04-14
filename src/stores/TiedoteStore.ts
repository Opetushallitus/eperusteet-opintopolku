import _ from 'lodash';
import { Store, Getter, State } from '@shared/stores/store';
import { TiedoteDto, Tiedotteet, Perusteet, getAllPerusteet, PerusteInfoDto, KoodiDto, findTiedotteetBy } from '@shared/api/eperusteet';
import { Page } from '@shared/tyypit';
import { ActionPayload } from 'vuex';

export interface KoodiPerusteella extends KoodiDto {
  perusteet: PerusteInfoDto[];
}

@Store
export class TiedoteStore {
  @State() public uusimmatTiedotteet: TiedoteDto[] | null = null;
  @State() public tiedotteet: TiedoteDto[] | null = null;
  @State() public tiedote: TiedoteDto | null = null;
  @State() public tiedoteId: number | null = null;
  @State() public amount = 0;
  @State() public filter = {
    nimi: '',
    kieli: ['fi'],
    sivu: 0,
    sivukoko: 10,
    koulutustyypit: undefined,
  };
  @State() public tiedotteenTutkinnonosaPerusteet: KoodiPerusteella[] | null = null;
  @State() public tiedotteenOsaamisalaPerusteet: KoodiPerusteella[] | null = null;

  async getUusimmat(kieli, koulutustyypit) {
    this.uusimmatTiedotteet = null;
    this.uusimmatTiedotteet = ((await findTiedotteetBy({
      sivu: 0,
      sivukoko: 10,
      kieli: kieli,
      tiedoteJulkaisuPaikka: ['opintopolku_etusivu'],
      koulutusTyyppi: koulutustyypit,
      koulutustyypiton: true,
    })).data as any).data;
  }

  public readonly updateFilter = _.debounce(async (filter) => {
    this.filter = {
      ...this.filter,
      ...filter,
    };
    this.tiedotteet = null;
    this.fetchUutiset();
  }, 300);

  async fetchUutiset() {
    const result = (await findTiedotteetBy({
      ...this.filter,
      kieli: this.filter.kieli,
      nimi: this.filter.nimi,
      tiedoteJulkaisuPaikka: ['opintopolku_etusivu'],
      koulutusTyyppi: this.filter.koulutustyypit,
      koulutustyypiton: true,
    })).data as any;
    this.amount = result['kokonaismäärä'];
    this.tiedotteet = result.data;
  }

  async fetchUutinen(tiedoteId: number) {
    this.tiedoteId = tiedoteId;
    this.tiedote = null;
    this.tiedotteenTutkinnonosaPerusteet = null;
    this.tiedotteenOsaamisalaPerusteet = null;

    this.tiedote = (await Tiedotteet.getTiedote(this.tiedoteId)).data;

    if (!_.isEmpty(this.tiedote?.tutkinnonosat)) {
      this.tiedotteenTutkinnonosaPerusteet = await Promise.all(_.map(this.tiedote?.tutkinnonosat, async tutkinnonosa => {
        return {
          ...tutkinnonosa,
          perusteet: ((await getAllPerusteet({ tutkinnonosaKoodit: [tutkinnonosa.uri!] })).data as Page<PerusteInfoDto>).data,
        };
      }));
    }
    else {
      this.tiedotteenTutkinnonosaPerusteet = [];
    }

    if (!_.isEmpty(this.tiedote?.osaamisalat)) {
      this.tiedotteenOsaamisalaPerusteet = await Promise.all(_.map(this.tiedote?.osaamisalat, async osaamisala => {
        return {
          ...osaamisala,
          perusteet: ((await getAllPerusteet({ osaamisalaKoodit: [osaamisala.uri!] })).data as Page<PerusteInfoDto>).data,
        };
      }));
    }
    else {
      this.tiedotteenOsaamisalaPerusteet = [];
    }
  }
}
