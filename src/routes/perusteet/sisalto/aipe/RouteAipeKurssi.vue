<template>
  <div class="content">
    <h2>{{ $kaanna(kurssi.nimi) }}</h2>

    <div
      v-if="kurssi.koodi"
      class="mt-4"
    >
      <h3>{{ $t('koodi') }}</h3>
      <span>{{ kurssi.koodi.arvo }}</span>
    </div>

    <div
      v-if="kurssi.kuvaus"
      class="mt-4"
    >
      <h3>{{ $t('kuvaus') }}</h3>
      <ep-content-viewer
        :value="$kaanna(kurssi.kuvaus)"
        :kuvat="kuvat"
      />
    </div>

    <div
      v-if="tavoitteet && tavoitteet.length > 0"
      class="mt-5"
    >
      <h3>{{ $t('liitetyt-tavoitteet') }}</h3>
      <div
        v-for="tavoite in tavoitteet"
        :key="'tavoite'+tavoite.id"
        class="taulukko-rivi-varitys px-2 py-3"
      >
        {{ $kaanna(tavoite.tavoite) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { AipeKurssiStore } from '@/stores/AipeKurssiStore';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { getTavoiteNumero } from '@shared/utils/perusteet';

@Component({
  components: {
    EpContentViewer,
  },
})
export default class RouteAipeKurssi extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  get kurssiId() {
    return _.toNumber(this.$route.params.kurssiId);
  }

  get kurssi() {
    return this.perusteDataStore.getJulkaistuPerusteSisalto({ id: this.kurssiId });
  }

  get oppiaineId() {
    return _.toNumber(this.$route.params.oppiaineId);
  }

  get oppiaine() {
    return this.perusteDataStore.getJulkaistuPerusteSisalto({ id: this.oppiaineId });
  }

  get tavoitteet() {
    if (this.kurssi) {
      return _.chain(this.kurssi.tavoitteet)
        .map(tavoite => this.tavoitteetById![tavoite as any])
        .sortBy(tavoite => getTavoiteNumero(tavoite.tavoite))
        .value();
    }
  }

  get tavoitteetById() {
    if (this.oppiaine) {
      return _.keyBy(this.oppiaine.tavoitteet, 'id');
    }
  }

  get fields() {
    return [{
      key: 'tavoite',
      thStyle: {
        display: 'none',
      },
    }];
  }

  get kuvat() {
    return this.perusteDataStore.kuvat;
  }
}

</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
