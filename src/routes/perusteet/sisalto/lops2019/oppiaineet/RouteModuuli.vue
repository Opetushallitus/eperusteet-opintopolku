<template>
  <div class="content">
    <div v-if="moduuli">
      <h2
        slot="header"
        class="otsikko"
      >
        {{ $kaanna(moduuli.nimi) + (koodi ? ' (' + koodi.arvo + ')' : '') }}
      </h2>

      <div class="teksti">
        <moduuli-esitys
          :moduuli="moduuli"
          :termit="termit"
          :kuvat="kuvat"
        />
      </div>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import ModuuliEsitys from '@shared/components/EpOpintojaksonModuuli/ModuuliEsitys.vue';
import * as _ from 'lodash';

@Component({
  components: {
    EpSpinner,
    ModuuliEsitys,
  },
})
export default class RouteModuuli extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  get moduuliId() {
    return _.toNumber(this.$route.params.moduuliId);
  }

  get moduuli() {
    return this.perusteDataStore.getJulkaistuPerusteSisalto({ id: this.moduuliId }) as any;
  }

  get termit() {
    return this.perusteDataStore.termit;
  }

  get kuvat() {
    return this.perusteDataStore.kuvat;
  }

  get koodi() {
    if (this.moduuli) {
      return this.moduuli.koodi;
    }
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
