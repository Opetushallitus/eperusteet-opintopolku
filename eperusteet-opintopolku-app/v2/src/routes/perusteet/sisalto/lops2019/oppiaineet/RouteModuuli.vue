<template>
<div class="content">
  <div v-if="moduuli">
    <h2 class="otsikko" slot="header">{{ $kaanna(moduuli.nimi) + (koodi ? ' (' + koodi.arvo + ')'  : '') }}</h2>

    <div class="teksti">
      <moduuli-esitys :moduuli="moduuli" :termit="termit" :kuvat="kuvat" />
    </div>

    <slot name="previous-next-navigation" />
  </div>
  <ep-spinner v-else />
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Lops2019ModuuliStore } from '@/stores/Lops2019ModuuliStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import ModuuliEsitys from '@/routes/perusteet/sisalto/lops2019/oppiaineet/ModuuliEsitys.vue';

@Component({
  components: {
    EpSpinner,
    ModuuliEsitys,
  }
})
export default class RouteModuuli extends Vue {

  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private lops2019ModuuliStore!: Lops2019ModuuliStore;

  get moduuli() {
    return this.lops2019ModuuliStore.moduuli;
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
@import '../../../../../styles/_variables.scss';
@import '../../../../../styles/_mixins.scss';

.content {
  padding: 0 $content-padding;

  .otsikko, .teksti {
    @include teksti-sisalto;
  }
}
</style>
