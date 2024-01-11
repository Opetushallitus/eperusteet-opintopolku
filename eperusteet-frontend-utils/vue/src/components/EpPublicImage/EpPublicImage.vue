<template>
  <img :src="src" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class EpPublicImage extends Vue {
  @Prop({ required: true })
  private image!: string;

  get src() {
    return require(`../../../public/img/icons/${this.image}`);
  }
}
</script>

<style lang="scss" scoped>
</style>
