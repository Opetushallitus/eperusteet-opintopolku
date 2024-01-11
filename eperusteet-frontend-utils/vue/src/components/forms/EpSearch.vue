<template>
<div class="filter" role="search" :class="{'maxWidth': maxWidth}">
    <span class="form-control-feedback">
      <EpMaterialIcon class="icon">search</EpMaterialIcon>
    </span>
    <label class="sr-only" :for="id">{{ ariaPlaceholderText }}</label>
    <input :id="id"
           class="form-control"
           type="search"
           :placeholder="placeholderText"
           @input="onInput($event.target.value)"
           :value="val">
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Kielet } from '../../stores/kieli';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpMaterialIcon,
  },
})
export default class EpSearch extends Vue {
  @Prop({ type: String })
  private value!: string;

  @Prop({ type: String })
  private placeholder!: string;

  @Prop({ type: String })
  private srPlaceholder!: string;

  @Prop({ required: false, default: false })
  private isLoading!: boolean;

  @Prop({ required: false, default: false, type: Boolean })
  private maxWidth!: boolean;

  get id() {
    return 'search-' + _.uniqueId();
  }

  get icon() {
    return this.isLoading ? 'spinner' : 'search';
  }

  get placeholderText() {
    return this.placeholder || this.$t('etsi');
  }

  get ariaPlaceholderText() {
    return this.srPlaceholder || this.$t('etsi-tietoja-sivulta-haku');
  }

  public onInput(input: any) {
    this.$emit('input', input);
  }

  get val() {
    if (_.isObject(this.value)) {
      return (this.value as any)[Kielet.getSisaltoKieli.value];
    }
    else {
      return this.value;
    }
  }
}
</script>

<style scoped lang="scss">
.icon {
  vertical-align: middle;
}

.filter {
  position: relative;

  &.maxWidth {
    max-width: 100%;
  }

  .form-control {
    padding-left: 2.375rem;
    border-radius: 10px;
    background: #F7F7F7;
    border-width: 0.1rem;
    border-color: #DDD;

    &::placeholder {
      color: #888;
    }
  }

  .form-control-feedback {
    position: absolute;
    z-index: 2;
    display: block;
    width: 2.375rem;
    height: 2.375rem;
    line-height: 2.375rem;
    text-align: center;
    pointer-events: none;
    color: #555;
  }
}

</style>
