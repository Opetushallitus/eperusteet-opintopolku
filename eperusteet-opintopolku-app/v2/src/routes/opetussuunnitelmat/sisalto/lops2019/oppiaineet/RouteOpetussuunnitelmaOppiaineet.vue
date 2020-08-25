<template>
<div class="content">
  <div v-if="oppiaineetFormatted">
    <h2 class="otsikko" slot="header">{{ $t('oppiaineet') }}</h2>
    <div class="teksti">
      <div class="oppiaine" v-for="(oppiaine, idx) in oppiaineetFormatted" :key="idx">
        <router-link v-if="oppiaine.location" :to="oppiaine.location">
          {{ $kaannaOlioTaiTeksti(oppiaine.label) }}
          <span v-if="oppiaine.koodiLabel" class="code-field">({{ oppiaine.koodiLabel }})</span>
        </router-link>
        <span v-else>
          {{ $kaannaOlioTaiTeksti(oppiaine.label) }}
          <span v-if="oppiaine.koodiLabel" class="code-field">({{ oppiaine.koodiLabel }})</span>
        </span>
      </div>
    </div>

    <slot name="previous-next-navigation" />
  </div>
  <ep-spinner v-else />
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';

import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';

@Component({
  components: {
    EpSpinner,
  },
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

  get oppiaineetFormatted() {
    if (!_.isEmpty(this.oppiaineet)) {
      return _.map(this.oppiaineet, oa => ({
        ...oa,
        koodiLabel: _.get(oa, 'meta.koodi.arvo') || _.get(oa, 'meta.koodi'),
      }));
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

  span.code-field {
    margin-left: 5px;
    font-size: 80%;
    text-transform: uppercase;
  }
}
</style>
