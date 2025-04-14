<template>
  <div>
    <div
      class="vari-header"
      :class="theme"
    >
      <div class="container header">
        <div class="murupolku">
          <nav :aria-label="$t('sijaintisi-sivustolla')">
            <ol
              class="breadcrumb"
              :class="{ 'black': isBlack, 'white': !isBlack }"
            >
              <li class="breadcrumb-item">
                <router-link
                  class="breadcrumb-home"
                  :to="{ name: 'root' }"
                  :aria-label="$t('etusivu')"
                >
                  <EpMaterialIcon size="20px">
                    home
                  </EpMaterialIcon>
                </router-link>
              </li>
              <li
                v-for="(item, idx) in murupolkuFiltered"
                :key="idx"
                class="breadcrumb-item"
              >
                <router-link
                  v-if="item.location"
                  class="breadcrumb-normal"
                  :to="item.location"
                >
                  {{ $kaannaOlioTaiTeksti(item.label) }}
                </router-link>
                <span
                  v-else
                  class="breadcrumb-normal"
                >
                  {{ $kaannaOlioTaiTeksti(item.label) }}
                </span>
              </li>
            </ol>
          </nav>
          <slot name="murupolku" />
        </div>
        <h1
          class="nimi"
          :style="style"
          tabindex="0"
        >
          <slot name="header" />
        </h1>
        <div :style="style">
          <slot name="subheader" />
        </div>
      </div>
    </div>
    <div
      v-if="$slots['default']"
      id="main"
      class="container-lg sisalto"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {
  koulutustyyppiTheme,
  koulutustyyppiThemeColor,
  calculateVisibleColor,
  kouluturtyyppiRyhmat,
} from '@shared/utils/perusteet';
import { MurupolkuOsa } from '@/tyypit';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import _ from 'lodash';

@Component({
  components: {
    EpMaterialIcon,
  },
})
export default class EpHeader extends Vue {
  @Prop({ required: true })
  private murupolku!: MurupolkuOsa[];

  @Prop({ required: false, type: String })
  private koulutustyyppi!: string;

  @Prop({ required: false, type: String })
  private tyyppi!: string;

  get murupolkuFiltered() {
    return _.filter(this.murupolku, (muru) => muru.label && muru.type !== 'root');
  }

  get theme() {
    if (this.koulutustyyppi) {
      return 'koulutustyyppi-' + koulutustyyppiTheme(this.koulutustyyppi);
    }
    else if (this.routeKoulutustyyppi && _.includes(kouluturtyyppiRyhmat, this.routeKoulutustyyppi)) {
      return 'koulutustyyppi-' + this.routeKoulutustyyppi;
    }
    if (this.tyyppi) {
      return 'tyyppi-' + this.tyyppi;
    }
  }

  get routeKoulutustyyppi() {
    return this.$route?.params?.koulutustyyppi;
  }

  get bgColor() {
    return koulutustyyppiThemeColor(this.koulutustyyppi || this.tyyppi || this.routeKoulutustyyppi);
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
  padding: 50px 0;

  // .header {
    // padding-left: 10px;
  // }

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

    .header {
      padding: 0 10px !important;
    }
  }

  // Taustat
  background-repeat: no-repeat;
  background-color: $uutiset-header-background;
  background-position-x: right;

  &.koulutustyyppi-ammatillinen {
    background-color: $koulutustyyppi-ammatillinen-color;
    background-image: url('@assets/img/banners/opintopolku/aallot_ammatillinen.svg');
  }
  &.koulutustyyppi-esiopetus {
    background-color: $koulutustyyppi-esiopetus-color;
    background-image: url('@assets/img/banners/opintopolku/aallot_esiopetus.svg');
  }
  &.koulutustyyppi-lukiokoulutus {
    background-color: $koulutustyyppi-lukiokoulutus-color;
    background-image: url('@assets/img/banners/opintopolku/aallot_lukio.svg');
  }
  &.koulutustyyppi-perusopetus {
    background-color: $koulutustyyppi-perusopetus-color;
    background-image: url('@assets/img/banners/opintopolku/aallot_perusopetus.svg');
  }
  &.koulutustyyppi-varhaiskasvatus {
    background-color: $koulutustyyppi-varhaiskasvatus-color;
    background-image: url('@assets/img/banners/opintopolku/aallot_varhaiskasvatus.svg');
  }
  &.koulutustyyppi-taiteenperusopetus {
    background-color: $koulutustyyppi-taiteenperusopetus-color;
    background-image: url('@assets/img/banners/opintopolku/aallot_taiteenperusopetus.svg');
  }
  &.koulutustyyppi-vapaasivistystyo {
    background-color: $koulutustyyppi-vapaasivistystyo-color;
    background-image: url('@assets/img/banners/opintopolku/aallot_vapaasivistystyo.svg');
  }
  &.koulutustyyppi-tutkintoonvalmentava {
    background-color: $koulutustyyppi-tutkintoonvalmentava-color;
    background-image: url('@assets/img/banners/opintopolku/aallot_tuva.svg');
  }
  &.koulutustyyppi-kotoutumiskoulutus {
    background-color: $koulutustyyppi-kotoutumiskoulutus-color;
    background-image: url('@assets/img/banners/opintopolku/aallot_kotoutumiskoulutus.svg');
  }

  &.koulutustyyppi-muukoulutus {
    background-color: $koulutustyyppi-muu-color;
    background-image: url('@assets/img/banners/opintopolku/aallot_muukoulutus.svg');
  }

  &.tyyppi-digitaalinen_osaaminen {
    background-color: $digitaalinen-osaaminen-color;
  }

  &.tyyppi-yhteinen {
    background-color: $koulutustyyppi-ammatillinen-color;
    background-image: url('@assets/img/banners/opintopolku/aallot_ammatillinen.svg');
  }

  &.tyyppi-maarayskokoelma {
    background-color: $white;
    background-image: url('@assets/img/banners/opintopolku/aallot_maarayskokoelma.svg'), url('@assets/img/banners/opintopolku/aallot_maarayskokoelma_tausta.svg');
    background-repeat: no-repeat, repeat;
    background-position: right top, left top;
    background-size: auto auto, auto 100%;
    margin-top: -2px;

    @media (max-width: 991.98px) {
      background-size: auto 160px, auto 100%;
    }
    // Todo: käytä muuttujia
    @media (max-width: 767.98px) {
      background-size: auto 80px, auto 100%;
    }
  }

  // Murupolku
  nav ol.breadcrumb {
    font-size: 14px;
    background: none;
    padding-left: 0;
    padding-right: 0;
    margin: 0;

    li {
      font-weight: 600;
      align-self: end
    }

    li:last-child {
      font-weight: 400;
      align-self: end
    }

    &.black ::v-deep li, &.black ::v-deep li::before, &.black ::v-deep li a {
      color: #001A58;
    }

    &.white ::v-deep li, &.white ::v-deep li::before, &.white ::v-deep li a {
      color: white;
    }
    .router-link-exact-active.router-link-active {
      cursor: auto;
    }

    @media (max-width: 991.98px) {
      font-size: 16px;
      display: block;

      .breadcrumb-item {
        padding-left: 0;
        content: '';
        margin-bottom: 10px;
        &::before {
          content: '';
        }
      }
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
