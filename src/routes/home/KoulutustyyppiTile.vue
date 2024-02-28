<template>
  <div class="tyyppi-tile tile-background-shadow-selected shadow-tile mb-3">
    <router-link :to="tyyppi.route">
      <div class="p-2">
        <div class="ikoni">
          <EpMaterialIcon v-if="icon"
                          icon-shape="outlined"
                          :color="rgbColor"
                          size="38px"
                          class="img">{{icon}}</EpMaterialIcon>
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
import { koulutustyyppiThemeColor, rgb2string } from '@shared/utils/perusteet';
import osaamismerkkiLogoFI from '@assets/img/images/osaamismerkki_main_FI.svg';

@Component({
  components: {},
})
export default class KoulutustyyppiTile extends Vue {
  @Prop({ required: true })
  private tyyppi!: any;

  get rgbColor() {
    return rgb2string(koulutustyyppiThemeColor(this.tyyppi.route.params?.koulutustyyppi));
  }

  get name() {
    if (this.tyyppi.name === 'tutkintoonvalmentava') {
      return this.$t('koulutustyyppi-' + this.tyyppi.name);
    }
    else if (this.tyyppi.name === 'kotoutumiskoulutus') {
      return this.$t('koulutustyyppi-' + this.tyyppi.name);
    }
    else if (this.tyyppi.name === 'muukoulutus') {
      return this.$t('jotpa-rahoitteinen-koulutus');
    }
    return this.$t(this.tyyppi.name);
  }

  get icon() {
    if (this.tyyppi.name === 'osaamismerkit') {
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
@import '@shared/styles/_mixins.scss';

@include shadow-tile;

.tyyppi-tile {
  color: #212529;
  cursor: pointer;
  border-radius: 10px;
  border: 1px solid #E7E7E7;
  width: 380px;
  height: 120px;
  padding-left: 20px;
  padding-right: 20px;
  align-items: center;

  @media(max-width: 767.98px) {
    width: 100%;
  }
}

.ikoni {
  color: #EDA0DF;
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

</style>
