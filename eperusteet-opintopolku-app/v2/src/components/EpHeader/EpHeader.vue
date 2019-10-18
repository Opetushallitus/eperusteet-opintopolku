<template>
  <div>
    <div class="kooste-header" :class="theme">
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

$kooste-padding: 80px;

.kooste-header {
  min-height: 238px;
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
