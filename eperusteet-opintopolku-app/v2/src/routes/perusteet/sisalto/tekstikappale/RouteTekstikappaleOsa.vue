<template>
  <div class="content" v-if="osa">
    <h2 v-if="osa.nimi">{{$kaanna(osa.nimi)}}</h2>
    <h2 v-else>{{$t(tekstikappaleenOsa)}}</h2>

    <ep-content-viewer :value="$kaanna(osa.teksti)" :termit="termit" :kuvat="kuvat" />

    <slot name="previous-next-navigation" />
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { ViiteLaaja } from '@shared/api/eperusteet';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpHeading from '@shared/components/EpHeading/EpHeading.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';

@Component({
  components: {
    EpSpinner,
    EpHeading,
    EpContentViewer,
  },
})
export default class RouteTekstikappaleOsa extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private perusteenOsaStore!: PerusteenOsaStore;

  get kuvat() {
    return this.perusteDataStore.kuvat;
  }

  get termit() {
    return this.perusteDataStore.termit;
  }

  get osa() {
    return _.get(this.perusteenOsaStore.perusteenOsa, this.tekstikappaleenOsa);
  }

  get tekstikappaleenOsa() {
    return this.$route.params.osa;
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
