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
        <span>{{ $t(kaannokset['katselet-tulevaisuudessa-voimaantulevaa'], {voimaantulo: $sd(currentJulkaisu.muutosmaarays.voimassaoloAlkaa)}) }} </span>
        <template v-if="uusinVoimassaolevaJulkaisu && voimassaolevaRoute">
          <span>{{ $t('siirry-talla-hetkella') }} </span>
          <router-link :to="voimassaolevaRoute">
            {{ $t(kaannokset['voimassaolevaan']) }}.
          </router-link>
        </template>
      </div>
      <div
        v-if="voimassaolo === 'voimassa'"
        class="notifikaatio-text"
      >
        <span>{{ $t(kaannokset['katselet-talla-hetkella-voimassaolevaa']) }}. </span>

        <template v-if="uusimpaanJulkaisuunRoute">
          <span class="mr-1">{{ $t('siirry') }}</span>
          <router-link :to="uusimpaanJulkaisuunRoute">
            {{ $t(kaannokset['uusimpaan']) }},
          </router-link>
          <span>{{ $t('joka-on-tulossa-voimaan', {voimaantulo: $sd(uusinJulkaisu.muutosmaarays.voimassaoloAlkaa)}) }}.</span>
        </template>
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
import { JulkaisuBaseDto } from '@shared/api/eperusteet';
import { OpetussuunnitelmanJulkaisuKevytDto } from '@shared/api/ylops';

interface PerusteProps {
  viimeisinJulkaisuAika?: string | number;
  kielet?: string[];
}

const props = withDefaults(
  defineProps<{
    perusteenJulkaisut?: JulkaisuBaseDto[];
    opetussuunnitelmanJulkaisut?: OpetussuunnitelmanJulkaisuKevytDto[];
    peruste?: PerusteProps;
    hasSisaltoKielelle?: boolean;
  }>(),
  {
    perusteenJulkaisut: () => [],
    opetussuunnitelmanJulkaisut: () => [],
    hasSisaltoKielelle: true,
  },
);

const route = useRoute();
const router = useRouter();

const julkaisutSorted = computed(() => {
  return _.sortBy(props.perusteenJulkaisut, 'revision');
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
  const firstRevision = ensimmainenTulevaMuutosmaarays.value?.revision;
  if (firstRevision == null) return undefined;
  return _.find(julkaisutReversed.value, julkaisu => julkaisu.revision! < firstRevision);
});

const voimassaOlevatPerusteenJulkaisut = computed(() => {
  const firstRevision = ensimmainenTulevaMuutosmaarays.value?.revision;
  if (firstRevision == null) return undefined;
  return _.filter(julkaisutReversed.value, julkaisu => julkaisu.revision! < firstRevision);
});

const voimassaolo = computed(() => {
  if (route.params.revision === '0') {
    return undefined;
  }

  if (ensimmainenTulevaMuutosmaarays.value) {
    if (currentRevision.value >= ensimmainenTulevaMuutosmaarays.value?.revision) {
      return 'tuleva';
    }

    if (sisaltoTyyppi.value === 'peruste'
      && currentRevision.value >= uusinVoimassaolevaJulkaisu.value?.revision
    ) {
      return 'voimassa';
    }

    if (sisaltoTyyppi.value === 'opetussuunnitelma'
      && uusimpaanJulkaisuunRoute.value
      && route.params.revision === _.toString(voimassaOlevaOpetussuunnitelmaJulkaisu.value?.revision)
    ) {
      return 'voimassa';
    }
  }

  return undefined;
});

const currentRevision = computed(() => {
  return _.get(_.find(props.perusteenJulkaisut, julkaisu => julkaisu.luotu === props.peruste?.viimeisinJulkaisuAika), 'revision');
});

const maxRevision = computed(() => {
  if (sisaltoTyyppi.value === 'peruste') {
    return _.max(_.map(props.perusteenJulkaisut, 'revision'));
  }

  if (sisaltoTyyppi.value === 'opetussuunnitelma') {
    return _.max(_.map(props.opetussuunnitelmanJulkaisut, 'revision'));
  }

  return undefined;
});

const uusinJulkaisu = computed(() => {
  return {
    ..._.last(props.perusteenJulkaisut),
    muutosmaarays: uusinTulevaMuutosmaarays.value?.muutosmaarays,
  };
});

const currentJulkaisu = computed(() => {
  const currentJulkaisuObj = _.find(props.perusteenJulkaisut, julkaisu => julkaisu.revision === currentRevision.value);

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

const voimassaolevaRoute = computed(() => {
  if (sisaltoTyyppi.value === 'peruste') {
    return {
      name: 'peruste',
      params: { ...route.params, revision: uusinVoimassaolevaJulkaisu.value?.revision },
    };
  }

  if (sisaltoTyyppi.value === 'opetussuunnitelma' && voimassaOlevaOpetussuunnitelmaJulkaisu.value) {
    return {
      name: 'opetussuunnitelma',
      params: { ...route.params, revision: voimassaOlevaOpetussuunnitelmaJulkaisu.value?.revision },
    };
  }

  return undefined;
});

const uusimpaanJulkaisuunRoute = computed(() => {
  if (sisaltoTyyppi.value === 'peruste' && !!route.params.revision) {
    return {
      name: 'peruste',
      params: { ...route.params, revision: '' },
    };
  }

  if (sisaltoTyyppi.value === 'opetussuunnitelma' && !!route.params.revision) {
    return {
      name: 'opetussuunnitelma',
      params: { ...route.params, revision: '' },
    };
  }

  return undefined;
});

const sisaltoTyyppi = computed(() => {
  return _.some(route.matched, route => route.name === 'peruste') ? 'peruste' : 'opetussuunnitelma';
});

const kaannokset = computed(() => {
  return sisaltoTyyppiKaannokset.value[sisaltoTyyppi.value];
});

const sisaltoTyyppiKaannokset = computed(() => {
  return {
    'peruste': {
      'katselet-tulevaisuudessa-voimaantulevaa': 'katselet-tulevaisuudessa-voimaantulevaa-perustetta',
      'voimassaolevaan': 'voimassaolevaan-perusteeseen',
      'katselet-talla-hetkella-voimassaolevaa': 'katselet-talla-hetkella-voimassaolevaa-perustetta',
      'uusimpaan': 'uusimpaan-perusteeseen',
    },
    'opetussuunnitelma': {
      'katselet-tulevaisuudessa-voimaantulevaa': 'katselet-tulevaisuudessa-voimaantulevaa-opetussuunnitelmaa',
      'voimassaolevaan': 'voimassaolevaan-opetussuunnitelmaan',
      'katselet-talla-hetkella-voimassaolevaa': 'katselet-talla-hetkella-voimassaolevaa-opetussuunnitelmaa',
      'uusimpaan': 'uusimpaan-opetussuunnitelmaan',
    },
  };
});

const voimassaOlevaOpetussuunnitelmaJulkaisu = computed(() => {
  return _.chain(props.opetussuunnitelmanJulkaisut)
    .filter(julkaisu => _.includes(_.map(voimassaOlevatPerusteenJulkaisut.value, 'luotu'), julkaisu.perusteJulkaisuAika))
    .sortBy('luotu')
    .last()
    .value();
});
</script>
