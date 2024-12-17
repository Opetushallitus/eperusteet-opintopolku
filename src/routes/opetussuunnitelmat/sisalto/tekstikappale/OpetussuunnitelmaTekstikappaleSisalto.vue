<template>
  <div>
    <slot name="header"/>
      <ep-collapse tyyppi="perusteteksti" v-if="naytaPerusteenTeksti && perusteenTekstikappale && perusteenTekstikappale.teksti">
        <div class="collapse-header" slot="header">{{ $t('perusteen-teksti') }}</div>
        <ep-content-viewer
          :value="$kaanna(perusteenTekstikappale.teksti)"
          :termit="perusteTermit"
          :kuvat="perusteKuvat" />
      </ep-collapse>

      <ep-collapse tyyppi="pohjateksti"
                   v-if="naytaPohjanTeksti && hasTekstikappalePohjanTeksteja">
        <div class="collapse-header" slot="header">
          {{$kaanna(pohjaNimi)}}
        </div>
        <ep-content-viewer v-for="(pohjanTeksti, index) in tekstikappalePohjanTekstit" :key="'tekstiKappaleOriginal'+index" :value="$kaanna(pohjanTeksti.teksti)" :termit="termit" :kuvat="kuvat" />
      </ep-collapse>

      <EpPaikallinenTarkennus v-if="tekstiKappale && tekstiKappale.teksti" :noheader="!perusteenTekstikappale">
        <ep-content-viewer :value="$kaanna(tekstiKappale.teksti)" :termit="termit" :kuvat="kuvat" />
      </EpPaikallinenTarkennus>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';

@Component({
  components: {
    EpContentViewer,
    EpCollapse,
  },
})
export default class OpetussuunnitelmaTekstikappaleSisalto extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  @Prop({ required: true })
  private tekstiKappaleViite!: any;

  get tekstiKappale() {
    return this.tekstiKappaleViite.tekstiKappale;
  }

  get naytaPerusteenTeksti() {
    return this.tekstiKappaleViite?.naytaPerusteenTeksti;
  }

  get naytaPohjanTeksti() {
    return this.tekstiKappaleViite?.naytaPohjanTeksti;
  }

  get perusteenTekstikappale() {
    return this.tekstiKappaleViite.perusteenTekstikappale;
  }

  get istekstiKappaleAllLoaded() {
    return !!this.tekstiKappaleViite;
  }

  get tekstikappalePohjanTekstit() {
    return _.map([
      ...(this.tekstiKappaleViite.pohjanTeksti ? [this.tekstiKappaleViite.pohjanTeksti] : []),
      ...(this.tekstiKappaleViite.pohjanTeksti && this.tekstiKappaleViite.pohjanTeksti.pohjanTeksti && this.tekstiKappaleViite.pohjanTeksti.naytaPohjanTeksti ? [this.tekstiKappaleViite.pohjanTeksti.pohjanTeksti] : []),
    ], 'tekstiKappale');
  }

  get hasTekstikappalePohjanTeksteja() {
    return _.size(_.filter(this.tekstikappalePohjanTekstit, 'teksti')) > 0;
  }

  get perusteTermit() {
    return this.opetussuunnitelmaDataStore.perusteTermit;
  }

  get termit() {
    return this.opetussuunnitelmaDataStore.termit;
  }

  get perusteKuvat() {
    return this.opetussuunnitelmaDataStore.perusteKuvat;
  }

  get kuvat() {
    return this.opetussuunnitelmaDataStore.kuvat;
  }

  get pohjaNimi() {
    return this.opetussuunnitelmaDataStore.opetussuunnitelma?.pohja?.nimi;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
