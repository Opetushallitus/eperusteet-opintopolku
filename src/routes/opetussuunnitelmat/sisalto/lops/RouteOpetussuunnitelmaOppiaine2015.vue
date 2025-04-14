<template>
  <div class="content">
    <router-view v-if="kurssiId">
      <template slot="previous-next-navigation">
        <slot name="previous-next-navigation" />
      </template>
    </router-view>

    <div v-else-if="oppiaine">
      <h2 class="otsikko">
        {{ $kaanna(oppiaine.nimi) }} <span v-if="oppiaine.koodiArvo">({{ oppiaine.koodiArvo }})</span>
      </h2>

      <div
        v-for="(sisaltoavain, index) in sisaltoAvaimet"
        :key="'sisaltoavain'+index"
        class="mt-4"
      >
        <div
          v-if="(oppiaine[sisaltoavain] && oppiaine[sisaltoavain].teksti) || (oppiaine.perusteen[sisaltoavain] && oppiaine.perusteen[sisaltoavain].teksti)"
          class="mt-4"
        >
          <h3>{{ $kaanna((oppiaine[sisaltoavain] && oppiaine[sisaltoavain].otsikko) || oppiaine.perusteen[sisaltoavain].otsikko) }}</h3>

          <EpCollapse
            v-if="oppiaine.perusteen[sisaltoavain]"
            :border-bottom="false"
            :shadow="true"
            class="mb-4"
            :expanded-by-default="!(oppiaine[sisaltoavain] && oppiaine[sisaltoavain].teksti)"
          >
            <div slot="header">
              {{ $t('tukiteksti') }}
            </div>
            <ep-content-viewer
              :value="$kaanna(oppiaine.perusteen[sisaltoavain].teksti)"
              :termit="termit"
              :kuvat="kuvat"
            />
          </EpCollapse>

          <ep-content-viewer
            v-if="oppiaine[sisaltoavain] && oppiaine[sisaltoavain].teksti"
            :value="$kaanna(oppiaine[sisaltoavain].teksti)"
            :termit="termit"
            :kuvat="kuvat"
          />
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
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';

@Component({
  components: {
    EpSpinner,
    EpContentViewer,
    EpCollapse,
  },
})
export default class RouteOpetussuunnitelmaOppiaine2015 extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  get termit() {
    return [
      this.opetussuunnitelmaDataStore.perusteTermit,
      this.opetussuunnitelmaDataStore.termit,
    ];
  }

  get kuvat() {
    return this.opetussuunnitelmaDataStore.kuvat;
  }

  get oppiaineId() {
    return _.toNumber(this.$route.params.oppiaineId);
  }

  get oppiaine() {
    return this.opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: this.oppiaineId });
  }

  get kurssiId() {
    return _.toNumber(this.$route.params.kurssiId);
  }

  get sisaltoAvaimet() {
    return ['tehtava', 'tavoitteet', 'arviointi'];
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
