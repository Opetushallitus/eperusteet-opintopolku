<template>
  <div>
    <ep-form-content class="col-md-12 mb-5" :showHeader="false" v-if="tutkinnonosa.kuvaus">
      <span v-html="$kaanna(tutkinnonosa.kuvaus)" />
    </ep-form-content>

    <ep-form-content class="col-md-12 mb-5" name="osa-alueet" v-if="tutkinnonosa.osaAlueet">

      <ep-collapse class="mb-3" v-for="(osaalue, index) in tutkinnonosa.osaAlueet" :key="'osaalue'+index" :shadow="true" :borderBottom="false" :expandedByDefault="false">
        <label class="osaamistavoiteotsikko" slot="header">{{$kaanna(osaalue.nimi)}}</label>

        <div class="mt-2" v-for="(osaamistavoite, otIndex) in osaalue.osaamistavoitteet" :key="'osaamistavoite'+ index + otIndex">
          <div class="osaamistavoiteotsikko">
            <span v-if="osaamistavoite.pakollinen">{{$t('pakolliset-osaamistavoitteet')}}</span>
            <span v-else>{{$t('valinnaiset-osaamistavoitteet')}}</span>
            <span>, {{osaamistavoite.laajuus}} {{$t('osaamispiste')}}</span>
          </div>

          <div class="mt-2" v-html="$kaanna(osaamistavoite.tavoitteet)"></div>

          <ep-form-content class="col-md-12 mt-4" name="arviointi" v-if="osaamistavoite.arviointi && osaamistavoite.arviointi.arvioinninKohdealueet">
            <div v-for="(arvioinninKohdealue, index) in osaamistavoite.arviointi.arvioinninKohdealueet" :key="'aka'+index" class="mb-5">
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
          </ep-form-content>

        </div>

      </ep-collapse>

    </ep-form-content>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';

@Component({
  components: {
    EpFormContent,
    EpCollapse,
  },
})
export default class EpTutkinnonosaTutke extends Vue {
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

  .osaamistavoiteotsikko {
    font-weight: 600;
  }

</style>
