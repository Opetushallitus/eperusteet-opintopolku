<template>
  <div>
    <router-view v-if="oppiaine" />

    <div
      v-else
      class="content"
    >
      <ep-spinner v-if="!vuosiluokkakokonaisuus" />

      <div v-else>
        <h2>{{ $kaanna(vuosiluokkakokonaisuus.nimi) }}</h2>

        <div
          v-if="hasContent(vuosiluokkakokonaisuus.tehtava)"
          class="mt-4"
        >
          <h3>{{ $kaanna(vuosiluokkakokonaisuus.tehtava.otsikko) }}</h3>
          <ep-content-viewer
            :value="$kaanna(vuosiluokkakokonaisuus.tehtava.teksti)"
            :kuvat="kuvat"
          />
        </div>

        <div
          v-if="hasContent(vuosiluokkakokonaisuus.siirtymaEdellisesta)"
          class="mt-4"
        >
          <h3>{{ $kaanna(vuosiluokkakokonaisuus.siirtymaEdellisesta.otsikko) }}</h3>
          <ep-content-viewer
            :value="$kaanna(vuosiluokkakokonaisuus.siirtymaEdellisesta.teksti)"
            :kuvat="kuvat"
          />
        </div>

        <div
          v-if="hasContent(vuosiluokkakokonaisuus.siirtymaSeuraavaan)"
          class="mt-4"
        >
          <h3>{{ $kaanna(vuosiluokkakokonaisuus.siirtymaSeuraavaan.otsikko) }}</h3>
          <ep-content-viewer
            :value="$kaanna(vuosiluokkakokonaisuus.siirtymaSeuraavaan.teksti)"
            :kuvat="kuvat"
          />
        </div>

        <div
          v-if="hasContent(vuosiluokkakokonaisuus.laajaalainenOsaaminen)"
          class="mt-4"
        >
          <h3>{{ $kaanna(vuosiluokkakokonaisuus.laajaalainenOsaaminen.otsikko) }}</h3>
          <ep-content-viewer
            :value="$kaanna(vuosiluokkakokonaisuus.laajaalainenOsaaminen.teksti)"
            :kuvat="kuvat"
          />
        </div>

        <template v-if="vuosiluokkakokonaisuus.vapaatTekstit && vuosiluokkakokonaisuus.vapaatTekstit.length > 0">
          <div
            v-for="(vapaaTeksti, index) in vuosiluokkakokonaisuus.vapaatTekstit"
            :key="'vapaateksti'+index"
            class="mt-4"
          >
            <h3>{{ $kaanna(vapaaTeksti.nimi) }}</h3>
            <ep-content-viewer
              :value="$kaanna(vapaaTeksti.teksti)"
              :kuvat="kuvat"
            />
          </div>
        </template>

        <div
          v-if="vuosiluokkakokonaisuus.laajaalaisetOsaamiset && vuosiluokkakokonaisuus.laajaalaisetOsaamiset.length > 0"
          class="mt-4"
        >
          <h3 class="mt-4">
            {{ $t('laaja-alaisen-osaamisen-alueet') }}
          </h3>

          <div
            v-for="(lao, index) in vuosiluokkakokonaisuus.laajaalaisetOsaamiset"
            :key="'lao'+index"
            class="mt-4"
          >
            <h4>{{ $kaanna(lao.nimi) }}</h4>
            <ep-content-viewer
              :value="$kaanna(lao.kuvaus)"
              :kuvat="kuvat"
            />
          </div>
        </div>

        <div
          v-if="hasContent(vuosiluokkakokonaisuus.paikallisestiPaatettavatAsiat)"
          class="mt-4"
        >
          <h3>{{ $kaanna(vuosiluokkakokonaisuus.paikallisestiPaatettavatAsiat.otsikko) }}</h3>
          <ep-content-viewer
            :value="$kaanna(vuosiluokkakokonaisuus.paikallisestiPaatettavatAsiat.teksti)"
            :kuvat="kuvat"
          />
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
  private perusteDataStore!: PerusteDataStore;

  get oppiaine() {
    return this.$route.params.oppiaineId;
  }

  get vlkId() {
    return _.toNumber(this.$route.params.vlkId);
  }
  get laajaalaisetOsaamisetById() {
    return _.keyBy(this.laajaalaisetOsaamiset, 'id');
  }

  get laajaalaisetOsaamiset() {
    return this.perusteDataStore.getJulkaistuPerusteSisalto('perusopetus.laajaalaisetosaamiset') as any;
  }

  get vuosiluokkakokonaisuus() {
    let vuosiluokkakokonaisuus = this.perusteDataStore.getJulkaistuPerusteSisalto({ id: this.vlkId }) as any;
    return {
      ...vuosiluokkakokonaisuus,
      laajaalaisetOsaamiset: _.chain(vuosiluokkakokonaisuus.laajaalaisetOsaamiset)
        .map(lao => {
          return {
            ...lao,
            nimi: _.get(this.laajaalaisetOsaamisetById[_.get(lao, '_laajaalainenOsaaminen')], 'nimi'),
          };
        })
        .sortBy(lao => this.$kaanna(lao.nimi))
        .value(),
    };
  }

  hasContent(obj) {
    return obj?.teksti && _.get(obj, 'teksti')[Kielet.getSisaltoKieli.value];
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
