<template>
  <ep-button class="mt-3"
             @click="suoritaJulkaisu()"
             :showSpinner="julkaistaan || julkaisuKesken"
             :disabled="disabled">
    {{ $t('julkaise') }}
  </ep-button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpButton from '@shared/components/EpButton/EpButton.vue';

@Component({
  components: {
    EpButton,
  },
})
export default class EpJulkaisuButton extends Vue {
  @Prop({ required: true })
  protected julkaise!: Function;

  @Prop({ required: false })
  protected julkaisuKesken!: boolean;

  @Prop({ required: false, default: false })
  protected disabled?: boolean;

  private julkaistaan = false;

  async suoritaJulkaisu() {
    if (await this.$bvModal.msgBoxConfirm((this.$t('julkaisu-varmistus-modal-teksti') as any), {
      title: this.$t('vahvista-julkaisu'),
      okVariant: 'primary',
      okTitle: this.$t('julkaise') as any,
      cancelVariant: 'link',
      cancelTitle: this.$t('peruuta') as any,
      centered: true,
      ...{} as any,
    })) {
      this.julkaistaan = true;
      await this.julkaise();
      this.julkaistaan = false;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/_variables.scss';

</style>
