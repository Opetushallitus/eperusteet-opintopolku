<template>
  <div>
    <router-view v-if="oppiaine" />

    <div v-else class="content">

      <ep-spinner v-if="!vuosiluokkakokonaisuus" />

      <div v-else>
        <h2>{{$kaanna(vuosiluokkakokonaisuus.nimi)}}</h2>

        <div class="mt-4" v-if="hasContent(vuosiluokkakokonaisuus.tehtava)">
          <h3>{{$kaanna(vuosiluokkakokonaisuus.tehtava.otsikko)}}</h3>
          <ep-content-viewer :value="$kaanna(vuosiluokkakokonaisuus.tehtava.teksti)" :kuvat="kuvat" />
        </div>

        <div class="mt-4" v-if="hasContent(vuosiluokkakokonaisuus.siirtymaEdellisesta)">
          <h3>{{$kaanna(vuosiluokkakokonaisuus.siirtymaEdellisesta.otsikko)}}</h3>
         <ep-content-viewer :value="$kaanna(vuosiluokkakokonaisuus.siirtymaEdellisesta.teksti)" :kuvat="kuvat" />
        </div>

        <div class="mt-4" v-if="hasContent(vuosiluokkakokonaisuus.siirtymaSeuraavaan)">
          <h3>{{$kaanna(vuosiluokkakokonaisuus.siirtymaSeuraavaan.otsikko)}}</h3>
          <ep-content-viewer :value="$kaanna(vuosiluokkakokonaisuus.siirtymaSeuraavaan.teksti)" :kuvat="kuvat" />
        </div>

        <div class="mt-4" v-if="hasContent(vuosiluokkakokonaisuus.laajaalainenOsaaminen)">
          <h3>{{$kaanna(vuosiluokkakokonaisuus.laajaalainenOsaaminen.otsikko)}}</h3>
          <ep-content-viewer :value="$kaanna(vuosiluokkakokonaisuus.laajaalainenOsaaminen.teksti)" :kuvat="kuvat" />
        </div>

        <div class="mt-4" v-if="vuosiluokkakokonaisuus.laajaalaisetOsaamiset && vuosiluokkakokonaisuus.laajaalaisetOsaamiset.length > 0">
          <h3 class="mt-4">{{$t('laaja-alaisen-osaamisen-alueet')}}</h3>

          <div class="mt-4" v-for="(lao, index) in vuosiluokkakokonaisuus.laajaalaisetOsaamiset" :key="'lao'+index">
            <h4>{{$kaanna(lao.nimi)}}</h4>
            <ep-content-viewer :value="$kaanna(lao.kuvaus)" :kuvat="kuvat" />
          </div>

        </div>

        <div class="mt-4" v-if="hasContent(vuosiluokkakokonaisuus.paikallisestiPaatettavatAsiat)">
          <h3>{{$kaanna(vuosiluokkakokonaisuus.paikallisestiPaatettavatAsiat.otsikko)}}</h3>
          <ep-content-viewer :value="$kaanna(vuosiluokkakokonaisuus.paikallisestiPaatettavatAsiat.teksti)" :kuvat="kuvat" />
        </div>

      </div>
    </div>

  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpPreviousNextNavigation from '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';
import { PerusteVuosiluokkakokonaisuusStore } from '@/stores/PerusteVuosiluokkakokonaisuusStore';
import { Kielet } from '@shared/stores/kieli';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { PerusteDataStore } from '@/stores/PerusteDataStore';

@Component({
  components: {
    EpSpinner,
    EpContentViewer,
  },
})
export default class RouteVuosiluokkakokonaisuus extends Vue {
  @Prop({ required: true })
  private perusteVuosiluokkakokonaisuusStore!: PerusteVuosiluokkakokonaisuusStore;

  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  get oppiaine() {
    return this.$route.params.oppiaineId;
  }

  get vuosiluokkakokonaisuus() {
    return this.perusteVuosiluokkakokonaisuusStore.vuosiluokkakokonaisuus.value;
  }

  hasContent(obj) {
    return _.isObject(obj) && _.get(obj, 'teksti') && _.get(obj, 'teksti')[Kielet.getSisaltoKieli.value];
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
