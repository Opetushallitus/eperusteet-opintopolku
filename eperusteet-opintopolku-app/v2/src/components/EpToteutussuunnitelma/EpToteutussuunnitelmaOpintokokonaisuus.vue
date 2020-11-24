<template>
  <div>
    <b-row>
      <b-col><h2 class="mb-4">{{$kaanna(sisaltoviite.tekstiKappale.nimi)}}</h2></b-col>
    </b-row>
    <b-row>
      <b-col md="6">
        <ep-form-content name="opintokokonaisuuden-nimi">
          <span>{{$kaanna(sisaltoviite.tekstiKappale.nimi)}}</span>
        </ep-form-content>
      </b-col>
      <b-col md="6">
        <ep-form-content name="laajuus">
          <span>{{$kaanna(sisaltoviite.opintokokonaisuus.laajuus)}} {{$t('opintopiste')}}</span>
        </ep-form-content>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <ep-form-content name="kuvaus">
          <span v-html="$kaanna(sisaltoviite.opintokokonaisuus.kuvaus)"></span>
        </ep-form-content>
      </b-col>
    </b-row>
    <hr>
    <b-row>
      <b-col><h3 class="mt-3 mb-4">{{ $t('opetuksen-tavoitteet') }}</h3></b-col>
    </b-row>
    <b-row>
      <b-col>
        <ep-form-content name="tavoitteiden-kuvaus">
          <span v-html="$kaanna(sisaltoviite.opintokokonaisuus.tavoitteidenKuvaus)"></span>
        </ep-form-content>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h4>{{ $kaanna(sisaltoviite.opintokokonaisuus.opetuksenTavoiteOtsikko) }}</h4>
        <ul>
          <li v-for="tavoiteItem in sisaltoviite.opintokokonaisuus.tavoitteet" :key="tavoiteItem.id">
            {{ tavoiteItem.tavoite }}
          </li>
        </ul>
      </b-col>
    </b-row>
    <template v-if="sisaltoviite.opintokokonaisuus.keskeisetSisallot">
      <hr>
      <b-row>
        <b-col>
          <ep-form-content name="keskeiset-sisallot" headerType="h3" headerClass="mt-3 mb-4">
            <span v-html="$kaanna(sisaltoviite.opintokokonaisuus.keskeisetSisallot)"></span>
          </ep-form-content>
        </b-col>
      </b-row>
    </template>
    <hr>
    <b-row>
      <b-col>
        <h3 class="mt-3 mb-4">{{ $t('arviointi') }}</h3>
      </b-col>
    </b-row>
    <b-row v-if="sisaltoviite.opintokokonaisuus.arvioinninKuvaus">
      <b-col>
        <ep-form-content name="arvioinnin-kuvaus">
          <span v-html="$kaanna(sisaltoviite.opintokokonaisuus.arvioinninKuvaus)"></span>
        </ep-form-content>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h4>{{ $t('opiskelijan-osaamisen-arvioinnin-kohteet') }}</h4>
        <ul>
          <li v-for="arviointiItem in sisaltoviite.opintokokonaisuus.arvioinnit" :key="arviointiItem.id">
            {{ $kaanna(arviointiItem.arviointi) }}
          </li>
        </ul>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { Matala, OpetussuunnitelmaDto } from '@shared/api/amosaa';

import EpFormContent from '@shared/components/forms/EpFormContent.vue';

@Component({
  components: {
    EpFormContent
  }
})
export default class EpToteutussuunnitelmaOpintokokonaisuus extends Vue {
    @Prop({ required: true })
    private sisaltoviite!: Matala;
}
</script>

<style scoped lang="scss">

</style>
