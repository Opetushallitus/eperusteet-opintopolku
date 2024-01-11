<template>
  <div class="d-flex flex-column" :class="{ 'is-warning': isWarning }">
    <div class="d-flex">
      <slot>
      </slot>
    </div>
    <div>
      <b-form-invalid-feedback :state="false">
        {{ message }}
      </b-form-invalid-feedback>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import _ from 'lodash';
import EpValidation from '../../mixins/EpValidation';

@Component
export default class EpErrorWrapper extends Mixins(EpValidation) {
}
</script>

<style scoped lang="scss">
.is-warning {
  .invalid-feedback {
    color: orange;
  }
}
</style>
