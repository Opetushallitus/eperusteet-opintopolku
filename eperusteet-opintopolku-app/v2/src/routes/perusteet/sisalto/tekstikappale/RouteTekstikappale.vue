<template>
<div class="content">
    <h1 class="teksti">{{ $kaanna(perusteenOsa.nimi) }}</h1>
    <div v-html="$kaanna(perusteenOsa.teksti)" class="teksti"></div>
</div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import EpPerusteRoute from '@/mixins/EpPerusteRoute';
import { PerusteenOsaStore } from '@/stores/PerusteenOsaStore';


@Component
export default class RouteTekstikappale extends Mixins(EpPerusteRoute) {
  @Prop({ required: true })
  private perusteenOsaStore!: PerusteenOsaStore;

  private get perusteenOsa() {
    return this.perusteenOsaStore.perusteenOsa;
  }
}

</script>

<style scoped lang="scss">
@import '../../../../styles/_variables.scss';

.content {
    padding: $content-padding;

    .teksti {
        hyphens: auto;

        & /deep/ p {
            text-align: justify;
        }

        & /deep/ img {
            max-width: 100%;
        }
    }
}
</style>
