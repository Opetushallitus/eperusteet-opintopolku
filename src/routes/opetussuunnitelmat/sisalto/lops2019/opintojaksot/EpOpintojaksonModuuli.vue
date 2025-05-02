<template>
  <div v-if="moduuli && moduuli.node && moduuli.node.location">
    <router-link
      class="moduulibox"
      role="button"
      :to="moduuli.node.location"
      tabindex="0"
    >
      <div class="name">
        {{ $kaanna(moduuli.node.label) }} ({{ moduuli.node.meta.koodi.arvo }})
      </div>
      <div class="bottom">
        <div class="d-flex bd-highlight">
          <div class="px-2 flex-grow-1" />
          <div class="px-2 info">
            <span class="op">{{ moduuli.node.meta.laajuus }} {{ $t('opintopiste') }}</span>
            <ep-color-indicator :kind="moduuli.node.meta.pakollinen ? 'pakollinen' : 'valinnainen'" />
          </div>
        </div>
      </div>
    </router-link>
  </div>
  <div v-else-if="moduuli">
    <h3
      class="otsikko"
    >
      {{ $kaanna(moduuli.nimi) + (koodi ? ' (' + koodi.arvo + ')' : '') }}
    </h3>

    <div class="teksti">
      <moduuli-esitys
        :moduuli="moduuli"
        :termit="perusteTermit"
        :kuvat="perusteKuvat"
        :is-peruste-view="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import { Lops2019ModuuliDto } from '@shared/api/eperusteet';
import { getCachedOpetussuunnitelmaStore } from '@/stores/OpetussuunnitelmaCacheStore';
import ModuuliEsitys from '@shared/components/EpOpintojaksonModuuli/ModuuliEsitys.vue';
import { $kaanna } from '@shared/utils/globals';

const props = defineProps({
  opetussuunnitelmaDataStore: {
    type: Object as () => OpetussuunnitelmaDataStore,
    required: true,
  },
  moduuli: {
    type: Object as () => Lops2019ModuuliDto,
    required: true,
  },
});

const koodi = computed(() => {
  if (props.moduuli) {
    return props.moduuli.koodi;
  }
  return undefined;
});

const perusteTermit = computed(() => {
  return opetussuunnitelmaDataStore.perusteTermit;
});

const perusteKuvat = computed(() => {
  return opetussuunnitelmaDataStore.perusteKuvat;
});
</script>

<style lang="scss" scoped>
@import '@shared/styles/_variables.scss';

.moduulibox {
  background-image: url('../../../../../../public/img/banners/moduuli.svg');
  height: 161px;
  margin: 0;
  padding: 20px 10px 44px 20px;
  position: relative;
  width: 158px;
  color: $blue-darken-1;
  user-select: none;
  cursor: pointer;
  display: block;

  .name {
    font-weight: bold;
    max-height: 76px;

    &::-webkit-scrollbar {
      width: 0.5em;
    }
    &::-webkit-scrollbar-track {
      background-color: $blue-lighten-4;
    }
    &::-webkit-scrollbar-thumb {
      background-color: $blue-lighten-3;
      border-radius: 0.5em;
    }
  }

  .bottom {
    width: 100%;
    padding: 10px;
    position: absolute;
    left: 0;
    bottom: 0;

    .icon {
      display: inline-block;
      outline: none;
    }

    .icon-editing {
      cursor: pointer;
    }

    .info {
      .op {
        padding: 0 5px 0 0;
      }
    }
  }
}
</style>
