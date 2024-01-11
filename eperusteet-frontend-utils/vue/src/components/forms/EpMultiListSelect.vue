<template>
  <div v-if="isEditing">

    <div v-for="(innerModel, i) in innerModelValidations" :key="i" class="row mb-2">
      <div class="col-11">
        <multiselect
          :disabled="isLoading"
          class="groupselect"
          v-model="innerModels[i]"
          :options="items"
          :multiple="false"
          track-by="text"
          label="text"
          select-label=""
          selected-label=""
          deselect-label=""
          :placeholder="''"
          :class="{'is-invalid': !innerModel.valid }"
          @input="handleInput($event, i)" >

          <template slot="option" slot-scope="{ option }">
            <div :class="{'child': option.child, 'unselectable': option.unselectable}">
              <slot name="option" :option="option">{{option.text}}</slot>
            </div>
          </template>

          <template slot="singleLabel" slot-scope="{ option }">
            <slot name="singleLabel" :option="option" v-if="option.value">{{option.text}}</slot>
            <div class="valitse" v-else>{{$t('valitse')}}</div>
          </template>

          <template slot="noResult">
            <div>{{ $t('ei-hakutuloksia') }}</div>
          </template>
          <template slot="noOptions">
            <div>{{ $t('ei-vaihtoehtoja') }}</div>
          </template>

        </multiselect>

      </div>
      <div class="col-1">
        <ep-button v-if="!required || (i > 0 && !isLoading)"
                   buttonClass="p-0 pt-2 roskalaatikko"
                   variant="link"
                   icon="delete"
                   @click="poistaValinta(i)"/>
      </div>
    </div>

    <ep-spinner v-if="isLoading"/>
    <ep-button buttonClass="pl-0 lisaa-valinta" variant="outline-primary" icon="add" @click="lisaaValinta" v-else-if="multiple" >
      <slot name="lisaaTeksti">{{ $t(lisaaTeksti) }}</slot>
    </ep-button>

    <div class="valid-feedback" v-if="!validationError && validMessage">{{ $t(validMessage) }}</div>
    <div class="invalid-feedback" v-else-if="validationError && invalidMessage ">{{ $t(invalidMessage) }}</div>
    <div class="invalid-feedback" v-else-if="validationError && !invalidMessage">{{ $t('validation-error-' + validationError, validation.$params[validationError]) }}</div>
    <small class="form-text text-muted" v-if="help && isEditing">{{ $t(help) }}</small>

  </div>
  <div v-else>
    <div v-for="(innerModel, i) in innerModelValidations" :key="i" class="row" :class="{'mb-2': i < innerModelValidations.length-1}">
      <div class="col-11">
        <slot name="singleLabel" :option="innerModels[i]" v-if="innerModels[i].value">{{innerModels[i].text}}</slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Mixins, Watch, Vue } from 'vue-property-decorator';
import EpSpinner from '../EpSpinner/EpSpinner.vue';
import EpValidation from '../../mixins/EpValidation';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import Multiselect from 'vue-multiselect';

export interface InnerModelValidations {
  innerModel: any;
  valid: boolean;
}

export interface MultiListSelectItem {
  value: any,
  text: string,
  unselectable: boolean,
  child: boolean,
}

@Component({
  components: {
    EpSpinner,
    EpButton,
    Multiselect,
  },
})
export default class EpMultiListSelect extends Mixins(EpValidation) {
  @Prop({ required: true })
  private items!: MultiListSelectItem[];

  @Prop({ required: true })
  private value!: any[] | any;

  @Prop({ required: false })
  private tyyppi!: string;

  @Prop({ default: null })
  public validation!: any;

  @Prop({ required: false, default: false })
  private required!: boolean;

  private innerModels: any[] = [];

  @Prop({ default: false })
  public isLoading!: boolean;

  @Prop({ default: true })
  private multiple!: boolean;

  @Prop({ default: true, type: Boolean })
  private isEditing!: boolean;

  @Prop({ default: '', type: String })
  private help!: string;

