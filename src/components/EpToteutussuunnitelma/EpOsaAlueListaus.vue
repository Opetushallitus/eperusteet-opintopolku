<template>
  <div>
    <div
      v-for="(osaalue, index) in osaAlueet"
      :key="'osaalue' + randomKey + index"
      class="osaalue"
    >
      <router-link :to="{name: 'toteutussuunnitelmaOsaAlue', params: {sisaltoviiteId: sisaltoviiteId, osaalueId: osaalue.id }}">
        <span v-if="osaalue.perusteenOsaAlue">{{ $kaannaOlioTaiTeksti(osaalue.perusteenOsaAlue.nimi) }}</span>
        <span v-else>{{ $kaannaOlioTaiTeksti(osaalue.nimi) }}</span>
        <span
          v-if="osaalue.perusteenOsaAlueKoodi"
          class="koodi ml-1"
        >({{ osaalue.perusteenOsaAlueKoodi.split('_')[1].toUpperCase() }})</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { computed } from 'vue';
import { $kaannaOlioTaiTeksti } from '@shared/utils/globals';

const props = defineProps({
  osaAlueet: {
    type: Array,
    required: true,
  },
  sisaltoviiteId: {
    type: Number,
    required: true,
  },
});

const randomKey = computed(() => {
  return (Math.random() + 1).toString(36).substring(7);
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.osaalue {
  background: #e6f6ff;
  padding: 14px;
  border-radius: 40px;
  margin-bottom: 5px;

  .nimi {
  }

  .koodi {
    color: #414141;
  }
}

</style>
