<template>
  <div class="content">
    <ep-spinner v-if="isLoading"></ep-spinner>
    <div v-else>
      <h2 class="otsikko mb-2" slot="header">
        <slot name="header">
          {{ $t('muutoshistoria') }}
        </slot>
      </h2>
      <div class="row">
        <div class="col-md-12" v-if="julkaisut && julkaisut.length > 0">
            <EpJulkaisuHistoriaJulkinen :julkaisut="julkaisut" naytaKaikki></EpJulkaisuHistoriaJulkinen>
        </div>
      </div>
      <slot name="previous-next-navigation" />
    </div>
  </div>
  </template>

  <script lang="ts">
  import _ from 'lodash';
  import { Prop, Vue, Component } from 'vue-property-decorator';
  import { PerusteDataStore } from '@/stores/PerusteDataStore';
  import EpFormContent from '@shared/components/forms/EpFormContent.vue';
  import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
  import EpJulkaisuHistoriaJulkinen from '@shared/components/EpJulkaisuHistoriaJulkinen/EpJulkaisuHistoriaJulkinen.vue';

  @Component({
    components: {
      EpJulkaisuHistoriaJulkinen,
      EpFormContent,
      EpSpinner,
    },
  })
  export default class RoutePerusteMuutoshistoria extends Vue {
    @Prop({ required: true })
    private perusteDataStore!: PerusteDataStore;

    get julkaisut() {
      return this.perusteDataStore.julkaisut;
    }
  }
  </script>

  <style scoped lang="scss">
  @import '@shared/styles/_variables.scss';

  .content {
    padding: $content-padding;
  }

  </style>
