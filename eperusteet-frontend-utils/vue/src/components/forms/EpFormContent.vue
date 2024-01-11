<template>
<div class="form-group form-content">
    <div v-if="showHeader">
      <div v-if="name">
        <h3 :class="headerClass" v-if="headerType === 'h3'">{{ $t(name) }}</h3>
        <label v-else>{{ $t(name) }}</label>
      </div>
      <slot name="header"></slot>
    </div>
    <slot></slot>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

/**
 * Tämän komponentin tehtävä on ainoastaan esittää label lomakekentälle
 */
@Component
export default class EpFormContent extends Vue {
  @Prop({ required: false, type: String })
  private name!: string;

  @Prop({ type: String })
  private headerType!: string;

  @Prop({ type: String })
  private headerClass!: string;

  @Prop({ required: false, default: true })
  private showHeader!:boolean;
}
</script>

<style scoped lang="scss">
.form-content {
  margin: 0 0 30px 0;

  label {
    font-weight: 600;
  }

  .h6 {
    font-weight: 600;
    font-size: 16px;
  }
}
</style>
