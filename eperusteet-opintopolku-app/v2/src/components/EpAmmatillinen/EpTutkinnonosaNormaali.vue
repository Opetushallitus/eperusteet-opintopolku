<template>
  <div>
    <ep-form-content class="col-md-12 mb-5" v-if="!tutkinnonosa.ammattitaitovaatimukset2019 && tutkinnonosa.ammattitaitovaatimukset" name="ammattitaitovaatimukset">
      <span v-html="$kaanna(tutkinnonosa.ammattitaitovaatimukset)" />
    </ep-form-content>

    <ep-form-content class="col-md-12 mb-5" :showHeader="false" v-if="tutkinnonosa.kuvaus">
      <span v-html="$kaanna(tutkinnonosa.kuvaus)" />
    </ep-form-content>

    <ep-form-content class="col-md-12 mb-5" v-if="tutkinnonosa.ammattitaitovaatimukset2019" name="ammattitaitovaatimukset">
      <EpAmmattitaitovaatimukset v-model="tutkinnonosa.ammattitaitovaatimukset2019" :is-editing="false">
        <template v-slot:koodi="{koodi}">
          <span>{{ $kaanna(koodi.nimi) }}</span>
        </template>
      </EpAmmattitaitovaatimukset>
    </ep-form-content>

    <template v-if="hasArviointi">
      <ep-ammatillinen-arvioinnin-kohdealueet
              v-if="tutkinnonosa.arviointi && tutkinnonosa.arviointi.arvioinninKohdealueet && tutkinnonosa.arviointi.arvioinninKohdealueet.length > 0"
              :arviointiasteikot="arviointiasteikot"
              :arvioinninKohdealueet="tutkinnonosa.arviointi.arvioinninKohdealueet"/>

      <div v-if="tutkinnonosa.geneerinenArviointiasteikko && tutkinnonosa.geneerinenArviointiasteikko.osaamistasonKriteerit">
        <GeneerinenArviointiTaulukko :arviointi="tutkinnonosa.geneerinenArviointiasteikko" />
      </div>

      <div v-if="tutkinnonosa.arviointi && tutkinnonosa.arviointi.lisatiedot">
        <h3>{{$t('arviointi')}}</h3>
        <div v-html="$kaanna(tutkinnonosa.arviointi.lisatiedot)" />
      </div>

      <hr class="mt-5 mb-5"/>
    </template>

    <ep-form-content class="col-md-12" v-if="tutkinnonosa.ammattitaidonOsoittamistavat" name="ammattitaidon-osoittamistavat">
      <span v-html="$kaanna(tutkinnonosa.ammattitaidonOsoittamistavat)" />

      <hr class="mt-5 mb-5" v-if="tutkinnonosa.vapaatTekstit && tutkinnonosa.vapaatTekstit.length > 0"/>
    </ep-form-content>

    <div class="col-md-12" v-for="(vapaaTeksti, index) in tutkinnonosa.vapaatTekstit" :key="'vapaateksti'+index">
      <h3>{{$kaanna(vapaaTeksti.nimi)}}</h3>
      <span v-html="$kaanna(vapaaTeksti.teksti)" />

      <hr class="mt-5 mb-5"/>
    </div>

    <div v-if="tutkinnonosa.valmaTelmaSisalto">
      <template v-if="tutkinnonosa.valmaTelmaSisalto.osaamistavoite && tutkinnonosa.valmaTelmaSisalto.osaamistavoite.length > 0">
        <div v-for="(osaamistavoite, index) in tutkinnonosa.valmaTelmaSisalto.osaamistavoite" :key="'osaamistavoite'+index" class="mb-5">
          <h3>{{$kaanna(osaamistavoite.nimi)}}</h3>
          <h4 class="mt-3">{{$kaanna(osaamistavoite.kohde)}}</h4>
          <ul>
            <li v-for="(tavoite, tindex) in osaamistavoite.tavoitteet" :key="'osaamistavoitetavoite'+tindex">
              {{$kaanna(tavoite)}}
            </li>
          </ul>
        </div>

      </template>

      <EpValmaTelmaSisalto :valmaTelmaSisalto="tutkinnonosa.valmaTelmaSisalto" />

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpAmmatillinenArvioinninKohdealueet from '@/components/EpAmmatillinen/EpAmmatillinenArvioinninKohdealueet.vue';
import EpAmmattitaitovaatimukset from '@shared/components/EpAmmattitaitovaatimukset/EpAmmattitaitovaatimukset.vue';
import GeneerinenArviointiTaulukko from '@/components/EpAmmatillinen/GeneerinenArviointiTaulukko.vue';
import EpValmaTelmaSisalto from '@/components/EpAmmatillinen/EpValmaTelmaSisalto.vue';
import _ from 'lodash';

@Component({
  components: {
    EpFormContent,
    EpAmmatillinenArvioinninKohdealueet,
    EpAmmattitaitovaatimukset,
    GeneerinenArviointiTaulukko,
    EpValmaTelmaSisalto,
  },
})
export default class EpTutkinnonosaNormaali extends Vue {
  @Prop({ required: true })
  tutkinnonosa: any;

  @Prop({ required: true })
  arviointiasteikot!: any[];

  get hasArviointi() {
    return !_.isNil(this.tutkinnonosa.arviointi?.lisatiedot)
      || !_.isEmpty(this.tutkinnonosa.arviointi?.arvioinninKohdealueet)
      || !_.isNil(this.tutkinnonosa.geneerinenArviointiasteikko);
  }

  get osaamistasonKriteeritFields() {
    return [{
      key: 'osaamistaso',
      label: this.$t('osaamistaso') as string,
      thStyle: { display: 'none' },
    }, {
      key: 'kriteerit',
      label: this.$t('kriteerit') as string,
      thStyle: { display: 'none' },
    }] as any[];
  }
}
</script>

<style scoped lang="scss">

</style>
