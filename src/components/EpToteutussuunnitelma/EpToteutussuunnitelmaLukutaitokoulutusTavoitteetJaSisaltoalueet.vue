<template>
  <div v-if="perusteenOsa">
    <slot name="sisalto-nimi" />

    <div
      v-for="(tavoitealue, tavoitealueIndex) in perusteenOsa.tavoitealueet"
      :key="'tavoitealue' + tavoitealueIndex"
      class="mb-5"
    >
      <h3 class="mb-3">
        {{ $kaanna(tavoitealue.nimi) }}
      </h3>
      <template v-if="tavoitealue.tavoitteet && tavoitealue.tavoitteet.length > 0">
        <div class="font-semibold mb-2">
          {{ $t('opiskelija-osaa') }}
        </div>
        <ul class="mb-0">
          <li
            v-for="(tavoite, index) in tavoitealue.tavoitteet"
            :key="'tavoite' + tavoitealueIndex + '-' + index"
          >
            {{ $kaanna(tavoite) }}
          </li>
        </ul>
      </template>
    </div>

    <EpPaikallinenTarkennus
      v-if="lukutaitoTavoitealue.paikallinenTarkennus"
      class="mt-3"
    >
      <template #header>
        <h3>
          {{ $t('paikallinen-teksti') }}
        </h3>
      </template>
      <ep-content-viewer
        :value="$kaanna(lukutaitoTavoitealue.paikallinenTarkennus)"
        :kuvat="kuvat"
      />
    </EpPaikallinenTarkennus>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { $kaanna, $t } from '@shared/utils/globals';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpPaikallinenTarkennus from '@shared/components/EpPaikallinenTarkennus/EpPaikallinenTarkennus.vue';

const props = defineProps({
  sisaltoviite: {
    type: Object,
    required: true,
  },
  kuvat: {
    type: Array,
    required: true,
  },
});

const lukutaitoTavoitealue = computed(() => {
  return (props.sisaltoviite as any).lukutaitoTavoitealue;
});

const perusteenOsa = computed(() => {
  return lukutaitoTavoitealue.value?.perusteenOsa;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
