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
      v-if="hasDefaultSlot"
      id="main"
      class="container-lg sisalto"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  koulutustyyppiTheme,
  koulutustyyppiThemeColor,
  calculateVisibleColor,
  kouluturtyyppiRyhmat,
} from '@shared/utils/perusteet';
import { MurupolkuOsa } from '@/tyypit';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import _ from 'lodash';
import { hasSlotContent } from '@shared/utils/vue-utils';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useSlots } from 'vue';
import { $kaannaOlioTaiTeksti, $t } from '@shared/utils/globals';

const props = defineProps<{
  murupolku: MurupolkuOsa[];
  koulutustyyppi?: string;
  tyyppi?: string;
}>();

const slots = useSlots();
const route = useRoute();

const hasDefaultSlot = computed(() => {
  return hasSlotContent(slots.default);
});

const murupolkuFiltered = computed(() => {
  return _.filter(props.murupolku, (muru) => muru.label && muru.type !== 'root');
});

const routeKoulutustyyppi = computed(() => {
  return route?.params?.koulutustyyppi as string | undefined;
});

const theme = computed(() => {
  if (props.koulutustyyppi) {
    return 'koulutustyyppi-' + koulutustyyppiTheme(props.koulutustyyppi);
  }
  else if (routeKoulutustyyppi.value && _.includes(kouluturtyyppiRyhmat, routeKoulutustyyppi.value)) {
    return 'koulutustyyppi-' + routeKoulutustyyppi.value;
  }
  if (props.tyyppi) {
    return 'tyyppi-' + props.tyyppi;
  }
  return '';
});

const bgColor = computed(() => {
  return koulutustyyppiThemeColor(props.koulutustyyppi || props.tyyppi || routeKoulutustyyppi.value);
});

const textColor = computed(() => {
  return calculateVisibleColor(bgColor.value, 125);
});

const isBlack = computed(() => {
  return textColor.value === 'black';
});

const style = computed(() => {
  return {
    color: isBlack.value ? '#001A58' : '#fff',
  };
});
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

    &.black :deep(li), &.black :deep(li::before), &.black :deep(li a) {
      color: #001A58;
    }

    &.white :deep(li), &.white :deep(li::before), &.white :deep(li a) {
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
