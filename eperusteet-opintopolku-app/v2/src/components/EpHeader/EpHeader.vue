<template>
<div>
  <div class="vari-header" :class="theme">
    <div class="container header">
      <div class="col">
        <div class="murupolku">
           <nav aria-label="breadcrumb">
             <ol class="breadcrumb" :class="{ 'black': isBlack, 'white': !isBlack }">
               <li class="breadcrumb-item">
                 <router-link class="breadcrumb-home" :to="{ name: 'root' }">
                   {{ $t('eperusteet') }}
                 </router-link>
               </li>
               <li class="breadcrumb-item"
                   v-for="(item, idx) in murupolkuFiltered"
                   :key="idx">
                 <router-link class="breadcrumb-normal" :to="item.location" v-if="item.location">
                   {{ $kaannaOlioTaiTeksti(item.label) }}
                 </router-link>
                 <span v-else class="breadcrumb-normal">
                   {{ $kaannaOlioTaiTeksti(item.label) }}
                 </span>
               </li>
             </ol>
          </nav>
          <slot name="murupolku"></slot>
        </div>
        <h1 class="nimi" :style="style">
          <slot name="header"></slot>
        </h1>
        <div :style="style">
          <slot name="subheader" />
        </div>
      </div>
    </div>
  </div>
  <div id="main" class="container-lg sisalto" v-if="$slots['default']">
    <slot></slot>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { koulutustyyppiTheme, koulutustyyppiThemeColor, calculateVisibleColor } from '@shared/utils/perusteet';
import { MurupolkuOsa } from '@/tyypit';
import _ from 'lodash';

@Component
export default class EpHeader extends Vue {
  @Prop({ required: true })
  private murupolku!: MurupolkuOsa[];

  @Prop({ required: false, type: String })
  private koulutustyyppi!: string;

  @Prop({ required: false, type: String })
  private tyyppi!: string;

  get murupolkuFiltered() {
    return _.filter(this.murupolku, (muru) => muru.label);
  }

  get theme() {
    if (this.koulutustyyppi) {
      return 'koulutustyyppi-' + koulutustyyppiTheme(this.koulutustyyppi);
    }
    if (this.tyyppi) {
      return 'tyyppi-' + this.tyyppi;
    }
  }

  get bgColor() {
    return koulutustyyppiThemeColor(this.koulutustyyppi || this.tyyppi);
  }

  get textColor() {
    return calculateVisibleColor(this.bgColor, 125);
  }

  get isBlack() {
    return this.textColor === 'black';
  }

  get style() {
    return {
      color: this.isBlack ? '#001A58' : '#fff',
    };
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.vari-header {
  min-height: 238px;
  padding: 80px 0;

  // Todo: käytä muuttujia
  @media (max-width: 991.98px) {
    padding-top: 40px;
    padding-bottom: 40px;
    min-height: 0;
    background-size: auto 160px;
  }
  // Todo: käytä muuttujia
  @media (max-width: 767.98px) {
    background-size: auto 80px;
  }

  // Taustat
  background-repeat: no-repeat;
  background-color: $uutiset-header-background;
  background-position-x: right;

  &.koulutustyyppi-ammatillinen {
    background-color: $koulutustyyppi-ammatillinen-color;
    background-image: url('../../../public/img/banners/aallot_ammatillinen.svg');
  }
  &.koulutustyyppi-esiopetus {
    background-color: $koulutustyyppi-esiopetus-color;
    background-image: url('../../../public/img/banners/aallot_esiopetus.svg');
  }
  &.koulutustyyppi-lukio {
    background-color: $koulutustyyppi-lukio-color;
    background-image: url('../../../public/img/banners/aallot_lukio.svg');
  }
  &.koulutustyyppi-perusopetus {
    background-color: $koulutustyyppi-perusopetus-color;
    background-image: url('../../../public/img/banners/aallot_perusopetus.svg');
  }
  &.koulutustyyppi-varhaiskasvatus {
    background-color: $koulutustyyppi-varhaiskasvatus-color;
    background-image: url('../../../public/img/banners/aallot_varhaiskasvatus.svg');
  }
  &.koulutustyyppi-taiteenperusopetus {
    background-color: $koulutustyyppi-taiteenperusopetus-color;
    background-image: url('../../../public/img/banners/aallot_taiteenperusopetus.svg');
  }
  &.koulutustyyppi-vapaasivistystyo {
    background-color: $koulutustyyppi-vapaasivistystyo-color;
    background-image: url('../../../public/img/banners/aallot_vapaasivistystyo.svg');
  }
  &.koulutustyyppi-tutkintoonvalmentava {
    background-color: $koulutustyyppi-tutkintoonvalmentava-color;
    background-image: url('../../../public/img/banners/aallot_tuva.svg');
  }
  &.koulutustyyppi-kotoutumiskoulutus {
    background-color: $koulutustyyppi-kotoutumiskoulutus-color;
    background-image: url('../../../public/img/banners/aallot_kotoutumiskoulutus.svg');
  }

  &.koulutustyyppi-muukoulutus {
    background-color: $koulutustyyppi-muu-color;
    background-image: url('../../../public/img/banners/aallot_muukoulutus.svg');
  }

  &.tyyppi-digitaalinen_osaaminen {
    background-color: $digitaalinen-osaaminen-color;
    background-image: url('../../../public/img/banners/banner_digitaalinen_osaaminen.svg');
  }

  // Murupolku
  nav ol.breadcrumb {
    background: none;
    padding-left: 0;
    padding-right: 0;
    margin: 0;

    li {
      font-weight: 600;
    }

    li:last-child {
      font-weight: 400;
    }

    &.black /deep/ li, &.black /deep/ li::before, &.black /deep/ li a {
      color: #001A58;
    }

    &.white /deep/ li, &.white /deep/ li::before, &.white /deep/ li a {
      color: white;
    }
    .router-link-exact-active.router-link-active {
      cursor: auto;
    }
  }

  // Koosteen / perusteen nimi
  h1.nimi {
    margin-top: 0;
    font-weight: 500;
    color: #fff;
    font-family: 'Poppins';

    @media (max-width: 991.98px) {
      font-size: 1.5rem;
    }
  }

  // Jos nimi tai murupolun osa ei mahdu ruudulle
  .container-lg.header {
    overflow-x: auto;
  }
}

.container-lg.sisalto {
  margin-top: $sisalto-container-margin;
  margin-bottom: $sisalto-container-margin;
}

</style>
