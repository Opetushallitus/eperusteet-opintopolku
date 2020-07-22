<template>
  <div>
    <ep-collapse class="mb-3" v-for="(osaalue, index) in osaalueet" :key="'osaalue'+index"
      :shadow="true"
      :togglefull="true"
      :borderBottom="false"
      :expandedByDefault="osaalueet.length === 1">

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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpAmmatillinenArvioinninKohdealueet from '@/components/EpAmmatillinen/EpAmmatillinenArvioinninKohdealueet.vue';
import * as _ from 'lodash';

@Component({
  components: {
    EpFormContent,
    EpCollapse,
    EpAmmatillinenArvioinninKohdealueet,
  },
})
export default class EpAmmatillinenOsaalueet extends Vue {
  @Prop({ required: true })
  private osaalueet: any;

  @Prop({ required: true })
  private arviointiasteikot!: any[];
}
</script>

<style scoped lang="scss">

  .osaamistavoiteotsikko {
    font-weight: 600;
  }

</style>
