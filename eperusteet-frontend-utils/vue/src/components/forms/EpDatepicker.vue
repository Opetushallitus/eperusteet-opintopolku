<template>
<div class="ep-date-picker"
     v-if="isEditing">

    <b-form-datepicker
      :value="modelValue"
      @input="onInput"
      :locale="locale"
      start-weekday="1"
      :placeholder="$t('valitse-pvm')"
      :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
      :state="state"
      reset-button
      close-button
      @blur="onBlur"
      :label-reset-button="$t('tyhjenna')"
      :label-close-button="$t('sulje')"
      :label-no-date-selected="$t('valitse-pvm')"
      :label-help="$t('kalenteri-navigointi-ohje')"
      :value-as-date="true"
      :hide-header="true"
      :no-flip="true"
      />

    <div class="valid-feedback"
         v-if="!validationError && validMessage">{{ $t(validMessage) }}</div>
    <div v-else-if="validationError && isDirty" :class="{ 'is-warning': isWarning }">
      <div class="invalid-feedback" v-if="invalidMessage">{{ $t(invalidMessage) }}</div>
      <div class="invalid-feedback" v-else>{{ message }}</div>
    </div>
    <small class="form-text text-muted"
           v-if="help && isEditing">{{ $t(help) }}</small>
</div>
<div v-else>{{ locdate }}</div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import _ from 'lodash';
import DatePicker from 'vue2-datepicker';
import { Kielet } from '../../stores/kieli';
import EpFormContent from './EpFormContent.vue';
import EpValidation from '../../mixins/EpValidation';

@Component({
  components: {
    DatePicker,
    EpFormContent,
  },
})
export default class EpDatepicker extends Mixins(EpValidation) {
  @Prop({ required: true })
  private value!: any;

  @Prop({
    default: 'sd',
    validator(value) {
      return _.includes(['date', 'datetime', 'sd'], value);
    },
  })
  private type!: string;

  @Prop({ default: false, type: Boolean })
  private isEditing!: boolean;

  @Prop({ default: '', type: String })
  private help!: string;

  @Prop({ default: true, required: false })
  private showValidValidation!: boolean;

  get modelValue() {
    if (_.isNumber(this.value)) {
      return new Date(this.value);
    }

    return this.value;
  }

  get state() {
    if (!this.showValidValidation || this.isValid) {
      return null;
    }

    return this.isValid;
  }

  get locdate() {
    if (!this.value) {
      return this.$t('ei-asetettu');
    }
    else if (this.type === 'datetime') {
      return (this as any).$ldt(this.value);
    }
    else if (this.type === 'sd') {
      return (this as any).$sd(this.value);
    }
    else {
      return (this as any).$ld(this.value);
    }
  }

  get lang() {
    return Kielet.getAikakaannokset;
  }

  get locale() {
    return Kielet.getUiKieli.value;
  }

  private onInput(event: any) {
    this.$emit('input', event);
    if (this.validation) {
      (this.validation as any).$touch();
    }
  }
}
</script>

<style scoped lang="scss">

/deep/ .ep-datepicker-validation {
  padding-right: calc(3em + .75rem) !important;
}

/deep/ .ep-datepicker-validation ~ .mx-input-append {
  right: 30px;
}

// Piilotettu Bootstrapissa oletuksena
/deep/ .invalid-feedback,
/deep/ .valid-feedback {
  display: block;
}

</style>
