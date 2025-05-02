<template>
  <div>
    <b-row>
      <b-col>
        <h3 class="mb-4">
          {{ $t('kansalliset-perustaitojen-osaamismerkit') }}
        </h3>
      </b-col>
    </b-row>
    <b-row v-if="sisaltoviite.osaamismerkkiKappale.kuvaus">
      <b-col>
        <h4 class="mb-4">
          {{ $t('osaamismerkkien-suorittaminen') }}
        </h4>
        <ep-content-viewer
          :value="$kaanna(sisaltoviite.osaamismerkkiKappale.kuvaus)"
          :kuvat="kuvat"
          class="mb-5"
        />
      </b-col>
    </b-row>
    <b-row v-if="osaamisMerkkiKoodit.length > 0">
      <b-col>
        <EpOsaamismerkit
          :osaamismerkit="osaamismerkit"
          :osaamismerkki-kategoriat="osaamismerkkiKategoriat"
          hide-kuvaus
        />
      </b-col>
    </b-row>
  </div>
</template>

<script setup lang="ts">
import * as _ from 'lodash';
import { ref, computed, onMounted } from 'vue';
import { SisaltoViiteExportDto } from '@shared/api/amosaa';
import EpOsaamismerkit from '@/routes/osaamismerkit/EpOsaamismerkit.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { useOsaamismerkitStore } from '@/stores/OsaamismerkitStore';
import { pinia } from '@/pinia';

const props = defineProps({
  sisaltoviite: {
    type: Object as () => SisaltoViiteExportDto,
    required: true,
  },
  kuvat: {
    type: Array,
    required: true,
  },
});

const osaamismerkitStore = useOsaamismerkitStore(pinia);

const osaamisMerkkiKoodit = computed(() => {
  return _.map(props.sisaltoviite.osaamismerkkiKappale?.osaamismerkkiKoodit, koodi => _.toNumber(koodi.koodi));
});

const osaamismerkit = computed(() => {
  return osaamismerkitStore.osaamismerkit;
});

const osaamismerkkiKategoriat = computed(() => {
  return _.chain(osaamismerkitStore.kategoriat)
    .uniqWith(_.isEqual)
    .sortBy(kategoria => kategoria.nimi)
    .filter(kategoria => !!kategoria.nimi)
    .value();
});

const osaamismerkkiKappale = computed(() => {
  return props.sisaltoviite.osaamismerkkiKappale;
});

onMounted(async () => {
  if (osaamisMerkkiKoodit.value.length > 0) {
    await osaamismerkitStore.updateOsaamismerkitQuery({ koodit: osaamisMerkkiKoodit.value, poistunut: true });
    await osaamismerkitStore.fetchKategoriat({ poistunut: true });
  }
});
</script>

<style scoped lang="scss">

</style>
