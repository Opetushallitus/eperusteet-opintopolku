<template>
<div>
  <div v-if="!onlyText" class="d-flex align-items-center">
    <div v-if="ops">
      <svg width="116" height="116" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fill-rule="evenodd">
          <circle fill="#E9EEF8" cx="58" cy="58" r="58"/>
          <g fill-rule="nonzero">
            <path d="M28 58.3v18.91C28 83.17 28 88 34 88s7.1-2.4 7.1-6.03V52.25h-7A6.07 6.07 0 0028 58.3z" fill="#D9DFEB"/>
            <path d="M87.58 34.06c-.04 10.12 0 15.25 0 20.31v22.84c0 5.96-4.9 10.78-10.94 10.79H33.6c3.55 0 5.5-3.65 5.48-5.44-.19-10.78-.18-26.96.03-48.53A6.06 6.06 0 0145.25 28h36.2a6.1 6.1 0 016.13 6.06z" fill="#FEFEFF"/>
            <path d="M76.4 47.7h-25v-6.06h25v6.06zm-8 24.25h-17v-6.06h17v6.06zm-17-18.19h24.58v6.06H51.4v-6.06z" fill="#DEE1E6"/>
          </g>
        </g>
      </svg>
    </div>
    <div v-else>
      <div>
        <svg width="116" height="116" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fill-rule="evenodd">
          <circle fill="#E9EEF8" cx="58" cy="58" r="58"/>
          <path d="M29.5 23h46a2 2 0 012 2v66a2 2 0 01-2 2h-46a2 2 0 01-2-2V25c0-1.1.9-2 2-2z" fill="#FFF"/>
          <path fill="#E2E9F8" d="M67.87 62.12l-10.6 2.12 2.11-10.6L90.5 22.51 98.98 31z"/>
          <path fill="#DBE3F6" d="M65.04 59.29l-2.83-2.83 31.11-31.11 2.83 2.83z"/>
          <path fill="#CCD9F8" d="M67.87 62.12l-2.83-2.83 31.11-31.11L98.98 31z"/>
          <path d="M57.26 64.24l2.12-10.6 8.49 8.48-10.6 2.12z" fill="#E9EEF8"/>
          <path d="M57.26 64.24l.7-3.54 2.84 2.83-3.54.7z" fill="#99B3F1"/>
          </g>
        </svg>
      </div>
    </div>
    <div class="alert flex-fill-1">{{ text }}</div>
  </div>
  <span v-else class="alert alert-only-text">{{ text }}</span>
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class EpAlert extends Vue {
  @Prop({ required: true })
  private text!: string;

  @Prop({ default: false, required: false })
  private ops!: boolean;

  @Prop({ default: false, required: false })
  private onlyText!: boolean;
}
</script>

<style lang="scss" scoped>

.alert {
  color: #9e9e9e;
}

.alert-only-text {
  padding: 0;
}

</style>
