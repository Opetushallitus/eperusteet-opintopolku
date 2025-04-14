<template>
  <div class="content">
    <div v-if="kurssi">
      <h2
        slot="header"
        class="otsikko"
      >
        {{ $kaanna(kurssi.nimi) }} <span v-if="kurssi.koodiArvo">({{ kurssi.koodiArvo }})</span>
      </h2>

      <ep-content-viewer
        v-if="kurssi.kuvaus"
        :value="$kaanna(kurssi.kuvaus)"
        :termit="termit"
        :kuvat="kuvat"
      />

      <ep-content-viewer
        v-if="kurssi.tyyppi === 'PAKOLLINEN' && oppiaine.pakollinenKurssiKuvaus"
        :value="$kaanna( oppiaine.pakollinenKurssiKuvaus)"
        :termit="termit"
        :kuvat="kuvat"
      />

      <ep-content-viewer
        v-if="kurssi.tyyppi === 'VALTAKUNNALLINEN_SYVENTAVA' && oppiaine.syventavaKurssiKuvaus"
        :value="$kaanna( oppiaine.syventavaKurssiKuvaus)"
        :termit="termit"
        :kuvat="kuvat"
      />

      <ep-content-viewer
        v-if="kurssi.tyyppi === 'VALTAKUNNALLINEN_SOVELTAVA' && oppiaine.soveltavaKurssiKuvaus"
        :value="$kaanna( oppiaine.soveltavaKurssiKuvaus)"
        :termit="termit"
        :kuvat="kuvat"
      />

      <div
        v-if="kurssi.tavoitteet"
        class="mt-4"
      >
        <h3>{{ $kaanna(kurssi.tavoitteet.otsikko) }}</h3>
        <ep-content-viewer
          :value="$kaanna(kurssi.tavoitteet.teksti)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <div
        v-if="kurssi.keskeisetSisallot"
        class="mt-4"
      >
        <h3>{{ $kaanna(kurssi.keskeisetSisallot.otsikko) }}</h3>
        <ep-content-viewer
          :value="$kaanna(kurssi.keskeisetSisallot.teksti)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <div
        v-if="kurssi.tavoitteetJaKeskeisetSisallot"
        class="mt-4"
      >
        <h3>{{ $kaanna(kurssi.tavoitteetJaKeskeisetSisallot.otsikko) }}</h3>
        <ep-content-viewer
          :value="$kaanna(kurssi.tavoitteetJaKeskeisetSisallot.teksti)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script lang="ts">
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { deepFind } from '@shared/utils/helpers';
import * as _ from 'lodash';
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';

@Component({
  components: {
    EpContentViewer,
    EpSpinner,
  },
})
export default class RouteKurssi extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  get kurssiId() {
    return _.toNumber(this.$route.params.kurssiId);
  }

  get oppiaineId() {
    return _.toNumber(this.$route.params.oppiaineId);
  }

  get kurssi() {
    return this.perusteDataStore.getJulkaistuPerusteSisalto({ id: this.kurssiId }) as any;
  }

  get oppiaine() {
    return this.perusteDataStore.getJulkaistuPerusteSisalto({ id: this.oppiaineId }) as any;
  }

  get termit() {
    return this.perusteDataStore.termit;
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
