<template>
  <div>
    <portal-target name="toteutussuunnitelma-sisalto-header"></portal-target>

    <EpSpinner v-if="!koulutuksenosat"/>

    <template v-else>
      <div v-if="yhteisetKoulutuksenosat.length > 0" class="mb-4">
        <h3>{{$t('yhteiset-opinnot')}}</h3>

        <EpKoulutuksenOsaKortti
          v-for="koulutuksenosaViite in yhteisetKoulutuksenosat"
          :key="'koulutuksenosa'+koulutuksenosaViite.id"
          :koulutuksenosa="koulutuksenosaViite.koulutuksenosa"
          :route="{name: 'toteutussuunnitelmaSisalto', params: {'sisaltoviiteId': koulutuksenosaViite.id}}"/>
      </div>

      <template v-if="valinnaisetKoulutuksenosat.length > 0">
        <h3>{{$t('valinnaiset-opinnot')}}</h3>

        <EpKoulutuksenOsaKortti
          v-for="koulutuksenosaViite in valinnaisetKoulutuksenosat"
          :key="'koulutuksenosa'+koulutuksenosaViite.id"
          :koulutuksenosa="koulutuksenosaViite.koulutuksenosa"
          :route="{name: 'toteutussuunnitelmaSisalto', params: {'sisaltoviiteId': koulutuksenosaViite.id}}"/>
      </template>

      <template v-if="yhteisetKoulutuksenosat.length === 0 && valinnaisetKoulutuksenosat.length === 0 && koulutuksenosat.length > 0">
        <EpKoulutuksenOsaKortti
          v-for="koulutuksenosaViite in koulutuksenosat"
          :key="'koulutuksenosa'+koulutuksenosaViite.id"
          :koulutuksenosa="koulutuksenosaViite.koulutuksenosa"
          :route="{name: 'toteutussuunnitelmaSisalto', params: {'sisaltoviiteId': koulutuksenosaViite.id}}"/>
      </template>
    </template>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { KoulutuksenOsaDtoKoulutusOsanTyyppiEnum, Matala, OpetussuunnitelmaDto } from '@shared/api/amosaa';
import { KoulutuksenOsatStore } from '@/stores/KoulutuksenOsatStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpKoulutuksenOsaKortti from '@shared/components/EpKoulutuksenosa/EpKoulutuksenOsaKortti.vue';
import * as _ from 'lodash';
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';

@Component({
  components: {
    EpSpinner,
    EpKoulutuksenOsaKortti,
  },
})
export default class EpToteutussuunnitelmaKoulutuksenOsat extends Vue {
  @Prop({ required: true })
  private sisaltoviite!: Matala;

  @Prop({ required: true })
  private kuvat!: any[];

  @Prop({ required: true })
  private opetussuunnitelma!: OpetussuunnitelmaDto;

  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: ToteutussuunnitelmaDataStore;

  get koulutuksenosat() {
    return _.map(this.sisaltoviite.lapset, (viite: any) => {
      let perusteenOsa;
      if (viite.perusteenOsaId) {
        perusteenOsa = this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ id: viite.perusteenOsaId });
      };

      return {
        ...viite,
        koulutuksenosa: {
          ...viite.koulutuksenosa,
          laajuusMinimi: !_.isNil(perusteenOsa?.laajuusMinimi) ? perusteenOsa.laajuusMinimi : viite?.koulutuksenosa?.laajuusMinimi,
          laajuusMaksimi: !_.isNil(perusteenOsa?.laajuusMaksimi) ? perusteenOsa?.laajuusMaksimi : viite?.koulutuksenosa?.laajuusMaksimi,
        },
      };
    }) as any;
  }

  get yhteisetKoulutuksenosat() {
    return _.filter(this.koulutuksenosat, koulutuksenosaViite => koulutuksenosaViite.koulutuksenosa?.koulutusOsanTyyppi === _.toLower(KoulutuksenOsaDtoKoulutusOsanTyyppiEnum.YHTEINEN));
  }

  get valinnaisetKoulutuksenosat() {
    return _.filter(this.koulutuksenosat, koulutuksenosaViite => koulutuksenosaViite.koulutuksenosa?.koulutusOsanTyyppi === _.toLower(KoulutuksenOsaDtoKoulutusOsanTyyppiEnum.VALINNAINEN));
  }
}
</script>

<style scoped lang="scss">

</style>
