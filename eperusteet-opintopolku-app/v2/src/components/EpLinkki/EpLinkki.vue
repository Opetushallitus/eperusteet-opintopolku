<template>
<div class="linkki">
  <a :href="url">
    <fas :icon="icon" fixed-width class="mr-1" v-if="icon"></fas>
    <span>{{ cleanUrl }}</span>
  </a>
</div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';

@Component
export default class EpLinkki extends Vue {
  @Prop()
  private url!: string;

  @Prop({
    required: false,
  })
  private label!: string;

  @Prop({ default: '' })
  private icon!: string;

  @Prop({
    default: true,
  })
  private onlyTopLevel!: boolean;

  get cleanUrl() {
    let result = this.url
      ? (this.url.replace(/^https?:\/\//, ''))
      : '';

    result = result.replace(/^mailto?:/, '');

    if (this.onlyTopLevel) {
      const idx = result.indexOf('/');
      if (idx > 0) {
        result = result.substr(0, idx);
      }
    }
    return result;
  }
}
</script>

<style scoped lang="scss">
.linkki {
  font-size: small;

  a {
    display: inline;
    white-space: nowrap;

  }
}
</style>

