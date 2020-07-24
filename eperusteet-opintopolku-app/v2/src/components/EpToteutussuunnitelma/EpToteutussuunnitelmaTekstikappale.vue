<template>
  <div>
    <h2>{{$kaanna(sisaltoviite.tekstiKappale.nimi)}}</h2>
    <ep-content-viewer :value="$kaanna(sisaltoviite.tekstiKappale.teksti)" :kuvat="kuvat"/>
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
export default class EpToteutussuunnitelmaTekstikappale extends Vue {
  @Prop({ required: true })
  private sisaltoviite!: Matala;

  @Prop({ required: true })
  private kuvat!: any[];
}
</script>

<style scoped lang="scss">

</style>
