<template>
  <div v-if="sisaltoviite">
    <h2 class="otsikko mb-4" slot="header">{{ $kaanna(sisaltoviite.tekstiKappale.nimi)}}, {{laajuus}} {{$t('osaamispiste')}}</h2>

    <div class="d-flex">
      <ep-form-content name="luotu" class="flex-fill" v-if="luotu">
        {{$sd(luotu)}}
      </ep-form-content>

      <ep-form-content name="muokattu" class="flex-fill" v-if="muokattu">
        {{$sd(muokattu)}}
      </ep-form-content>
    </div>

    <ep-form-content class="col-md-12 mt-4" name="kuvaus" v-if="hasKuvaus">
      <ep-content-viewer :value="$kaanna(sisaltoviite.tekstiKappale.teksti)" :kuvat="kuvat"/>
      <ep-content-viewer v-if="perusteenTutkinnonosa && perusteenTutkinnonosa.kuvaus" :value="$kaanna(perusteenTutkinnonosa.kuvaus)" :kuvat="kuvat"/>
    </ep-form-content>

    <ep-form-content class="col-md-12 mt-4" v-for="(vapaa, index) in sisaltoviite.tosa.vapaat" :key="'tosavapaateksti'+index">
      <label slot="header">{{$kaanna(vapaa.nimi)}}</label>
      <ep-content-viewer :value="$kaanna(vapaa.teksti)" :kuvat="kuvat"/>
    </ep-form-content>

    <ep-form-content class="col-md-12 mt-4 mb-5" name="koulutuksen-jarjestajan-toteutus" v-if="sisaltoviite.tosa.toteutukset && sisaltoviite.tosa.toteutukset.length > 0">

      <ep-collapse class="mb-3" v-for="toteutus in sisaltoviite.tosa.toteutukset" :key="toteutus.id"
        :shadow="true"
        :borderBottom="false"
        :togglefull="true"
        :expandedByDefault="sisaltoviite.tosa.toteutukset.length === 1">
        <div class="font-600" slot="header">{{$kaanna(toteutus.otsikko)}}</div>

        <template v-if="toteutus.tutkintonimikkeetJaOsaamisalat.length > 0">
          <div class="font-600 mt-3">{{$t('tutkintonimikkeet-ja-osaamisalat')}}</div>
          <b-table striped :items="toteutus.tutkintonimikkeetJaOsaamisalat" :fields="koodiFields" />
        </template>

        <div v-if="toteutus.tavatjaymparisto">
          <ep-form-content class="col-md-12" name="tavat-ja-ymparisto">
            <ep-content-viewer :value="$kaanna(toteutus.tavatjaymparisto.teksti)" :kuvat="kuvat"/>
          </ep-form-content>

          <hr/>
        </div>

        <div v-if="toteutus.arvioinnista">
          <ep-form-content class="col-md-12" name="osaamisen-arvioinnista">
            <ep-content-viewer :value="$kaanna(toteutus.arvioinnista.teksti)" :kuvat="kuvat"/>
          </ep-form-content>

          <hr/>
        </div>

        <div v-if="toteutus.vapaat && toteutus.vapaat.length > 0">
          <ep-form-content class="col-md-12 mt-4" v-for="(vapaa, index) in toteutus.vapaat" :key="'vapaa'+index">
            <label slot="header">{{$kaanna(vapaa.nimi)}}</label>
            <ep-content-viewer :value="$kaanna(vapaa.teksti)" :kuvat="kuvat"/>
            <hr v-if="index < toteutus.length-1"/>
          </ep-form-content>
        </div>

      </ep-collapse>

    </ep-form-content>

    <div v-if="sisaltoviite.tosa.omatutkinnonosa">

      <div v-if="sisaltoviite.tosa.omatutkinnonosa.tavoitteet" class="mb-4">
        <ep-form-content class="col-md-12" name="tavoitteet">
          <ep-content-viewer :value="$kaanna(sisaltoviite.tosa.omatutkinnonosa.tavoitteet)" :kuvat="kuvat"/>
        </ep-form-content>
        <hr/>
      </div>

      <div v-if="sisaltoviite.tosa.omatutkinnonosa.ammattitaitovaatimuksetLista && sisaltoviite.tosa.omatutkinnonosa.ammattitaitovaatimuksetLista.length > 0" class="mb-4">
        <ep-form-content class="col-md-12" name="ammattitaitovaatimukset">

          <div v-for="(ammattitaitovaatimus, index) in sisaltoviite.tosa.omatutkinnonosa.ammattitaitovaatimuksetLista" :key="'atv'+index">
            <div v-for="(vaatimuskohde, index) in ammattitaitovaatimus.vaatimuksenKohteet" :key="'vkohde'+index">
              <div class="font-600">{{$kaanna(vaatimuskohde.otsikko)}}</div>
              <ul>
                <li v-for="(vaatimus, index) in vaatimuskohde.vaatimukset" :key="'vaatimus'+index">
                  {{$kaanna(vaatimus.selite)}}
                </li>
              </ul>
            </div>
          </div>

        </ep-form-content>
        <hr/>
      </div>

      <div v-if="sisaltoviite.tosa.omatutkinnonosa.arviointi && sisaltoviite.tosa.omatutkinnonosa.arviointi.arvioinninKohdealueet" class="mb-5">
        <ep-ammatillinen-arvioinnin-kohdealueet
          :arviointiasteikot="arviointiasteikot"
          :arvioinninKohdealueet="sisaltoviite.tosa.omatutkinnonosa.arviointi.arvioinninKohdealueet"/>
        <hr/>
      </div>

      <ep-form-content class="col-md-12" v-if="sisaltoviite.tosa.omatutkinnonosa.ammattitaidonOsoittamistavat" name="tavoitteet">
        <ep-content-viewer :value="$kaanna(sisaltoviite.tosa.omatutkinnonosa.ammattitaidonOsoittamistavat)" :kuvat="kuvat"/>
      </ep-form-content>

    </div>

    <div v-if="perusteenTutkinnonosa">
      <h3>{{ $t('perusteen-sisalto') }}</h3>

      <ep-form-content class="col-md-12 mb-5" v-if="perusteenTutkinnonosa.ammattitaitovaatimukset" name="ammattitaitovaatimukset">
        <ep-content-viewer :value="$kaanna(perusteenTutkinnonosa.ammattitaitovaatimukset)" :kuvat="kuvat"/>
      </ep-form-content>

      <ep-ammatillinen-arvioinnin-kohdealueet
        v-if="perusteenTutkinnonosa.arviointi && perusteenTutkinnonosa.arviointi.arvioinninKohdealueet"
        :arviointiasteikot="arviointiasteikot"
        :arvioinninKohdealueet="perusteenTutkinnonosa.arviointi.arvioinninKohdealueet"/>

      <ep-form-content class="col-md-12 mb-5" v-if="perusteenTutkinnonosa.ammattitaidonOsoittamistavat" name="ammattitaidon-osoittamistavat">
        <ep-content-viewer :value="$kaanna(perusteenTutkinnonosa.ammattitaidonOsoittamistavat)" :kuvat="kuvat"/>
      </ep-form-content>

      <ep-form-content class="col-md-12 mb-5" v-if="pakollisetOsaAlueet && pakollisetOsaAlueet.length > 0" name="pakolliset-osa-alueet">
        <ep-ammatillinen-osaalueet :arviointiasteikot="arviointiasteikot" :osaalueet="pakollisetOsaAlueet" />
      </ep-form-content>

      <ep-form-content class="col-md-12 mb-5" v-if="valinnaisetOsaAlueet && valinnaisetOsaAlueet.length > 0" name="valinnaiset-osa-alueet">
        <ep-ammatillinen-osaalueet :arviointiasteikot="arviointiasteikot" :osaalueet="valinnaisetOsaAlueet" />
      </ep-form-content>

    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpAmmatillinenArvioinninKohdealueet from '@/components/EpAmmatillinen/EpAmmatillinenArvioinninKohdealueet.vue';
