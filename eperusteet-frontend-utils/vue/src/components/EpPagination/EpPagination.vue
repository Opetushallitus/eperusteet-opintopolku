<template>
<div v-if="totalRows > 0">
  <div :aria-label="$t('sivutus')" class="d-flex align-items-center justify-content-center">
    <div class="link-container">
      <b-button variant="link"
                :aria-label="$t('edellinen')"
                @click="setValue(value - 1)"
                class="link"
                :class="{ 'muted': leftDisabled }"
                :disabled="leftDisabled">
        <EpMaterialIcon>chevron_left</EpMaterialIcon>
      </b-button>
    </div>
    <div v-for="row in pages" :key="row" class="link-container">
      <div v-if="row !== null">
        <b-button :class="{ 'active-link': row === value }"
                  :aria-label="$t('sivu') + ' ' + row"
                  variant="link"
                  @click="setValue(row)"
                  class="link">{{ row }}</b-button>
      </div>
      <div v-else>
        ...
      </div>
    </div>
    <div class="link-container">
      <b-button class="link"
                :aria-label="$t('seuraava')"
                variant="link"
                @click="setValue(value + 1)"
                :class="{ 'muted': rightDisabled }"
                :disabled="rightDisabled">
        <EpMaterialIcon>chevron_right</EpMaterialIcon>
      </b-button>
    </div>
  </div>
</div>
<div v-else>
  <slot name="empty">
  </slot>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpButton from '../EpButton/EpButton.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import _ from 'lodash';

@Component({
  components: {
    EpButton,
    EpMaterialIcon,
  },
})
export default class EpPagination extends Vue {
  @Prop({ required: true })
  private value!: number;

  @Prop({ required: true })
  private perPage!: number;

  @Prop({ required: true })
  private totalRows!: number;

  get leftDisabled() {
    return this.value < 2;
  }

  get rightDisabled() {
    return this.value > this.count - 1;
  }

  get leftEllipsis() {
    return this.value - 1 > 1;
  }

  get rightEllipsis() {
    return this.value < this.count - 1;
  }

  get count() {
    return Math.ceil(this.totalRows / this.perPage);
  }

  get pages() {
    if (this.count < 6) {
      return _.range(1, this.count + 1);
    }
    else {
      const result: (number | null)[] = [];
      if (!this.leftDisabled) {
        result.push(1);
      }
      if (this.leftEllipsis) {
        if (this.value > 3) {
          result.push(null);
        }
        result.push(this.value - 1);
      }
      result.push(this.value);
      if (this.rightEllipsis) {
        result.push(this.value + 1);
        if (this.value < this.count - 2) {
          result.push(null);
        }
      }
      if (this.value !== this.count) {
        result.push(this.count);
      }
      return result;
    }
  }

  async setValue(value: number) {
    if (value > 0 && value <= this.count) {
      this.$emit('input', value);
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";

.link-container {
  margin: 0 0.05rem 0 0.05rem;

  .active-link {
    background: #3367e3;
    border-radius: 100%;
    color: #fff !important;
    font-weight: bold;
    height: 2em;
    padding-top: 0.2rem;
    width: 2em;

    &:active {
      background: none;
    }

  }

  .link {
    color: #4f4f4f;
  }

  .muted {
    color: #ccc;
  }

}

</style>
