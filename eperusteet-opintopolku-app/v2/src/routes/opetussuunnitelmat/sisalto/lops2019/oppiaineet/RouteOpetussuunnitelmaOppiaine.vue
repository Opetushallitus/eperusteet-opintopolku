<template>
<div class="content">
  <div v-if="perusteOppiaine">
    <h2 class="otsikko" slot="header">{{ $kaanna(perusteOppiaine.nimi) }}</h2>
    <pre>{{ perusteOppiaine }}</pre>

    <slot name="previous-next-navigation" />
  </div>
  <ep-spinner v-else />
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { Lops2019OpetussuunnitelmaOppiaineStore } from '@/stores/Lops2019OpetussuunnitelmaOppiaineStore';


@Component({
  components: {
    EpSpinner,
    EpColorIndicator,
    EpContentViewer,
  }
})
export default class RouteOpetussuunnitelmaOppiaine extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  @Prop({ required: true })
  private lops2019OpetussuunnitelmaOppiaineStore!: Lops2019OpetussuunnitelmaOppiaineStore;

  get oppiaineId() {
    return this.opetussuunnitelmaDataStore.opetussuunnitelmaId;
  }

  get perusteOppiaine() {
    return this.lops2019OpetussuunnitelmaOppiaineStore.oppiaine;
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
