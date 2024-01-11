<template>
  <div class="d-flex align-self-center flex-wrap flex-lg-row flex-column justify-content-between">
    <b-form-group :label="$t('nayta')" :aria-label="$t('tutkinnon-peruste-tai-tutkinnon-osa-rajaus')" class="group">
      <div class="d-flex flex-lg-row flex-column justify-content-between">
        <EpToggle v-model="queryData.perusteet" class="haku-toggle" :is-s-witch="false">
          <span class="sr-only">{{ $t('valittu') }}</span>
          <span class="sr-only">{{ $t('tutkinto-filtteri') }}</span>
          {{ $t('tutkinnon-peruste') }}
        </EpToggle>
        <EpToggle v-model="queryData.tutkinnonosat" class="haku-toggle" :is-s-witch="false">
          <span class="sr-only">{{ $t('valittu') }}</span>
          <span class="sr-only">{{ $t('tutkinto-filtteri') }}</span>
          {{ $t('tutkinnon-osa') }}
        </EpToggle>
      </div>
    </b-form-group>

    <b-form-group :label="$t('voimassaolo')" :aria-label="$t('voimassaolo-rajaus')" class="group">
      <EpVoimassaoloFilter v-model="queryData"></EpVoimassaoloFilter>
    </b-form-group>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import EpVoimassaoloFilter from '@shared/components/EpVoimassaoloFilter/EpVoimassaoloFilter.vue';

@Component({
  components: {
    EpToggle,
    EpVoimassaoloFilter,
  },
})
export default class EpSisaltotyyppiFilter extends Vue {
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

.group {
  padding-right: 0;
  margin-top: 0;

  @media(max-width: 992px) {
    margin-bottom: 0;
  }
}

.haku-toggle {
  padding: 2px 7px;
  border: 1px solid $gray-lighten-8;
  border-radius: 6px;
  margin-right: 7px;
  margin-bottom: 5px;

  @media(max-width: 992px) {
    padding: 15px 20px;
    margin-right: 0;
  }
}
</style>
