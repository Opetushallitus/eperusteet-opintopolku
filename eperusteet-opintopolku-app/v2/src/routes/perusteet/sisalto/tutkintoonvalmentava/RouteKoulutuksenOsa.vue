<template>
  <div class="content">
    <template v-if="perusteenOsa">
      <h2 class="mb-4">{{ $kaanna(perusteenOsa.nimi) }}</h2>
      <b-row>
        <b-col lg="6" md="12">
          <ep-form-content name="koulutuksen-osan-nimi" headerType="h4">
            <span>{{$kaanna(perusteenOsa.nimi)}}</span>
          </ep-form-content>
        </b-col>
        <b-col lg="6" md="12">
          <ep-form-content name="laajuus" headerType="h4">
            <span>{{perusteenOsa.laajuusMinimi}} - {{perusteenOsa.laajuusMaksimi}}</span>
          </ep-form-content>
        </b-col>
      </b-row>
      <b-row v-if="perusteenOsa.kuvaus">
        <b-col>
          <h4>{{$t('kuvaus')}}</h4>
          <ep-content-viewer name="kuvaus" :value="$kaanna(perusteenOsa.kuvaus)" :kuvat="kuvat" />
        </b-col>
      </b-row>
      <template v-if="perusteenOsa.tavoitteet.length > 0">
        <hr/>
        <b-row>
          <b-col>
            <h3 class="mt-3 mb-4">{{ $t('tavoitteet') }}</h3>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <h4 v-if="perusteenOsa.tavoitteenKuvaus">{{$kaanna(perusteenOsa.tavoitteenKuvaus)}}</h4>
            <h4 v-else>{{ $t('opiskelija') }}</h4>
            <ul>
              <li v-for="tavoite in perusteenOsa.tavoitteet" :key="tavoite._id">
                {{ $kaanna(tavoite) }}
              </li>
            </ul>
          </b-col>
        </b-row>
      </template>
      <template v-if="perusteenOsa.keskeinenSisalto">
        <hr/>
        <b-row>
          <b-col>
            <h3 class="mt-3 mb-4">{{ $t('keskeinen-sisalto') }}</h3>
            <ep-content-viewer :value="$kaanna(perusteenOsa.keskeinenSisalto)" :kuvat="kuvat"/>
          </b-col>
        </b-row>
      </template>
      <template v-if="perusteenOsa.laajaAlaisenOsaamisenKuvaus">
        <hr/>
        <b-row>
          <b-col>
            <h3 class="mt-3 mb-4">{{ $t('laaja-alainen-osaaminen') }}</h3>
            <ep-content-viewer :value="$kaanna(perusteenOsa.laajaAlaisenOsaamisenKuvaus)" :kuvat="kuvat"/>
          </b-col>
        </b-row>
      </template>
      <template v-if="perusteenOsa.arvioinninKuvaus">
        <hr/>
        <b-row>
          <b-col>
            <h3 class="mt-3 mb-4">{{ $t('arviointi') }}</h3>
            <ep-content-viewer :value="$kaanna(perusteenOsa.arvioinninKuvaus)" :kuvat="kuvat"/>
          </b-col>
        </b-row>
      </template>
      <b-row v-if="perusteenOsa.osaamisenArvioinnista">
        <b-col>
          <h4>{{ $t('osaamisen-arvioinnista') }}</h4>
          <ep-content-viewer :value="$kaanna(perusteenOsa.osaamisenArvioinnista)" :kuvat="kuvat"/>
        </b-col>
      </b-row>
      <slot name="previous-next-navigation" />
    </template>
    <ep-spinner v-else />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { PerusteDataStore } from '@/stores/PerusteDataStore';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';

import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';

@Component({
  components: {
    EpContentViewer,
    EpFormContent,
    EpSpinner,
  },
})
export default class RouteKoulutuksenOsa extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private perusteenOsaStore!: PerusteenOsaStore;

  @Watch('current', { immediate: true })
  async fetchAlikappaleet() {
    if (!this.current) {
      return;
    }
    const isMainHeading = !!this.current && this.current.path.length === 2;
    await this.perusteenOsaStore.fetchPerusteenOsa(isMainHeading);
  }

  get perusteenOsa() {
    return this.perusteenOsaStore.perusteenOsa;
  }

  get current() {
    return this.perusteDataStore.current || null;
  }

  get kuvat() {
    return this.perusteDataStore.kuvat;
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
