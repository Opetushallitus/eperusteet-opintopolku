<template>
  <div>
    <b-row>
      <b-col><h2 class="mb-4">{{$kaanna(sisaltoviite.tekstiKappale.nimi)}}</h2></b-col>
    </b-row>
    <b-row>
      <b-col md="6">
        <ep-form-content :name="$t(opintokokonaisuusNimiOtsikko(opintokokonaisuus.tyyppi))" headerType="h4">
          <span>{{$kaanna(sisaltoviite.nimi)}}</span>
        </ep-form-content>
      </b-col>
      <b-col md="6">
        <ep-form-content name="laajuus" headerType="h4">
          <span v-if="opintokokonaisuus.laajuus && laajuusYksikkoLyhenne">{{ opintokokonaisuus.laajuus }} {{ laajuusYksikkoLyhenne }}</span>
          <span v-else>-</span>
        </ep-form-content>
      </b-col>
    </b-row>
    <b-row v-if="opintokokonaisuus.koodiArvo" class="mb-4">
      <b-col>
        <h4>{{$t('opintokokonaisuuden-koodi')}}</h4>
        <div>{{opintokokonaisuus.koodiArvo}}</div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h4 role="presentation">{{ $t('kuvaus') }}</h4>
        <ep-content-viewer :value="$kaanna(opintokokonaisuus.kuvaus)" :kuvat="kuvat"/>
      </b-col>
    </b-row>
    <hr>
    <b-row>
      <b-col><h3 class="mt-3 mb-4">{{ $t('opetuksen-tavoitteet') }}</h3></b-col>
    </b-row>
    <b-row v-if="opintokokonaisuus.tavoitteidenKuvaus">
      <b-col>
        <h4>{{ $t('tavoitteiden-kuvaus') }}</h4>
        <ep-content-viewer :value="$kaanna(opintokokonaisuus.tavoitteidenKuvaus)" :kuvat="kuvat"/>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h4>{{ $kaanna(opintokokonaisuus.opetuksenTavoiteOtsikko) }}</h4>
        <ul>
          <li v-for="tavoiteItem in opintokokonaisuus.tavoitteet" :key="tavoiteItem.id">
            {{ $kaanna(tavoiteItem.tavoite) }}
          </li>
        </ul>
      </b-col>
    </b-row>
    <template v-if="opintokokonaisuus.keskeisetSisallot">
      <hr>
      <b-row>
        <b-col>
          <h3 class="mt-3 mb-4">{{ $t('keskeiset-sisallot') }}</h3>
          <ep-content-viewer :value="$kaanna(opintokokonaisuus.keskeisetSisallot)" :kuvat="kuvat"/>
        </b-col>
      </b-row>
    </template>
    <hr>
    <b-row>
      <b-col>
        <h3 class="mt-3 mb-4">{{ $t('arviointi') }}</h3>
      </b-col>
    </b-row>
    <b-row v-if="opintokokonaisuus.arvioinninKuvaus">
      <b-col>
        <h4>{{ $t('arvioinnin-kuvaus') }}</h4>
        <ep-content-viewer :value="$kaanna(opintokokonaisuus.arvioinninKuvaus)" :kuvat="kuvat"/>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h4>{{ $t('opiskelijan-osaamisen-arvioinnin-kohteet') }}</h4>
        <ul>
          <li v-for="arviointiItem in opintokokonaisuus.arvioinnit" :key="arviointiItem.id">
            {{ $kaanna(arviointiItem.arviointi) }}
          </li>
        </ul>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Matala, OpintokokonaisuusDtoTyyppiEnum } from '@shared/api/amosaa';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import * as _ from 'lodash';

@Component({
  components: {
    EpFormContent,
    EpContentViewer,
  },
})
export default class EpToteutussuunnitelmaOpintokokonaisuus extends Vue {
    @Prop({ required: true })
    private sisaltoviite!: Matala;

    @Prop({ required: true })
    private kuvat!: any[];

    get opintokokonaisuus() {
      return this.sisaltoviite.opintokokonaisuus;
    }

    opintokokonaisuusNimiOtsikko(tyyppi: OpintokokonaisuusDtoTyyppiEnum): string {
      return {
        [_.toLower(OpintokokonaisuusDtoTyyppiEnum.OMA)]: 'opintokokonaisuuden-nimi',
        [_.toLower(OpintokokonaisuusDtoTyyppiEnum.PERUSTEESTA)]: 'osaamiskokonaisuuden-nimi',
      }[tyyppi];
    }

    get laajuusYksikkoLyhenne() {
      return this.opintokokonaisuus?.laajuusYksikko
        ? this.$t(_.toLower(this.opintokokonaisuus?.laajuusYksikko) + '-lyhenne')
        : this.$t('opintopiste');
    }
}
</script>

<style scoped lang="scss">

</style>
