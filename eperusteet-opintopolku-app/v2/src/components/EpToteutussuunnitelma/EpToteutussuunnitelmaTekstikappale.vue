<template>
  <div>
    <h2>{{$kaanna(tekstikappale.nimi)}}</h2>
    <div v-html="$kaanna(tekstikappale.teksti)" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Matala } from '@shared/api/amosaa';

@Component
export default class EpToteutussuunnitelmaTekstikappale extends Vue {
  @Prop({ required: true })
  private sisaltoviite!: Matala;

  get tekstikappale() {
    if (this.sisaltoviite.tekstiKappale) {
      return this.sisaltoviite.tekstiKappale;
    }
  }
}
</script>

<style scoped lang="scss">

</style>
