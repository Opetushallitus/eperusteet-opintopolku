<template>
  <div class="content">
    <ep-spinner v-if="!sisaltoviite" />

    <ep-toteutussuunnitelma-tekstikappale v-else-if="sisaltoviite.tyyppi === 'tekstikappale'" :sisaltoviite="sisaltoviite" />
    <ep-toteutussuunnitelma-tutkinnonosa v-else-if="sisaltoviite.tyyppi === 'tutkinnonosa'" :sisaltoviite="sisaltoviite" />
    <ep-toteutussuunnitelma-suorituspolku v-else-if="sisaltoviite.tyyppi === 'suorituspolku'" :sisaltoviite="sisaltoviite" />
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { SisaltoviiteStore } from '@/stores/SisaltoviiteStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpToteutussuunnitelmaTekstikappale from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaTekstikappale.vue';
import EpToteutussuunnitelmaTutkinnonosa from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaTutkinnonosa.vue';
import EpToteutussuunnitelmaSuorituspolku from '@/components/EpToteutussuunnitelma/EpToteutussuunnitelmaSuorituspolku.vue';

@Component({
  components: {
    EpSpinner,
    EpToteutussuunnitelmaTekstikappale,
    EpToteutussuunnitelmaTutkinnonosa,
    EpToteutussuunnitelmaSuorituspolku,
  },
})
export default class RouteToteutussuunnitelmaSisalto extends Vue {
  @Prop({ required: true })
  private sisaltoviiteStore!: SisaltoviiteStore;

  get sisaltoviite() {
    if (this.sisaltoviiteStore.sisaltoviite.value) {
      return this.sisaltoviiteStore.sisaltoviite.value!;
    }
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .content {
    padding: 0 $content-padding;

  }

</style>
