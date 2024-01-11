<template>
  <div>
    <template v-if="isEditing">
      <draggable
        v-bind="defaultDragOptions"
        tag="div"
        v-model="innerModel">
        <b-row v-for="(model, i) in innerModel" :key="group+i" class="pb-2">
          <b-col cols="11">
            <slot name="input" :model="model" :index="i">
              <EpInput
                v-model="innerModel[i]"
                :is-editing="isEditing">
                <div class="order-handle m-2" slot="left">
                  <EpMaterialIcon>drag_indicator</EpMaterialIcon>
                </div>
              </EpInput>
            </slot>
          </b-col>
          <b-col cols="1" v-if="isEditing" class="text-center">
            <div class="default-icon clickable mt-2" @click="poistaTeksti(i)">
              <EpMaterialIcon icon-shape="outlined">delete</EpMaterialIcon>
            </div>
          </b-col>
        </b-row>
      </draggable>
      <EpButton
        variant="outline"
        icon="add"
        @click="lisaaTeksti()"
        v-if="isEditing">
        <slot name="default">{{ $t('lisaa-teksti') }}</slot>
      </EpButton>
    </template>
    <template v-else-if="innerModel.length > 0">
      <ul>
        <li v-for="(model, i) in innerModel" :key="group+i">
          <slot name="li" :model="model">
            {{$kaanna(model)}}
          </slot>
        </li>
      </ul>
    </template>
  </div>

</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpButton from '../EpButton/EpButton.vue';
import _ from 'lodash';
import EpInput from '@shared/components/forms/EpInput.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import draggable from 'vuedraggable';

@Component({
  components: {
    EpButton,
    EpInput,
    EpMaterialIcon,
    draggable,
  },
})
export default class EpSortableTextList extends Vue {
  @Prop({ required: true })
  private value!: any[];

  @Prop({ default: false })
  private isEditing!: boolean;

  @Prop({ default: true })
  private sortable!: boolean;

  @Prop({ required: false, default: 'sortableTextList' })
  private group!: string;

  get innerModel() {
    return this.value;
  }

  set innerModel(innerModel) {
    this.$emit('input', innerModel);
  }

  lisaaTeksti() {
    this.innerModel = [
      ...this.innerModel,
      {},
    ];
  }

  poistaTeksti(poistettavaIndex) {
    this.innerModel = _.filter(this.innerModel, (teksti, index) => index !== poistettavaIndex);
  }

  get defaultDragOptions() {
    return {
      animation: 300,
      emptyInsertThreshold: 10,
      handle: '.order-handle',
      disabled: !this.isEditing && this.sortable,
      ghostClass: 'dragged',
      group: {
        name: this.group,
      },
    };
  }
}
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

</style>
