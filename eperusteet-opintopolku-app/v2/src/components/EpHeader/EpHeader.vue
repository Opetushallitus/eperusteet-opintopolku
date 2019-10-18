<template>
<div>
  <div class="kooste-header" :class="theme">
    <div class="container">
      <div class="col">
        <div class="murupolku">
           <nav aria-label="breadcrumb">
            <ol class="breadcrumb" :style="style">
              <li class="breadcrumb-item" :style="style">
                <router-link class="breadcrumb-home" :to="{ name: 'root' }" :style="style">
                  {{ $t('eperusteet') }}
                </router-link>
              </li>
              <li class="breadcrumb-item"
                  :class="{ 'breadcrumb-truncated': idx < murupolku.length - 2 }"
                  v-for="(item, idx) in murupolkuFiltered"
                  :key="idx">
                <router-link class="breadcrumb-normal" :style="style" :to="item.to">
                  {{ item.label }}
                </router-link>
              </li>
            </ol>
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
import Tausta from './Tausta.vue';
import { RawLocation } from 'vue-router';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { koulutustyyppiTheme, koulutustyyppiThemeColor, calculateVisibleColor } from '@/utils/perusteet';
import _ from 'lodash';

export interface Muru {
  label: string;
  to: RawLocation;
}

@Component({
  components: {
    Tausta,
  },
})
export default class EpHeader extends Vue {

  @Prop({ required: true })
  private murupolku!: Muru[];

  @Prop({ required: false })
  private koulutustyyppi!: string;

  get murupolkuFiltered() {
    return _.filter(this.murupolku, (muru) => muru.label && muru.to);
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

  get style() {
    return {
      color: this.textColor === 'black' ? '#001A58' : '#fff',
    };
  }
}
</script>


<style scoped lang="scss">
@import '../../styles/_variables.scss';
$kooste-padding: 80px;

.kooste-header {
  min-height: 238px;
  max-height: 238px;
  position: relative;
  width: 100%;
  padding: 80px 0;
  @media (max-width: 991.98px) {
      padding-top: 40px;
      padding-bottom: 40px;
      background: none;
      min-height: 0px;
  }

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

  .murupolku {
    margin-bottom: 0.5rem;
  }

  h1.nimi {
    margin-top: 0;
    font-weight: bold;
    font-size: 2rem;
    color: #fff;
    @media (max-width: 991.98px) {
      font-size: 1.5rem;
    }
  }

  ol.breadcrumb {
    font-size: 14px;
    background: none;
    margin: 0;
    padding: 0;

    .breadcrumb-home {
      font-weight: bolder;
    }

    .breadcrumb-truncated {
      max-width: 140px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

}

.container.sisalto {
  margin-top: $sisalto-container-margin;
  margin-bottom: $sisalto-container-margin;
}

</style>
