<template>
<div class="content">
  <div v-if="laajaAlaisetKokonaisuus">
    <h2 class="otsikko" slot="header">{{ $t('laaja-alaiset-osaamiset') }}</h2>
    <div>
      <div v-if="hasLaajaAlaiset" class="laaja-alaiset">
        <div v-for="(laajaAlainen, idx) in laajaAlaiset" :key="idx" :id="getLaajaAlainenId(laajaAlainen)">
          <h3 class="otsikko">{{ $kaanna(laajaAlainen.nimi) }}</h3>
          <div v-if="laajaAlainen.koodi">
            <strong>{{ $t('koodi') }}</strong>
            <p>{{ laajaAlainen.koodi.arvo }}</p>
          </div>
          <ep-content-viewer :value="$kaanna(laajaAlainen.kuvaus)" :termit="termit" :kuvat="kuvat" />
        </div>
      </div>
    </div>

    <slot name="previous-next-navigation" />
  </div>
  <ep-spinner v-else />
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import VueScrollTo from 'vue-scrollto';
import { Lops2019LaajaAlaisetStore } from '@/stores/Lops2019LaajaAlaisetStore';
import { getLaajaAlainenId } from '@shared/utils/NavigationBuilder';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpPreviousNextNavigation from  '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';

@Component({
  components: {
    EpSpinner,
    EpPreviousNextNavigation,
    EpContentViewer,
  }
})
export default class RouteLaajaAlaiset extends Vue {

  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private lops2019LaajaAlaisetStore!: Lops2019LaajaAlaisetStore;

  get laajaAlaisetKokonaisuus() {
    return this.lops2019LaajaAlaisetStore.laajaAlaisetKokonaisuus;
  }

  updated() {
    // Odotetaan myös alikomponenttien päivittymistä
    this.$nextTick(() => {
      if (this.$route && this.$route.hash && this.laajaAlaisetKokonaisuus) {
        VueScrollTo.scrollTo(this.$route.hash);
      }
    });
  }

  get laajaAlaiset() {
    if (this.laajaAlaisetKokonaisuus && this.laajaAlaisetKokonaisuus.laajaAlaisetOsaamiset) {
      return this.laajaAlaisetKokonaisuus.laajaAlaisetOsaamiset;
    }
  }

  get hasLaajaAlaiset() {
    return !_.isEmpty(this.laajaAlaiset);
  }

  get termit() {
    return this.perusteDataStore.termit;
  }

  get kuvat() {
    return this.perusteDataStore.kuvat;
  }

  private getLaajaAlainenId(laajaAlainen) {
    const koodiUri = _.get(laajaAlainen, 'koodi.uri');
    _.set(laajaAlainen, 'meta.koodi.uri', koodiUri);
    return getLaajaAlainenId(laajaAlainen);
  }
}
</script>

<style scoped lang="scss">
@import '../../../../../styles/_variables.scss';
@import '../../../../../styles/_mixins.scss';

.content {
  padding: 0 $content-padding;

  .otsikko, .teksti {
    @include teksti-sisalto;
  }
}
</style>
