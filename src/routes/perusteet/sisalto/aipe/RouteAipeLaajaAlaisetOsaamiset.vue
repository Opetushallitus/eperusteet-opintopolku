<template>
  <div class="content">
    <div v-if="laajaAlaisetOsaamiset">
      <h2 class="otsikko">
        {{ $t('laaja-alaiset-osaamiset') }}
      </h2>

      <EpCollapse
        v-for="lao in laajaAlaisetOsaamiset"
        :key="'lao' + lao.id"
      >
        <template #header>
          <h3>
            {{ $kaanna(lao.nimi) }}
          </h3>
        </template>
        <div v-html="$kaanna(lao.kuvaus)" />
      </EpCollapse>

      <slot name="previous-next-navigation" />
    </div>
    <ep-spinner v-else />
  </div>
</template>

<script lang="ts">
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import * as _ from 'lodash';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';

@Component({
  components: {
    EpSpinner,
    EpCollapse,
  },
})
export default class RouteAipeLaajaAlaisetOsaamiset extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  get laajaAlaisetOsaamiset() {
    return this.perusteDataStore.getJulkaistuPerusteSisalto('aipe.laajaalaisetosaamiset');
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
