<template>
  <div
    v-for="(ryhma, ryhmaIndex) in ryhmat"
    :key="'ryhma' + (ryhma.otsikko?.id || ryhmaIndex)"
  >
    <template v-if="ryhma.otsikko">
      <hr
        v-if="ryhmaIndex > 0"
        class="mt-0 mb-5"
      >
      <div class="alue-otsikko mb-3">
        {{ $kaanna(ryhma.otsikko.otsikko?.nimi) }}
      </div>
      <div
        v-if="$kaanna(ryhma.otsikko.tavoitteidenJohdanto)"
        class="mb-2 ml-6"
      >
        {{ $kaanna(ryhma.otsikko.tavoitteidenJohdanto) }}
      </div>
      <div
        v-if="ryhma.otsikko.tavoitteet?.length > 0"
        class="mb-4 ml-6"
      >
        <ul class="tavoitteet-lista">
          <li
            v-for="(tavoite, index) in ryhma.otsikko.tavoitteet"
            :key="'otsikko-tavoite' + (ryhma.otsikko.id || ryhmaIndex) + index"
          >
            {{ $kaanna(tavoite.nimi) }}
          </li>
        </ul>
      </div>
    </template>

    <div
      v-for="(alue, alueIndex) in ryhma.sisalto"
      :key="'alue' + (alue.id || alueIndex)"
      class="tavoitesisaltoalue mb-5"
      :class="{ 'ml-6': !!ryhma.otsikko }"
    >
      <div
        v-if="naytaAlueenOtsikko(ryhma, alue)"
        class="alue-otsikko mb-3"
      >
        {{ $kaanna(alue.otsikko.nimi) }}
      </div>
      <div
        v-if="$kaanna(alue.tavoitteidenJohdanto)"
        class="mb-2"
      >
        {{ $kaanna(alue.tavoitteidenJohdanto) }}
      </div>
      <div
        v-if="alue.tavoitteet?.length > 0"
        class="mb-4"
      >
        <ul class="tavoitteet-lista">
          <li
            v-for="(tavoite, index) in alue.tavoitteet"
            :key="(alue.id || alueIndex) + 'tavoite' + index"
          >
            {{ $kaanna(tavoite.nimi) }}
          </li>
        </ul>
      </div>
      <div v-if="alue.keskeisetSisaltoalueet?.length > 0">
        <div class="sisalto-otsikko mb-2">
          {{ $t('keskeiset-sisaltoalueet') }}
        </div>
        <div class="sisalto-rivit">
          <div
            v-for="(sisaltoalue, index) in alue.keskeisetSisaltoalueet"
            :key="(alue.id || alueIndex) + 'sisalto' + index"
            class="sisalto-rivi p-2"
          >
            {{ $kaanna(sisaltoalue) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  tavoitealueet?: any[],
}>();

const onOtsikko = (alue: any) => alue?.tavoiteAlueTyyppi === 'OTSIKKO';

const naytaAlueenOtsikko = (ryhma: { otsikko: any }, alue: any) => {
  if (onOtsikko(alue) || !alue?.otsikko?.uri) {
    return false;
  }
  return !ryhma.otsikko || !(alue.tavoitteet?.length > 0);
};

const ryhmat = computed(() => {
  const tulos: Array<{ otsikko: any, sisalto: any[] }> = [];
  let ryhma: { otsikko: any, sisalto: any[] } | null = null;
  (props.tavoitealueet || []).forEach((alue: any) => {
    if (onOtsikko(alue)) {
      ryhma = { otsikko: alue, sisalto: [] };
      tulos.push(ryhma);
    }
    else if (ryhma) {
      ryhma.sisalto.push(alue);
    }
    else {
      tulos.push({ otsikko: null, sisalto: [alue] });
    }
  });
  return tulos;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.alue-otsikko {
  font-size: 1.1rem;
}

.sisalto-otsikko {
  font-weight: 600;
}

.tavoitteet-lista {
  list-style-type: disc;
  margin-bottom: 1rem;
  padding-left: 1.25rem;
}

.sisalto-rivit .sisalto-rivi {
  &:nth-child(even) {
    background-color: $table-even-row-bg-color;
  }

  &:nth-child(odd) {
    background-color: $table-odd-row-bg-color;
  }
}
</style>
