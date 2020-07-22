<template>
  <div>
    <ep-form-content class="col-md-12 mb-5" v-if="tutkinnonosa.ammattitaitovaatimukset" name="ammattitaitovaatimukset">
      <span v-html="$kaanna(tutkinnonosa.ammattitaitovaatimukset)" />
    </ep-form-content>

    <div v-if="hasArviointi">
      <ep-ammatillinen-arvioinnin-kohdealueet
              v-if="tutkinnonosa.arviointi && tutkinnonosa.arviointi.arvioinninKohdealueet"
              :arviointiasteikot="arviointiasteikot"
              :arvioinninKohdealueet="tutkinnonosa.arviointi.arvioinninKohdealueet"/>

      <div v-if="tutkinnonosa.geneerinenArviointiasteikko && tutkinnonosa.geneerinenArviointiasteikko.osaamistasonKriteerit" class="ml-2">

        <div class="mb-3 mt-3">
          <div class="mb-1">{{$t('arvioinnin-kohde')}}</div>
          <span>{{$kaanna(tutkinnonosa.geneerinenArviointiasteikko.kohde)}}</span>
        </div>

        <b-table striped :items="tutkinnonosa.geneerinenArviointiasteikko.osaamistasonKriteerit" :fields="osaamistasonKriteeritFields">
          <template v-slot:cell(osaamistaso)="{item}">
            <span v-if="item.osaamistaso">{{$kaanna(item.osaamistaso.otsikko)}}</span>
          </template>

          <template v-slot:cell(kriteerit)="{item}">
            <ul>
              <li v-for="(kriteeri, index) in item.kriteerit" :key="'kriteeri'+index">
                {{$kaanna(kriteeri)}}
              </li>
            </ul>
          </template>
        </b-table>
      </div>

      <hr class="mt-5 mb-5"/>
    </div>

    <ep-form-content class="col-md-12" v-if="tutkinnonosa.ammattitaidonOsoittamistavat" name="ammattitaidon-osoittamistavat">
      <span v-html="$kaanna(tutkinnonosa.ammattitaidonOsoittamistavat)" />

      <hr class="mt-5 mb-5"/>
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

@Component({
  components: {
    EpFormContent,
    EpAmmatillinenArvioinninKohdealueet,
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
      thStyle: { width: '40%' },
    }, {
      key: 'kriteerit',
      label: this.$t('kriteerit') as string,
    }] as any[];
  }
}
</script>

<style scoped lang="scss">

</style>
