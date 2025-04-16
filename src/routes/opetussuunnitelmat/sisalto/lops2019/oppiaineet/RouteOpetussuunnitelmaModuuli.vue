<template>
  <div class="content">
    <div v-if="moduuli">
      <h2
        class="otsikko"
      >
        {{ $kaanna(moduuli.nimi) + (koodi ? ' (' + koodi.arvo + ')' : '') }}
      </h2>

      <div class="teksti">
        <moduuli-esitys
          :moduuli="moduuli"
          :termit="perusteTermit"
          :kuvat="perusteKuvat"
          :is-peruste-view="false"
        />
      </div>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import ModuuliEsitys from '@shared/components/EpOpintojaksonModuuli/ModuuliEsitys.vue';
import _ from 'lodash';

@Component({
  components: {
    EpSpinner,
    ModuuliEsitys,
  },
})
export default class RouteOpetussuunnitelmaModuuli extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  get moduuliId() {
    return _.toNumber(this.$route.params.moduuliId);
  }

  get moduuli() {
    return this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ id: this.moduuliId });
  }

  get koodi() {
    if (this.moduuli) {
      return this.moduuli.koodi;
    }
  }
  get perusteTermit() {
    return this.opetussuunnitelmaDataStore.perusteTermit;
  }

  get perusteKuvat() {
    return this.opetussuunnitelmaDataStore.perusteKuvat;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: 0 $content-padding;

  .otsikko, .teksti {
    @include teksti-sisalto;
  }
}
</style>
