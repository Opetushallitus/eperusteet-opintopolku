<template>
<div class="content">
  <div v-if="oppiaineet">
    <h2 class="otsikko" slot="header">{{ $t('oppiaineet') }}</h2>
    <div class="teksti">
      <div class="oppiaine" v-for="(oppiaine, idx) in oppiaineet" :key="idx">
        <router-link v-if="oppiaine.location" :to="oppiaine.location">
          {{ $kaannaOlioTaiTeksti(oppiaine.label) }}
        </router-link>
        <span v-else>
          {{ $kaannaOlioTaiTeksti(oppiaine.label) }}
        </span>
      </div>
    </div>

    <slot name="previous-next-navigation" />
  </div>
  <ep-spinner v-else />
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';


@Component({
  components: {
    EpSpinner,
  }
})
export default class RouteOpetussuunnitelmaOppiaineet extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  get current() {
    return this.opetussuunnitelmaDataStore.current;
  }

  get oppiaineet() {
    if (this.current) {
      return this.current.children;
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
