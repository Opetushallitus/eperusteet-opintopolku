<template>
<div class="oph-spinner oph-spinner-in-button" :class="{'link' : link}">
  <div class="oph-bounce oph-bounce1"></div>
  <div class="oph-bounce oph-bounce2"></div>
  <div class="oph-bounce oph-bounce3"></div>
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class EpSpinnerInline extends Vue {
  @Prop({ required: false, default: false })
  private link!: boolean;
}
</script>

<style scoped lang="scss">
@import "./style.scss";

  .oph-spinner-in-button.oph-spinner-in-button.link .oph-bounce {
    background-color: #3367E3;
  }

.oph-spinner-in-button {
  margin-left: 15px;
}
</style>
