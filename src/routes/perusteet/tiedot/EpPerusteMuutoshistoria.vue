<template>
  <div class="content" id="scroll-anchor">
    <h2 class="otsikko mb-2">
      {{ $t('muutoshistoria') }}
    </h2>

    <div>
      {{$t('peruste-muutoshistoria-kuvaus')}}

      <span class="clickable link-style" @click="piilotaMuutoshistoria">{{$t('palaa-perusteen-tietoihin')}}</span>
    </div>

    <div class="mt-2" v-if="julkaisut && julkaisut.length > 0">
      <EpJulkaisuHistoriaJulkinen
        :julkaisut="julkaisut"
        naytaKaikki />
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Prop, Vue, Component } from 'vue-property-decorator';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpJulkaisuHistoriaJulkinen from '@shared/components/EpJulkaisuHistoriaJulkinen/EpJulkaisuHistoriaJulkinen.vue';

@Component({
  components: {
    EpJulkaisuHistoriaJulkinen,
    EpFormContent,
    EpSpinner,
  },
})
export default class EpPerusteMuutoshistoria extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  get julkaisut() {
    return this.perusteDataStore.julkaisut;
  }

  piilotaMuutoshistoria() {
    this.$router.replace({ query: {} }).catch(() => {});
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: $content-padding;
}

</style>
