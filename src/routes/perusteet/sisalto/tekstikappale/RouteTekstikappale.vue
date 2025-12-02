<template>
  <router-view v-if="tekstikappaleenOsa">
    <template #previous-next-navigation>
      <slot name="previous-next-navigation" />
    </template>
  </router-view>

  <div
    v-else
    class="content"
  >
    <div v-if="perusteenOsa">
      <h2
        id="tekstikappale-otsikko"
        class="otsikko"
      >
        <span v-if="numerointi">{{ numerointi }}</span>
        {{ $kaanna(perusteenOsa.nimi) }}
      </h2>
      <ep-content-viewer
        :value="$kaanna(perusteenOsa.teksti)"
        :termit="termit"
        :kuvat="kuvat"
      />

      <!-- Alikappaleet -->
      <div
        v-for="(alikappaleViite, idx) in alikappaleet"
        :key="idx"
      >
        <ep-heading
          class="otsikko"
          :level="alikappaleViite.level + 2"
        >
          <span v-if="alikappaleNumeroinnitById[alikappaleViite.id]">{{ alikappaleNumeroinnitById[alikappaleViite.id] }}</span>
          {{ $kaanna(alikappaleViite.perusteenOsa.nimi) }}
        </ep-heading>
        <ep-content-viewer
          :value="$kaanna(alikappaleViite.perusteenOsa.teksti)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <EpOpasKiinnitysLinkki
        v-if="osaamisalaKoodiUri"
        :koodi-uri="osaamisalaKoodiUri"
      />

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import _ from 'lodash';
import { ViiteLaaja } from '@shared/api/eperusteet';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpHeading from '@shared/components/EpHeading/EpHeading.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpOpasKiinnitysLinkki from '@shared/components/EpOpasKiinnitysLinkki/EpOpasKiinnitysLinkki.vue';
import { $kaanna } from '@shared/utils/globals';
import { getCachedPerusteStore } from '@/stores/PerusteCacheStore';
import { createPerusteOsaStore } from '@/stores/PerusteenOsaStore';

const route = useRoute();
const router = useRouter();

const perusteDataStore = getCachedPerusteStore();
const perusteenOsaStore = createPerusteOsaStore(perusteDataStore, route.params.viiteId);

const redirectToLinkkiSivuLapsiTyypit = ['koulutuksenosa', 'koto_opinto', 'koto_kielitaitotaso', 'koto_laajaalainenosaaminen', 'opintokokonaisuus'];

onMounted(() => {
  if (_.some(_.map(perusteenOsaViite.value?.lapset, 'perusteenOsa.osanTyyppi'), osanTyyppi => _.includes(redirectToLinkkiSivuLapsiTyypit, osanTyyppi))) {
    router.push({
      name: 'linkkisivu',
      params: {
        linkkisivuId: route.params.viiteId as string,
      },
    });
  }
});

const perusteenOsa = computed(() => {
  return perusteenOsaStore.perusteenOsa;
});

const perusteenOsaViite = computed(() => {
  return perusteenOsaStore.perusteenOsaViite;
});

const alikappaleet = computed(() => {
  if (!_.isEmpty(perusteenOsaViite.value)) {
    const viitteet: ViiteLaaja[] = [];

    const stack: ViiteLaaja[] = [perusteenOsaViite.value!];

    while (!_.isEmpty(stack)) {
      const head: any = stack.shift()!;

      if (head.perusteenOsa) {
        viitteet.push(head);
      }

      const lapsiTekstikappaleet = _.filter(head.lapset, lapsiViite => !!lapsiViite.perusteenOsa?.teksti);

      stack.unshift(..._.map(lapsiTekstikappaleet, viite => ({
        ...viite,
        level: (head.level || 0) + 1,
      })));
    }

    // Poistetaan nykyinen viite alikappaleista
    return _.slice(viitteet, 1);
  }
  else {
    return [];
  }
});

const termit = computed(() => {
  return perusteDataStore.termit;
});

const kuvat = computed(() => {
  return perusteDataStore.kuvat;
});

const current = computed(() => {
  return perusteDataStore.current || null;
});

const tekstikappaleenOsa = computed(() => {
  return route.params.osa || route.params.vapaatekstiId;
});

const osaamisalaKoodiUri = computed(() => {
  return (perusteenOsa.value as any)?.osaamisala?.uri;
});

const numerointi = computed(() => {
  return current.value?.meta?.numerointi;
});

const alikappaleNumeroinnitById = computed(() => {
  if (current.value?.children) {
    return current.value?.children?.reduce((acc: any, child: any) => {
      acc[child.id] = child?.meta?.numerointi;
      return acc;
    }, {});
  }

  return {};
});
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: $content-padding;
}
</style>
