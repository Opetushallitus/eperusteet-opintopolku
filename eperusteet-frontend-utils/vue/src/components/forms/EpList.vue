<template>
<div v-if="isEditable">
  <div class="arvo" v-for="(value, idx) in internal" :key="idx">
    <ep-input v-model="internal[idx][kentta]" :is-editing="true" class="mb-2">
      <div slot="left" style="padding: 8px">
        <i>&#8226;</i>
      </div>
      <div slot="right">
        <b-button variant="link" @click="poista(idx)">
          <EpMaterialIcon>close</EpMaterialIcon>
        </b-button>
      </div>
    </ep-input>
  </div>
  <div style="margin-top: 20px;">
    <ep-button
      variant="outline-primary"
      icon="add"
      @click="lisaaRivi()">
      {{ $t(lisays) }}
    </ep-button>
  </div>
</div>
<div v-else>
  <ul class="arvot">
    <li class="arvo" v-for="(value, idx) in internal" :key="idx">
      <ep-input :value="internal[idx][kentta]" :is-editing="false" />
    </li>
  </ul>
</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpButton from '../EpButton/EpButton.vue';
import EpInput from './EpInput.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import _ from 'lodash';

@Component({
  components: {
    EpButton,
    EpInput,
    EpMaterialIcon,
  },
})
export default class EpList extends Vue {
  @Prop({
    type: Boolean,
    default: false,
  })
  private isEditable!: boolean;

  @Prop({ required: true })
  private value!: any;

  @Prop({ default: 'lisaa-sisalto', type: String })
  private lisays!: string;

  @Prop({ required: true, type: String })
  private kentta!: string;

  get sanitized() {
    if (_.isArray(this.value)) {
      return this.value;
    }
    else {
      return [this.value];
    }
  }

  get internal() {
    return this.sanitized;
  }

  set internal(value: any) {
    this.$emit('input', value);
  }

  get options() {
    return {
      // handle: '.handle',
      animation: 300,
      disabled: false,
    };
  }

  lisaaRivi() {
    this.internal.push({ });
  }

  poista(idx) {
    this.internal = [
      ...this.internal.slice(0, idx),
      ...this.internal.slice(idx + 1),
    ];
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/_variables.scss';

.alue-editing {
  background: $color-light-background;
  padding: 20px;
}

.alue {
  margin-bottom: 40px;

  .header {
    font-weight: 600 !important;

    .actions {
      float: right;
    }
  }

  .kohde {
    font-style: italic;
  }

  ul.arvot {
    li.arvo {
      margin: 0;
    }
  }

  div.arvot {
    margin: 20px 0 0 40px;

    div.arvo {
      margin-bottom: 5px;
      display: flex;

      .text {
        width: calc(100% - 120px);
      }

      .actions {
        width: 119px;

        button {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }

  }
}
</style>
