<template>
  <div class="d-flex align-self-center flex-wrap flex-lg-row flex-column toggles">
    <EpToggle v-model="queryData.tuleva" class="haku-toggle" :is-s-witch="false">
      <span v-if="queryData.tuleva" class="sr-only">{{ $t('valittu') }}</span>
      <span class="sr-only">{{ $t('voimassaolo-filtteri') }}</span>
      {{ $t('tulossa-voimaan') }}
    </EpToggle>
    <EpToggle v-model="queryData.voimassaolo" class="haku-toggle" :is-s-witch="false">
      <span v-if="queryData.voimassaolo" class="sr-only">{{ $t('valittu') }}</span>
      <span class="sr-only">{{ $t('voimassaolo-filtteri') }}</span>
      {{ $t('voimassa') }}
    </EpToggle>
    <EpToggle v-if="queryData.siirtyma != null" v-model="queryData.siirtyma" class="haku-toggle" :is-s-witch="false">
      <span v-if="queryData.siirtyma" class="sr-only">{{ $t('valittu') }}</span>
      <span class="sr-only">{{ $t('voimassaolo-filtteri') }}</span>
      {{ $t('ajoitus-siirtyma') }}
    </EpToggle>
    <EpToggle v-model="queryData.poistunut" class="haku-toggle" :is-s-witch="false">
      <span v-if="queryData.poistunut" class="sr-only">{{ $t('valittu') }}</span>
      <span class="sr-only">{{ $t('voimassaolo-filtteri') }}</span>
      {{ $t('ei-voimassa') }}
    </EpToggle>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpToggle from '@shared/components/forms/EpToggle.vue';

@Component({
  components: {
    EpToggle,
  },
})
export default class EpVoimassaoloFilter extends Vue {
  @Prop({ required: true })
  private value!: any;

  get queryData() {
    return this.value;
  }

  set queryData(val) {
    this.$emit('input', val);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.toggles {
  padding-bottom: 10px;

  .haku-toggle {
    padding: 2px 7px;
    border: 1px solid $gray-lighten-8;
    border-radius: 6px;
    margin-right: 7px;
    margin-bottom: 5px;

    @media(max-width: 992px) {
      padding: 15px 20px;
    }
  }
}

</style>
