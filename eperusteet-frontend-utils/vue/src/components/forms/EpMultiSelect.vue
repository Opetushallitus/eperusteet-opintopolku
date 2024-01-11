<template>
<div>
  <multiselect v-model="model"
               :track-by="track"
               :options="filteredOptions"
               :close-on-select="closeOnSelect"
               :clear-on-select="clearOnSelect"
               :placeholder="placeholder"
               :internalSearch="false"
               select-label=""
               selected-label=""
               deselect-label=""
               @search-change="onSearchChange"
               :multiple="multiple"
               :class="inputClass"
               :label="label"
               :custom-label="customLabel"
               :group-values="groupValues"
               :group-label="groupLabel"
               :group-select="groupSelect"
               :searchable="searchable"
               :maxHeight="maxHeight"
               :loading="loading"
               :internal-search="internalSearch"
               :disabled="disabled"
               :allowEmpty="allowEmpty"
               :openDirection="openDirection"
               @remove="remove"
               ref="multiselect"
               @tag="addTag"
               :taggable="taggable"
               :tagPlaceholder="tagPlaceholder">

    <template slot="beforeList">
      <slot name="beforeList" />
    </template>

    <template slot="singleLabel"
              slot-scope="{ option }">
      <slot name="singleLabel" :option="option"></slot>
    </template>
    <template slot="option" slot-scope="{ option, search }">
      <slot name="checkbox" :option="option">
        <input type="checkbox" :checked="optionChecked(option)" v-if="multiple"/>
      </slot>
      <slot name="option" :option="option" :search="search">
        <span class="ml-2">{{getOptionLabel(option)}}</span>
      </slot>
    </template>
    <template slot="tag" slot-scope="{ option, search, remove }">
      <slot name="tag" :option="option" :search="search" :remove="remove"></slot>
    </template>
    <template slot="noResult">
      <slot name="noResult">
        <div>{{ $t('ei-hakutuloksia') }}</div>
      </slot>
    </template>
    <template slot="noOptions">
      <slot name="noOptions">
        <div>{{ $t('ei-vaihtoehtoja') }}</div>
      </slot>
    </template>
    <template slot="selection" slot-scope="{ values, search, isOpen }">
      <slot name="selection" :values="values" :search="search" :isOpen="isOpen"></slot>
    </template>
    <template slot="afterList">
      <slot name="afterList"></slot>
    </template>
  </multiselect>
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
export default class EpMultiSelect extends Mixins(EpValidation) {
  @Prop({
    required: true,
    // type: Array
  })
  private value!: any[] | any;

  @Prop({
    default: false,
  })
  private multiple!: boolean;

  @Prop()
  private trackBy!: string;

  @Prop()
  private label!: string;

  @Prop({ required: false })
  private customLabel!: Function;

  @Prop({ required: true })
  private options!: any[];

  @Prop({ default: '' })
  private help!: string;

  @Prop({ default: '' })
  private placeholder!: string;

  @Prop({ default: '' })
  private tagPlaceholder!: string;

  @Prop({ default: null })
  private searchIdentity!: null | ((v: any) => string | null | undefined);

  @Prop({ required: false })
  private groupValues!: string;

  @Prop({ required: false })
  private groupLabel!: string;

  @Prop({ default: false })
  private groupSelect!: boolean;

  @Prop({ default: true })
  private searchable!: boolean;

  @Prop({ default: false })
  private loading!: boolean;

  @Prop({ default: true })
  private internalSearch!: boolean;

  @Prop({ default: true })
  private closeOnSelect!: boolean;

  @Prop({ default: false })
  private taggable!: boolean;

  @Prop({ default: true })
  private clearOnSelect!: boolean;

  @Prop({ required: false })
  private maxHeight!: number;

  @Prop({ default: false, type: Boolean })
  private disabled!: boolean;

  @Prop({ default: true, type: Boolean })
  private allowEmpty!: boolean;

  @Prop({ default: '' })
  private openDirection!: string;

  private search = '';

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

  set model(value) {
    this.$emit('input', value);
  }

  get hasValue() {
    return !_.isEmpty(this.value);
  }

  get track() {
    return this.trackBy;
  }

  optionChecked(option) {
    return option === this.value || !_.isEmpty(_.filter(this.value, x => x === option));
  }

  getOptionLabel(option) {
    if (_.isEmpty(option)) return '';
    if (!_.isEmpty(this.label) && !_.isEmpty(_.get(option, this.label))) return _.get(option, this.label);
    return option;
  }

  @Debounced(300)
  async onSearchChange(ev) {
    if (this.searchIdentity) {
      this.search = ev;
    }
    else {
      this.$emit('search', ev);
    }
  }

  get inputClass() {
    return {
      'is-invalid': this.isInvalid,
      'is-valid': this.isValid,
    };
  }

  remove(option) {
    this.$emit('remove', option);
  }

  sulje() {
    (this.$refs.multiselect as any)?.deactivate();
  }

  addTag(tag) {
    this.$emit('tag', tag);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

::v-deep .multiselect__tags {
  border: 2px solid #E0E0E1;
  border-radius: 10px;
  background-color: $white;
  padding-left:10px;
}

::v-deep .multiselect__tag {
  background-color: $white;
  color: $black;
  margin: 0px;
}

::v-deep .multiselect__placeholder {
  margin-bottom: 0px;
  padding-top: 0px;
}

::v-deep .multiselect--active {
  .multiselect__tags {
    border-top: 2px solid #E0E0E1;
  }
}

::v-deep .multiselect--above {
  .multiselect__content-wrapper {
    border: 2px solid #E0E0E1;
    border-radius: 10px 10px 0 0;
  }
}
::v-deep .multiselect--above.multiselect--active {
  .multiselect__tags {
    border-top: 2px solid #E0E0E1;
  }
}

::v-deep .multiselect__content-wrapper {
  border: 2px solid #E0E0E1;
  border-radius: 0 0 10px 10px;
  width: fit-content;
  min-width: 100%;
  margin-top: -2px;

  .multiselect__option--highlight::after {
    background-color: $blue-lighten-5;
  }
}

::v-deep .is-invalid .multiselect__content-wrapper {
  border-color: #dc3545;
}

::v-deep .is-valid .multiselect__content-wrapper {
  border-color: $valid;
}

::v-deep .multiselect__tags {
  border-bottom: 2px solid #E0E0E1;
}

::v-deep .is-invalid .multiselect__tags {
  border-color: #dc3545;
}

::v-deep .is-valid .multiselect__tags {
  border-color: $valid;
}

// Piilotettu Bootstrapissa oletuksena
::v-deep .invalid-feedback,
::v-deep .valid-feedback {
  display: block;
}

::v-deep .multiselect__option--disabled {
  background: none !important;
  color: $disabled !important;
}

::v-deep .multiselect__option--selected {
  font-weight: 400;
}

::v-deep .multiselect__input {
  padding-left: 0px;
  font-size: 14px;
}

::v-deep .multiselect__option--highlight {
    background-color: #bbb;
    color: #fff;
  }

::v-deep .multiselect__tags {
  .multiselect__tag {
    background-color: $gray-lighten-6;
    border-radius: 25px;
    margin-right: 10px;

    .multiselect__tag-icon {
      margin-right: 5px;
    }
  }

  .multiselect__input {
    // margin-top: 15px;
  }

  .remove-all {
    .material-icons {
      font-size: 18px;
    }
  }
}

::v-deep .multiselect__tag-icon:focus, ::v-deep .multiselect__tag-icon:hover {
  background: $gray;
}

</style>
