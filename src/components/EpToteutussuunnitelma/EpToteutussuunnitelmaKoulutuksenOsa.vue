<template>
  <div>
    <portal-target name="toteutussuunnitelma-sisalto-header"></portal-target>

    <b-row>
      <b-col>
        <b-form-group :label="$t('laajuus')">
          {{perusteenOsa.laajuusMinimi}} - {{perusteenOsa.laajuusMaksimi}} {{$t('viikkoa')}}
        </b-form-group>
      </b-col>
    </b-row>

    <b-row v-if="koulutuksenosaKoodi" class="mb-4">
      <b-col>
        <h4>{{$t('koulutuksenosan-koodi')}}</h4>
        <div>{{koulutuksenosaKoodi}}</div>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-form-group :label="$t('kuvaus')">
          <ep-content-viewer :value="$kaanna(perusteenOsa.kuvaus)" :kuvat="kuvat"/>
        </b-form-group>
      </b-col>
    </b-row>

    <template v-if="tavoitteet.length > 0 || (koulutuksenosa.paikallinenTarkennus && koulutuksenosa.paikallinenTarkennus.tavoitteetKuvaus)">
      <hr/>
      <b-row>
        <b-col>
          <h3 class="mb-4">{{$t('tavoitteet')}}</h3>
          <b-form-group :label="$t('opiskelija')">
            <template v-if="tavoitteet.length > 0">
              <ul class="mb-0">
                <li v-for="tavoite in tavoitteet" :key="tavoite.id">
                  {{$kaanna(tavoite)}}
                </li>
              </ul>
            </template>
          </b-form-group>
          <EpPaikallinenTarkennus v-if="koulutuksenosa.paikallinenTarkennus && koulutuksenosa.paikallinenTarkennus.tavoitteetKuvaus">
            <ep-content-viewer :value="$kaanna(koulutuksenosa.paikallinenTarkennus.tavoitteetKuvaus)" :kuvat="kuvat"/>
          </EpPaikallinenTarkennus>
        </b-col>
      </b-row>
    </template>

    <template v-if="perusteenOsa.laajaAlaisenOsaamisenKuvaus || (koulutuksenosa.paikallinenTarkennus && koulutuksenosa.paikallinenTarkennus.laajaalaisetosaamiset.length > 0)">
      <hr/>
      <b-row>
        <b-col>
          <b-form-group>
            <h3 slot="label">{{ $t('laaja-alainen-osaaminen') }}</h3>
            <!-- laaaja-alainen sisältää ainoastaan ohjetekstin perusteessa -->
            <!-- <ep-content-viewer :value="$kaanna(koulutuksenosa.laajaAlaisenOsaamisenKuvaus)" :kuvat="kuvat"/> -->
          </b-form-group>
          <template v-if="koulutuksenosa.paikallinenTarkennus">
            <div v-for="(lao, index) in koulutuksenosa.paikallinenTarkennus.laajaalaisetosaamiset" :key="'lao'+index" class="mb-4">
              <div class="font-weight-bold">{{$kaanna(lao.nimi)}}</div>
              <ep-content-viewer v-if="laajaAlaisetKoodilla[lao.koodiUri]" :value="$kaanna(laajaAlaisetKoodilla[lao.koodiUri].perusteteksti)" :kuvat="kuvat"/>
              <ep-content-viewer :value="$kaanna(lao.laajaAlaisenOsaamisenKuvaus)" :kuvat="kuvat"/>
            </div>
          </template>
        </b-col>
      </b-row>
    </template>

    <template v-if="perusteenOsa.keskeinenSisalto || (koulutuksenosa.paikallinenTarkennus && koulutuksenosa.paikallinenTarkennus.keskeinenSisalto)">
      <hr/>
      <b-row>
        <b-col>
          <b-form-group>
            <h3 slot="label">{{ $t('keskeinen-sisalto') }}</h3>
              <ep-content-viewer :value="$kaanna(perusteenOsa.keskeinenSisalto)" :kuvat="kuvat"/>
          </b-form-group>
          <EpPaikallinenTarkennus v-if="koulutuksenosa.paikallinenTarkennus && koulutuksenosa.paikallinenTarkennus.keskeinenSisalto">
            <ep-content-viewer :value="$kaanna(koulutuksenosa.paikallinenTarkennus.keskeinenSisalto)" :kuvat="kuvat"/>
          </EpPaikallinenTarkennus>
        </b-col>
      </b-row>
    </template>

    <template v-if="perusteenOsa.arvioinninKuvaus || (koulutuksenosa.paikallinenTarkennus && koulutuksenosa.paikallinenTarkennus.arvioinninKuvaus)">
      <hr/>
      <b-row>
        <b-col>
          <b-form-group>
            <h3 slot="label">{{ $t('arviointi-teksti') }}</h3>
              <ep-content-viewer :value="$kaanna(perusteenOsa.arvioinninKuvaus)" :kuvat="kuvat"/>
          </b-form-group>
          <EpPaikallinenTarkennus v-if="koulutuksenosa.paikallinenTarkennus && koulutuksenosa.paikallinenTarkennus.arvioinninKuvaus">
            <ep-content-viewer :value="$kaanna(koulutuksenosa.paikallinenTarkennus.arvioinninKuvaus)" :kuvat="kuvat"/>
          </EpPaikallinenTarkennus>
        </b-col>
      </b-row>
    </template>
    <template v-if="koulutuksenosa.paikallinenTarkennus && koulutuksenosa.paikallinenTarkennus.koulutuksenJarjestajat.length > 0">
      <hr/>
      <b-row>
        <b-col>
          <b-form-group>
            <h3 slot="label">{{ $t('koulutuksen-jarjestajat') }}</h3>

            <div v-for="(koulutuksenjarjestaja, i) in koulutuksenosa.paikallinenTarkennus.koulutuksenJarjestajat" :key="'ktj'+i" class="pt-3 pb-2 px-3 mb-3">

              <h3>{{$kaanna(koulutuksenjarjestaja.nimi)}}</h3>
              <b-form-group v-if="koulutuksenjarjestaja.url" :label="$t('toteutussuunnitelman-tai-koulutuksen-jarjestajan-verkkosivut')" class="mb-3">
                <EpLinkki :url="koulutuksenjarjestaja.url[kieli]" />
              </b-form-group>

              <b-form-group v-if="koulutuksenjarjestaja.kuvaus" :label="$t('kaytannon-toteutus')" class="mb-0">
                <ep-content-viewer :value="$kaanna(koulutuksenjarjestaja.kuvaus)" :kuvat="kuvat"/>
              </b-form-group>

            </div>

          </b-form-group>
        </b-col>
      </b-row>
    </template>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Matala, OpetussuunnitelmaDto, Sisaltoviitteet } from '@shared/api/amosaa';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import _ from 'lodash';
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';
import EpLinkki from '@shared/components/EpLinkki/EpLinkki.vue';
import { Kielet } from '@shared/stores/kieli';

