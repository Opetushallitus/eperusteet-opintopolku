<template>
  <div>
    <EpMaterialIcon :class="tyyppi">{{ icon }}</EpMaterialIcon>
    <span class="pl-2"><slot /></span>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpMaterialIcon,
  },
})
export default class IkoniTeksti extends Vue {
  @Prop({ required: true })
  private tyyppi!: 'virhe' | 'huomautus' | 'kaikki-kunnossa';

  get icon() {
    if (this.tyyppi === 'kaikki-kunnossa') {
      return 'check_circle';
    }
    return 'info';
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .virhe {
    color: $red;
  }

  .huomautus {
    color: $yellow;
  }

  .kaikki-kunnossa {
    color: $green;
  }

</style>
