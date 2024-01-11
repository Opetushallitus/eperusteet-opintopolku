<template>
  <div>
    <draggable
      v-bind="defaultDragOptions"
      tag="div"
      v-model="model">

      <b-row v-for="(sisalto, index) in model" :key="'edKehOsaaminen'+index" class="pb-2">
        <b-col cols="11">
          <ep-input v-model="sisalto[sisaltokieli]" :is-editing="isEditing" type="string" class="flex-grow-1">
            <div class="order-handle m-2" slot="left">
              <EpMaterialIcon>drag_indicator</EpMaterialIcon>
            </div>
          </ep-input>
        </b-col>
        <b-col cols="1">
          <div class="clickable mt-2" @click="poistaKuvaus(sisalto)">
            <EpMaterialIcon class="default-icon">delete</EpMaterialIcon>
          </div>
        </b-col>
      </b-row>
    </draggable>

    <ep-button @click="lisaaKuvaus()" variant="outline" icon="add" class="mt-1">
      {{ $t('lisaa-kuvaus') }}
    </ep-button>

  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpInput from '@shared/components/forms/EpInput.vue';
import { Kielet } from '@shared/stores/kieli';
import draggable from 'vuedraggable';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpInput,
    draggable,
    EpButton,
    EpMaterialIcon,
  },
})
export default class EpOsaAlueSisalto extends Vue {
  @Prop({ required: true })
  value!: any;

  @Prop({ required: false, default: false })
  isEditing!: boolean;

  get model() {
    return this.value;
  }

  set model(val) {
    this.$emit('input', val);
  }

  get defaultDragOptions() {
    return {
      animation: 300,
      emptyInsertThreshold: 10,
      handle: '.order-handle',
      disabled: !this.isEditing,
      ghostClass: 'dragged',
      group: {
        name: 'kuvaukset',
      },
    };
  }

  get sisaltokieli() {
    return Kielet.getSisaltoKieli.value;
  }

  poistaKuvaus(sisalto) {
    this.$emit('input', _.filter(this.value, row => row !== sisalto));
  }

  lisaaKuvaus() {
    this.$emit('input', [...this.value, {}]);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