import EpAmmatillinenOsaalueet from '@/components/EpAmmatillinen/EpAmmatillinenOsaalueet.vue';
import * as _ from 'lodash';

@Component({
  components: {
    EpFormContent,
    EpContentViewer,
    EpCollapse,
    EpAmmatillinenArvioinninKohdealueet,
    EpAmmatillinenOsaalueet,
  },
})
export default class EpToteutussuunnitelmaTutkinnonosa extends Vue {
  @Prop({ required: true })
  private sisaltoviite!: any;

  @Prop({ required: true })
  private perusteenTutkinnonosaViite!: any;

  @Prop({ required: true })
  private perusteenTutkinnonosa!: any;

  @Prop({ required: true })
  private kuvat!: any[];

  @Prop({ required: true })
  private arviointiasteikot!: any[];

  get hasKuvaus() {
    return this.sisaltoviite.tekstiKappale.teksti || (this.perusteenTutkinnonosa && this.perusteenTutkinnonosa.kuvaus);
  }

  get luotu() {
    if (this.perusteenTutkinnonosa) {
      return this.perusteenTutkinnonosa.luotu;
    }
  }

  get muokattu() {
    if (this.perusteenTutkinnonosa) {
      return this.perusteenTutkinnonosa.muokattu;
    }
    else if (this.sisaltoviite.tosa) {
      return this.sisaltoviite.tosa.muokattu;
    }
  }

  get laajuus() {
    if (this.perusteenTutkinnonosaViite) {
      return this.perusteenTutkinnonosaViite.laajuus;
    }
    else if (this.sisaltoviite.tosa.omatutkinnonosa) {
      return this.sisaltoviite.tosa.omatutkinnonosa.laajuus;
    }
  }

  get koodiFields() {
    return [{
      key: 'nimi',
      label: this.$t('nimi') as string,
      thStyle: { width: '40%' },
      formatter: (value:any) => {
        return this.$kaanna(value);
      },
    }, {
      key: 'koodiArvo',
      label: this.$t('koodi') as string,
    }] as any[];
  }

  get pakollisetOsaAlueet() {
    if (this.perusteenTutkinnonosa) {
      return this.osaAlueFiltered(['pakollinen', true]);
    }
  }

  get valinnaisetOsaAlueet() {
    if (this.perusteenTutkinnonosa) {
      return this.osaAlueFiltered(['pakollinen', false]);
    }
  }

  osaAlueFiltered(osaamistavoiteFilter) {
    return _.chain(this.perusteenTutkinnonosa.osaAlueet)
      .map(osaAlue => {
        return {
          ...osaAlue,
          osaamistavoitteet: _.filter(osaAlue.osaamistavoitteet, osaamistavoiteFilter),
        };
      })
      .filter(osaAlue => _.size(osaAlue.osaamistavoitteet) > 0)
      .value();
  }
}
</script>

<style scoped lang="scss">
  .font-600 {
    font-weight: 600;
  }
</style>
