<template>
  <div
    v-if="hasNotification"
    id="notification-bar"
    ref="stickyElement"
    v-sticky="{ zIndex: 5000, top: `${sidenavHeight}px` }"
    class="notifikaatio justify-center py-3 korostus"
    :class="notifikaatioClass"
  >
    <EpMaterialIcon
      icon-shape="outlined"
      class="mr-2"
    >
      info
    </EpMaterialIcon>
    <slot>
      <span class="notifikaatio-text">{{ notifikaatio }}</span>
      <div v-if="!isEsikatselu && versio && hasSisaltoKielelle">
        <router-link :to="uusinRoute">
          {{ $t('siirry-uusimpaan-julkaisuun') }}.
        </router-link>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, useSlots, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as _ from 'lodash';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { $t, $sd } from '@shared/utils/globals';
import { hasSlotContent } from '@shared/utils/vue-utils';

import { useTemplateRef } from 'vue';

const props = defineProps({
  julkaisuPvm: {
    type: [String, Number, Date, Object],
    required: false,
    default: undefined,
  },
  hasSisaltoKielelle: {
    type: Boolean,
    required: false,
    default: true,
  },
  maxRevision: {
    type: Number,
    required: false,
    default: undefined,
  },
});

const route = useRoute();
const router = useRouter();
const slots = useSlots();

const sidenavHeight = computed(() => {
  const element = document.querySelector('.ep-julkinen-sidenav');
  return element ? element.getBoundingClientRect().height : 0;
});

const hasNotification = computed(() => {
  return notifikaatio.value || hasDefaultSlotContent.value;
});

const notifikaatioClass = computed(() => {
  return isEsikatselu.value ? 'esikatselu' : 'katselu';
});

const isEsikatselu = computed(() => {
  return versio.value === '0';
});

const versio = computed(() => {
  return route.params?.revision as string;
});

const tyyppi = computed((): 'peruste' | 'suunnitelma' => {
  return (route.params?.perusteId ? 'peruste' : 'suunnitelma');
});

const notifikaatio = computed(() => {
  if (isEsikatselu.value) {
    if (tyyppi.value === 'peruste') {
      return $t('olet-esikastelutilassa-perustetta-ei-ole-viela-julkaistu');
    }
    else {
      return $t('olet-esikatselutilassa-suunnitelmaa-ei-ole-viela-julkaistu');
    }
  }

  if (!props.hasSisaltoKielelle) {
    return $t('sisaltoa-ei-saatavilla');
  }

  if (versio.value && (!props.maxRevision || _.toNumber(versio.value) < props.maxRevision)) {
    if (tyyppi.value === 'peruste' && props.julkaisuPvm) {
      return `${$t('katselet-perusteen-aiempaa-julkaisua')}${julkaisuPvmText.value}`;
    }

    if (tyyppi.value === 'suunnitelma') {
      return `${$t('katselet-suunnitelman-vanhentunutta-versiota')} (${versio.value}).`;
    }
  }

  return undefined;
});

const julkaisuPvmText = computed(() => {
  return props.julkaisuPvm ? ' (' + $sd(props.julkaisuPvm) + ').' : '.';
});

const routeName = computed(() => {
  if (route.params.perusteId) {
    return 'peruste';
  }

  if (route.params.opetussuunnitelmaId) {
    return 'opetussuunnitelma';
  }

  if (route.params.toteutussuunnitelmaId) {
    return 'toteutussuunnitelma';
  }

  return route.name;
});

const uusinRoute = computed(() => {
  return {
    name: routeName.value,
    params: { ...route.params, revision: '' },
  };
});

const hasDefaultSlotContent = computed(() => {
  return hasSlotContent(slots.default);
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .notifikaatio {
    width: 100% !important;
    display: flex;

    &.esikatselu {
      background-color: $grey50;
    }

    &.katselu {
      background-color: $lightBlue2;
    }

    .notifikaatio-text {
      margin: 0 5px 0 5px;
    }

    &.korostus, .korostus {
      font-weight: 600 !important;
    }
  }

</style>
