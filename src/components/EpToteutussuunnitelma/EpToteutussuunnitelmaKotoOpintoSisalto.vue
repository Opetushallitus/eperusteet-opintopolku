<template>
  <div v-if="perusteenOsa">
    <h2 id="tekstikappale-otsikko" class="otsikko mb-4">{{ $kaanna(perusteenOsa.nimi) }}</h2>

      <ep-content-viewer :value="$kaanna(perusteenOsa.kuvaus)" :kuvat="kuvat" />
      <hr class="my-4"/>

      <EpKotoTaitotasot
        :taitotasoTyyppi="taitotasoTyyppi"
        :value="perusteenOsa.taitotasot"
        :kuvat="kuvat">
          <template #paikallinentarkennus="{ nimi }">
            <ep-content-viewer :value="$kaanna(kotoTaitotasotByUri[nimi.uri].tavoiteTarkennus)" :kuvat="kuvat" />
          </template>
      </EpKotoTaitotasot>

      <div v-if="laajaAlaisetOsaamiset && laajaAlaisetOsaamiset.length > 0">
        <hr class="my-4"/>
        <h2 class="mb-4">{{$t('laaja-alainen-osaaminen')}}</h2>
        <div v-for="(lao, index) in laajaAlaisetOsaamiset" :key="'lao' + index" :class="{'mt-4': index > 0}">
          <h3>{{ $kaanna(perusteenLaotByUri[lao.koodiUri].koodi.nimi) }}</h3>
          <ep-content-viewer :value="$kaanna(perusteenLaotByUri[lao.koodiUri].kuvaus)" :kuvat="kuvat" />
          <ep-content-viewer :value="$kaanna(lao.teksti)" :kuvat="kuvat" />
        </div>
      </div>

      <slot name="previous-next-navigation" />
  </div>
</template>

<script lang="ts">
import { SisaltoViiteExportDto } from '@shared/api/amosaa';
import * as _ from 'lodash';
import { Prop, Component, Vue } from 'vue-property-decorator';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpKotoTaitotasot from '@shared/components/EpKotoTaitotasot/EpKotoTaitotasot.vue';
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';

@Component({
  components: {
    EpContentViewer,
    EpKotoTaitotasot,
  },
})
export default class EpToteutussuunnitelmaKotoOpintoSisalto extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: ToteutussuunnitelmaDataStore;

  @Prop({ required: true })
  private sisaltoviite!: SisaltoViiteExportDto;

  @Prop({ required: true })
  private kuvat!: any[];

  @Prop({ required: true })
  private sisaltoViiteSisalto!: 'kotoKielitaitotaso' | 'kotoOpinto';

  get taitotasoTyyppi() {
    return this.sisaltoViiteSisalto === 'kotoKielitaitotaso' ? 'kielitaitotaso' : 'opintokokonaisuus';
  }

  get perusteenOsa() {
    return this.sisaltoviite[this.sisaltoViiteSisalto]!.perusteenOsa;
  }

  get kotoTaitotasotByUri() {
    return _.keyBy(this.sisaltoviite[this.sisaltoViiteSisalto]!.taitotasot, 'koodiUri');
  }

  get laajaAlaisetOsaamiset() {
    return this.sisaltoviite[this.sisaltoViiteSisalto]!.laajaAlaisetOsaamiset;
  }

  get perusteenLaajaAlaisetOsaamiset() {
    return _.get(this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ 'osanTyyppi': 'koto_laajaalainenosaaminen' }), 'osaamisAlueet');
  }

  get perusteenLaotByUri() {
    return _.keyBy(this.perusteenLaajaAlaisetOsaamiset, 'koodi.uri');
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
