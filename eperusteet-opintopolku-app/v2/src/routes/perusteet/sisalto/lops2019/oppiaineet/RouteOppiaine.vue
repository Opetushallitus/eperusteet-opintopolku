<template>
<div class="content">
  <div v-if="oppiaine">
    <h2 class="otsikko" slot="header">{{ $kaanna(oppiaine.nimi) }}</h2>

    <div class="teksti">
      <oppiaine-esitys :oppiaine="oppiaine"
                       :termit="termit"
                       :kuvat="kuvat" />
    </div>
    <slot name="previous-next-navigation" />
  </div>
  <ep-spinner v-else />
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Lops2019OppiaineStore } from '@/stores/Lops2019OppiaineStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import OppiaineEsitys from './OppiaineEsitys.vue';

@Component({
  components: {
    EpSpinner,
    OppiaineEsitys,
  }
})
export default class RouteOppiaine extends Vue {

  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private lops2019OppiaineStore!: Lops2019OppiaineStore;

  get termit() {
    return this.perusteDataStore.termit;
  }

  get kuvat() {
    return this.perusteDataStore.kuvat;
  }

  get oppiaine() {
    return this.lops2019OppiaineStore.oppiaine;
  }
}
</script>

<style scoped lang="scss">
@import '../../../../../styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
