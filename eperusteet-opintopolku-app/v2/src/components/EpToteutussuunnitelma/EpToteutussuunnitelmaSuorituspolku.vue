<template>
  <div>
    EpToteutussuunnitelmaSuorituspolku
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Matala } from '@shared/api/amosaa';

@Component
export default class EpToteutussuunnitelmaSuorituspolku extends Vue {
  @Prop({ required: true })
  private sisaltoviite!: Matala;
}
</script>

<style scoped lang="scss">

</style>
