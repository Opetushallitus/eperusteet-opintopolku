<template>
    <div v-if="isEditing">
        <div v-if="items && (!multiple || innerModel)">
            <select v-if="!useCheckboxes"
                    class="form-control"
                    v-model="innerModel"
                    :multiple="multiple"
                    :class="{ 'is-invalid': isInvalid, 'is-valid': isValid }"
                    :disabled="disabled">
                <option :value="null" v-if="enableEmptyOption" :disabled="emptyOptionDisabled" :hidden="emptyOptionDisabled">{{ $t(placeholder) }}</option>
                <option v-for="(item, idx) in items" :value="item" :key="idx">
                    <slot name="default" :item="item">{{ item }}</slot>
                </option>
            </select>
            <b-form-group v-else>
              <b-form-checkbox-group
                v-model="innerModel"
                name="kielivalinta"
                stacked
                :class="{ 'is-invalid': isInvalid, 'is-valid': isValid }">
                <b-form-checkbox
                  v-for="item in items"
                  :key="item"
                  :value="item">
                  <slot name="default" :item="item">
                    <span>{{ item }}</span>
                  </slot>
                </b-form-checkbox>
              </b-form-checkbox-group>
            </b-form-group>
            <div class="valid-feedback"
                 v-if="!validationError && validMessage">{{ $t(validMessage) }}</div>
            <div class="invalid-feedback"
                 v-else-if="validationError && invalidMessage">{{ $t(invalidMessage) }}</div>
            <div class="invalid-feedback"
                 v-else-if="validationError && !invalidMessage">{{ $t('validation-error-' + validationError, validation.$params[validationError]) }}</div>
            <small class="form-text text-muted"
                   v-if="help && isEditing">{{ $t(help) }}</small>
        </div>
        <ep-spinner v-else></ep-spinner>
    </div>
    <div v-else>
        <ul>
            <li v-for="(item, idx) in displayValue" :key="idx">
                <slot name="default"
                      :item="item">
                    <span>{{ item }}</span>
                </slot>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';

import EpSpinner from '../EpSpinner/EpSpinner.vue';
import EpValidation from '../../mixins/EpValidation';

@Component({
  components: {
    EpSpinner,
  },
})
export default class EpSelect extends Mixins(EpValidation) {
  @Prop({
    default: false,
    type: Boolean,
  })
  private isEditing!: boolean;

  @Prop({ required: true })
  private items!: any[];

  @Prop({
    required: true,
  })
  private value!: any | any[];

  @Prop({ default: false, type: Boolean })
  private useCheckboxes!: boolean;

  @Prop({ default: false, type: Boolean })
  private multiple!: boolean;

  @Prop({ default: true, type: Boolean })
  private enableEmptyOption!: boolean;

  @Prop({ default: '', type: String })
  private help!: string;

  @Prop({ default: '', type: String })
  private placeholder!: string;

  @Prop({ default: false, type: Boolean })
  private disabled!: boolean;

  @Prop({ default: false, type: Boolean })
  private emptyOptionDisabled!: boolean;

  get displayValue() {
    return _.filter(this.items, (item) => _.includes(this.value, item));
  }

  set innerModel(innerModel) {
    if (_.isArray(innerModel)) {
      if (!_.isEqual(innerModel, this.innerModel)) {
        this.$emit('input', [...innerModel]);
      }
    }
    else {
      if (!_.isEqual(innerModel, this.innerModel)) {
        this.$emit('input', innerModel);
      }
    }

    if (this.validation?.$touch) {
      this.validation?.$touch();
    }
  }

  get innerModel() {
    if (this.value) {
      return this.value;
    }
    else if (this.multiple) {
      return [];
    }
    else {
      return null;
    }
  }

  @Watch('items', { immediate: true })
  itemsChange() {
    if (!this.enableEmptyOption && _.size(this.items) > 0 && this.value === null && !this.multiple) {
      this.innerModel = _.first(this.items);
    }
  }
}
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";

select {
  // Chrome pakottaa oman border-radiuksen ilman
  appearance: none;
  background: url('../../../public/img/icons/vakanen-alas.svg') no-repeat right $white;
  background-position-x: calc(100% - 5px);
  background-position-y: calc(100% - 2px);
}

/deep/ label.custom-control-label::before {
  border: 2px solid #E0E0E1;
  border-radius: 0.2rem;
}

/deep/ input.custom-control-input {
  appearance: none;
}

// Piilotettu Bootstrapissa oletuksena
/deep/ .invalid-feedback,
/deep/ .valid-feedback {
  display: block;
}

select {
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 500;

  &:focus {
    border-color: #47a4f5;
    outline: none !important;
    box-shadow: none !important;
  }
}

</style>
