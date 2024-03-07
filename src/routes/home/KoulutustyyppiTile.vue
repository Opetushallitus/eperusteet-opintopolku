<template>
  <div class="tyyppi-tile tile-background-shadow-selected shadow-tile mb-3">
    <router-link :to="tyyppi.route">
      <div class="p-2">
        <div class="ikoni">
          <EpMaterialIcon v-if="icon"
                          icon-shape="outlined"
                          size="38px"
                          class="img"
                          :style="iconGradient">{{icon}}</EpMaterialIcon>
          <img v-else :src="osaamimerkkiLogo" :alt="$t('osaamismerkit')" class="img"/>
        </div>
        <div class="nimi">
          <span>{{ name }}</span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { koulutustyyppiThemeColor, rgbCode } from '@shared/utils/perusteet';
import osaamismerkkiLogoFI from '@assets/img/images/osaamismerkki_main_FI.svg';

@Component({
  components: {},
})
export default class KoulutustyyppiTile extends Vue {
  @Prop({ required: true })
  private tyyppi!: any;

  get rgbColor() {
    return rgbCode(koulutustyyppiThemeColor(this.tyyppi.route.params?.koulutustyyppi));
  }

  get iconGradient() {
    return `background-image: linear-gradient(120deg, rgba(${this.rgbColor},1), rgba(${this.rgbColor},0.4))`;
  }

  get name() {
    return this.$t(this.tyyppi.name);
  }

  get icon() {
    if (this.tyyppi.name === 'kansalliset-perustaitojen-osaamismerkit') {
      return null;
    }
    else if (this.tyyppi.name === 'opetushallituksen-maaraykset') {
      return 'gavel';
    }
    return 'account_balance';
  }

  get osaamimerkkiLogo() {
    return osaamismerkkiLogoFI;
  }
}
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
  width: 395px;
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
    background-clip: text;
    -webkit-text-fill-color: transparent;
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
  color: $black;
  font-weight: 600;
}

</style>
