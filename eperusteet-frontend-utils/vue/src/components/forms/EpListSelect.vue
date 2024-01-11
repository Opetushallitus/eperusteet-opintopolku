<template>
<div>
  <div>
    <div>
      <EpInput type="string"
               @blur="onListBlur"
               @focus="onListFocus"
               v-model="search" is-editing>
      </EpInput>
    </div>
    <div class="searchlist-wrapper">
      <div class="searchlist" v-if="search">
        <!-- <pre>{{ value }}</pre> -->
        <!-- <pre>{{ options }}</pre> -->
        <div class="searchitem" v-for="option in options" :key="option[identity]">
          <slot v-bind:option="option">
          </slot>
        </div>
      </div>
    </div>
    <span class="clear"></span>
  </div>
  <div class="valid-feedback" v-if="!validationError && validMessage">{{ $t(validMessage) }}</div>
  <div class="invalid-feedback" v-else-if="validationError && invalidMessage ">{{ $t(invalidMessage) }}</div>
  <div class="invalid-feedback" v-else-if="validationError && !invalidMessage">{{ $t('validation-error-' + validationError, validation.$params[validationError]) }}</div>
  <small class="form-text text-muted" v-if="help">{{ $t(help) }}</small>
</div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';

import Multiselect from 'vue-multiselect';
import EpContent from '@shared/components/EpContent/EpContent.vue';
import { Debounced } from '@shared/utils/delay';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpValidation from '../../mixins/EpValidation';
import _ from 'lodash';

@Component({
  components: {
    EpContent,
    EpInput,
    EpSpinner,
    Multiselect,
  },
})
export default class EpListSelect extends Mixins(EpValidation) {
  @Prop({
    required: true,
    type: Array,
  })
  private options!: any[];

  @Prop({
    required: true,
    type: Array,
  })
  private value!: any[];

  @Prop()
  private trackBy!: string;

  @Prop({ required: true })
  private identity!: string;

  @Prop({ default: () => '' })
  private searchIdentity!: null | ((v: any) => string | null | undefined);

  @Prop({ default: '', type: String })
  private help!: string;

  private search = '';
  private hasFocus = false;

  get filteredOptions() {
    if (this.search && this.searchIdentity) {
      return _.filter(this.options, x => _.includes(
        _.toLower(this.searchIdentity!(x) || ''),
        _.toLower(this.search || '')));
    }
    return this.options;
  }

  get model() {
    return this.value;
  }

  get track() {
    return this.trackBy;
  }

  private changed(value: any) {
    this.$emit('input', value);
  }

  private onListBlur() {
    this.hasFocus = false;
  }

  private onListFocus() {
    this.hasFocus = true;
  }
}

</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

/* .clear {          */
/*   clear: left;    */
/*   display: block; */
/* }                 */

.searchlist-wrapper {
  /* float: left; */
  display: inline-block;
  position: relative;
  top: 0;

  .searchlist {
    /* float: left; */
    /* #parent { overflow: hidden; float: left; width: 100%; } */
    position: absolute;
    left: 0;
    top: 0;
    border: 1px solid black;
    min-width: 120px;
    max-width: 576px;
    max-height: 356px;
    overflow-y: scroll;
    background: #ffffffff;
    z-index: 1000;
    border: 1px solid #ced4da;
    border-top: none;
  }
}

</style>
