<template>
  <div>

    <div v-if="perusteenVuosiluokkakokonaisuus">
      <ep-peruste-content
        :naytaSisaltoTyhjana="false"
        :perusteObject="perusteenVuosiluokkakokonaisuus.tehtava"
        :object="oppiaineenVuosiluokkakokonaisuus.tehtava"
        :kuvat="kuvat"
      />

      <ep-peruste-content
        :naytaSisaltoTyhjana="false"
        :perusteObject="perusteenVuosiluokkakokonaisuus.tyotavat"
        :object="oppiaineenVuosiluokkakokonaisuus.tyotavat"
        :kuvat="kuvat"
      />

      <ep-peruste-content
        :naytaSisaltoTyhjana="false"
        :perusteObject="perusteenVuosiluokkakokonaisuus.ohjaus"
        :object="oppiaineenVuosiluokkakokonaisuus.ohjaus"
        :kuvat="kuvat"
      />

      <ep-peruste-content
        :naytaSisaltoTyhjana="false"
        :perusteObject="perusteenVuosiluokkakokonaisuus.arviointi"
        :object="oppiaineenVuosiluokkakokonaisuus.arviointi"
        :kuvat="kuvat"
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

      <hr class="mt-5 mb-5" />
      <h3>{{$t('valinnaisen-tehtava')}}</h3>
      <ep-content-viewer :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.tehtava.teksti)" :kuvat="kuvat" />

      <hr class="mt-5 mb-5" />

      <h3>{{$t('oppiaine-tyotavat')}}</h3>
      <ep-content-viewer :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.tyotavat.teksti)" :kuvat="kuvat" />

      <hr class="mt-5 mb-5" />

      <h3>{{$t('oppiaine-ohjaus')}}</h3>
      <ep-content-viewer :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.ohjaus.teksti)" :kuvat="kuvat" />

      <hr class="mt-5 mb-5" />

      <h3>{{$t('oppiaine-arviointi')}}</h3>
      <ep-content-viewer :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.arviointi.teksti)" :kuvat="kuvat" />

      <hr class="mt-5 mb-5" />

      <h3>{{$t('oppiaine-tavoitteista-johdetut-oppimisen-tavoitteet')}}</h3>
      <ep-content-viewer :value="$kaanna(oppiaineenVuosiluokkakokonaisuus.tavoitteistaJohdetutOppimisenTavoitteet.teksti)" :kuvat="kuvat" />

    </div>

    <hr class="mt-5 mb-5"/>

    <h3>{{$t('tavoitteet-ja-sisallot-vuosiluokittain')}}</h3>

    <b-tabs>
      <b-tab v-for="(vuosiluokka,index) in vuosiluokat" :key="'vuosiluokka'+index" :title="$t(vuosiluokka.vuosiluokka)">

        <oppiaineen-vuosiluokka :oppiaineenVuosiluokka="vuosiluokka" :valinnainen="!perusteenVuosiluokkakokonaisuus" :kuvat="kuvat"/>

      </b-tab>
    </b-tabs>

  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { OpetussuunnitelmaOppiaineStore } from '@/stores/OpetussuunnitelmaOppiaineStore';
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

  get perusteenVuosiluokkakokonaisuus() {
    return this.tietue.oppiaineenPerusteenVuosiluokkakokonaisuus;
  }

  get oppiaineenVuosiluokkakokonaisuus() {
    return this.tietue.oppiaineenVuosiluokkakokonaisuus;
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
