<template>
  <div class="content">
    <template v-if="perusteenOsa">
      <h2 class="mb-4">
        <span v-if="numerointi">{{numerointi}}</span>
        {{ $kaanna(nimi) }}
      </h2>
      <b-row>
        <b-col lg="6" md="12">
          <ep-form-content name="koulutuksen-osan-nimi" headerType="h4">
            <span>{{$kaanna(nimi)}}</span>
          </ep-form-content>
        </b-col>
        <b-col lg="6" md="12">
          <ep-form-content name="laajuus" headerType="h4">
            <span>{{perusteenOsa.laajuusMinimi}} - {{perusteenOsa.laajuusMaksimi}} {{$t('viikkoa')}}</span>
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
            <h4 >{{ $t('opiskelija') }}</h4>
            <ul>
              <li v-for="tavoite in perusteenOsa.tavoitteet" :key="tavoite._id">
                {{ $kaanna(tavoite) }}
              </li>
            </ul>
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
      <template v-if="perusteenOsa.keskeinenSisalto">
        <hr/>
        <b-row>
          <b-col>
            <h3 class="mt-3 mb-4">{{ $t('keskeinen-sisalto') }}</h3>
            <ep-content-viewer :value="$kaanna(perusteenOsa.keskeinenSisalto)" :kuvat="kuvat"/>
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

      <EpOpasKiinnitysLinkki :koodiUri="koulutuksenosaKoodiUri"/>

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
import EpOpasKiinnitysLinkki from '@shared/components/EpOpasKiinnitysLinkki/EpOpasKiinnitysLinkki.vue';
import _ from 'lodash';

@Component({
  components: {
    EpContentViewer,
    EpFormContent,
    EpSpinner,
    EpOpasKiinnitysLinkki,
  },
})
export default class RouteKoulutuksenOsa extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private perusteenOsaStore!: PerusteenOsaStore;

  get perusteenOsa() {
    return this.perusteenOsaStore.perusteenOsa;
  }

  get current() {
    return this.perusteDataStore.current || null;
  }

  get kuvat() {
    return this.perusteDataStore.kuvat;
  }

  get koulutuksenosaKoodiUri() {
    return (this.perusteenOsa as any)?.nimiKoodi?.uri;
  }

  get nimi() {
    return _.get(this.perusteenOsa, 'nimiKoodi') ? _.get(this.perusteenOsa, 'nimiKoodi.nimi') : _.get(this.perusteenOsa, 'nimi');
  }

  get numerointi() {
    return this.current?.meta?.numerointi;
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
