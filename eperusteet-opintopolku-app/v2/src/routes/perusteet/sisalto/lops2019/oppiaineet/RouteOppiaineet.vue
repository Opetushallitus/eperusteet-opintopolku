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

    <slot name="previous-next-navigation" />
  </div>
  <ep-spinner v-else />
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { Lops2019OppiaineetStore } from '@/stores/Lops2019OppiaineetStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';

@Component({
  components: {
    EpSpinner,
  }
})
export default class RouteOppiaineet extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private lops2019OppiaineetStore!: Lops2019OppiaineetStore;

  get oppiaineet() {
    if (this.current) {
      return this.current.children;
    }
  }

  get current() {
    return this.perusteDataStore.current;
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
