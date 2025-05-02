<template>
  <div class="tiivistetty-content">
    <h4
      class="link-style clickable font-weight-bold"
      @click="selectOppiaine(oppiaine)"
    >
      {{ $kaanna(oppiaine.nimi) }}
    </h4>

    <h5 class="mt-3">
      {{ $t('tavoitteet') }}
    </h5>

    <div
      v-for="(alue, alueindex) in tavoitteetAlueilla"
      :key="'alue'+alueindex"
      class="mt-4"
    >
      <h6 v-if="alue.nimi">
        {{ $kaanna(alue.nimi) }}
      </h6>

      <div
        v-for="(tavoite, tavoiteindex) in alue.tavoitteet"
        :key="tavoiteindex + '' + alueindex"
        class="striped p-2"
      >
        <div v-html="$kaanna(tavoite.tavoite)" />
      </div>
    </div>

    <TavoitteenSisaltoalueet
      :sisaltoalueet="sisaltoalueet"
      :nayta-oma-kuvaus="false"
      class="mt-4"
    />
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { computed } from 'vue';
import TavoitteenSisaltoalueet from './TavoitteenSisaltoalueet.vue';
import { $kaanna } from '@shared/utils/globals';

const props = defineProps({
  oppiaineJaTavoitteet: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['selectOppiaine']);

const oppiaine = computed(() => {
  return props.oppiaineJaTavoitteet.oppiaine;
});

const tavoitteet = computed(() => {
  return _.map(props.oppiaineJaTavoitteet.vuosiluokka.tavoitteet, tavoite => {
    return {
      ...tavoite,
      tavoite: $kaanna(tavoite.tavoite)
        .replace('<p>', '')
        .replace('</p>', ''),
    };
  });
});

const sisaltoalueet = computed(() => {
  return _.chain(tavoitteet.value)
    .map('sisaltoalueet')
    .flatten()
    .filter('nimi')
    .uniqBy('nimi')
    .value();
});

const tavoitealueet = computed(() => {
  return _.chain(tavoitteet.value)
    .map('kohdealueet')
    .flatten()
    .uniqBy('nimi')
    .value();
});

const tavoitteetAlueilla = computed(() => {
  if (_.size(tavoitealueet.value) > 0) {
    return [
      ..._.map(tavoitealueet.value, tavoitealue => {
        return {
          nimi: tavoitealue.nimi,
          tavoitteet: _.filter(tavoitteet.value, tavoite => _.find(tavoite.kohdealueet, { nimi: tavoitealue.nimi })),
        };
      }),
    ];
  }
  else {
    return [{ nimi: '', tavoitteet: tavoitteet.value }];
  }
});

const selectOppiaine = (oppiaine) => {
  emit('selectOppiaine', oppiaine);
};
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.tiivistetty-content{
  border: 2px solid#E0E0E1;
  border-radius: 1rem;
  padding: 1rem;
}

.striped {
  &:nth-of-type(even) {
    background-color: $table-even-row-bg-color;
  }
  &:nth-of-type(odd) {
    background-color: $table-odd-row-bg-color;
  }
}

.nimi {
  line-height: 1.7;
}

:deep(.ep-collapse) {
  margin-top: 0px;

  .collapse-button {
    margin-bottom: 0px !important;
  }
}

:deep(.ep-button .btn){
  padding: 0;
}

.paikallinen-tarkennus-alue {
  border-radius: 1rem;
  background-color: $ylops-paikallinen-color;
  padding: 0.8rem;
}
</style>
