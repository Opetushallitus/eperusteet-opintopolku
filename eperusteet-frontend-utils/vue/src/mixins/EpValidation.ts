import _ from 'lodash';
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { validationMixin } from 'vuelidate';
import { createLogger } from '../utils/logger';

const logger = createLogger('EpValidation');

@Component({
  validations() {
    const vc = (this as any).validationConfig;
    if (vc === undefined) {
      logger.warn('Validation configuration missing:', this);
      return {};
    }
    return vc;
  },
} as any)
export default class EpValidation extends Mixins(validationMixin) {
  @Prop({ type: String })
  protected validMessage!: string | undefined;

  @Prop({ type: String })
  protected invalidMessage!: string | undefined;

  @Prop({ default: null })
  protected validation!: any;

  @Prop({ default: false })
  protected warning!: boolean;

  protected onFocus() {
    // TODO: Ehkä käytetään
    // if (this.validation) {
    //   this.validation.$reset();
    // }
  }

  protected onBlur() {
    if (this.validation) {
      this.validation.$touch();
    }
  }

  protected get isWarning() {
    if (this.validationError && this.validation.$params) {
      return this.validation.$params[this.validationError]?.type === 'warning';
    }
    else {
      return false;
    }
  }

  protected get isDirty() {
    // TODO: Ehkä?
    return this.validation?.$dirty || false;
    // return true;
  }

  protected get isInvalid() {
    return this.validation && this.isDirty && this.validation.$invalid;
  }

  protected get isValid() {
    return this.validation && !this.validation.$invalid;
  }

  protected get validators() {
    return _(this.validation)
      .keys()
      .reject((key) => _.startsWith(key, '$'))
      .reject((key) => this.validation[key])
      .value();
  }

  protected get errorValidators() {
    if (this.validation) {
      return _.reject(this.validators, x => this.validation.$params[x]?.type === 'warning');
    }
    return [];
  }

  protected get message() {
    if (this.validationError && !this.invalidMessage) {
      const prefix = this.isWarning
        ? 'validation-warning-'
        : 'validation-error-';
      return this.$t(prefix + (this.validationError || ''), this.validation.$params[this.validationError]) || '';
    }
    return '';
  }

  protected get validationError() {
    // Validointi näyteään vain muokkaustilassa
    if ((this as any).isEditing === undefined || (this as any).isEditing) {
      return _.first(this.errorValidators) || _.first(this.validators) || null;
    }
    else {
      return null;
    }
  }
}
