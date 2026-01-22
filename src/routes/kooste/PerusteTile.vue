<template>
  <div class="peruste tile-background-shadow-selected shadow-tile flex flex-col">
    <div class="upper">
      <div class="peruste-ikoni">
        <EpMaterialIcon
          v-if="isHallitus"
          icon-shape="outlined"
          :color="rgbColor"
          size="38px"
          class="img"
        >
          account_balance
        </EpMaterialIcon>
        <EpMaterialIcon
          v-else
          :color="rgbColor"
          size="38px"
          class="img"
        >
          menu_book
        </EpMaterialIcon>
      </div>
      <div class="nimi">
        {{ $kaanna(julkaisu.nimi) }} <span v-if="julkaisu.laajuus">{{ julkaisu.laajuus }} {{ $t('osaamispiste') }}</span>
      </div>
    </div>
    <div class="mt-auto">
      <div class="voimaantulo">
        <span v-if="julkaisu.voimassaoloAlkaa">
          {{ $t('voimaantulo') }}: {{ $sd(julkaisu.voimassaoloAlkaa) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { isVstLukutaito, koulutustyyppiThemeColor, rgb2string } from '@shared/utils/perusteet';
import EpVoimassaolo from '@shared/components/EpVoimassaolo/EpVoimassaolo.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { $kaanna, $t, $sd } from '@shared/utils/globals';

interface PerusteJulkiData {
  nimi:{ [key: string]: string; };
  voimassaoloAlkaa?: number,
  voimassaoloLoppuu?: number,
  laajuus?: number,
  koulutustyyppi?: string,
}

const props = defineProps({
  julkaisu: {
    type: Object as () => PerusteJulkiData,
    required: true,
  },
  koulutustyyppi: {
    type: String,
    required: false,
  },
});

const rgbColor = computed(() => {
  return rgb2string(koulutustyyppiThemeColor(props.koulutustyyppi));
});

const isHallitus = computed(() => {
  return !isVstLukutaito(props.julkaisu.koulutustyyppi!);
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile;

.peruste {
  cursor: pointer;
  border-radius: 10px;
  border: 1px solid #E7E7E7;
  min-height: 200px;
  overflow-x: auto;
  width: 330px;
  height: 172px;
  padding-left: 20px;
  padding-right: 20px;

  @media(max-width: 767.98px) {
    width: 100%;
  }
}

.voimaantulo {
  border-top: 1px solid #EBEBEB;
  color: #001A58;
  font-size: 14px;
  padding: 10px;
  text-align: center;
  width: 100%;
}

.upper {
  height: 180px;
  overflow-y: clip;

  .peruste-ikoni {
    color: #0041DC;
    text-align: center;

    .img {
      margin: 12px;
      height: 38px;
      width: 38px;
    }
  }

  .nimi {
    hyphens: auto;
    overflow: hidden;
    width: 100%;
    padding: 0;
    text-align: center;
    color: #2B2B2B;
    font-weight: 600;
  }
}

.row {
  margin-bottom: 2rem;
}

</style>
