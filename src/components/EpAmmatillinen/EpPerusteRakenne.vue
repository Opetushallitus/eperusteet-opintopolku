<template>
  <div class="peruste-rakenne">
    <ep-search
      v-model="query"
      class="query"
      :placeholder="$t('etsi-rakenteesta')"
    />

    <div class="rakennepohja mt-3">
      <div class="flex">
        <ep-button
          class="rakennetoggle"
          variant="link"
          @click="toggleRakenne()"
        >
          {{ $t(rakenneOsaSuljeTeksti) }}
        </ep-button>
        <ep-button
          class="kuvaustoggle"
          variant="link"
          @click="toggleKuvaukset()"
        >
          {{ $t(rakenneOsaKuvasTeksti) }}
        </ep-button>
      </div>
      <div class="text-right rakenneotsikko">
        {{ laajuustyyppi }}
      </div>      <div class="rakenneosat">
        <peruste-rakenne-osa
          v-for="(osa, index) in filteredRakenneOsat"
          ref="rakenneosaRef"
          :key="'osa'+index"
          :rakenneosa="osa"
          :ei-vanhempaa="true"
          :viimeinen="true"
        >
          <template #nimi="{ rakenneosa }">
            <slot
              name="nimi"
              :rakenneosa="rakenneosa"
            />
          </template>
        </peruste-rakenne-osa>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, computed, onBeforeUpdate, onMounted, nextTick } from 'vue';
import { Kielet } from '@shared/stores/kieli';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import PerusteRakenneOsa from '@/components/EpAmmatillinen/PerusteRakenneOsa.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import { $t } from '@shared/utils/globals';

const props = defineProps({
  rakenneOsat: {
    type: Array,
    required: true,
  },
});

const naytaRakenteet = ref(false);
const naytaKuvaukset = ref(false);
const query = ref('');
const rakenneosaRef = ref<any[]>([]); // This will be automatically populated by Vue

const flattenRakenneOsat = (osat: any[]) => {
  return _.chain(osat)
    .map(osa => {
      return [
        osa,
        ...flattenRakenneOsat(osa.osat),
      ];
    })
    .flatMap()
    .value();
};

const flattenedRakenneOsat = computed(() => {
  return _.keyBy(flattenRakenneOsat(props.rakenneOsat), 'tunniste');
});

const filterRakenneOsat = (osat: any[]) => {
  return _.chain(osat)
    .map(osa => {
      return {
        ...osa,
        osat: filterRakenneOsat(osa.osat),
      };
    })
    .filter(osa => {
      let nimi = osa.tutkinnonosa?.tutkinnonOsa?.nimi || osa.tutkinnonosa?.nimi || osa.nimi || osa.tutkinnonosa?.perusteenTutkinnonosa?.nimi;
      return _.size(osa.osat) > 0 || (nimi && Kielet.search(query.value, nimi));
    })
    .map(osa => {
      return {
        ...osa,
        osat: _.size(osa.osat) > 0 ? osa.osat : flattenedRakenneOsat.value[osa.tunniste].osat,
      };
    })
    .value();
};

const filteredRakenneOsat = computed(() => {
  return filterRakenneOsat(props.rakenneOsat);
});

const rakenneOsaSuljeTeksti = computed(() => {
  if (!naytaRakenteet.value) {
    return 'avaa-kaikki';
  }
  else {
    return 'sulje-kaikki';
  }
});

const rakenneOsaKuvasTeksti = computed(() => {
  if (!naytaKuvaukset.value) {
    return 'nayta-ryhmien-kuvaukset';
  }
  else {
    return 'piilota-ryhmien-kuvaukset';
  }
});

const laajuustyyppi = computed(() => {
  const laajuustyypit = _.chain(flattenRakenneOsat(props.rakenneOsat))
    .map(osa => {
      return {
        ..._.pickBy(osa.muodostumisSaanto, _.identity),
      };
    })
    .filter(muodostumisSaanto => !_.isEmpty(muodostumisSaanto))
    .map(muodostumisSaanto => _.keys(muodostumisSaanto))
    .flatMap()
    .uniq()
    .value();

  if (_.size(laajuustyypit) === 0 || _.size(laajuustyypit) > 1) {
    return '';
  }

  return _.includes(laajuustyypit, 'laajuus') ? $t('osaamispiste') : $t('kpl');
});

const toggleRakenne = () => {
  naytaRakenteet.value = !naytaRakenteet.value;
  nextTick(() => {
    if (rakenneosaRef.value) {
      rakenneosaRef.value.forEach((item) => {
        if (item && item.toggleRakenne) {
          item.toggleRakenne(naytaRakenteet.value);
        }
      });
    }
  });
};

const toggleKuvaukset = () => {
  naytaKuvaukset.value = !naytaKuvaukset.value;
  nextTick(() => {
    if (!rakenneosaRef.value) return;
    rakenneosaRef.value.forEach((item) => {
      if (item && item.toggleKuvaus) {
        item.toggleKuvaus(naytaKuvaukset.value);
      }
    });
  });
};
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .peruste-rakenne {

    .rakennepohja {
      background-color: $grey50;
      padding: 20px;
    }

    .rakenneosat div:first-child {
      margin-top: -15px;
    }

    .rakenneotsikko {
      padding-right: 20px;
    }

    :deep(.rakennetoggle .btn), :deep(.rakennetoggle .btn .teksti) {
        padding-left: 0px !important;
    }
  }

</style>