  @Prop({ required: false, default: () => _.isEqual })
  private equality!: Function;

  private updateValue() {
    if (this.multiple) {
      this.$emit('input', [...this.innerModelsValues]);
    }
    else {
      this.$emit('input', this.innerModelsValues[0]);
    }
  }

  get innerModelValidations(): InnerModelValidations[] {
    return _.map(this.innerModels, (innerModel, index) => {
      let valid = true;
      if (this.validation && this.validation.$each && this.validation.$each.$iter[index]) {
        valid = !this.validation.$each.$iter[index].$invalid;
      }

      return {
        innerModel,
        valid,
      } as InnerModelValidations;
    });
  }

  @Watch('items', { immediate: true })
  itemsChange(items: any) {
    this.changeInnerModels(items, this.value);

    if (this.required && _.isEmpty(this.innerModels)) {
      this.innerModels = [
        {},
      ];
    }
  }

  private changeInnerModels(items, value) {
    let valueArray = _.isArray(value) ? value : [value];

    if (_.size(items) > 0) {
      this.innerModels = _.chain(valueArray)
        .map((singleValue) => _.head(_.filter(items, (item) => {
          return this.equality(item.value, singleValue);
        })))
        .filter(singleValue => _.isObject(singleValue))
        .value();
      this.updateValue();
    }
  }

  get lisaaTeksti() {
    if (this.tyyppi) {
      return 'lisaa-' + this.tyyppi;
    }

    return 'lisaa';
  }

  lisaaValinta() {
    this.innerModels = [
      ...(this.innerModels as any),
      {},
    ];
  }

  poistaValinta(index) {
    this.innerModels = _.filter(this.innerModels, (val, valIndex) => index !== valIndex);
    this.updateValue();
  }

  handleInput(selected, index) {
    if (_.isEmpty(selected) || selected.unselectable) {
      this.poistaValinta(index);
      this.lisaaValinta();
    }
    else {
      if (_.size(_.filter(this.innerModels, (innerModel) => innerModel === selected)) === 1) {
        this.updateValue();
      }
      else {
        Vue.set(this.innerModels, index, {});
      }
    }
  }

  get innerModelsValues() {
    return _.chain(this.innerModels)
      .filter(innerModel => (_.isArray(innerModel.value) && !_.isEmpty(innerModel.value)) || !_.isNil(innerModel.value))
      .map(innerModel => innerModel.value)
      .value();
  }
}
</script>

<style scoped lang="scss">
@import "@shared/styles/_variables.scss";

  .unselectable {
    cursor: default;
  }

  /deep/ .multiselect__tags {
    border: 2px solid #E0E0E1;
    border-radius: 10px;
    font-size: 1rem;
    background-color: $white;
  }

  /deep/ .multiselect__element {
    margin: 0px;
    padding: 0px;
    line-height: 1rem;
  }

  /deep/ .multiselect__option {
    padding: 0px;
    margin: 0px;
    background-color: $white;
    color: $black;
  }

  /deep/ .multiselect__option div {
    padding: 12px;
    margin: 0px;
  }

  /deep/ .multiselect__option div.child {
    padding-left: 35px;
  }

  /deep/ .multiselect__option--highlight div {
    background-color: $blue-lighten-1;
    color: $white;
  }

  /deep/ .multiselect__option .unselectable {
    background-color: $white;
    color: $gray-lighten-1;
  }

  /deep/ .is-invalid .multiselect__content-wrapper {
    border-color: #dc3545;
  }

  /deep/ .is-valid .multiselect__content-wrapper {
    border-color: $valid;
  }

  /deep/ .is-invalid .multiselect__tags {
    border-color: #dc3545;
  }

  /deep/ .is-valid .multiselect__tags {
    border-color: $valid;
  }

  // Piilotettu Bootstrapissa oletuksena
  /deep/ .invalid-feedback,
  /deep/ .valid-feedback {
    display: block;
  }

  .valitse {
    color: $gray-lighten-2;
  }

</style>
