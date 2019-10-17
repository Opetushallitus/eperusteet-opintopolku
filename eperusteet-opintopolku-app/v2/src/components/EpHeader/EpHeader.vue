<template>
  <div>
    <div class="kooste-header">
      <div class="container">
        <div class="murupolku">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <router-link class="breadcrumb-home" :to="{ name: 'root' }">
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
        <h1 class="nimi">
          <slot name="header"></slot>
        </h1>
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
import { Component, Vue, Prop } from 'vue-property-decorator';
import { koulutustyyppiTheme } from '@/utils/perusteet';

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

}
</script>


<style scoped lang="scss">
@import '../../styles/_variables.scss';

.kooste-header {
  height: 238px;
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
    padding-top: 81px;
    height: 119px;
  }

  h1.nimi {
    margin-top: 0;
    height: 75px;
    font-weight: bold;
    font-size: 32px;
    color: #fff;
  }

  ol.breadcrumb {
    font-size: 14px;
    background: none;
    margin: 0;
    padding: 0;

    .breadcrumb-home {
      color: #fff;
      font-weight: bolder;
    }

    .breadcrumb-normal {
      color: #fff;
    }
  }
}

.container.sisalto {
  margin-top: $sisalto-container-margin;
  margin-bottom: $sisalto-container-margin;
}

</style>
