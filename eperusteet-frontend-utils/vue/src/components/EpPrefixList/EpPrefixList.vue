<template>
<div v-if="isEditable">
  <div class="alue" v-for="(alue, alueIdx) in internal" :key="alueIdx">
    <div class="alue-editing">
      <div class="header">
        <div class="row">
          <div class="col-sm-6">
            <ep-input v-model="alue.nimi" :help="arvot + '-nimi'" :placeholder="$t(arvot + '-nimi')" :is-editing="true" />
          </div>
          <div class="col-sm-6">
            <div class="actions">
              <ep-button variant="danger" icon="close" @click="poistaIndeksi(internal, alueIdx)">{{ $t('poista-alue-' + arvot) }}</ep-button>
            </div>
          </div>
        </div>
      </div>
      <div class="kohde">
        <ep-input v-model="alue[kohde]" :help="kohde" :is-editing="true" />
      </div>
      <div class="arvot">
        <draggable class="arvot-group" v-bind="options" :list="alue[arvot]">
          <div class="arvo arvot-group-item" v-for="(item, idx) in alue[arvot]" :key="idx">
            <div class="text">
              <ep-input v-model="item[arvo]" :is-editing="true" />
            </div>
            <div class="actions">
              <ep-button variant="danger" icon="close" @click="poistaIndeksi(alue[arvot], idx)">{{ $t('poista') }}</ep-button>
            </div>
          </div>
        </draggable>
        <ep-button icon="add" @click="lisaaArvo(alue)">{{ $t('lisaa-arvo-' + arvo) }}</ep-button>
      </div>
    </div>
  </div>
  <ep-button v-if="hasMultiple" icon="add" @click="lisaaAlue()">{{ $t('lisaa-alue-' + arvot) }}</ep-button>
</div>
<div v-else>
  <div class="alue" v-for="(alue, alueIdx) in internal" :key="alueIdx">
    <div class="header">
      <ep-input v-model="alue.nimi" :is-editing="isEditable" />
    </div>
    <div class="kohde">
      <ep-input v-model="alue[kohde]" :is-editing="isEditable" />
    </div>
    <ul class="arvot">
      <li class="arvo" v-for="(item, idx) in alue[arvot]" :key="idx">
        <ep-input :value="arvo ? item[arvo] : item" :is-editing="false" />
      </li>
    </ul>
  </div>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import draggable from 'vuedraggable';

import { Kielet } from '@shared/stores/kieli';

import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpInput from '@shared/components/forms/EpInput.vue';

@Component({
  components: {
    draggable,
    EpButton,
    EpInput,
  },
})
export default class EpPrefixList extends Vue {
  @Prop({ default: false })
  private isEditable!: boolean;

  @Prop({ required: true })
  private value!: any;

  @Prop({ default: 'kohde' })
  private kohde!: string;

  @Prop({ default: 'arvot' })
  private arvot!: string;

  @Prop({ default: '' })
  private arvo!: string;

  get hasMultiple() {
    return _.isArray(this.sanitized);
  }

  get sanitized() {
    if (_.isArray(this.value)) {
      return this.value;
    }
    else {
      return [this.value];
    }
  }

  get kieli() {
    return Kielet.getSisaltoKieli.value;
  }

  get internal() {
    return _.map(this.sanitized, el => {
      const res = _.cloneDeep(el);

      // Piilotetaan kohteet, joita ei ole lokalisoitu jos kyseessä lokalisoitu teksti
      const kohde = res[this.kohde];
      if (kohde) {
        if (_.isObject(kohde) && !kohde[this.kieli]) {
          res[this.kohde] = undefined;
        }
      }

      // Piilotetaan arvot, joita ei ole lokalisoitu jos kyseessä lokalisoitu teksti
      const arvot = res[this.arvot];
      if (arvot && !_.isEmpty(arvot)) {
        const arvotFiltered: any[] = [];
        _.each(arvot, arvo => {
          if (_.isObject(arvo)) {
            if (arvo[this.kieli]) {
              arvotFiltered.push(arvo);
            }
          }
          else {
            arvotFiltered.push(arvo);
          }
        });
        res[this.arvot] = arvotFiltered;
      }

      return res;
    });
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

  private poistaIndeksi(arr: any[], alueIdx: number) {
    arr.splice(alueIdx, 1);
  }

  private lisaaAlue() {
    this.internal.push({
      nimi: {},
      [this.kohde]: {},
      [this.arvot]: [],
    });
  }

  private lisaaArvo(alue: any) {
    alue[this.arvot].push(this.arvot
      ? { [this.arvo]: {} }
      : {});
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
