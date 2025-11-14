<template>
  <div class="content">
    <div v-if="oppiaineetFormatted">
      <h2
        class="otsikko"
      >
        {{ $t('oppiaineet') }}
      </h2>
      <div class="teksti">
        <div
          v-for="(oppiaine, idx) in oppiaineetFormatted"
          :key="idx"
          class="oppiaine"
        >
          <router-link
            v-if="oppiaine.location"
            :to="oppiaine.location"
          >
            {{ $kaannaOlioTaiTeksti(oppiaine.label) }}
            <span
              v-if="oppiaine.koodiLabel"
              class="code-field"
            >({{ oppiaine.koodiLabel }})</span>
          </router-link>
          <span v-else>
            {{ $kaannaOlioTaiTeksti(oppiaine.label) }}
            <span
              v-if="oppiaine.koodiLabel"
              class="code-field"
            >({{ oppiaine.koodiLabel }})</span>
          </span>
        </div>
      </div>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';

const opetussuunnitelmaDataStore = getCachedOpetussuunnitelmaStore();

const current = computed(() => {
  return opetussuunnitelmaDataStore.current;
});

const oppiaineet = computed(() => {
  if (current.value) {
    return current.value.children;
  }
  return undefined;
});

const oppiaineetFormatted = computed(() => {
  if (!_.isEmpty(oppiaineet.value)) {
    return _.map(oppiaineet.value, oa => ({
      ...oa,
      koodiLabel: _.get(oa, 'meta.koodi.arvo') || _.get(oa, 'meta.koodi'),
    }));
  }
  return undefined;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: 0 $content-padding;

  .otsikko, .teksti {
    @include teksti-sisalto;
  }

  span.code-field {
    margin-left: 5px;
    font-size: 80%;
    text-transform: uppercase;
  }
}
</style>
