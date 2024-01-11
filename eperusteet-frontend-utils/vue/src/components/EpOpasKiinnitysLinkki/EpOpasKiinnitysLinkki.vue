<template>
  <div class="mt-5" v-if="oppaat && oppaat.length > 0">
    <hr/>
    <h2 class="mb-4 mt-4">{{$t('ohjeet-ja-materiaalit')}}</h2>

    <router-link
      v-for="opas in oppaat"
      :key="opas.id"
      class="d-flex opas mb-2"
      :to="{name: 'peruste', params: {koulutustyyppi: 'opas', perusteId: opas.id}}">
      <div class="icon mr-3">
        <EpMaterialIcon size="18px">menu_book</EpMaterialIcon>
      </div>
      <div class="nimi pt-1">{{$kaanna(opas.nimi)}}</div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { PerusteDto, Perusteet } from '@shared/api/eperusteet';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpSpinner,
    EpMaterialIcon,
  },
})
export default class EpOpasKiinnitysLinkki extends Vue {
  @Prop({ required: false })
  private koodiUri!: string;

  private oppaat: PerusteDto[] | null = null;

  async mounted() {
    if (this.koodiUri) {
      this.oppaat = (await Perusteet.getOpasKiinnitettyKoodi(this.koodiUri)).data;
    }
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.opas {

  border: 1px solid $gray-lighten-8;
  padding: 0.7rem;
  border-radius: 0.2rem;

  .icon {
    color: $blue-lighten-5;
  }

  .nimi {
    font-weight:600;
    color: $black;
  }

  &:hover {
    background-color: $gray-lighten-5;
  }
}
</style>
