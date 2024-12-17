<template>
  <component :is="tekstikappaleComponent" :opetussuunnitelmaDataStore="opetussuunnitelmaDataStore"/>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpHeading from '@shared/components/EpHeading/EpHeading.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import OpetussuunnitelmaTekstikappalePerusteeton from './OpetussuunnitelmaTekstikappalePerusteeton.vue';
import OpetussuunnitelmaTekstikappale from './OpetussuunnitelmaTekstikappale.vue';

@Component({
  components: {
    EpSpinner,
    EpHeading,
    EpContentViewer,
    EpCollapse,
  },
})
export default class RouteOpetussuunnitelmaTekstikappale extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  get tekstikappaleComponent() {
    if (this.opetussuunnitelmaDataStore.opetussuunnitelma?.sisaltaaPerusteenTekstit) {
      return OpetussuunnitelmaTekstikappale;
    };

    return OpetussuunnitelmaTekstikappalePerusteeton;
  }
}

</script>
