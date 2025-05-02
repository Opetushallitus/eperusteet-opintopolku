<template>
  <router-link :to="tyyppi.route">
    <div class="tyyppi-tile tile-background-shadow-selected shadow-tile">
      <div class="p-2">
        <div class="ikoni">
          <EpMaterialIcon
            v-if="icon"
            icon-shape="outlined"
            :color="rgbColor"
            size="38px"
            class="img"
          >
            {{ icon }}
          </EpMaterialIcon>
          <img
            v-else
            :src="osaamimerkkiLogo"
            :alt="$t('osaamismerkit')"
            class="img"
          >
        </div>
        <div class="nimi">
          <span>{{ $t(name) }}</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { koulutustyyppiThemeColor, rgb2string } from '@shared/utils/perusteet';
import osaamismerkkiLogoFI from '@assets/img/images/osaamismerkki_main_FI.svg';

const props = defineProps({
  tyyppi: {
    type: Object,
    required: true,
  },
});

const rgbColor = computed(() => {
  return rgb2string(koulutustyyppiThemeColor(props.tyyppi.route.params?.koulutustyyppi));
});

const name = computed(() => {
  return props.tyyppi.name;
});

const icon = computed(() => {
  if (props.tyyppi.name === 'kansalliset-perustaitojen-osaamismerkit') {
    return null;
  }
  else if (props.tyyppi.name === 'opetushallituksen-maaraykset') {
    return 'gavel';
  }
  return 'account_balance';
});

const osaamimerkkiLogo = computed(() => {
  return osaamismerkkiLogoFI;
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

@include shadow-tile;

.tyyppi-tile {
  background: $white;
  color: #212529;
  cursor: pointer;
  border-radius: 10px;
  border: 1px solid $content-header-separator-color;
  width: 385px;
  height: 120px;
  padding-left: 20px;
  padding-right: 20px;
  align-items: center;

  @media(max-width: 767.98px) {
    width: 100%;
  }
}

.ikoni {
  color: $purple-lighten-1;
  text-align: center;

  .img {
    margin: 12px 12px 0 12px;
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
  color: $black;
  font-weight: 600;
}

</style>
