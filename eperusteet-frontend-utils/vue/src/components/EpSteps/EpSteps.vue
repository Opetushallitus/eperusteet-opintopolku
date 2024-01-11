<template>
<div class="ep-steps">
  <div class="steps d-flex justify-content-center mr-5 ml-5 mb-5" v-if="steps.length > 1">
    <div role="button" v-for="(step, idx) in steps" :key="step.key" class="text-center step" @click="stepIdx = idx">
      <div class="connection" v-if="steps.length > 1" :class="{ left: idx === steps.length - 1, right: idx === 0 }"/>
      <div class="p-4">
        <div class="d-inline-block" :class="{ ball: true, active: idx <= stepIdx }">
          {{ idx + 1 }}
        </div>
        <div :class="{ name: true, active: idx === stepIdx }">
          {{ step.name }}
        </div>
      </div>
    </div>
  </div>

  <h2 class="heading">
    {{ currentStep.name }}
  </h2>
  <p class="description" v-if="currentStep.description" v-html="currentStep.description"></p>

  <div>
    <slot :name="currentStep.key" />
  </div>

  <div class="clearfix">
    <div class="float-right mt-5">
      <ep-button variant="link" @click="cancel" v-if="hasCancelEvent">{{ $t('peruuta')}}</ep-button>
      <ep-button variant="link" @click="previous" v-if="stepIdx > 0">{{ $t('edellinen') }}</ep-button>
      <ep-button @click="next" v-if="stepIdx < steps.length - 1" :disabled="!currentValid">{{ $t('seuraava') }}</ep-button>
      <ep-button @click="saveImpl" v-else :disabled="!currentValid" :showSpinner="saving">
        <slot name="luo">{{ $t('tallenna') }}</slot>
      </ep-button>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Watch, Component, Prop, Vue } from 'vue-property-decorator';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import _ from 'lodash';

export interface Step {
  key: string;
  name: string;
  description: string;
  isValid?: () => boolean;
  onNext?: () => void;
}

@Component({
  components: {
    EpButton,
  },
})
export default class EpSteps extends Vue {
  @Prop({ required: true })
  private steps!: Step[];

  @Prop({ default: 0 })
  private initialStep!: number;

  @Prop({ required: true })
  private onSave!: () => Promise<void>;

  private stepIdx = 0;
  private saving = false;

  async saveImpl() {
    const isValid = _.last(this.steps)?.isValid;
    if (isValid && !isValid()) {
      return;
    }
    this.saving = true;
    await this.onSave();
    this.saving = false;
  }

  @Watch('initialStep', { immediate: true })
  onInitialStepUpdate(value: number) {
    this.stepIdx = value;
  }

  @Watch('currentStep', { immediate: true })
  onStepChange(newVal) {
    this.$emit('stepChange', newVal);
  }

  get currentStep() {
    return this.steps[this.stepIdx];
  }

  previous() {
    --this.stepIdx;
  }

  get currentValid() {
    if (this.currentStep.isValid) {
      return this.currentStep.isValid();
    }

    return true;
  }

  next() {
    if (!this.currentStep.isValid || this.currentStep.isValid()) {
      if (this.currentStep.onNext) {
        this.currentStep.onNext();
      }

      ++this.stepIdx;
    }
    else {
    }
  }

  get hasCancelEvent() {
    return this.$listeners && this.$listeners.cancel;
  }

  cancel() {
    this.$emit('cancel');
  }
}
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";

.ep-steps {

  .steps {
    color: #767676;

    .step {
      user-select: none;
      cursor: pointer;

      .ball {
        padding: 1px 9px;
        margin-bottom: 10px;
        border-radius: 100%;
        position: relative;
        z-index: 10;
        border-color: $gray-lighten-3;
        border-style: solid;
        border-width: 2px;
        background-color: $white;
        color: $gray-lighten-2;

        &.active {
          background-color: $blue-lighten-5;
          border-color: $blue-lighten-5;
          color: $white;
          border-width: 2px;
        }
      }

      .active:not(.ball) {
        font-weight: 600;
        color: black;
      }

      .connection {
        border-top: 2px solid $gray-lighten-3;
        position: relative;
        width: 100%;
        top: 40px;
        z-index: 1;

        &.right {
          width: 50%;
          left: 50%;
        }

        &.left {
          width: 50%;
        }
      }

    }
  }

}

</style>
