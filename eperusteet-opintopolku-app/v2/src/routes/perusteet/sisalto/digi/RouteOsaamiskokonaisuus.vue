<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2 class="otsikko mb-4">{{ $kaanna(perusteenOsa.nimi) }}</h2>

      <ep-content-viewer :value="$kaanna(perusteenOsa.kuvaus)" :termit="termit" :kuvat="kuvat" />

      <div class="mt-5" v-for="(aihekokonaisuus, index) in perusteenOsa.aihekokonaisuudet" :key="'aihekokonaisuus'+index">
        <h3>{{$kaanna(aihekokonaisuus.otsikko)}}</h3>
        <ep-content-viewer :value="$kaanna(aihekokonaisuus.yleiskuvaus)" :termit="termit" :kuvat="kuvat" />
      </div>

      <EpCollapse :borderBottom="false">
        <h3 slot="header" class="collapse-header">{{ $kaanna(perusteenOsa.nimi) }} {{$t('varhaiskasvatuksessa-ja-esi-ja-perusopetuksessa')}}</h3>

        <b-tabs>
          <b-tab :title="$t(kasitteisto.taso.toLowerCase())" v-for="kasitteisto in perusteenOsa.kasitteistot" :key="'kasitteisto' + kasitteisto.taso">
            <ep-content-viewer class="mt-3" :value="$kaanna(kasitteisto.kuvaus)" :termit="termit" :kuvat="kuvat" />
          </b-tab>
        </b-tabs>
      </EpCollapse>

      <EpCollapse :borderBottom="false" v-if="perusteenOsa.keskeinenKasitteisto">
        <h3 slot="header" class="collapse-header">{{$t('keskeinen-kasitteisto')}}</h3>
        <ep-content-viewer :value="$kaanna(perusteenOsa.keskeinenKasitteisto)" :termit="termit" :kuvat="kuvat" />
      </EpCollapse>

      <EpCollapse :borderBottom="false" :collapsable="false">
        <h3 slot="header" class="collapse-header">{{$t('paa-alueet')}}</h3>
        <div class="row">
          <router-link
            v-for="paaAlue in paaAlueet"
            :key="'paaAlue'+paaAlue.id"
            class="paa-alue col-3"
            :to="{name: 'perusteOsaamiskokonaisuusPaaAlue', params: {osaamiskokonaisuusPaaAlueId: paaAlue.id + ''}}">
            <div class="nimi">{{$kaanna(paaAlue.perusteenOsa.nimi)}}</div>
          </router-link>
        </div>
      </EpCollapse>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script lang="ts">
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import * as _ from 'lodash';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';

@Component({
  components: {
    EpSpinner,
    EpContentViewer,
    EpCollapse,
  },
})
export default class RouteOsaamiskokonaisuus extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private perusteenOsaStore!: PerusteenOsaStore;

  @Watch('current', { immediate: true })
  async fetchPerusteenOsa() {
    if (!this.current) {
      return;
    }
    await this.perusteenOsaStore.fetchPerusteenOsa();
  }

  get current() {
    return this.perusteDataStore.current || null;
  }

  get perusteenOsa() {
    return this.perusteenOsaStore.perusteenOsa;
  }

  get termit() {
    return this.perusteDataStore.termit;
  }

  get kuvat() {
    return this.perusteDataStore.kuvat;
  }

  get paaAlueet(): any[] {
    return _.filter(this.perusteenOsaStore.perusteenOsaViite?.lapset, lapsi => _.get(lapsi, 'perusteenOsa.osanTyyppi') === 'osaamiskokonaisuus_paa_alue');
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: $content-padding;
}

::v-deep .collapse-button {
  background-color: $digitaalinen-osaaminen-color;
  padding: 0.3rem 0.6rem;
  margin-bottom: 16px;
}

.collapse-header {
  margin: 0;
}

.paa-alue {
  margin: 20px;
  height: 150px;
  background-color: $digitaalinen-osaaminen-paa-alue-color;
  border-radius: 10px;
  background-position: center bottom;
  background-repeat: no-repeat;
  background-image: url('../../../../../public/img/banners/tile_digitaalinen_osaaminen.svg');

  .nimi {
    margin-top: 10px;
    font-weight: 500;
    color: $black;
    overflow-wrap: break-word;
  }

  @include tile-background-shadow;

    &:hover {
      @include tile-background-shadow-selected;
    }
}

</style>
