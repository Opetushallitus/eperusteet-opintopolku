<template>
  <div>
    <portal-target name="toteutussuunnitelma-sisalto-header"></portal-target>
    <ep-content-viewer :value="$kaanna(sisaltoviite.perusteteksti)" :kuvat="kuvat" v-if="sisaltoviite.naytaPerusteenTeksti"/>
    <ep-content-viewer :value="$kaanna(sisaltoviite.tuvaLaajaAlainenOsaaminen.teksti)" :kuvat="kuvat"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Matala } from '@shared/api/amosaa';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';

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
}
</script>

<style scoped lang="scss">

</style>
