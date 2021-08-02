<template>
  <div>
    <h2>{{$kaanna(koulutuksenosa.nimi)}}</h2>

    <b-row>
      <b-col>
        <b-form-group :label="$t('laajuus')">
          {{koulutuksenosa.laajuusMinimi}} - {{koulutuksenosa.laajuusMaksimi}} {{$t('viikkoa')}}
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <b-form-group :label="$t('kuvaus')">
          <ep-content-viewer :value="$kaanna(koulutuksenosa.kuvaus)" :kuvat="kuvat"/>
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
          <template v-if="koulutuksenosa.paikallinenTarkennus">
            <b-form-group :label="$t('paikallinen-teksti')">
              <ep-content-viewer :value="$kaanna(koulutuksenosa.paikallinenTarkennus.tavoitteetKuvaus)" :kuvat="kuvat"/>
            </b-form-group>
          </template>
        </b-col>
      </b-row>
    </template>

    <template v-if="koulutuksenosa.laajaAlaisenOsaamisenKuvaus || (koulutuksenosa.paikallinenTarkennus && koulutuksenosa.paikallinenTarkennus.laajaalaisetosaamiset.length > 0)">
      <hr/>
      <b-row>
        <b-col>
          <b-form-group>
            <h3 slot="label">{{ $t('laaja-alainen-osaaminen') }}</h3>
            <ep-content-viewer :value="$kaanna(koulutuksenosa.laajaAlaisenOsaamisenKuvaus)" :kuvat="kuvat"/>
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

    <template v-if="koulutuksenosa.keskeinenSisalto || (koulutuksenosa.paikallinenTarkennus && koulutuksenosa.paikallinenTarkennus.keskeinenSisalto)">
      <hr/>
      <b-row>
        <b-col>
          <b-form-group>
            <h3 slot="label">{{ $t('keskeinen-sisalto') }}</h3>
              <ep-content-viewer :value="$kaanna(koulutuksenosa.keskeinenSisalto)" :kuvat="kuvat"/>
          </b-form-group>
          <template v-if="koulutuksenosa.paikallinenTarkennus">
            <b-form-group :label="$t('paikallinen-teksti')">
              <ep-content-viewer :value="$kaanna(koulutuksenosa.paikallinenTarkennus.keskeinenSisalto)" :kuvat="kuvat"/>
            </b-form-group>
          </template>
        </b-col>
      </b-row>
    </template>

    <template v-if="koulutuksenosa.arvioinninKuvaus || (koulutuksenosa.paikallinenTarkennus && koulutuksenosa.paikallinenTarkennus.arvioinninKuvaus)">
      <hr/>
      <b-row>
        <b-col>
          <b-form-group>
            <h3 slot="label">{{ $t('arviointi-teksti') }}</h3>
              <ep-content-viewer :value="$kaanna(koulutuksenosa.arvioinninKuvaus)" :kuvat="kuvat"/>
          </b-form-group>
          <template v-if="koulutuksenosa.paikallinenTarkennus">
            <b-form-group :label="$t('paikallinen-teksti')">
              <ep-content-viewer :value="$kaanna(koulutuksenosa.paikallinenTarkennus.arvioinninKuvaus)" :kuvat="kuvat"/>
            </b-form-group>
          </template>
        </b-col>
      </b-row>
    </template>
    <template v-if="koulutuksenosa.paikallinenTarkennus && koulutuksenosa.paikallinenTarkennus.koulutuksenJarjestajat.length > 0">
      <hr/>
      <b-row>
        <b-col>
          <b-form-group>
            <h3 slot="label">{{ $t('koulutuksen-jarjestajat') }}</h3>

            <EpKoulutuksenJarjestajaSelect
              :value="koulutuksenosa.paikallinenTarkennus.koulutuksenJarjestajat">
              <template v-slot:(kuvaus)="{model}">
                <ep-content-viewer :value="$kaanna(model)" :kuvat="kuvat"/>
              </template>
            </EpKoulutuksenJarjestajaSelect>

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
import EpKoulutuksenJarjestajaSelect from '@shared/components/EpKoulutuksenJarjestajaSelect/EpKoulutuksenJarjestajaSelect.vue';
import _ from 'lodash';

@Component({
  components: {
    EpContentViewer,
    EpFormContent,
    EpKoulutuksenJarjestajaSelect,
  },
})
export default class EpToteutussuunnitelmaKoulutuksenOsa extends Vue {
  @Prop({ required: true })
  private sisaltoviite!: Matala;

  @Prop({ required: true })
  private kuvat!: any[];

  @Prop({ required: true })
  private opetussuunnitelma!: OpetussuunnitelmaDto;

  private laajaAlaisetOsaamiset: any[] = [];

  async mounted() {
    this.laajaAlaisetOsaamiset = (await Sisaltoviitteet.getSisaltoviitteeTyypilla(
      this.opetussuunnitelma.id!,
      'laajaalainenosaaminen',
      _.toString(this.opetussuunnitelma.koulutustoimija!.id))).data;
  }

  get laajaAlaisetKoodilla() {
    return _.keyBy(this.laajaAlaisetOsaamiset, 'tuvaLaajaAlainenOsaaminen.nimiKoodi');
  }

  get koulutuksenosa() {
    return this.sisaltoviite.koulutuksenosa;
  }

  get tavoitteet() {
    return [
      ...this.koulutuksenosa?.tavoitteet!,
      ...(this.koulutuksenosa?.paikallinenTarkennus ? this.koulutuksenosa?.paikallinenTarkennus?.tavoitteet! : []),
    ];
  }
}
</script>

<style scoped lang="scss">

</style>
