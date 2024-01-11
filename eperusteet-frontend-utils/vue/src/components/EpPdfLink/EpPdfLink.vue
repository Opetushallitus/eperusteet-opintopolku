<template>
  <a :href="url" target="_blank" rel="noopener noreferrer">
    <div class="d-flex">
      <EpMaterialIcon color="#3367E3" class="mr-2" alt="pdf">picture_as_pdf</EpMaterialIcon>
      <slot></slot>
    </div>
  </a>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {

  },
})
export default class EpPdfLink extends Vue {
  @Prop({ required: true })
  url!: string;
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
