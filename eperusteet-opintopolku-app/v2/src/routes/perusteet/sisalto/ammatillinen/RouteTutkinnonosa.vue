<template>
  <div class="content">
    <ep-spinner v-if="!tutkinnonosa"></ep-spinner>
    <div v-else>
      <h2 class="otsikko mb-4" slot="header">{{ $kaanna(tutkinnonosaViite.nimi)}}, {{tutkinnonosaViite.laajuus}} {{$t('osaamispiste')}}</h2>

      <ep-tutkinnonosa-normaali v-if="tutkinnonosa.tyyppi === 'normaali'" :tutkinnonosa="tutkinnonosa" />
      <ep-tutkinnonosa-tutke v-else :tutkinnonosa="tutkinnonosa" />

    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { PerusteenTutkinnonosaStore } from '@/stores/PerusteenTutkinnonosaStore';
import { Kielet } from '@shared/stores/kieli';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpTutkinnonosaNormaali from '@/components/EpAmmatillinen/EpTutkinnonosaNormaali.vue';
import EpTutkinnonosaTutke from '@/components/EpAmmatillinen/EpTutkinnonosaTutke.vue';

@Component({
  components: {
    EpSpinner,
    EpFormContent,
    EpTutkinnonosaNormaali,
    EpTutkinnonosaTutke,
  },
})
export default class RouteTutkinnonosa extends Vue {
  @Prop({ required: true })
  private tutkinnonosaStore!: PerusteenTutkinnonosaStore;

  get tutkinnonosa() {
    return this.tutkinnonosaStore.tutkinnonosa.value;
  }

  get tutkinnonosaViite() {
    return this.tutkinnonosaStore.tutkinnonosaViite.value;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .content {
    padding: 0 $content-padding;
  }

</style>
