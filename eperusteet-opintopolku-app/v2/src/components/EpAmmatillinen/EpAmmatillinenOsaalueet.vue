<template>
  <div>
    <ep-collapse class="mb-3"
                 v-for="(osaalue, index) in osaalueet"
                 :key="'osaalue'+index"
                 :shadow="false"
                 :borderBottom="false"
                 :use-padding="false"
                 :expandedByDefault="osaalueet.length === 1"
                 blue>

      <h4 class="osaamistavoiteotsikko" slot="header">{{$kaanna(osaalue.nimi)}} <span v-if="osaalue.koodi">({{osaalue.koodi.arvo}})</span></h4>

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

      <template v-if="osaalue.pakollisetOsaamistavoitteet">
        <h4 class="mt-4">{{ $t('pakolliset-osaamistavoitteet') }}, {{osaalue.pakollisetOsaamistavoitteet.laajuus}} {{$t('osp')}}</h4>
        <Osaamistavoite v-model="osaalue.pakollisetOsaamistavoitteet"
                        v-if="osaalue.pakollisetOsaamistavoitteet"
                        :is-valinnainen="false"
                        :showLaajuus="false">
          <div slot="osaamistavoitteet" />
        </Osaamistavoite>
      </template>

      <template v-if="osaalue.valinnaisetOsaamistavoitteet">
        <hr/>
        <h4>{{ $t('valinnaiset-osaamistavoitteet') }}, {{osaalue.valinnaisetOsaamistavoitteet.laajuus}} {{$t('osp')}}</h4>
        <Osaamistavoite v-model="osaalue.valinnaisetOsaamistavoitteet"
                        :is-valinnainen="true"
                        :showLaajuus="false">
          <div slot="osaamistavoitteet" />
        </Osaamistavoite>
      </template>

      <hr/>

      <div v-if="osaalue.arviointi && osaalue.arviointi.osaamistasonKriteerit">
        <GeneerinenArviointiTaulukko :arviointi="osaalue.arviointi">
          <h4 slot="header">{{ $t('arviointi')}} </h4>
        </GeneerinenArviointiTaulukko>
      </div>

      <EpValmaTelmaSisalto :valmaTelmaSisalto="osaalue.valmaTelmaSisalto" />

    </ep-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpAmmatillinenArvioinninKohdealueet from '@/components/EpAmmatillinen/EpAmmatillinenArvioinninKohdealueet.vue';
import Osaamistavoite from '@shared/components/EpOsaamistavoite/Osaamistavoite.vue';
import GeneerinenArviointiTaulukko from '@/components/EpAmmatillinen/GeneerinenArviointiTaulukko.vue';
import EpValmaTelmaSisalto from '@/components/EpAmmatillinen/EpValmaTelmaSisalto.vue';

@Component({
  components: {
    EpFormContent,
    EpCollapse,
    EpAmmatillinenArvioinninKohdealueet,
    Osaamistavoite,
    GeneerinenArviointiTaulukko,
    EpValmaTelmaSisalto,
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
