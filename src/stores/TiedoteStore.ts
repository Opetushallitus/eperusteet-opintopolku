import _ from 'lodash';
import { defineStore } from 'pinia';
import { reactive, ref, computed } from 'vue';
import { TiedoteDto, Tiedotteet, Perusteet, getAllPerusteet, PerusteInfoDto, KoodiDto, findTiedotteetBy } from '@shared/api/eperusteet';
import { Page } from '@shared/tyypit';

export interface KoodiPerusteella extends KoodiDto {
  perusteet: PerusteInfoDto[];
}

export const useTiedoteStore = defineStore('tiedote', () => {
  // State as refs
  const uusimmatTiedotteet = ref<TiedoteDto[] | null>(null);
  const tiedotteet = ref<TiedoteDto[] | null>(null);
  const tiedote = ref<TiedoteDto | null>(null);
  const tiedoteId = ref<number | null>(null);
  const amount = ref(0);
  const filter = reactive({
    nimi: '',
    kieli: ['fi'],
    sivu: 0,
    sivukoko: 10,
    koulutustyypit: undefined as undefined | string[],
    koulutustyypiton: true,
  });
  const tiedotteenTutkinnonosaPerusteet = ref<KoodiPerusteella[] | null>(null);
  const tiedotteenOsaamisalaPerusteet = ref<KoodiPerusteella[] | null>(null);

  // Actions
  const getUusimmat = async (kieli: string[], koulutustyypit?: string[]) => {
    uusimmatTiedotteet.value = null;
    uusimmatTiedotteet.value = ((await findTiedotteetBy({
      sivu: 0,
      sivukoko: 10,
      kieli: kieli,
      tiedoteJulkaisuPaikka: ['opintopolku_etusivu'],
      koulutusTyyppi: koulutustyypit,
      koulutustyypiton: true,
    })).data as any).data;
  };

  const updateFilter = _.debounce(async (newFilter: any) => {
    Object.assign(filter, newFilter);
    tiedotteet.value = null;
    await fetchUutiset();
  }, 300);

  const fetchUutiset = async () => {
    const result = (await findTiedotteetBy({
      ...filter,
      kieli: filter.kieli,
      nimi: filter.nimi,
      tiedoteJulkaisuPaikka: ['opintopolku_etusivu'],
      koulutusTyyppi: filter.koulutustyypit,
      koulutustyypiton: filter.koulutustyypiton,
    })).data as any;
    amount.value = result['kokonaismäärä'];
    tiedotteet.value = result.data;
  };

  const fetchUutinen = async (id: number) => {
    tiedoteId.value = id;
    tiedote.value = null;
    tiedotteenTutkinnonosaPerusteet.value = null;
    tiedotteenOsaamisalaPerusteet.value = null;

    tiedote.value = (await Tiedotteet.getTiedote(tiedoteId.value)).data;

    if (!_.isEmpty(tiedote.value?.tutkinnonosat)) {
      tiedotteenTutkinnonosaPerusteet.value = await Promise.all(_.map(tiedote.value?.tutkinnonosat, async tutkinnonosa => {
        return {
          ...tutkinnonosa,
          perusteet: ((await getAllPerusteet({ tutkinnonosaKoodit: [tutkinnonosa.uri!] })).data as Page<PerusteInfoDto>).data,
        };
      }));
    }
    else {
      tiedotteenTutkinnonosaPerusteet.value = [];
    }

    if (!_.isEmpty(tiedote.value?.osaamisalat)) {
      tiedotteenOsaamisalaPerusteet.value = await Promise.all(_.map(tiedote.value?.osaamisalat, async osaamisala => {
        return {
          ...osaamisala,
          perusteet: ((await getAllPerusteet({ osaamisalaKoodit: [osaamisala.uri!] })).data as Page<PerusteInfoDto>).data,
        };
      }));
    }
    else {
      tiedotteenOsaamisalaPerusteet.value = [];
    }
  };

  return {
    // State
    uusimmatTiedotteet,
    tiedotteet,
    tiedote,
    tiedoteId,
    amount,
    filter,
    tiedotteenTutkinnonosaPerusteet,
    tiedotteenOsaamisalaPerusteet,

    // Actions
    getUusimmat,
    updateFilter,
    fetchUutiset,
    fetchUutinen,
  };
});


