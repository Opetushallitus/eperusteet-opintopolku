<template>
  <div class="tile tile-background-shadow-selected shadow-tile d-flex flex-column">
    <div class="ikoni">
      <img
        :src="osaamimerkkiLogo"
        :alt="$t('osaamismerkit')"
        class="img"
      >
    </div>
    <div class="nimi">
      {{ $t('kansalliset-perustaitojen-osaamismerkit') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import osaamismerkkiLogoFI from '@assets/img/images/osaamismerkki_main_FI.svg';
import osaamismerkkiLogoSV from '@assets/img/images/osaamismerkki_main_SV.svg';
import { Kielet } from '@shared/stores/kieli';

const sisaltokieli = computed(() => {
  return Kielet.getSisaltoKieli.value;
});

const osaamimerkkiLogo = computed(() => {
  if (sisaltokieli.value === 'sv') {
    return osaamismerkkiLogoSV;
  }
  else {
    return osaamismerkkiLogoFI;
  }
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile;

.tile {
  cursor: pointer;
  margin: 10px 20px 10px 0;
  border-radius: 10px;
  border: 1px solid #E7E7E7;
  min-height: 200px;
  overflow-x: auto;
  width: 330px;
  height: 172px;
  padding-top: 20px;
  padding-left: 20px;
  padding-right: 20px;

  @media(max-width: 767.98px) {
    width: 100%;
  }
}

.ikoni {
  text-align: center;
}

.nimi {
  margin-top: 10px;
  hyphens: auto;
  overflow: hidden;
  width: 100%;
  padding: 0;
  text-align: center;
  color: #2B2B2B;
  font-weight: 600;
}

.img {
  height: 100px;
  width: 100px;
}
</style>
