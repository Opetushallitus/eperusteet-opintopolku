<template>
  <div class="content">
    <div v-if="kurssi">
      <h2 class="otsikko">
        {{ $kaanna(kurssi.nimi) }} <span v-if="kurssi.koodiArvo">({{ kurssi.koodiArvo }})</span>
      </h2>

      <EpCollapse
        v-if="kurssi.perusteen && kurssi.perusteen.kuvaus"
        :border-bottom="false"
        :shadow="true"
        class="mb-4"
      >
        <template #header>
          <div>
            {{ $t('tukiteksti') }}
          </div>
        </template>
        <ep-content-viewer
          :value="$kaanna(kurssi.perusteen.kuvaus)"
          :termit="termit"
          :kuvat="kuvat"
        />
      </EpCollapse>

      <div
        v-for="(sisaltoavain, index) in sisaltoAvaimet"
        :key="'sisaltoavain'+index"
        class="mt-4"
      >
        <div
          v-if="(kurssi[sisaltoavain] && kurssi[sisaltoavain].teksti)
            || (kurssi.perusteen && kurssi.perusteen[sisaltoavain] && kurssi.perusteen[sisaltoavain].teksti)"
          class="mt-4"
        >
          <h3>{{ $kaanna((kurssi[sisaltoavain] && kurssi[sisaltoavain].otsikko) || kurssi.perusteen[sisaltoavain].otsikko) }}</h3>

          <EpCollapse
            v-if="kurssi.perusteen && kurssi.perusteen[sisaltoavain]"
            :border-bottom="false"
            :shadow="true"
            class="mb-4"
            :expanded-by-default="!(kurssi[sisaltoavain] && kurssi[sisaltoavain].teksti)"
          >
            <template #header>
              <div>
                {{ $t('tukiteksti') }}
              </div>
            </template>
            <ep-content-viewer
              :value="$kaanna(kurssi.perusteen[sisaltoavain].teksti)"
              :termit="termit"
              :kuvat="kuvat"
            />
          </EpCollapse>

          <ep-content-viewer
            v-if="kurssi[sisaltoavain]"
            :value="$kaanna(kurssi[sisaltoavain].teksti)"
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
import * as _ from 'lodash';
import { Prop, Component, Vue } from 'vue-property-decorator';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';

@Component({
  components: {
    EpCollapse,
    EpContentViewer,
    EpSpinner,
  },
})
export default class RouteOpetussuunnitelmaKurssi extends Vue {
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

  get kurssiId() {
    return _.toNumber(this.$route.params.kurssiId);
  }

  get kurssi() {
    return this.opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: this.kurssiId });
  }

  get sisaltoAvaimet() {
    return ['tavoitteetJaKeskeinenSisalto', 'tavoitteetJaKeskeisetSisallot', 'tehtava', 'tavoitteet', 'keskeinenSisalto', 'keskeisetSisallot'];
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}

</style>
