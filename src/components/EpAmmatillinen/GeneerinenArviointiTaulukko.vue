<template>
  <ep-form-content class="col-md-12 mb-5">
    <slot name="header">
      <label>{{ $t('arviointi') }}</label>
    </slot>
    <div class="mb-3">
      {{ $kaanna(arviointi.kohde) }}
    </div>
    <div v-if="kriteeriton">
      {{ $kaanna(osaamistasonOtsikko) }}
    </div>
    <div
      v-else
      class="w-full max-w-screen-lg osaamistasot mt-3"
    >
      <div
        v-for="(osaamistasonKriteeri,index) in osaamistasonKriteeritSorted"
        :key="'osaamistasokriteeri'+index"
        class="flex flex-wrap"
      >
        <div
          class="pt-3 w-full md:w-full lg:w-1/3"
        >
          <span>{{ $kaanna(osaamistasonKriteeri.osaamistaso.otsikko) }}</span>
        </div>
        <div
          class="pt-3 w-full md:w-full lg:w-2/3"
        >
          <ul class="pl-3">
            <li
              v-for="(kriteeri, index) in osaamistasonKriteeri.kriteerit"
              :key="'kriteeri'+index"
            >
              {{ $kaanna(kriteeri) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </ep-form-content>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { $kaanna, $t } from '@shared/utils/globals';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import * as _ from 'lodash';

const props = defineProps({
  arviointi: {
    type: Object,
    required: true,
  },
});

const osaamistasonKriteeritSorted = computed(() => {
  return _.sortBy(props.arviointi.osaamistasonKriteerit, kriteeri => _.get(kriteeri, 'osaamistaso.koodi.arvo'));
});

const osaamistasonKriteeritFields = computed(() => {
  return [{
    key: 'osaamistaso',
    label: $t('osaamistaso'),
    thStyle: { display: 'none' },
  }, {
    key: 'kriteerit',
    label: $t('kriteerit'),
    thStyle: { display: 'none' },
  }];
});

const kriteeriton = computed(() => {
  return props.arviointi.osaamistasonKriteerit.length === 1
    && _.chain(props.arviointi.osaamistasonKriteerit)
      .map('kriteerit')
      .flatten()
      .isEmpty()
      .value();
});

const osaamistasonOtsikko = computed(() => {
  return _.get(props.arviointi, 'osaamistasonKriteerit[0].osaamistaso.otsikko');
});
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";

  .osaamistasot {
    .row:nth-of-type(even) {
      background-color: $table-even-row-bg-color;
    }
    .row:nth-of-type(odd) {
      background-color: $table-odd-row-bg-color;
    }
  }

</style>
