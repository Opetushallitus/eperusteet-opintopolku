<template>
  <div>
    <div class="kooste-header">
      <div class="container">
        <div class="col">
          <div class="murupolku">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <router-link class="breadcrumb-home" :to="{ name: 'root' }" :style="{ color: textColor }">
                    {{ $t('eperusteet') }}
                  </router-link>
                </li>
                <li class="breadcrumb-item" v-for="(item, idx) in murupolku" :key="idx">
                  <router-link class="breadcrumb-normal" :to="item.to">{{ item.name }}</router-link>
                </li>
              </ol>
            </nav>
            <slot name="murupolku"></slot>
          </div>
          <h1 class="nimi" :style="{ color: nimiColor }">
            <slot name="header"></slot>
          </h1>
        </div>
      </div>
      <div class="bg-left" :class="theme"></div>
      <div class="bg-right" :class="theme"></div>
    </div>
    <div class="container sisalto">
      <slot></slot>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { koulutustyyppiTheme, koulutustyyppiThemeColor, calculateVisibleColor } from '@/utils/perusteet';

@Component
export default class EpHeader extends Vue {

  @Prop({ required: true })
  private murupolku!: Array<any>;

  @Prop({ required: false })
  private koulutustyyppi!: string;

  get theme() {
    if (this.koulutustyyppi) {
      return 'koulutustyyppi-' + koulutustyyppiTheme(this.koulutustyyppi);
    }
    else {
      return 'default';
    }
  }

  get bgColor() {
    return koulutustyyppiThemeColor(this.koulutustyyppi);
  }

  get textColor() {
    return calculateVisibleColor(this.bgColor, 125);
  }

  get nimiColor() {
    if (this.textColor === 'black') {
      return '#001A58';
    }
    else {
      return 'white';
    }
  }
}
</script>


<style scoped lang="scss">
@import '../../styles/_variables.scss';

.kooste-header {
  min-height: 238px;
  background-repeat: no-repeat;
  position: relative;
  width: 100%;

  .bg-left {
    left: 0;
    top: 0;
    bottom: 0;
    position: absolute;
    width: calc(100vw - 1440px);
    z-index: -1000;

    &.koulutustyyppi-ammatillinen {
      background-color: #008800;
    }

    &.koulutustyyppi-esiopetus {
      background-color: #84d2ff;
    }

    &.koulutustyyppi-lukio {
      background-color: #0143da;
    }

    &.koulutustyyppi-perusopetus {
      background-color: #67cccc;
    }

    &.koulutustyyppi-varhaiskasvatus {
      background-color: #ffcc33;
    }

    &.default {
      background-color: $uutiset-header-background;
    }
  }

  .bg-right {
    background-position: right;
    right: 0;
    top: 0;
    bottom: 0;
    position: absolute;
    width: 1440px;
    z-index: -1000;

    &.koulutustyyppi-ammatillinen {
      background-image: url('../../../public/img/banners/aallot_ammatillinen.svg');
    }

    &.koulutustyyppi-esiopetus {
      background-image: url('../../../public/img/banners/aallot_esiopetus.svg');
    }

    &.koulutustyyppi-lukio {
      background-image: url('../../../public/img/banners/aallot_lukio.svg');
    }

    &.koulutustyyppi-perusopetus {
      background-image: url('../../../public/img/banners/aallot_perusopetus.svg');
    }

    &.koulutustyyppi-varhaiskasvatus {
      background-image: url('../../../public/img/banners/aallot_varhaiskasvatus.svg');
    }

    &.default {
      background-color: $uutiset-header-background;
    }
  }

  .murupolku {
    padding-top: 80px;
    padding-bottom: 1rem;

    @media (max-width: 991.98px) {
      padding-top: 40px;
    }
  }

  h1.nimi {
    margin-top: 0;
    font-weight: bold;
    font-size: 2rem;
    color: #001A58;

    @media (max-width: 991.98px) {
      font-size: 1.5rem;
    }
  }

  ol.breadcrumb {
    background: none;
    margin: 0;
    padding: 0;

    .breadcrumb-home {
      font-weight: bolder;
    }
  }
}

.container.sisalto {
  margin-top: $sisalto-container-margin;
  margin-bottom: $sisalto-container-margin;
}

</style>
