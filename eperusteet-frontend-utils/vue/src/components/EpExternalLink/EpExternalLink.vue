<template>
  <ep-linkki
      :class="styleclass"
      :url="url"
      :label="label"
      :icon="icon"
      :only-top-level="onlyTopLevel">
    <slot></slot>
  </ep-linkki>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import EpLinkki from '@shared/components/EpLinkki/EpLinkki.vue';

@Component({
  components: {
    EpLinkki,
  },
})
export default class EpExternalLink extends Vue {
  @Prop({ type: String })
  private url!: string;

  @Prop({ default: true, type: Boolean })
  private showIcon!: Boolean;

  @Prop({
    required: false,
    type: String,
  })
  private label!: string;

  @Prop({ default: 'medium', type: String })
  private styleclass!: string;

  @Prop({
    default: true,
    type: Boolean,
  })
  private onlyTopLevel!: boolean;

  get icon() {
    if (this.showIcon) {
      return 'launch';
    }

    return '';
  }

  get urlWithQueryParam() {
    return this.url + '?paluuosoite=' + encodeURIComponent(location.href);
  }
}

</script>
