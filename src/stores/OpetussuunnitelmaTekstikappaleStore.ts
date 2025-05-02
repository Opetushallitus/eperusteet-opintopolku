import _ from 'lodash';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { TekstiKappaleDto, Puu, OpetussuunnitelmanSisalto, TekstiKappaleViiteDto } from '@shared/api/ylops';
import { Matala } from '@shared/api/eperusteet';
import { createLogger } from '@shared/utils/logger';

const logger = createLogger('OpetussuunnitelmaTekstikappaleStore');

export const useOpetussuunnitelmaTekstikappaleStore = defineStore('opetussuunnitelmaTekstikappale', () => {
  // State
  const opsId = ref<number | null>(null);
  const tekstiKappaleViiteId = ref<number | null>(null);
  const tekstiKappaleViite = ref<Puu | null>(null);
  const tekstiKappaleViitteet = ref<number[] | null>(null);
  const tekstiKappaleOriginalViites = ref<Puu[] | null>(null);
  const tekstiKappaleOriginals = ref<TekstiKappaleDto[] | null>(null);
  const tekstiKappaleOriginalViitteetObj = ref<object | null>(null);
  const tekstiKappale = ref<TekstiKappaleDto | null>(null);
  const perusteTekstikappaleViite = ref<TekstiKappaleViiteDto | null>(null);
  const tekstiKappaleAllLoaded = ref<boolean>(false);
  const opstoteutus = ref<string | null>(null);

  // Actions
  const init = (ops: number, tkviite: number, toteutus: string) => {
    opsId.value = ops;
    tekstiKappaleViiteId.value = tkviite;
    opstoteutus.value = toteutus;
    return {
      opsId,
      tekstiKappaleViiteId,
      opstoteutus,
    };
  };

  const fetchTekstikappaleAll = async (deep: boolean = false) => {
    tekstiKappaleAllLoaded.value = false;
    tekstiKappaleViite.value = null;
    tekstiKappale.value = null;
    tekstiKappaleViitteet.value = null;
    perusteTekstikappaleViite.value = null;
    tekstiKappaleOriginalViites.value = null;
    tekstiKappaleOriginals.value = null;

    await fetchTekstikappale(deep);

    await Promise.all([
      tekstiKappaleViite.value!.naytaPerusteenTeksti ? fetchPerusteTekstikappale() : new Promise<void>(resolve => resolve()),
      tekstiKappaleViite.value!.naytaPohjanTeksti ? fetchOriginalTekstikappaleDeep() : new Promise<void>(resolve => resolve()),
    ]);

    tekstiKappaleAllLoaded.value = true;
  };

  const fetchTekstikappale = async (deep: boolean = false) => {
    if (deep) {
      tekstiKappaleViite.value = (await OpetussuunnitelmanSisalto
        .getTekstiKappaleViiteSyva(opsId.value!, tekstiKappaleViiteId.value!)).data;
    }
    else {
      tekstiKappaleViite.value = (await OpetussuunnitelmanSisalto
        .getTekstiKappaleViite(opsId.value!, tekstiKappaleViiteId.value!)).data as Puu;
    }

    if (tekstiKappaleViite.value.tekstiKappale) {
      tekstiKappale.value = tekstiKappaleViite.value.tekstiKappale;
    }
  };

  const fetchPerusteTekstikappale = async () => {
    perusteTekstikappaleViite.value = null;
    if (tekstiKappaleViite.value && tekstiKappaleViite.value.perusteTekstikappaleId) {
      try {
        perusteTekstikappaleViite.value = (await OpetussuunnitelmanSisalto.getPerusteTekstikappale(opsId.value!, tekstiKappaleViiteId.value!)).data;
      }
      catch (err) {
        logger.error(err);
      }
    }
  };

  const fetchOriginalTekstikappaleDeep = async () => {
    tekstiKappaleOriginalViites.value = null;
    tekstiKappaleOriginals.value = null;
    tekstiKappaleOriginalViitteetObj.value = {};

    // Saman tason pohjan viite
    await fetchOriginalTekstikappale();

    // Haetaan alikappaleiden pohjien tekstit
    getAliviiteIds();
    if (tekstiKappaleViitteet.value) {
      const viitteet: Matala[] = [];
      await Promise.all(tekstiKappaleViitteet.value.map(async viite => {
        const tekstiKappaleOriginal = await fetchOriginalAlikappale(viite);
        // Jos alkuperäinen ei löydy, rajapinta palauttaa tyhjän merkkijonon. Sen takia tarkistetaan onko objekti.
        if (_.isObject(tekstiKappaleOriginal)) {
          viitteet.push(tekstiKappaleOriginal);
        }
      }));

      tekstiKappaleOriginalViitteetObj.value = _.keyBy(viitteet, 'id');
    }
  };

  const fetchOriginalAlikappale = async (viite: number): Promise<any> => {
    return (await OpetussuunnitelmanSisalto
      .getTekstiKappaleViiteOriginal(opsId.value!, viite)).data;
  };

  const fetchOriginalTekstikappale = async () => {
    tekstiKappaleOriginalViites.value = (await OpetussuunnitelmanSisalto
      .getTekstiKappaleViiteOriginals(opsId.value!, tekstiKappaleViiteId.value!)).data as Puu[];
    if (_.size(_.filter(tekstiKappaleOriginalViites.value, 'tekstiKappale')) > 0) {
      tekstiKappaleOriginals.value = _.map(tekstiKappaleOriginalViites.value, 'tekstiKappale') as TekstiKappaleDto[];
    }
  };

  const getAliviiteIds = () => {
    if (!_.isEmpty(tekstiKappaleViite.value)) {
      const viitteet: any[] = [];
      const stack = [tekstiKappaleViite.value!];

      while (!_.isEmpty(stack)) {
        const head: any = stack.shift()!;

        // Lisätään vain ne, joilla halutaan näyttää pohjan sisältö
        if (head.id && head.naytaPohjanTeksti) {
          viitteet.push(head.id);
        }

        stack.unshift(..._.map(head.lapset, viite => ({
          ...viite,
        })));
      }

      tekstiKappaleViitteet.value = _.slice(viitteet, 1);
    }
  };

  return {
    // State
    opsId,
    tekstiKappaleViiteId,
    tekstiKappaleViite,
    tekstiKappaleViitteet,
    tekstiKappaleOriginalViites,
    tekstiKappaleOriginals,
    tekstiKappaleOriginalViitteetObj,
    tekstiKappale,
    perusteTekstikappaleViite,
    tekstiKappaleAllLoaded,
    opstoteutus,

    // Actions
    init,
    fetchTekstikappaleAll,
    fetchTekstikappale,
    fetchPerusteTekstikappale,
    fetchOriginalTekstikappaleDeep,
    fetchOriginalAlikappale,
    fetchOriginalTekstikappale,
    getAliviiteIds,
  };
});
