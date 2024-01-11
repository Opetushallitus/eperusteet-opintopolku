<template>
  <div>
    <draggable
      v-bind="tavoitteetOptions"
      tag="div"
      v-model="tavoitteet">
      <b-row v-for="(tavoite, tavoiteIndex) in tavoitteet" :key="tavoite+tavoiteIndex" class="pb-2">
        <b-col cols="11">
          <slot :tavoite="tavoite" :tavoiteIndex="tavoiteIndex">
            <EpKoodistoSelect
              :store="tavoitteetlukutaidotKoodisto"
              v-model="tavoitteet[tavoiteIndex]"
              :is-editing="true"
              :naytaArvo="false">
              <template #default="{ open }">
                <b-input-group>
                  <EpInput
                    v-model="tavoite.nimi"
                    :is-editing="true"
                    :disabled="!tavoite.uri.startsWith('temporary')"
                    class="input-wrapper"
                    :validation="$v.tavoitteet.$each.$iter[tavoiteIndex].nimi">
                    <div class="order-handle m-2" slot="left">
                      <EpMaterialIcon>drag_indicator</EpMaterialIcon>
                    </div>
                  </EpInput>
                  <b-input-group-append>
                    <b-button @click="open" variant="primary">
                      {{ $t('hae-koodistosta') }}
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </template>
            </EpKoodistoSelect>
          </slot>
        </b-col>
        <b-col cols="1">
          <div class="default-icon clickable mt-2" @click="poistaTavoite(tavoite)">
            <EpMaterialIcon icon-shape="outlined" :color="'inherit'">delete</EpMaterialIcon>
          </div>
        </b-col>
      </b-row>
    </draggable>

    <div class="d-flex justify-content-between">
      <ep-button variant="outline" icon="add" @click="lisaaTavoite()">
        <slot name="lisaaBtnText">
          {{ $t('lisaa-tavoite') }}
        </slot>
      </ep-button>

      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import _ from 'lodash';
import { KoodistoSelectStore } from '../EpKoodistoSelect/KoodistoSelectStore';
import { Koodisto } from '@shared/api/eperusteet';
import draggable from 'vuedraggable';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpKoodistoSelect from '@shared/components/EpKoodistoSelect/EpKoodistoSelect.vue';
import EpInput from '@shared/components/forms/EpInput.vue';
import { koodistoKoodiValidator } from '@shared/validators/required';
import { Validations } from 'vuelidate-property-decorators';
import { generateTemporaryKoodiUri } from '@shared/utils/koodi';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpKoodistoSelect,
    EpButton,
    draggable,
    EpInput,
    EpMaterialIcon,
  },
})
export default class EpTavoitealueTavoitteet extends Vue {
  @Prop({ required: true })
  private value!: any[];

  get tavoitteet() {
    return this.value;
  }

  set tavoitteet(value) {
    this.$emit('input', value);
  }

  @Validations()
    validations = {
      tavoitteet: {
        $each: {
          ...koodistoKoodiValidator(),
        },
      },
    }

  private readonly tavoitteetlukutaidotKoodisto = new KoodistoSelectStore({
    koodisto: 'tavoitteetlukutaidot',
    async query(query: string, sivu = 0, koodisto: string) {
      const { data } = (await Koodisto.kaikkiSivutettuna(koodisto, query, {
        params: {
          sivu,
          sivukoko: 10,
        },
      }));
      return data as any;
    },
  });

  lisaaTavoite() {
    this.tavoitteet = [
      ...this.tavoitteet,
      {
        ...(!this.$scopedSlots['default'] && { uri: generateTemporaryKoodiUri('tavoitteetlukutaidot') }),
      },
    ];
  }

  poistaTavoite(tavoite) {
    this.tavoitteet = _.filter(this.tavoitteet, rivi => rivi !== tavoite);
  }

  get defaultDragOptions() {
    return {
      animation: 300,
      emptyInsertThreshold: 10,
      handle: '.order-handle',
      ghostClass: 'dragged',
    };
  }

  get tavoitteetOptions() {
    return {
      ...this.defaultDragOptions,
      group: {
        name: 'tavoitteet',
      },
    };
  }
}
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";

  ::v-deep .input-group-append {
    display: inline-block;
  }
</style>
