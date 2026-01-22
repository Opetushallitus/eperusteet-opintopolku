<template>
  <div v-if="kooditPerusteilla && kooditPerusteilla.length > 0">
    <div class="flex">
      <slot name="header" />

      <template v-if="perusteelliset.length > 0">
        <EpPopover :triggers="['hover']">
          <template #trigger>
            <a
              :id="popovertarget"
              href="javascript:;"
              class="peruste-popover ml-3"
            >
              {{ $t('nayta-perusteet') }}
            </a>
          </template>
          <div class="p-1">
            <slot name="popover-header" />
            <div
              v-for="koodi in perusteelliset"
              :key="koodi.uri"
              class="mt-4 koodi"
            >
              <h4>{{ $kaanna(koodi.nimi) }}</h4>
              <div
                v-for="peruste in koodi.perusteet"
                :key="koodi.uri+peruste.id"
                class="peruste p-2"
              >
                <router-link :to="{ name: 'peruste', params: { perusteId: peruste.id, koulutustyyppi: 'ammatillinen' } }">
                  {{ $kaanna(peruste.nimi) }}
                </router-link>
              </div>
            </div>
          </div>
        </EpPopover>
      </template>
    </div>
    <span
      v-for="(koodi,index) in kooditPerusteilla"
      :key="'koodi'+koodi.uri"
    >
      <span v-if="index > 0">, </span>
      <span>{{ $kaanna(koodi.nimi) }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { KoodiPerusteella } from '@/stores/TiedoteStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { $kaanna } from '@shared/utils/globals';
import EpPopover from '@shared/components/EpPopover/EpPopover.vue';
import _ from 'lodash';

const props = defineProps({
  kooditPerusteilla: {
    type: Array as () => KoodiPerusteella[],
    required: true,
  },
});

const popovertarget = computed(() => {
  return props.kooditPerusteilla[0].uri;
});

const perusteelliset = computed(() => {
  return _.filter(props.kooditPerusteilla, koodi => !_.isEmpty(koodi.perusteet));
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.peruste-popover {
  font-size: 0.8rem;
}

.koodi {
  .peruste:nth-of-type(even) {
    background-color: $table-even-row-bg-color;
  }
  .peruste:nth-of-type(odd) {
    background-color: $table-odd-row-bg-color;
  }
}
</style>
