<template>
<div class="content">
  <div v-if="oppiaineet">
    <h2 class="otsikko" slot="header">{{ $t('oppiaineet') }}</h2>
    <div class="teksti">
      <div class="oppiaine" v-for="(oppiaine, idx) in oppiaineet" :key="idx">
        <router-link :to="oppiaine.location">
          {{ $kaannaOlioTaiTeksti(oppiaine.label) }}
        </router-link>
      </div>
    </div>

    <ep-previous-next-navigation :active-node="current" :flattened-sidenav="flattenedSidenav" />
  </div>
  <ep-spinner v-else />
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { Lops2019OppiaineetStore } from '@/stores/Lops2019OppiaineetStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpPreviousNextNavigation from  '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';

@Component({
  components: {
    EpSpinner,
    EpPreviousNextNavigation,
  }
})
export default class RouteOppiaineet extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private lops2019oppiaineetStore!: Lops2019OppiaineetStore;

  get oppiaineet() {
    if (this.current) {
      return this.current.children;
    }
  }

  get current() {
    return this.perusteDataStore.current;
  }


  get flattenedSidenav() {
    return this.perusteDataStore.flattenedSidenav;
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
