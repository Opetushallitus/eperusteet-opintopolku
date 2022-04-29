<template>
  <div class="content">
    <div v-if="perusteenOsa">
      <h2 id="tekstikappale-otsikko" class="otsikko mb-4">{{ $kaanna(perusteenOsa.nimi) }}</h2>

      <div v-for="(alisivu, idx) in alisivut" :key="idx">
          <router-link :to="alisivu.location">
            {{ $kaanna(alisivu.label) }}
          </router-link>
      </div>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';
import { PerusteDataStore } from '@/stores/PerusteDataStore';

@Component({
  components: {
    EpSpinner,
  },
})
export default class RouteLinkkisivu extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private perusteenOsaStore!: PerusteenOsaStore;

  @Watch('current', { immediate: true })
  async fetchAlisivut() {
    if (!this.current) {
      return;
    }

    const isMainHeading = !!this.current && this.current.path.length === 2;
    await this.perusteenOsaStore.fetchPerusteenOsa(isMainHeading);
  }

  get perusteenOsa() {
    return this.perusteenOsaStore.perusteenOsa;
  }

  get alisivut() {
    return this.current?.children;
  }

  get current() {
    return this.perusteDataStore.current || null;
  }
}

</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.content {
  padding: 0 $content-padding;
}
</style>
