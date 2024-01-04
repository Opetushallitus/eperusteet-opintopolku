<template>
  <div v-if="sisaltoviite">
    <h2 class="otsikko mb-4" slot="header">{{ $kaanna(sisaltoviite.tekstiKappale.nimi)}}, {{laajuus}} {{$t('osaamispiste')}}</h2>

    <ep-form-content class="col-md-12 mt-4" name="tutkinnon-osan-kuvaus" v-if="perusteenTutkinnonosa && perusteenTutkinnonosa.kuvaus">
      <ep-content-viewer :value="$kaanna(perusteenTutkinnonosa.kuvaus)" :kuvat="kuvat"/>
    </ep-form-content>

    <ep-form-content class="col-md-12 mt-4" name="koulutuksen-jarjestajan-tarkennus" v-if="sisaltoviite.tekstiKappale.teksti">
      <ep-content-viewer :value="$kaanna(sisaltoviite.tekstiKappale.teksti)" :kuvat="kuvat"/>
    </ep-form-content>

    <ep-form-content class="col-md-12 mt-4" v-for="(vapaa, index) in sisaltoviite.tosa.vapaat" :key="'tosavapaateksti'+index">
      <label slot="header">{{$kaanna(vapaa.nimi)}}</label>
      <ep-content-viewer :value="$kaanna(vapaa.teksti)" :kuvat="kuvat"/>
    </ep-form-content>

    <ep-form-content class="col-md-12 mt-4 mb-5" name="koulutuksen-jarjestajan-toteutus" v-if="sisaltoviite.tosa.toteutukset && sisaltoviite.tosa.toteutukset.length > 0 && (!osaAlueet || osaAlueet.length === 0)">
      <EpToteutukset :toteutukset="toteutukset" :kuvat="kuvat"/>
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

      <ep-form-content class="col-md-12 mb-5" v-if="sisaltoviite.tosa.omatutkinnonosa.ammattitaitovaatimukset" name="ammattitaitovaatimukset">
        <EpAmmattitaitovaatimukset v-model="sisaltoviite.tosa.omatutkinnonosa.ammattitaitovaatimukset" :is-editing="false">
          <template v-slot:koodi="{koodi}">
            <span>{{ $kaanna(koodi.nimi) }}</span>
          </template>
        </EpAmmattitaitovaatimukset>
      </ep-form-content>

      <GeneerinenArviointiTaulukko
        v-if="sisaltoviite.tosa.omatutkinnonosa.geneerinenArviointiasteikko"
        :arviointi="sisaltoviite.tosa.omatutkinnonosa.geneerinenArviointiasteikko" />

      <ep-form-content class="col-md-12" v-if="sisaltoviite.tosa.omatutkinnonosa.ammattitaidonOsoittamistavat" name="ammattitaidon-osoittamistavat">
        <ep-content-viewer :value="$kaanna(sisaltoviite.tosa.omatutkinnonosa.ammattitaidonOsoittamistavat)" :kuvat="kuvat"/>
      </ep-form-content>

    </div>

    <div v-if="naytetaanPerusteenSisalto">
      <h3>{{ $t('perusteen-sisalto') }}</h3>

      <ep-form-content class="col-md-12" v-if="perusteenTutkinnonosa.koodiArvo" name="koodi">
        <span v-html="perusteenTutkinnonosa.koodiArvo" />
      </ep-form-content>

      <ep-form-content class="col-md-12 mb-5" v-if="perusteenTutkinnonosa.ammattitaitovaatimukset && perusteenTutkinnonosa.tyyppi === 'normaali'" name="ammattitaitovaatimukset">
        <ep-content-viewer class="ammattitaitovaatimukset" :value="$kaanna(perusteenTutkinnonosa.ammattitaitovaatimukset)" :kuvat="kuvat"/>
      </ep-form-content>

      <ep-ammatillinen-arvioinnin-kohdealueet
        v-if="perusteenTutkinnonosa.arviointi && perusteenTutkinnonosa.arviointi.arvioinninKohdealueet"
        :arviointiasteikot="arviointiasteikot"
        :arvioinninKohdealueet="perusteenTutkinnonosa.arviointi.arvioinninKohdealueet"/>

      <div v-if="perusteenTutkinnonosa.geneerinenArviointiasteikko && perusteenTutkinnonosa.geneerinenArviointiasteikko.osaamistasonKriteerit">
        <GeneerinenArviointiTaulukko :arviointi="perusteenTutkinnonosa.geneerinenArviointiasteikko" />
      </div>

      <ep-form-content class="col-md-12 mb-5" v-if="perusteenTutkinnonosa.ammattitaidonOsoittamistavat" name="ammattitaidon-osoittamistavat">
        <ep-content-viewer :value="$kaanna(perusteenTutkinnonosa.ammattitaidonOsoittamistavat)" :kuvat="kuvat"/>
      </ep-form-content>

      <template v-if="!osaAlueet || osaAlueet.length ===0">
        <ep-form-content class="col-md-12 mb-5" v-if="perusteenOsaAlueet.length > 0" name="osa-alueet">
          <ep-ammatillinen-osaalueet :arviointiasteikot="arviointiasteikot" :osaalueet="perusteenOsaAlueet" />
        </ep-form-content>

        <ep-form-content class="col-md-12 mb-5" v-if="perusteenPakollisetOsaAlueet && perusteenPakollisetOsaAlueet.length > 0" name="pakolliset-osa-alueet">
          <ep-ammatillinen-osaalueet :arviointiasteikot="arviointiasteikot" :osaalueet="perusteenPakollisetOsaAlueet" />
        </ep-form-content>

        <ep-form-content class="col-md-12 mb-5" v-if="perusteenValinnaisetOsaAlueet && perusteenValinnaisetOsaAlueet.length > 0" name="valinnaiset-osa-alueet">
          <ep-ammatillinen-osaalueet :arviointiasteikot="arviointiasteikot" :osaalueet="perusteenValinnaisetOsaAlueet" />
        </ep-form-content>
      </template>

    </div>

    <ep-form-content class="col-md-12 mt-4" name="pakolliset-osa-alueet" v-if="pakollisetOsaAlueet.length > 0">
      <EpOsaAlueListaus :osaAlueet="pakollisetOsaAlueet" :sisaltoviiteId="sisaltoviite.id" />
    </ep-form-content>

    <ep-form-content class="col-md-12 mt-4" name="valinnaiset-osa-alueet" v-if="valinnaisetOsaAlueet.length > 0">
      <EpOsaAlueListaus :osaAlueet="valinnaisetOsaAlueet" :sisaltoviiteId="sisaltoviite.id" />
    </ep-form-content>

    <ep-form-content class="col-md-12 mt-4" name="paikalliset-osa-alueet" v-if="paikallisetOsaAlueet.length > 0">
      <EpOsaAlueListaus :osaAlueet="paikallisetOsaAlueet" :sisaltoviiteId="sisaltoviite.id" />
    </ep-form-content>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpAmmatillinenArvioinninKohdealueet from '@/components/EpAmmatillinen/EpAmmatillinenArvioinninKohdealueet.vue';
