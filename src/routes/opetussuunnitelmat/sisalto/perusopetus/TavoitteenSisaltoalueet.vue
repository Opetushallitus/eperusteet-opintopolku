<template>
  <div
    v-if="sisaltoalueet.length > 0 && naytaSisaltoalueet"
    class="inner-collapse mb-4"
  >
    <h5>{{ $t('sisaltoalueet') }}</h5>
    <ep-collapse
      v-for="(sisaltoalue, index) in sisaltoalueet"
      :key="sisaltoalue.id + 'sisaltoalue'+index"
      ref="sisaltoaluecollapse"
      class="sisaltoalue"
      :border-bottom="false"
      :expanded-by-default="false"
      chevron-location="left"
      :use-padding="false"
    >
      <template #header>
        <h6
          class="nimi"
          v-html="$kaanna(sisaltoalue.nimi)"
        />
      </template>

      <div
        v-if="sisaltoalue.vuosiluokanSisaltoalue"
        class="pl-4 mb-4 sisaltoaluekuvaus"
      >
        <div
          v-if="sisaltoalue.kuvaus"
          v-html="$kaanna(sisaltoalue.kuvaus)"
        />
        <div
          v-if="(sisaltoalue.vuosiluokanSisaltoalue.kaytaOmaaKuvausta && naytaOmaKuvaus) || sisaltoalue.vuosiluokanSisaltoalue.sisaltoalueet.kuvaus"
          class="paikallinen-tarkennus-alue"
        >
          <div class="font-weight-600">
            {{ $t('paikallinen-teksti') }}
          </div>
          <div
            v-if="sisaltoalue.vuosiluokanSisaltoalue.kaytaOmaaKuvausta && naytaOmaKuvaus"
            v-html="$kaanna(sisaltoalue.vuosiluokanSisaltoalue.omaKuvaus).replace('<p>', '').replace('</p>', '')"
          />
          <div
            v-else-if="sisaltoalue.vuosiluokanSisaltoalue.sisaltoalueet.kuvaus"
            v-html="$kaanna(sisaltoalue.vuosiluokanSisaltoalue.sisaltoalueet.kuvaus).replace('<p>', '').replace('</p>', '')"
          />
        </div>
      </div>
    </ep-collapse>
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { useTemplateRef } from 'vue';
import { $kaanna } from '@shared/utils/globals';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';

const props = defineProps({
  sisaltoalueet: {
    type: Array,
    required: true,
  },
  naytaSisaltoalueet: {
    type: Boolean,
    default: true,
  },
  naytaOmaKuvaus: {
    type: Boolean,
    default: true,
  },
});

const sisaltoaluecollapse = useTemplateRef('sisaltoaluecollapse');

const toggle = (toggle: boolean | null = null) => {
  _.forEach(sisaltoaluecollapse.value, (collapsable: any) => collapsable.toggle(toggle));
};

// Expose the toggle method to parent components
defineExpose({
  toggle,
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.paikallinen-tarkennus-alue {
  border-radius: 1rem;
  background-color: $ylops-paikallinen-color;
  padding: 0.8rem;
}

:deep(.ep-collapse) {
  margin-top: 0px;

  .collapse-button {
    margin-bottom: 0px !important;
  }
}

.nimi {
  line-height: 1.7;
}
</style>
