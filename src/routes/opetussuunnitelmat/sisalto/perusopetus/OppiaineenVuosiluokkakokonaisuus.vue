<template>
  <div>

    <div v-if="perusteenVuosiluokkakokonaisuus">
      <ep-peruste-content
        :naytaSisaltoTyhjana="false"
        :perusteObject="perusteenVuosiluokkakokonaisuus.tehtava"
        :object="oppiaineenVuosiluokkakokonaisuus.tehtava"
        :pohjaObject="oppiaineenPohjanVuosiluokkakokonaisuus.tehtava"
        :kuvat="kuvat"
        :termit="termit">
        <h3 slot="otsikko" v-if="!perusteenVuosiluokkakokonaisuus.tehtava" class="mb-3">{{$t('tehtava')}}</h3>
      </ep-peruste-content>

      <template v-if="oppiaineenVuosiluokkakokonaisuus.yleistavoitteet && oppiaineenVuosiluokkakokonaisuus.yleistavoitteet.teksti">
        <h3 class="mt-5">{{$t('tavoitteet-ja-sisallot')}}</h3>
        <ep-content-viewer :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.yleistavoitteet.teksti)" :kuvat="kuvat" :termit="termit"/>
      </template>

      <ep-peruste-content
        :naytaSisaltoTyhjana="false"
        :perusteObject="perusteenVuosiluokkakokonaisuus.tyotavat"
        :object="oppiaineenVuosiluokkakokonaisuus.tyotavat"
        :pohjaObject="oppiaineenPohjanVuosiluokkakokonaisuus.tyotavat"
        :kuvat="kuvat"
        :termit="termit">
        <h3 slot="otsikko" v-if="!perusteenVuosiluokkakokonaisuus.tyotavat" class="mb-3">{{$t('tyotavat')}}</h3>
      </ep-peruste-content>

      <ep-peruste-content
        :naytaSisaltoTyhjana="false"
        :perusteObject="perusteenVuosiluokkakokonaisuus.ohjaus"
        :object="oppiaineenVuosiluokkakokonaisuus.ohjaus"
        :pohjaObject="oppiaineenPohjanVuosiluokkakokonaisuus.ohjaus"
        :kuvat="kuvat"
        :termit="termit">
        <h3 slot="otsikko" v-if="!perusteenVuosiluokkakokonaisuus.ohjaus" class="mb-3">{{$t('ohjaus')}}</h3>
      </ep-peruste-content>

      <ep-peruste-content
        :naytaSisaltoTyhjana="false"
        :perusteObject="perusteenVuosiluokkakokonaisuus.arviointi"
        :object="oppiaineenVuosiluokkakokonaisuus.arviointi"
        :pohjaObject="oppiaineenPohjanVuosiluokkakokonaisuus.arviointi"
        :kuvat="kuvat"
        :termit="termit">
        <h3 slot="otsikko" v-if="!perusteenVuosiluokkakokonaisuus.arviointi" class="mb-3">{{$t('arviointi')}}</h3>
      </ep-peruste-content>

      <template v-if="perusteenVuosiluokkakokonaisuus.vapaatTekstit">
        <div v-for="(vapaaTeksti, index) in perusteenVuosiluokkakokonaisuus.vapaatTekstit" :key="'vapaateksti'+index" class="mt-4">
          <h4>{{$kaanna(vapaaTeksti.nimi)}}</h4>
          <ep-content-viewer :value="$kaanna(vapaaTeksti.teksti)" :kuvat="kuvat" :termit="termit"/>
        </div>
      </template>
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

      <template v-if="hasTekstiContent(oppiaineenVuosiluokkakokonaisuus, 'tehtava') || hasTekstiContent(oppiaineenPohjanVuosiluokkakokonaisuus, 'tehtava')">
        <hr class="mt-5 mb-5" />
        <h3>{{$t('valinnaisen-tehtava')}}</h3>

        <ep-collapse class="mb-4 mt-3" :use-padding="false" tyyppi="pohjateksti" :border-bottom="false" :border-top="false"
          v-if="hasTekstiContent(oppiaineenPohjanVuosiluokkakokonaisuus, 'tehtava')">
          <template v-slot:header><h4>{{$t('pohjan-teksti')}}</h4></template>
          <span v-html="$kaanna(oppiaineenPohjanVuosiluokkakokonaisuus.tehtava.teksti)"></span>
        </ep-collapse>

        <template v-if="hasTekstiContent(oppiaineenVuosiluokkakokonaisuus, 'tehtava')">
          <h4>{{ $t('paikallinen-teksti') }}</h4>
          <ep-content-viewer :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.tehtava.teksti)" :kuvat="kuvat" :termit="termit"/>
        </template>
      </template>

      <template v-if="oppiaineenVuosiluokkakokonaisuus.yleistavoitteet && oppiaineenVuosiluokkakokonaisuus.yleistavoitteet.teksti">
        <hr class="mt-5 mb-5" />
        <h3>{{$t('tavoitteet-ja-sisallot')}}</h3>
        <ep-content-viewer :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.yleistavoitteet.teksti)" :kuvat="kuvat" :termit="termit"/>
      </template>

      <template v-if="hasTekstiContent(oppiaineenVuosiluokkakokonaisuus, 'tyotavat') || hasTekstiContent(oppiaineenPohjanVuosiluokkakokonaisuus, 'tyotavat')">
        <hr class="mt-5 mb-5" />
        <h3>{{$t('oppiaine-tyotavat')}}</h3>

        <ep-collapse class="mb-4 mt-3" :use-padding="false" tyyppi="pohjateksti" :border-bottom="false" :border-top="false"
          v-if="hasTekstiContent(oppiaineenPohjanVuosiluokkakokonaisuus, 'tyotavat')">
          <template v-slot:header><h4>{{$t('pohjan-teksti')}}</h4></template>
          <span v-html="$kaanna(oppiaineenPohjanVuosiluokkakokonaisuus.tyotavat.teksti)"></span>
        </ep-collapse>

        <template v-if="hasTekstiContent(oppiaineenVuosiluokkakokonaisuus, 'tyotavat')">
          <h4>{{ $t('paikallinen-teksti') }}</h4>
          <ep-content-viewer :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.tyotavat.teksti)" :kuvat="kuvat" :termit="termit"/>
        </template>
      </template>

      <template v-if="hasTekstiContent(oppiaineenVuosiluokkakokonaisuus, 'ohjaus') || hasTekstiContent(oppiaineenPohjanVuosiluokkakokonaisuus, 'ohjaus')">
        <hr class="mt-5 mb-5" />
        <h3>{{$t('oppiaine-ohjaus')}}</h3>

        <ep-collapse class="mb-4 mt-3" :use-padding="false" tyyppi="pohjateksti" :border-bottom="false" :border-top="false"
          v-if="hasTekstiContent(oppiaineenPohjanVuosiluokkakokonaisuus, 'ohjaus')">
          <template v-slot:header><h4>{{$t('pohjan-teksti')}}</h4></template>
          <span v-html="$kaanna(oppiaineenPohjanVuosiluokkakokonaisuus.ohjaus.teksti)"></span>
        </ep-collapse>

        <template v-if="hasTekstiContent(oppiaineenVuosiluokkakokonaisuus, 'ohjaus')">
          <h4>{{ $t('paikallinen-teksti') }}</h4>
          <ep-content-viewer :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.ohjaus.teksti)" :kuvat="kuvat" :termit="termit"/>
        </template>
      </template>

      <template v-if="hasTekstiContent(oppiaineenVuosiluokkakokonaisuus, 'arviointi') || hasTekstiContent(oppiaineenPohjanVuosiluokkakokonaisuus, 'arviointi')">
        <hr class="mt-5 mb-5" />
        <h3>{{$t('oppiaine-arviointi')}}</h3>

        <ep-collapse class="mb-4 mt-3" :use-padding="false" tyyppi="pohjateksti" :border-bottom="false" :border-top="false"
          v-if="hasTekstiContent(oppiaineenPohjanVuosiluokkakokonaisuus, 'arviointi')">
          <template v-slot:header><h4>{{$t('pohjan-teksti')}}</h4></template>
          <span v-html="$kaanna(oppiaineenPohjanVuosiluokkakokonaisuus.arviointi.teksti)"></span>
        </ep-collapse>

        <template v-if="hasTekstiContent(oppiaineenVuosiluokkakokonaisuus, 'arviointi')">
          <h4>{{ $t('paikallinen-teksti') }}</h4>
          <ep-content-viewer :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.arviointi.teksti)" :kuvat="kuvat" :termit="termit"/>
        </template>
      </template>

      <template v-if="hasTekstiContent(oppiaineenVuosiluokkakokonaisuus, 'tavoitteistaJohdetutOppimisenTavoitteet') || hasTekstiContent(oppiaineenPohjanVuosiluokkakokonaisuus, 'tavoitteistaJohdetutOppimisenTavoitteet')">
        <hr class="mt-5 mb-5" />
        <h3>{{$t('oppiaine-tavoitteista-johdetut-oppimisen-tavoitteet')}}</h3>

        <ep-collapse class="mb-4 mt-3" :use-padding="false" tyyppi="pohjateksti" :border-bottom="false" :border-top="false"
          v-if="hasTekstiContent(oppiaineenPohjanVuosiluokkakokonaisuus, 'tavoitteistaJohdetutOppimisenTavoitteet')">
          <template v-slot:header><h4>{{$t('pohjan-teksti')}}</h4></template>
          <span v-html="$kaanna(oppiaineenPohjanVuosiluokkakokonaisuus.tavoitteistaJohdetutOppimisenTavoitteet.teksti)"></span>
        </ep-collapse>

        <template v-if="hasTekstiContent(oppiaineenVuosiluokkakokonaisuus, 'tavoitteistaJohdetutOppimisenTavoitteet')">
          <h4>{{ $t('paikallinen-teksti') }}</h4>
          <ep-content-viewer :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.tavoitteistaJohdetutOppimisenTavoitteet.teksti)" :kuvat="kuvat" :termit="termit"/>
        </template>
      </template>

    </div>

    <template v-if="vuosiluokat && vuosiluokat.length > 0">
      <hr class="mt-5 mb-5"/>

      <h3>{{$t('tavoitteet-ja-sisallot-vuosiluokittain')}}</h3>

      <b-tabs>
        <b-tab v-for="(vuosiluokka,index) in vuosiluokat" :key="'vuosiluokka'+index" :title="$t(vuosiluokka.vuosiluokka)">
          <oppiaineen-vuosiluokka
            :oppiaineenVuosiluokka="vuosiluokka"
            :valinnainen="!perusteenVuosiluokkakokonaisuus"
            :pohjaOppiaineenVuosiluokka="pohjanVuosiluokat[vuosiluokka.vuosiluokka]"
            :kuvat="kuvat"
            :termit="termit"/>
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
    return this.tietue.perusteenOppiaineenVlk;
  }

  get oppiaineenVuosiluokkakokonaisuus() {
    return this.tietue.oppiaineenVuosiluokkakokonaisuus;
  }

  get oppiaineenPohjanVuosiluokkakokonaisuus() {
    return this.tietue.oppiaineenPohjanVuosiluokkakokonaisuus || {};
  }

  get pohjanVuosiluokat() {
    return _.keyBy(this.oppiaineenPohjanVuosiluokkakokonaisuus.vuosiluokat, 'vuosiluokka');
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

  hasTekstiContent(object, key) {
    return object != null && object[key] != null && object[key].teksti != null;
  }
}

</script>

<style scoped lang="scss">

  .font-600 {
    font-weight: 600;
  }

</style>
