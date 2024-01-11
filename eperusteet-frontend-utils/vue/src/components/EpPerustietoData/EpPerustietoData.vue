<template>
<div class="data-content d-flex flex-row">
  <div class="pr-3">
    <EpMaterialIcon>{{ icon }}</EpMaterialIcon>
  </div>
  <div>
    <div class="topic"><h4 class="mb-0">{{ topic }}</h4></div>
    <div><slot></slot></div>
  </div>
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpMaterialIcon,
  },
})
export default class EpPerustietoData extends Vue {
  @Prop({ required: true })
  private icon!: string;

  @Prop({ required: true })
  private topic!: string;
}
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";

  .icon {
    color: $blue-lighten-6;
  }

</style>
