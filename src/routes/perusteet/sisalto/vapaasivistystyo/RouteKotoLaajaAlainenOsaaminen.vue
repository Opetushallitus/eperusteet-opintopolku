<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2
        id="tekstikappale-otsikko"
        class="otsikko mb-4"
      >
        <span v-if="numerointi">{{ numerointi }}</span>
        {{ $kaanna(perusteenOsa.nimi) }}
      </h2>

      <div class="mb-4">
        <ep-content-viewer
          :value="$kaanna(perusteenOsa.yleiskuvaus)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <b-row
        v-if="perusteenOsa.osaamisAlueet.length > 0"
        class="mt-4"
      >
        <b-col>
          <div
            v-for="(osaamisalue, index) in perusteenOsa.osaamisAlueet"
            :key="index+'kotoLaajaAlainenOsaaminen'"
          >
            <h3 class="mt-4">
              {{ $kaanna(osaamisalue.koodi.nimi) }}
            </h3>
            <ep-content-viewer :value="$kaanna(osaamisalue.kuvaus)" />
          </div>
        </b-col>
      </b-row>
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';

@Component({
  components: {
    EpContentViewer,
    EpSpinner,
  },
})
export default class RouteKotoLaajaAlainenOsaaminen extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private perusteenOsaStore!: PerusteenOsaStore;

  get perusteenOsa() {
    return this.perusteenOsaStore.perusteenOsa;
  }

  get termit() {
    return this.perusteDataStore.termit;
  }

  get kuvat() {
    return this.perusteDataStore.kuvat;
  }

  get current() {
    return this.perusteDataStore.current || null;
  }

  get numerointi() {
    return this.current?.meta?.numerointi;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: 0 $content-padding;
}
</style>
