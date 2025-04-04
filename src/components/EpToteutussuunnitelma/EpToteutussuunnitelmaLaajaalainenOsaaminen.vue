<template>
  <div>
    <portal-target name="toteutussuunnitelma-sisalto-header"></portal-target>
    <ep-content-viewer :value="$kaanna(perusteenTeksti)" :kuvat="kuvat" v-if="sisaltoviite.naytaPerusteenTeksti && perusteenTeksti"/>
    <ep-content-viewer :value="$kaanna(sisaltoviite.tuvaLaajaAlainenOsaaminen.teksti)" :kuvat="kuvat"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Matala } from '@shared/api/amosaa';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { ToteutussuunnitelmaDataStore } from '@/stores/ToteutussuunnitelmaDataStore';

@Component({
  components: {
    EpContentViewer,
  },
})
export default class EpToteutussuunnitelmaLaajaalainenOsaaminen extends Vue {
  @Prop({ required: true })
  private sisaltoviite!: Matala;

  @Prop({ required: true })
  private kuvat!: any[];

  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: ToteutussuunnitelmaDataStore;

  get perusteenTeksti(): any {
    if (this.perusteenOsa) {
      return this.perusteenOsa.teksti;
    }

    return (this.sisaltoviite as any).perusteteksti;
  }

  get perusteenOsa() {
    if (this.sisaltoviite.perusteenOsaId) {
      return this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto({ id: this.sisaltoviite.perusteenOsaId });
    }
  }
}
</script>

<style scoped lang="scss">

</style>
