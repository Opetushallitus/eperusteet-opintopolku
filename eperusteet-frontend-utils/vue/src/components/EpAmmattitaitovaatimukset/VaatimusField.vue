<template>
  <div>
    <ep-koodisto-select :store="koodisto" v-model="value.koodi" v-if="value">
      <template #default="{ open }">
        <div class="d-flex flex-column">
          <div>
            <ep-error-wrapper :validation="validation">
              <b-input-group>
                <div class="handle text-muted">
                  <EpMaterialIcon>drag_indicator</EpMaterialIcon>
                </div>
                <b-form-input
                  class="vaatimus"
                  :value="vaatimus"
                  @input="onInput"
                  @resize="onResize"
                  @focus="focused = true"
                  @blur="onBlur"
                  ref="input"
                  v-if="!value.koodi" />
                <b-form-input
                  class="vaatimus"
                  :value="($kaanna(value.koodi.nimi) || vaatimus) + ' (' + koodiArvo + ')'"
                  disabled
                  v-if="value.koodi"></b-form-input>
                <b-input-group-append>
                  <b-button @click="open" variant="primary">
                    {{ $t('hae-koodistosta') }}
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </ep-error-wrapper>
          </div>
          <div class="datalist-wrapper" v-if="isDatalistVisible">
            <div class="datalist-container" ref="datalistContainer">
              <div v-if="isLoading" class="m-2">
                <ep-spinner />
              </div>
              <div class="datalist" v-else>
                <div class="item"
                     v-for="(item, idx) in koodit"
                     ref="datalist"
                     :key="'autocomplete-' + idx">
                  <div class="d-flex align-items-center">
                    <div role="button" @click="valitse(item)">
                      <span>{{ item.completion.left }}</span>
                      <span class="font-weight-bold">{{ item.completion.hit }}</span>
                      <span>{{ item.completion.right }}</span>
                    </div>
                    <div>
                      <Kayttolistaus :koodi="item" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </ep-koodisto-select>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpButton from '../EpButton/EpButton.vue';
import EpInput from '../forms/EpInput.vue';
import EpErrorWrapper from '../forms/EpErrorWrapper.vue';
import EpExternalLink from '../EpExternalLink/EpExternalLink.vue';
import EpSpinner from '../EpSpinner/EpSpinner.vue';
import EpKoodistoSelect from '../EpKoodistoSelect/EpKoodistoSelect.vue';
import { KoodistoSelectStore } from '@shared/components/EpKoodistoSelect/KoodistoSelectStore';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { metadataToLocalized } from '../../utils/perusteet';
import { delay } from '../../utils/delay';
import _ from 'lodash';
import Kayttolistaus from './Kayttolistaus.vue';

@Component({
  components: {
    EpButton,
    EpErrorWrapper,
    EpExternalLink,
    EpInput,
    EpKoodistoSelect,
    EpSpinner,
    Kayttolistaus,
    EpMaterialIcon,
  },
})
export default class VaatimusField extends Vue {
  @Prop({ required: true })
  private value!: any;

  @Prop({ required: true })
  private koodisto!: KoodistoSelectStore;

  @Prop({ default: null })
  private validation!: any;

  private focused = false;
  private hasChanged = false;
  private isLoading = false;

  get vaatimus() {
    return this.value?.vaatimus ? this.value.vaatimus[this.$slang.value] : '';
  }

  get isDatalistVisible() {
    return this.focused
      && this.hasChanged
      && (this.isLoading || this.koodit.length > 0);
  }

  get koodit() {
    const res = _.map(this.koodisto?.data.value?.data || [], koodi => {
      const localized = metadataToLocalized(koodi.metadata!, 'nimi');
      const nimi = localized[this.$slang.value] || '';
      const idx = nimi.indexOf(this.vaatimus);
      return {
        ...koodi,
        nimi: localized,
        completion: {
          left: nimi.substring(0, idx),
          hit: this.vaatimus,
          right: nimi.substring(idx + this.vaatimus.length),
        },
        uri: koodi.koodiUri,
      };
    });
    return res;
  }

  async fetchKoodisto(query: string) {
    this.hasChanged = true;
    try {
      this.isLoading = true;
      await this.koodisto.query(query || '');
    }
    catch (err) {
      console.error(err);
    }
    finally {
      this.isLoading = false;
    }
  }

  async onInput(ev: string) {
    this.$emit('input', {
      ...this.value,
      vaatimus: {
        ...this.value.vaatimus,
        [this.$slang.value]: ev,
      },
    });
    await this.fetchKoodisto(ev);
  }

  mounted() {
  }

  onResize() {
  }

  onBlur() {
    setTimeout(() => {
      this.focused = false;
    }, 300);
  }

  async valitse(koodi) {
    await delay(100);
    this.focused = false;
    this.$emit('input', {
      koodi: {
        uri: koodi.koodiUri,
        arvo: koodi.koodiArvo,
        nimi: koodi.nimi,
        versio: koodi.versio,
        koodisto: koodi.koodisto.koodistoUri,
      },
    });
  }

  private readonly datalist = _.uniqueId('datalist_');

  get koodiArvo() {
    return _.size(this.value.koodi.uri?.split('_')) === 2 ? this.value.koodi.uri?.split('_')[1] : this.value.koodi.arvo;
  }
}
</script>

<style scoped lang="scss">

.vaatimus {
  padding-left: 2rem !important;
}

.handle {
  position: absolute;
  padding: 10px 0 0 0;
  left: 6px;
  z-index: 100;
}

.datalist-wrapper {
  width: 100%;
  position: relative;
  z-index: 1000;

  .datalist-container {
    margin:  -2px 0 0 2px;
    border-radius: 3px;
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);
    position: absolute;
    background: white;
    border: 1px solid #ddd;
    left: 0px;
    right: 0px;

    .datalist {
      .item {
        padding: 8px;
        cursor: pointer;

        &:hover {
          background: #eee;
        }
      }
    }
  }
}
</style>
