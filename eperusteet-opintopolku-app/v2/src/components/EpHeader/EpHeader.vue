<template>
<div>
  <div class="vari-header" :class="theme">
    <div class="container header">
      <div class="col">
        <div class="murupolku">
          <nav aria-label="breadcrumb">
            <b-breadcrumb :items="items" :class="{ 'black': isBlack, 'white': !isBlack }"></b-breadcrumb>
          </nav>
          <slot name="murupolku"></slot>
        </div>
        <h1 class="nimi" :style="style">
          <slot name="header"></slot>
        </h1>
      </div>
    </div>
  </div>
  <div class="container sisalto">
    <slot></slot>
  </div>
</div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { koulutustyyppiTheme, koulutustyyppiThemeColor, calculateVisibleColor } from '@/utils/perusteet';
import { MurupolkuOsa } from '@/tyypit';

@Component
export default class EpHeader extends Vue {

  @Prop({ required: true })
  private murupolku!: Array<MurupolkuOsa>;

  @Prop({ required: false, type: String })
  private koulutustyyppi!: string;

  get items() {
    return this.murupolku;
  }

  get theme() {
    if (this.koulutustyyppi) {
      return 'koulutustyyppi-' + koulutustyyppiTheme(this.koulutustyyppi);
    }
  }

  get bgColor() {
    return koulutustyyppiThemeColor(this.koulutustyyppi);
  }

  get textColor() {
    return calculateVisibleColor(this.bgColor, 125);
  }

  get isBlack() {
    return this.textColor === 'black';
  }

  get style() {
    return {
      color: this.textColor === 'black' ? '#001A58' : '#fff',
    };
  }
}
</script>


<style scoped lang="scss">
@import '../../styles/_variables.scss';

.vari-header {
  min-height: 238px;
  padding: 80px 0;

  // Todo: käytä muuttujia
  @media (max-width: 991.98px) {
      padding-top: 40px;
      padding-bottom: 40px;
      background: none;
      min-height: 0;
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


  // Murupolku
  nav ol.breadcrumb {
    background: none;
    padding-left: 0;
    padding-right: 0;
    margin: 0;

    li:first-child {
      font-weight: bolder;
    }

    &.black /deep/ li, &.black /deep/ li a {
      color: black;
    }

    &.white /deep/ li, &.white /deep/ li a {
      color: white;
    }
  }

  // Koosteen / perusteen nimi
  h1.nimi {
    margin-top: 0;
    font-weight: bold;
    font-size: 2rem;
    color: #fff;

    @media (max-width: 991.98px) {
      font-size: 1.5rem;
    }
  }

  // Jos nimi tai murupolun osa ei mahdu ruudulle
  .container.header {
    overflow-x: auto;
  }
}

.container.sisalto {
  margin-top: $sisalto-container-margin;
  margin-bottom: $sisalto-container-margin;
}

</style>
