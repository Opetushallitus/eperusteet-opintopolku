<template>
<div>
  <b-form-checkbox :disabled="!isEditing"
                   v-model="innerValue"
                   :inline="inline"
                   :switch="asSwitch"
                   :class="{ 'custom-checkbox-lg': !asSwitch && lgSize, 'custom-switch-lg': asSwitch && lgSize }">
    <slot/>
  </b-form-checkbox>
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpFormContent from './EpFormContent.vue';

@Component({
  components: {
    EpFormContent,
  },
})
export default class EpToggle extends Vue {
  @Prop({ default: true, type: Boolean })
  private isEditing!: boolean;

  @Prop({ required: false, type: Boolean, default: false })
  private value!: boolean;

  @Prop({ default: true, type: Boolean })
  private inline!: boolean;

  @Prop({ default: true })
  private isSWitch!: boolean;

  @Prop({ default: false, type: Boolean })
  private checkbox!: Boolean;

  @Prop({ required: false })
  private size!: string | undefined;

  get lgSize() {
    return this.size ? this.size === 'lg' : false;
  }

  get innerValue() {
    return this.value;
  }

  set innerValue(value) {
    this.$emit('input', value);
  }

  get asSwitch() {
    return !this.checkbox && this.isSWitch;
  }
}
</script>

<style scoped lang="scss">

@import "@shared/styles/bootstrap.scss";ß

/deep/ .custom-checkbox label.custom-control-label::before {
  border-radius: 0.2rem;
  border: 2px solid #E0E0E1;
}

/deep/ .custom-checkbox .custom-control-input:enabled:checked ~ .custom-control-label::before {
  border-color: $primary;
}

/deep/ .custom-checkbox .custom-control-input:disabled:checked ~ .custom-control-label::before {
  border-width: 0;
}

/deep/ .custom-switch label.custom-control-label::before {
  border-radius: 0.625rem;
  border: 2px solid #E0E0E1;
}

// large checkbox
/deep/ .custom-checkbox-lg {
  padding-left: 2rem;
  .custom-control-input {
    left: 0;
    width: 1.5rem;
    height: 1.5rem;
  }
}

/deep/ .custom-checkbox-lg label.custom-control-label::before {
  border-radius: 0.3125rem;
  top: 0rem;
  left: -2rem;
  width: 1.5rem;
  height: 1.5rem;
}

/deep/ .custom-checkbox-lg label.custom-control-label::after {
  top: 0rem;
  left: -2rem;
  width: 1.5rem;
  height: 1.5rem;
}

/deep/ .custom-checkbox-lg .custom-control-input:checked ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='20' height='15' viewBox='0 0 20 15'%3e%3cpath fill='%23fff' d='M6.333 11.915L1.427 6.923 0 8.325l6.308 6.419L19.86 1.427 18.458 0z'/%3e%3c/svg%3e");
}

// Large switch
/deep/ .custom-switch-lg {
  padding-left: 3rem;
  .custom-control-input {
    left: 0;
    width: 2.625rem;
    height: 1.5rem;
  }
}

/deep/ .custom-switch-lg label.custom-control-label::before {
  border-radius: 1rem;
  top: 0rem;
  left: -3.125rem;
  width: 2.625rem;
  height: 1.5rem;
}

/deep/ .custom-switch-lg label.custom-control-label::after {
  border-radius: 1rem;
  top: 0.125rem;
  left: -3rem;
  width: 1.25rem;
  height: 1.25rem;
}

/deep/ .custom-switch .custom-control-input:checked ~ .custom-control-label::after {
  transform: translateX(1.125rem)
}

</style>
