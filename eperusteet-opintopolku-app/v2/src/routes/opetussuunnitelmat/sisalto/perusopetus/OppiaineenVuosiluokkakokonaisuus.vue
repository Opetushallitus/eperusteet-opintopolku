<template>
  <div>

    <div v-if="perusteenVuosiluokkakokonaisuus">
      <ep-peruste-content
        :naytaSisaltoTyhjana="false"
        :perusteObject="perusteenVuosiluokkakokonaisuus.tehtava"
        :object="oppiaineenVuosiluokkakokonaisuus.tehtava"
        :pohjaObject="oppiaineenPohjanVuosiluokkakokonaisuus.tehtava"
        :kuvat="kuvat"
        :termit="termit"
      />

      <ep-peruste-content
        :naytaSisaltoTyhjana="false"
        :perusteObject="perusteenVuosiluokkakokonaisuus.tyotavat"
        :object="oppiaineenVuosiluokkakokonaisuus.tyotavat"
        :pohjaObject="oppiaineenPohjanVuosiluokkakokonaisuus.tyotavat"
        :kuvat="kuvat"
        :termit="termit"
      />

      <ep-peruste-content
        :naytaSisaltoTyhjana="false"
        :perusteObject="perusteenVuosiluokkakokonaisuus.ohjaus"
        :object="oppiaineenVuosiluokkakokonaisuus.ohjaus"
        :pohjaObject="oppiaineenPohjanVuosiluokkakokonaisuus.ohjaus"
        :kuvat="kuvat"
        :termit="termit"
      />

      <ep-peruste-content
        :naytaSisaltoTyhjana="false"
        :perusteObject="perusteenVuosiluokkakokonaisuus.arviointi"
        :object="oppiaineenVuosiluokkakokonaisuus.arviointi"
        :pohjaObject="oppiaineenPohjanVuosiluokkakokonaisuus.arviointi"
        :kuvat="kuvat"
        :termit="termit"
      />
    </div>

    <div v-else>

      <div class="mt-4 font-600">{{$t('vuosiluokat-joilla-esiintyy')}}</div>
      <ul>
        <li v-for="(vlk, index) in oppiaineenVuosiluokkakokonaisuus.vuosiluokat" :key="'vuosiluokkaes'+index">
          {{$t(vlk.vuosiluokka)}}
        </li>
      </ul>

      <div class="mt-4 font-600">{{$t('laajuus')}}</div>
      <div>{{oppiaine.laajuus}} {{$t('vuosiviikkotuntia')}}</div>

      <template v-if="oppiaineenVuosiluokkakokonaisuus.tehtava && oppiaineenVuosiluokkakokonaisuus.tehtava.teksti">
        <hr class="mt-5 mb-5" />
        <h3>{{$t('valinnaisen-tehtava')}}</h3>
        <ep-content-viewer :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.tehtava.teksti)" :kuvat="kuvat" :termit="termit"/>
      </template>

      <template v-if="oppiaineenVuosiluokkakokonaisuus.tyotavat && oppiaineenVuosiluokkakokonaisuus.tyotavat.teksti">
        <hr class="mt-5 mb-5" />
        <h3>{{$t('oppiaine-tyotavat')}}</h3>
        <ep-content-viewer :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.tyotavat.teksti)" :kuvat="kuvat" :termit="termit"/>
      </template>

      <template v-if="oppiaineenVuosiluokkakokonaisuus.ohjaus && oppiaineenVuosiluokkakokonaisuus.ohjaus.teksti">
        <hr class="mt-5 mb-5" />
        <h3>{{$t('oppiaine-ohjaus')}}</h3>
        <ep-content-viewer :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.ohjaus.teksti)" :kuvat="kuvat" :termit="termit"/>
      </template>

      <template v-if="oppiaineenVuosiluokkakokonaisuus.arviointi && oppiaineenVuosiluokkakokonaisuus.arviointi.teksti">
        <hr class="mt-5 mb-5" />
        <h3>{{$t('oppiaine-arviointi')}}</h3>
        <ep-content-viewer :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.arviointi.teksti)" :kuvat="kuvat" :termit="termit"/>
      </template>

      <template v-if="oppiaineenVuosiluokkakokonaisuus.tavoitteistaJohdetutOppimisenTavoitteet && oppiaineenVuosiluokkakokonaisuus.tavoitteistaJohdetutOppimisenTavoitteet.teksti">
        <hr class="mt-5 mb-5" />
        <h3>{{$t('oppiaine-tavoitteista-johdetut-oppimisen-tavoitteet')}}</h3>
        <ep-content-viewer :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.tavoitteistaJohdetutOppimisenTavoitteet.teksti)" :kuvat="kuvat" :termit="termit"/>
      </template>

    </div>

    <template v-if="vuosiluokat && vuosiluokat.length > 0">
      <hr class="mt-5 mb-5"/>

      <h3>{{$t('tavoitteet-ja-sisallot-vuosiluokittain')}}</h3>

      <b-tabs>
        <b-tab v-for="(vuosiluokka,index) in vuosiluokat" :key="'vuosiluokka'+index" :title="$t(vuosiluokka.vuosiluokka)">
          <oppiaineen-vuosiluokka :oppiaineenVuosiluokka="vuosiluokka" :valinnainen="!perusteenVuosiluokkakokonaisuus" :kuvat="kuvat" :termit="termit"/>
        </b-tab>
      </b-tabs>
    </template>

  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import EpPerusteContent from '@shared/components/EpPerusteContent/EpPerusteContent.vue';
import OppiaineenVuosiluokka from './OppiaineenVuosiluokka.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';

@Component({
  components: {
    EpPerusteContent,
    OppiaineenVuosiluokka,
    EpContentViewer,
  },
})
export default class OppiaineenVuosiluokkakokonaisuus extends Vue {
  @Prop({ required: true })
  private tietue!: any;

  @Prop({ required: true })
  private kuvat!: any[];

  @Prop({ required: true })
  private termit!: any[];

  get perusteenVuosiluokkakokonaisuus() {
    return this.tietue.oppiaineenPerusteenVuosiluokkakokonaisuus;
  }

  get oppiaineenVuosiluokkakokonaisuus() {
    return this.tietue.oppiaineenVuosiluokkakokonaisuus;
  }

  get oppiaineenPohjanVuosiluokkakokonaisuus() {
    return this.tietue.oppiaineenPohjanVuosiluokkakokonaisuus || {};
  }

  get vuosiluokkakokonaisuus() {
    return this.tietue.vuosiluokkakokonaisuus;
  }

  get oppiaine() {
    return this.tietue.oppiaine;
  }

  get vuosiluokat() {
    return _.sortBy(this.oppiaineenVuosiluokkakokonaisuus.vuosiluokat, 'vuosiluokka');
  }
}

</script>

<style scoped lang="scss">

  .font-600 {
    font-weight: 600;
  }

</style>
