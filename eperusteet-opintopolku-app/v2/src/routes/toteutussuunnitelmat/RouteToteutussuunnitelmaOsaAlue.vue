<template>
  <div class="content">
    <ep-spinner v-if="osaalue" />
    <div v-else>
      <!-- <h2 class="otsikko mb-4" slot="header">{{ $kaanna(osaalue.nimi)}}</h2> -->

    </div>

  </div>
</template>

<script lang="ts">
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {

  },
})
export default class RouteToteutussuunnitelmaOsaAlue extends Vue {
  @Prop({ required: true })
  opetussuunnitelmaDataStore!: ToteutussuunnitelmaDataStore;

  @Prop({ required: true })
  osaalueId!: string;

  get osaalue() {
    // return this.opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: this.osaalueId });
    return null;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
    padding: 0 $content-padding;

  }
</style>
