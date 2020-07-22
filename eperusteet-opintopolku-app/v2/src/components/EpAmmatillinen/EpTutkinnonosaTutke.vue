<template>
  <div>
    <ep-form-content class="col-md-12 mb-5" :showHeader="false" v-if="tutkinnonosa.kuvaus">
      <span v-html="$kaanna(tutkinnonosa.kuvaus)" />
    </ep-form-content>

    <ep-form-content class="col-md-12 mb-5" name="osa-alueet" v-if="tutkinnonosa.osaAlueet">

      <ep-collapse class="mb-3" v-for="(osaalue, index) in tutkinnonosa.osaAlueet" :key="'osaalue'+index"
        :shadow="true"
        :togglefull="true"
        :borderBottom="false"
        :expandedByDefault="tutkinnonosa.osaAlueet.length === 1">

        <label class="osaamistavoiteotsikko" slot="header">{{$kaanna(osaalue.nimi)}}</label>

        <div class="mt-2" v-for="(osaamistavoite, otIndex) in osaalue.osaamistavoitteet" :key="'osaamistavoite'+ index + otIndex">
          <div class="osaamistavoiteotsikko">
            <span v-if="osaamistavoite.pakollinen">{{$t('pakolliset-osaamistavoitteet')}}</span>
            <span v-else>{{$t('valinnaiset-osaamistavoitteet')}}</span>
            <span>, {{osaamistavoite.laajuus}} {{$t('osaamispiste')}}</span>
          </div>

          <div class="mt-2" v-html="$kaanna(osaamistavoite.tavoitteet)"></div>

          <ep-ammatillinen-arvioinnin-kohdealueet
            v-if="osaamistavoite.arviointi && osaamistavoite.arviointi.arvioinninKohdealueet"
            :arviointiasteikot="arviointiasteikot"
            :arvioinninKohdealueet="osaamistavoite.arviointi.arvioinninKohdealueet"/>

        </div>

      </ep-collapse>

    </ep-form-content>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpAmmatillinenArvioinninKohdealueet from '@/components/EpAmmatillinen/EpAmmatillinenArvioinninKohdealueet.vue';

@Component({
  components: {
    EpFormContent,
    EpCollapse,
    EpAmmatillinenArvioinninKohdealueet,
  },
})
export default class EpTutkinnonosaTutke extends Vue {
  @Prop({ required: true })
  private tutkinnonosa: any;

  @Prop({ required: true })
  private arviointiasteikot!: any[];

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