@Component({
  components: {
    EpContentViewer,
    EpFormContent,
    EpLinkki,
  },
})
export default class EpToteutussuunnitelmaKoulutuksenOsa extends Vue {
  @Prop({ required: true })
  private sisaltoviite!: Matala;

  @Prop({ required: true })
  private kuvat!: any[];

  @Prop({ required: true })
  private opetussuunnitelma!: OpetussuunnitelmaDto;

  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: ToteutussuunnitelmaDataStore;

  get laajaAlaisetKoodilla() {
    return _.keyBy(this.laajaAlaisetOsaamiset, 'tuvaLaajaAlainenOsaaminen.nimiKoodi');
  }

  get koulutuksenosa() {
    return this.sisaltoviite.koulutuksenosa;
  }

  get koulutuksenosaKoodi() {
    if (this.koulutuksenosa?.nimiKoodi) {
      return _.split(this.koulutuksenosa.nimiKoodi, '_')[1];
    }
  }

  get tavoitteet() {
    return [
      ...this.perusteenOsa?.tavoitteet!,
      ...(this.koulutuksenosa?.paikallinenTarkennus ? this.koulutuksenosa?.paikallinenTarkennus?.tavoitteet! : []),
    ];
  }

  get laajaAlaisetOsaamiset() {
    return this.opetussuunnitelmaDataStore.getJulkaistuSisaltoList({ 'tyyppi': 'laajaalainenosaaminen' });
  }

  get kieli() {
    return Kielet.getSisaltoKieli.value;
  }

  get perusteenOsa() {
    if (this.sisaltoviite.perusteenOsaId) {
      return this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ id: this.sisaltoviite.perusteenOsaId });
    }
    else {
      return this.koulutuksenosa;
    }
  }
}
</script>

<style scoped lang="scss">

</style>
