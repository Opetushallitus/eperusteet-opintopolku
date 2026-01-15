<template>
  <EpNotificationBar
    :julkaisu-pvm="julkaisuPvm"
    :has-sisalto-kielelle="hasSisaltoKielelle"
    :max-revision="maxRevision"
  >
    <template v-if="voimassaolo">
      <div
        v-if="voimassaolo === 'tuleva'"
        class="notifikaatio-text"
      >
        <span>{{ $t('katselet-tulevaisuudessa-voimaantulevaa-perustetta', {voimaantulo: $sd(currentJulkaisu.muutosmaarays.voimassaoloAlkaa)}) }} </span>
        <template v-if="uusinVoimassaolevaJulkaisu">
          <span>{{ $t('siirry-talla-hetkella') }} </span>
          <router-link :to="voimassaolevaRoute">
            {{ $t('voimassaolevaan-perusteeseen') }}.
          </router-link>
        </template>
      </div>
      <div
        v-if="voimassaolo === 'voimassa'"
        class="notifikaatio-text"
      >
        <span>{{ $t('katselet-talla-hetkella-voimassaolevaa-perustetta') }}. </span>
        <span class="mr-1">{{ $t('siirry') }}</span>
        <router-link :to="uusimpaanJulkaisuunRoute">
          {{ $t('uusimpaan-perusteeseen') }},
        </router-link>
        <span>{{ $t('joka-on-tulossa-voimaan', {voimaantulo: $sd(uusinJulkaisu.muutosmaarays.voimassaoloAlkaa)}) }}.</span>
      </div>
    </template>
  </EpNotificationBar>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import EpNotificationBar from '@/components/EpNotificationBar/EpNotificationBar.vue';
import { Kielet } from '@shared/stores/kieli';

const props = defineProps({
  julkaisut: {
    type: Array,
    required: false,
    default: () => [],
  },
  peruste: {
    type: Object,
    required: false,
    default: undefined,
  },
});

const route = useRoute();
const router = useRouter();

const julkaisutSorted = computed(() => {
  return _.sortBy(props.julkaisut, 'revision');
});

const julkaisutReversed = computed(() => {
  return _.clone(julkaisutSorted.value).reverse();
});

const ensimmainenTulevaMuutosmaarays = computed(() => {
  return _.find(julkaisutSorted.value, julkaisu => julkaisu.muutosmaarays && julkaisu.muutosmaarays.voimassaoloAlkaa > Date.now());
});

const uusinTulevaMuutosmaarays = computed(() => {
  return _.find(julkaisutReversed.value, julkaisu => julkaisu.muutosmaarays && julkaisu.muutosmaarays.voimassaoloAlkaa > Date.now());
});

const uusinVoimassaolevaJulkaisu = computed(() => {
  return _.find(julkaisutReversed.value, julkaisu => julkaisu.revision < ensimmainenTulevaMuutosmaarays.value.revision);
});

const voimassaolo = computed(() => {
  if (ensimmainenTulevaMuutosmaarays.value) {
    if (currentRevision.value >= ensimmainenTulevaMuutosmaarays.value?.revision) {
      return 'tuleva';
    }

    if (currentRevision.value >= uusinVoimassaolevaJulkaisu.value?.revision) {
      return 'voimassa';
    }
  }

  return undefined;
});

const currentRevision = computed(() => {
  return _.toNumber(route?.params?.revision || _.max(_.map(props.julkaisut, 'revision')));
});

const maxRevision = computed(() => {
  return _.max(_.map(props.julkaisut, 'revision'));
});

const uusinJulkaisu = computed(() => {
  return {
    ..._.last(props.julkaisut),
    muutosmaarays: uusinTulevaMuutosmaarays.value?.muutosmaarays,
  };
});

const currentJulkaisu = computed(() => {
  const currentJulkaisuObj = _.find(props.julkaisut, julkaisu => julkaisu.revision === currentRevision.value);

  if (currentJulkaisuObj) {
    return {
      ...currentJulkaisuObj,
      muutosmaarays: currentJulkaisuObj?.muutosmaarays || _.find(julkaisutReversed.value, j => j.revision < currentJulkaisuObj.revision && j.muutosmaarays)?.muutosmaarays,
    };
  }

  return undefined;
});

const julkaisuPvm = computed(() => {
  return currentJulkaisu.value?.luotu;
});

const hasSisaltoKielelle = computed(() => {
  return _.includes(props.peruste?.kielet, _.toString(Kielet.getSisaltoKieli.value));
});

const voimassaolevaRoute = computed(() => {
  return {
    name: route.name,
    params: { ...route.params, revision: uusinVoimassaolevaJulkaisu.value?.revision },
  };
});

const uusimpaanJulkaisuunRoute = computed(() => {
  return {
    name: route.name,
    params: { ...route.params, revision: '' },
  };
});

</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
