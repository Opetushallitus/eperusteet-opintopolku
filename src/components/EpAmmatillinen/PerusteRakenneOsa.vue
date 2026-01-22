<template>
  <div :class="{'parentviiva': !viimeinen}">
    <div class="d-flex">
      <div
        v-if="!eiVanhempaa && viimeinen"
        class="parentviiva viimeinen"
      />
      <div
        v-if="!eiVanhempaa"
        class="liitosviiva"
      />
      <div class="w-100">
        <div
          class="rakenne"
          :style="rakenneStyle"
        >
          <div
            class="d-flex w-100 justify-content-between"
            :class="{'kuvaukseton': !rakenneosa.kuvaus}"
            @click="toggleRakenne()"
          >
            <div v-if="rakenneosa.osat && rakenneosa.osat.length > 0">
              <EpMaterialIcon v-if="!naytaRakenne">
                expand_more
              </EpMaterialIcon>
              <EpMaterialIcon v-else>
                expand_less
              </EpMaterialIcon>
            </div>
            <div
              class="w-75"
              :class="{'ml-3' : rakenneosa.osat && rakenneosa.osat.length > 0}"
            >
              <slot
                name="nimi"
                :rakenneosa="rakenneosa"
              >
                <template v-if="nimi">
                  {{ $kaanna(nimi) }}
                </template>
                <template v-else>
                  {{ $t('kohteen-nimea-ei-saatavilla') }}
                </template>
              </slot>
            </div>
            <div class="w-25 text-right">
              {{ laajuus }}
            </div>
          </div>

          <div
            v-if="rakenneosa.kuvaus || rakenneosa.paikallinenKuvaus && rakenneosa.paikallinenKuvaus.kuvaus"
            class="text-center"
            @click="toggleKuvaus()"
          >
            <EpMaterialIcon>more_horiz</EpMaterialIcon>
          </div>
          <div
            v-if="naytaKuvaus"
            class="kuvaus"
          >
            <div v-html="$kaanna(rakenneosa.kuvaus)" />
            <div
              v-if="rakenneosa.paikallinenKuvaus && rakenneosa.paikallinenKuvaus.kuvaus"
              class="mt-3"
            >
              <span class="paikallinen-kuvaus">{{ $t('koulutuksen-jarjestajan-tarkennus') }}</span>
              <div v-html="$kaanna(rakenneosa.paikallinenKuvaus.kuvaus)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="naytaRakenne"
      class="rakenneosat"
      :class="{'viimeinen': viimeinen}"
    >
      <peruste-rakenne-osa
        v-for="(osa, index) in osat"
        :key="'osa'+index"
        ref="rakenneosaRef"
        :rakenneosa="osa"
        :class="{'rakennemargin': !eiVanhempaa}"
        :viimeinen="index + 1 === rakenneosa.osat.length"
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
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import _ from 'lodash';
import { rakenneNodecolor } from '@shared/utils/perusterakenne';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { $kaanna } from '@shared/utils/globals';

const props = defineProps({
  rakenneosa: {
    type: Object,
    required: true,
  },
  eiVanhempaa: {
    type: Boolean,
    required: false,
    default: false,
  },
  viimeinen: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const naytaRakenne = ref(false);
const naytaKuvaus = ref(false);
const rakenneosaRef = ref<any[]>([]);

const pakollinen = () => {
  return (props.rakenneosa.rooli === 'määritelty' && $kaanna(props.rakenneosa.nimi) === 'rakenne-moduuli-pakollinen') || props.rakenneosa.pakollinen;
};

const toggleKuvaus = (naytaKuvausArg?: boolean) => {
  if (naytaKuvausArg !== undefined) {
    naytaKuvaus.value = naytaKuvausArg;
    nextTick(() => {
      if (!rakenneosaRef.value) return;
      rakenneosaRef.value.forEach((item) => {
        if (item && item.toggleKuvaus) {
          item.toggleKuvaus(naytaKuvaus.value);
        }
      });
    });
  }
  else {
    naytaKuvaus.value = !naytaKuvaus.value;
  }
};

const toggleRakenne = (naytaRakenneArg?: boolean) => {
  if (naytaRakenneArg !== undefined) {
    naytaRakenne.value = naytaRakenneArg;
    nextTick(() => {
      if (!rakenneosaRef.value) return;
      rakenneosaRef.value.forEach((item) => {
        if (item && item.toggleRakenne) {
          item.toggleRakenne(naytaRakenne.value);
        }
      });
    });
  }
  else {
    naytaRakenne.value = !naytaRakenne.value;
  }
};

const osat = computed(() => {
  return _.chain(props.rakenneosa.osat)
    .map((osa: any) => {
      return {
        ...osa,
        pakollinen: pakollinen(),
      };
    })
    .value();
});

const laajuus = computed(() => {
  if (props.rakenneosa.muodostumisSaanto) {
    const tyyppi = props.rakenneosa.muodostumisSaanto.laajuus || props.rakenneosa.muodostumisSaanto.koko;

    if (!_.isNil(tyyppi.minimi) && !_.isNil(tyyppi.maksimi) && tyyppi.maksimi !== 0 && tyyppi.minimi !== tyyppi.maksimi) {
      return tyyppi.minimi + ' - ' + tyyppi.maksimi;
    }

    return tyyppi.minimi || tyyppi.maksimi || '';
  }

  if (props.rakenneosa.tutkinnonosa?.perusteenTutkinnonosaViite?.laajuus) {
    return props.rakenneosa.tutkinnonosa.perusteenTutkinnonosaViite.laajuus;
  }

  if (props.rakenneosa.tutkinnonosa?.laajuus) {
    return props.rakenneosa.tutkinnonosa.laajuus;
  }

  if (props.rakenneosa.tutkinnonosa?.tosa?.omatutkinnonosa?.laajuus) {
    return props.rakenneosa.tutkinnonosa.tosa?.omatutkinnonosa?.laajuus;
  }

  return undefined;
});

const nimi = computed(() => {
  if (props.rakenneosa.tutkinnonosa) {
    return props.rakenneosa.tutkinnonosa.tutkinnonOsa?.nimi || props.rakenneosa.tutkinnonosa.nimi;
  }
  return props.rakenneosa.nimi;
});

const rakenneStyle = computed(() => {
  return 'border-color: ' + rakenneNodecolor(props.rakenneosa, null);
});

// Expose methods to parent component
defineExpose({
  toggleRakenne,
  toggleKuvaus,
});
</script>

<style scoped lang="scss">
  @import '@shared/styles/_variables.scss';

  .rakenne {
    border-radius: 0;
    border: 0 solid $gray;
    border-left-width: 0.3rem;
    padding:20px 20px 0px 20px;
    margin-top: 20px;
    background-color: $white;
    cursor: pointer;

    .kuvaus {
      padding: 10px 20px;
    }

    .kuvaukseton {
      padding-bottom: 20px;
    }

    .paikallinen-kuvaus {
      font-weight: 500;
    }
  }

  .liitosviiva {
    width: 20px;
    border-top: 2px solid $gray-lighten-3;
    transform: translateY(3rem);
  }

  .parentviiva {
    border-left: 2px solid $gray-lighten-3;
  }

  .parentviiva.viimeinen {
    height: 50px;
  }

  .rakenneosat.viimeinen{
    margin-left: 2px;
  }

  .rakennemargin {
    margin-left: 20px;
  }

</style>
