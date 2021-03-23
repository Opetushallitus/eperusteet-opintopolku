<template>
  <div>
    <ep-form-content class="col-md-12 mb-5" v-if="tutkinnonosa.ammattitaitovaatimukset" name="ammattitaitovaatimukset">
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
              v-if="tutkinnonosa.arviointi && tutkinnonosa.arviointi.arvioinninKohdealueet"
              :arviointiasteikot="arviointiasteikot"
              :arvioinninKohdealueet="tutkinnonosa.arviointi.arvioinninKohdealueet"/>

      <div v-if="tutkinnonosa.geneerinenArviointiasteikko && tutkinnonosa.geneerinenArviointiasteikko.osaamistasonKriteerit">
        <GeneerinenArviointiTaulukko :arviointi="tutkinnonosa.geneerinenArviointiasteikko" />
      </div>

      <hr class="mt-5 mb-5"/>
    </template>

    <ep-form-content class="col-md-12" v-if="tutkinnonosa.ammattitaidonOsoittamistavat" name="ammattitaidon-osoittamistavat">
      <span v-html="$kaanna(tutkinnonosa.ammattitaidonOsoittamistavat)" />

      <hr class="mt-5 mb-5" v-if="tutkinnonosa.vapaatTekstit.length > 0"/>
    </ep-form-content>

    <div class="col-md-12" v-for="(vapaaTeksti, index) in tutkinnonosa.vapaatTekstit" :key="'vapaateksti'+index">
      <h3>{{$kaanna(vapaaTeksti.nimi)}}</h3>
      <span v-html="$kaanna(vapaaTeksti.teksti)" />

      <hr class="mt-5 mb-5"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpAmmatillinenArvioinninKohdealueet from '@/components/EpAmmatillinen/EpAmmatillinenArvioinninKohdealueet.vue';
import EpAmmattitaitovaatimukset from '@shared/components/EpAmmattitaitovaatimukset/EpAmmattitaitovaatimukset.vue';
import GeneerinenArviointiTaulukko from '@/components/EpAmmatillinen/GeneerinenArviointiTaulukko.vue';

@Component({
  components: {
    EpFormContent,
    EpAmmatillinenArvioinninKohdealueet,
    EpAmmattitaitovaatimukset,
    GeneerinenArviointiTaulukko,
  },
})
export default class EpTutkinnonosaNormaali extends Vue {
  @Prop({ required: true })
  private tutkinnonosa: any;

  @Prop({ required: true })
  private arviointiasteikot!: any[];

  get hasArviointi() {
    return (this.tutkinnonosa.arviointi && this.tutkinnonosa.arviointi.arvioinninKohdealueet && this.tutkinnonosa.arviointi.arvioinninKohdealueet.length > 0) || this.tutkinnonosa.geneerinenArviointiasteikko;
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
