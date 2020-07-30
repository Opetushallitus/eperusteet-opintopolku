<template>
  <div>

    <div v-if="perusteenVuosiluokkakokonaisuus">
      <ep-peruste-content
        :naytaSisaltoTyhjana="false"
        :perusteObject="perusteenVuosiluokkakokonaisuus.tehtava"
        :object="oppiaineenVuosiluokkakokonaisuus.tehtava"
      />

      <ep-peruste-content
        :naytaSisaltoTyhjana="false"
        :perusteObject="perusteenVuosiluokkakokonaisuus.tyotavat"
        :object="oppiaineenVuosiluokkakokonaisuus.tyotavat"
      />

      <ep-peruste-content
        :naytaSisaltoTyhjana="false"
        :perusteObject="perusteenVuosiluokkakokonaisuus.ohjaus"
        :object="oppiaineenVuosiluokkakokonaisuus.ohjaus"
      />

      <ep-peruste-content
        :naytaSisaltoTyhjana="false"
        :perusteObject="perusteenVuosiluokkakokonaisuus.arviointi"
        :object="oppiaineenVuosiluokkakokonaisuus.arviointi"
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
      <div v-html="$kaanna(oppiaineenVuosiluokkakokonaisuus.tehtava.teksti)" />

      <hr class="mt-5 mb-5" />

      <h3>{{$t('oppiaine-tyotavat')}}</h3>
      <div v-html="$kaanna(oppiaineenVuosiluokkakokonaisuus.tyotavat.teksti)" />

      <hr class="mt-5 mb-5" />

      <h3>{{$t('oppiaine-ohjaus')}}</h3>
      <div v-html="$kaanna(oppiaineenVuosiluokkakokonaisuus.ohjaus.teksti)" />

      <hr class="mt-5 mb-5" />

      <h3>{{$t('oppiaine-arviointi')}}</h3>
      <div v-html="$kaanna(oppiaineenVuosiluokkakokonaisuus.arviointi.teksti)" />

      <hr class="mt-5 mb-5" />

      <h3>{{$t('oppiaine-tavoitteista-johdetut-oppimisen-tavoitteet')}}</h3>
      <div v-html="$kaanna(oppiaineenVuosiluokkakokonaisuus.tavoitteistaJohdetutOppimisenTavoitteet.teksti)" />

    </div>

    <hr class="mt-5 mb-5"/>

    <h3>{{$t('tavoitteet-ja-sisallot-vuosiluokittain')}}</h3>

    <b-tabs>
      <b-tab v-for="(vuosiluokka,index) in vuosiluokat" :key="'vuosiluokka'+index" :title="$t(vuosiluokka.vuosiluokka)">

        <oppiaineen-vuosiluokka :oppiaineenVuosiluokka="vuosiluokka" :valinnainen="!perusteenVuosiluokkakokonaisuus" />

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

@Component({
  components: {
    EpPerusteContent,
    OppiaineenVuosiluokka,
  },
})
export default class OppiaineenVuosiluokkakokonaisuus extends Vue {
  @Prop({ required: true })
  private tietue!: any;

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
