<template>
  <div class="content">
    <h2>{{$kaanna(oppiaine.nimi)}}</h2>

    <ep-peruste-content v-if="perusteOppiaine" :perusteObject="perusteOppiaine.tehtava" :kuvat="kuvat" :termit="termit"/>

    <b-tabs class="ml-0 pl-0 mt-4" v-if="!vlkId">
      <b-tab class="mt-4" v-for="(opVlk, index) in oppiaineenVuosiluokkakokonaisuudet" :key="'vlk'+index" :title="$kaanna(opVlk.vuosiluokkakokonaisuus.nimi)">
        <oppiaineen-vuosiluokkakokonaisuus :tietue="opVlk" :kuvat="kuvat" :termit="termit"/>
      </b-tab>
    </b-tabs>

    <oppiaineen-vuosiluokkakokonaisuus v-else :tietue="oppiaineenVuosiluokkakokonaisuus" :kuvat="kuvat" :termit="termit"/>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { OpetussuunnitelmaOppiaineStore } from '@/stores/OpetussuunnitelmaOppiaineStore';
import EpPerusteContent from '@shared/components/EpPerusteContent/EpPerusteContent.vue';
import OppiaineenVuosiluokkakokonaisuus from './OppiaineenVuosiluokkakokonaisuus.vue';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';

@Component({
  components: {
    EpPerusteContent,
    OppiaineenVuosiluokkakokonaisuus,
  },
} as any)
export default class RouteOpetussuunnitelmaPerusopetusOppiaine extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaOppiaineStore!: OpetussuunnitelmaOppiaineStore;

  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  get kuvat() {
    return this.opetussuunnitelmaDataStore.kuvat;
  }

  get termit() {
    return this.opetussuunnitelmaDataStore.kaikkiTermit;
  }

  get vlkId() {
    return this.$route.params.vlkId;
  }

  get oppiaine() {
    return this.opetussuunnitelmaOppiaineStore.oppiaine.value;
  }

  get perusteOppiaine() {
    return this.opetussuunnitelmaOppiaineStore.perusteOppiaine.value;
  }

  get oppiaineenVuosiluokkakokonaisuudet() {
    return _.sortBy(this.opetussuunnitelmaOppiaineStore.oppiaineenVuosiluokkakokonaisuudet.value, ovlk => this.$kaanna(ovlk.vuosiluokkakokonaisuus.nimi));
  }

  get oppiaineenVuosiluokkakokonaisuus() {
    return _.head(_.filter(this.oppiaineenVuosiluokkakokonaisuudet, ovlk => _.toNumber(ovlk.vuosiluokkakokonaisuus.id) === _.toNumber(this.vlkId)));
  }
}

</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