import EpAmmatillinenOsaalueet from '@/components/EpAmmatillinen/EpAmmatillinenOsaalueet.vue';
import GeneerinenArviointiTaulukko from '@/components/EpAmmatillinen/GeneerinenArviointiTaulukko.vue';
import EpOsaAlueListaus from '@/components/EpToteutussuunnitelma/EpOsaAlueListaus.vue';
import { OmaOsaAlueDtoTyyppiEnum, OpetussuunnitelmaKaikkiDtoJulkaisukieletEnum, Koodistot } from '@shared/api/amosaa';
import EpToteutukset from '@/components/EpToteutussuunnitelma/EpToteutukset.vue';
import EpAmmattitaitovaatimukset from '@shared/components/EpAmmattitaitovaatimukset/EpAmmattitaitovaatimukset.vue';
import * as _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';

@Component({
  components: {
    EpFormContent,
    EpContentViewer,
    EpCollapse,
    EpAmmatillinenArvioinninKohdealueet,
    EpAmmatillinenOsaalueet,
    GeneerinenArviointiTaulukko,
    EpOsaAlueListaus,
    EpToteutukset,
    EpAmmattitaitovaatimukset,
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

  @Prop({ required: false })
  private julkaisukielet?: OpetussuunnitelmaKaikkiDtoJulkaisukieletEnum[];

  private tutkintonimikkeetJaOsaamisalatKoodit: any | null = null;
  private toteutukset: any | null = null;

  async mounted() {
    this.tutkintonimikkeetJaOsaamisalatKoodit = _.chain(await Promise.all(
      _.chain(this.sisaltoviite.tosa?.toteutukset)
        .map(toteutus => toteutus.koodit)
        .flatten()
        .uniq()
        .map(koodi => Koodistot.getKoodistoKoodiByUri(koodi))
        .value())
    ).map('data')
      .map(koodi => {
        return {
          ...koodi,
          nimi: _.mapValues(_.keyBy(koodi.metadata, v => _.toLower(v.kieli)), v => v.nimi),
        };
      })
      .keyBy('koodiUri')
      .value();

    this.toteutukset = _.map(this.sisaltoviite.tosa?.toteutukset, toteutus => {
      return {
        ...toteutus,
        tutkintonimikkeetJaOsaamisalat: _.map(toteutus.koodit, koodi => this.tutkintonimikkeetJaOsaamisalatKoodit[koodi]),
      };
    });
  }

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

  get kieli() {
    return Kielet.getSisaltoKieli.value;
  }

  get osaAlueet() {
    return _.chain(this.sisaltoviite.osaAlueet)
      .map(osaAlue => {
        return {
          ...osaAlue,
          perusteenOsaAlue: _.find(this.perusteenOsaAlueet, pOsaAlue => pOsaAlue.id === osaAlue.perusteenOsaAlueId),
        };
      })
      .filter(osaAlue => !!osaAlue.nimi[this.kieli])
      .value();
  }

  get pakollisetOsaAlueet() {
    return _.filter(this.osaAlueet, oa => oa.tyyppi === _.toLower(OmaOsaAlueDtoTyyppiEnum.PAKOLLINEN));
  }

  get valinnaisetOsaAlueet() {
    return _.filter(this.osaAlueet, oa => oa.tyyppi === _.toLower(OmaOsaAlueDtoTyyppiEnum.VALINNAINEN));
  }

  get paikallisetOsaAlueet() {
    return _.filter(this.osaAlueet, oa => oa.tyyppi === _.toLower(OmaOsaAlueDtoTyyppiEnum.PAIKALLINEN));
  }

  get perusteenPakollisetOsaAlueet() {
    if (this.perusteenTutkinnonosa) {
      return this.perusteenOsaAlueetFiltered(['pakollinen', true]);
    }
  }
  get perusteenValinnaisetOsaAlueet() {
    if (this.perusteenTutkinnonosa) {
      return this.perusteenOsaAlueetFiltered(['pakollinen', false]);
    }
  }

  perusteenOsaAlueetFiltered(osaamistavoiteFilter) {
    return _.chain(this.perusteenOsaAlueet)
      .map(osaAlue => {
        return {
          ...osaAlue,
          osaamistavoitteet: _.filter(osaAlue.osaamistavoitteet, osaamistavoiteFilter),
        };
      })
      .filter(osaAlue => _.size(osaAlue.osaamistavoitteet) > 0)
      .filter(osaAlue => !!osaAlue.nimi[this.kieli])
      .value();
  }

  get perusteenOsaAlueet() {
    return this.perusteenTutkinnonosa?.osaAlueet;
  }

  get naytetaanPerusteenSisalto() {
    return this.perusteenTutkinnonosa && (this.perusteenTutkinnonosa.tyyppi !== 'reformi_tutke2' || !this.osaAlueet || this.osaAlueet.length === 0);
  }
}
</script>

<style scoped lang="scss">
  .font-600 {
    font-weight: 600;
  }

  .ammattitaitovaatimukset {
    ::v-deep dd {
      margin-left: 2.5rem;
      margin-bottom: 0;
    }
  }
</style>
