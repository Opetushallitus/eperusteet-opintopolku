<template>
<div class="content">
  <h2 class="otsikko" slot="header">{{ $t('perusteen-tiedot') }}</h2>
    <div class="row">
      <div class="col-md-12">
        <ep-form-content name="peruste-nimi">
          <ep-field v-model="test"></ep-field>
        </ep-form-content>
      </div>
    </div>
</div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import EpRoute from '@shared/mixins/EpRoute';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpField from '@shared/components/forms/EpField.vue';


@Component({
  components: {
    EpFormContent,
    EpField,
  },
})
export default class RouteTiedot extends EpRoute {
    private test = {
      'fi': 'test',
    }
}
</script>

<style scoped lang="scss">
</style>
