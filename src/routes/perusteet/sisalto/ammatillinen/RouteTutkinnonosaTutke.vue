<template>
  <div>
    <EpHeader
      :murupolku="murupolku"
      :koulutustyyppi="koulutustyyppi"
    >
      <template #header>
        <span v-if="tutkinnonosa">{{ $kaanna(tutkinnonosa.nimi) }}</span>
        <span v-if="laajuus">{{ laajuus }} {{ $t('osaamispiste') }}</span>
      </template>
    </EpHeader>
    <div class="container mt-4">
      <div class="content">
        <EpSpinner v-if="!tutkinnonosa" />
        <div v-else>
          <EpFormContent
            v-if="perusteet"
            class="col-md-12 mb-5"
          >
            <EpCollapse
              class="mb-3"
              :shadow="true"
              :border-bottom="false"
              :expanded-by-default="perusteet.length === 1"
            >
              <template #header>
                <h2
                  class="header"
                >
                  {{ $t('tutkinnot-joilla-tutkinnon-osa-on') }}
                </h2>
              </template>
              <hr>
              <div
                v-for="(peruste, oidx) in perusteet"
                :key="oidx"
                class="nimikkeet"
              >
                <div class="d-flex">
                  <router-link :to="{ name: 'peruste', params: { koulutustyyppi: 'ammatillinen', perusteId: peruste.id }}">
                    {{ $kaanna(peruste.nimi) }}
                  </router-link>
                  <EpVoimassaolo :voimassaolo="peruste" />
                  <span
                    v-if="peruste.diaarinumero"
                    class="ml-1"
                  >| {{ $t('diaarinumero') + ': ' + peruste.diaarinumero }}</span>
                </div>
              </div>
            </EpCollapse>
          </EpFormContent>

          <EpTutkinnonosaTutke
            :tutkinnonosa="tutkinnonosa.tutkinnonosa"
            :arviointiasteikot="arviointiasteikot"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import { RawLocation } from 'vue-router';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpTutkinnonosaNormaali from '@/components/EpAmmatillinen/EpTutkinnonosaNormaali.vue';
import EpTutkinnonosaTutke from '@/components/EpAmmatillinen/EpTutkinnonosaTutke.vue';
import EpOpasKiinnitysLinkki from '@shared/components/EpOpasKiinnitysLinkki/EpOpasKiinnitysLinkki.vue';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import { AmmatillinenPerusteHakuStore } from '@/stores/AmmatillinenPerusteHakuStore';
import { murupolkuAmmatillinenRoot } from '@/utils/murupolku';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpVoimassaolo from '@shared/components/EpVoimassaolo/EpVoimassaolo.vue';
import _ from 'lodash';
import { $t } from '@shared/utils/globals';

const props = defineProps({
  ammatillinenPerusteHakuStore: {
    type: Object as () => AmmatillinenPerusteHakuStore,
    required: true,
  },
});

const route = useRoute();

onMounted(async () => {
  await props.ammatillinenPerusteHakuStore.updateFilters({ perusteet: false, tutkinnonosat: true, koodi: koodi.value });
  await props.ammatillinenPerusteHakuStore.fetchArviointiasteikot();
});

const arviointiasteikot = computed(() => {
  return props.ammatillinenPerusteHakuStore.arviointiasteikot;
});

const tutkinnonosa = computed(() => {
  if (props.ammatillinenPerusteHakuStore.perusteet) {
    return props.ammatillinenPerusteHakuStore.perusteet[0];
  }

  return undefined;
});

const perusteet = computed(() => {
  if (tutkinnonosa.value?.perusteet) {
    return _.chain(tutkinnonosa.value.perusteet)
      .map(peruste => ({
        ...peruste,
        route: perusteRoute(peruste),
      }))
      .value();
  }

  return undefined;
});

const laajuus = computed(() => {
  return tutkinnonosa.value?.laajuus;
});

const perusteRoute = (peruste) => {
  return {
    name: 'ammatillinenkooste',
    params: {
      perusteId: _.toString(peruste.id),
    },
  };
};

const koodi = computed(() => {
  return route.params.koodi;
});

const koulutustyyppi = computed(() => {
  return 'ammatillinen';
});

const murupolku = computed(() => {
  return [
    murupolkuAmmatillinenRoot(koulutustyyppi.value),
    {
      label: tutkinnonosa.value?.nimi,
      location: {
        ...route,
      } as RawLocation,
    },
  ];
});

// Meta info
useHead({
  title: computed(() => $t('yhteinen-tutkinnon-osa')),
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.header {
  font-size: large;
  font-weight: 400;
}

.content {
  padding: 0 $content-padding;
}

</style>
