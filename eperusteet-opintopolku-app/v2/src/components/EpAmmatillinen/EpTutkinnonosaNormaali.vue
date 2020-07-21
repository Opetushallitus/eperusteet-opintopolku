<template>
  <div>
    <ep-form-content class="col-md-12 mb-5" v-if="tutkinnonosa.ammattitaitovaatimukset" name="ammattitaitovaatimukset">
      <span v-html="$kaanna(tutkinnonosa.ammattitaitovaatimukset)" />
    </ep-form-content>

    <ep-form-content class="col-md-12" v-if="hasArviointi" name="arviointi">

      <div v-if="hasArvioinninKohdealueet">
        <div v-for="(arvioinninKohdealue, index) in tutkinnonosa.arviointi.arvioinninKohdealueet" :key="'aka'+index" class="mb-5">
          <h4 class="mt-3">{{$kaanna(arvioinninKohdealue.otsikko)}}</h4>

          <div v-for="(arvioinninkohde, index) in arvioinninKohdealue.arvioinninKohteet" :key="'arvioinninkohde'+index" class="mr-5">

            <div class="mb-3 mt-4">
              <h5>{{$t('arvioinnin-kohde')}}</h5>
              <span>{{$kaanna(arvioinninkohde.selite)}}</span>
            </div>

            <b-table striped :items="arvioinninkohde.osaamistasonKriteerit" :fields="osaamistasonKriteeritFields">
              <template v-slot:cell(osaamistaso)="{item}">
                <span v-if="item.osaamistaso"> {{$kaanna(item.osaamistaso.otsikko)}}</span>
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
        </div>
      </div>

      <div v-if="tutkinnonosa.geneerinenArviointiasteikko && tutkinnonosa.geneerinenArviointiasteikko.osaamistasonKriteerit" class="ml-2">

        <div class="mb-3 mt-3">
          <h4>{{$t('arvioinnin-kohde')}}</h4>
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
    </ep-form-content>

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

@Component({
  components: {
    EpFormContent,
  },
})
export default class EpTutkinnonosaNormaali extends Vue {
  @Prop({ required: true })
  private tutkinnonosa: any;

  get hasArviointi() {
    return (this.tutkinnonosa.arviointi && this.tutkinnonosa.arviointi.arvioinninKohdealueet && this.tutkinnonosa.arviointi.arvioinninKohdealueet.length > 0) || this.tutkinnonosa.geneerinenArviointiasteikko;
  }

  get hasArvioinninKohdealueet() {
    return this.tutkinnonosa.arviointi && this.tutkinnonosa.arviointi.arvioinninKohdealueet;
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
