<template>
<div class="content">
  <div v-if="moduuli">
    <h2 class="otsikko" slot="header">{{ $kaanna(moduuli.nimi) + (koodi ? ' (' + koodi.arvo + ')'  : '') }}</h2>

    <div class="teksti">
      <moduuli-esitys :moduuli="moduuli"
                      :termit="perusteTermit"
                      :kuvat="perusteKuvat"
                      :isPerusteView="false" />
    </div>

    <slot name="previous-next-navigation" />
  </div>
  <ep-spinner v-else />
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { Lops2019OpetussuunnitelmaModuuliStore } from '@/stores/Lops2019OpetussuunnitelmaModuuliStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import ModuuliEsitys from '@/routes/perusteet/sisalto/lops2019/oppiaineet/ModuuliEsitys.vue';

@Component({
  components: {
    EpSpinner,
    ModuuliEsitys,
  }
})
export default class RouteOpetussuunnitelmaModuuli extends Vue {

  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  @Prop({ required: true })
  private lops2019OpetussuunnitelmaModuuliStore!: Lops2019OpetussuunnitelmaModuuliStore;

  get moduuli() {
    return this.lops2019OpetussuunnitelmaModuuliStore.moduuli;
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
@import '../../../../../styles/_variables.scss';
@import '../../../../../styles/_mixins.scss';

.content {
  padding: 0 $content-padding;

  .otsikko, .teksti {
    @include teksti-sisalto;
  }
}
</style>
