<template>
  <div class="content">
    <div v-if="oppiaineet">
      <h2
        class="otsikko"
      >
        {{ $t('oppiaineet') }}
      </h2>
      <div class="teksti">
        <div
          v-for="(oppiaine, idx) in oppiaineet"
          :key="idx"
          class="oppiaine"
        >
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
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';

@Component({
  components: {
    EpSpinner,
  },
})
export default class RouteOppiaineet extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

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
