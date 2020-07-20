<template>
  <div class="content">
    <ep-spinner v-if="!tutkinnonosa"></ep-spinner>
    <div v-else>
      <h2 class="otsikko mb-5" slot="header">{{ $kaanna(tutkinnonosaViite.nimi)}}, {{tutkinnonosaViite.laajuus}} {{$t('osaamispiste')}}</h2>

      <ep-form-content class="col-md-12 mb-5" v-if="tutkinnonosa.ammattitaitovaatimukset" name="ammattitaitovaatimukset" headerType="h3" headerClass="h6">
        <span v-html="$kaanna(tutkinnonosa.ammattitaitovaatimukset)" />
      </ep-form-content>

      <ep-form-content class="col-md-12" v-if="hasArviointi" name="arviointi" headerType="h3" headerClass="h6">

        <div v-if="hasArvioinninKohdealueet">
          <div v-for="(arvioinninKohdealue, index) in tutkinnonosa.arviointi.arvioinninKohdealueet" :key="'aka'+index" class="mb-5">
            <h3 class="mt-3">{{$kaanna(arvioinninKohdealue.otsikko)}}</h3>

            <div v-for="(arvioinninkohde, index) in arvioinninKohdealue.arvioinninKohteet" :key="'arvioinninkohde'+index" class="mr-5">

              <div class="mb-3 mt-4">
                <h4>{{$t('arvioinnin-kohde')}}</h4>
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

      <ep-form-content class="col-md-12" v-if="tutkinnonosa.ammattitaidonOsoittamistavat" name="ammattitaidon-osoittamistavat" headerType="h3" headerClass="h6">
        <span v-html="$kaanna(tutkinnonosa.ammattitaidonOsoittamistavat)" />

        <hr class="mt-5 mb-5"/>
      </ep-form-content>

      <div class="col-md-12" v-for="(vapaaTeksti, index) in tutkinnonosa.vapaatTekstit" :key="'vapaateksti'+index">
        <h3>{{$kaanna(vapaaTeksti.nimi)}}</h3>
        <span v-html="$kaanna(vapaaTeksti.teksti)" />

        <hr class="mt-5 mb-5"/>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { PerusteenTutkinnonosaStore } from '@/stores/PerusteenTutkinnonosaStore';
import { Kielet } from '@shared/stores/kieli';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';

@Component({
  components: {
    EpSpinner,
    EpFormContent,
  },
})
export default class RouteTutkinnonosa extends Vue {
  @Prop({ required: true })
  private tutkinnonosaStore!: PerusteenTutkinnonosaStore;

  get tutkinnonosa() {
    return this.tutkinnonosaStore.tutkinnonosa.value;
  }

  get tutkinnonosaViite() {
    return this.tutkinnonosaStore.tutkinnonosaViite.value;
  }

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
@import '@shared/styles/_variables.scss';

  .content {
    padding: 0 $content-padding;
  }

</style>
