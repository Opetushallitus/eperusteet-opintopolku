<template>
  <draggable
    v-bind="defaultDragOptions"
    tag="div"
    v-model="model">

    <EpCollapse
      v-for="(modelObject, index) in model"
      :key="'EpDraggableCollapse_' + index"
      :borderBottom="index < model.length -1"
      :collapsable="!isEditing"
      :usePadding="false">

      <template #header>
        <slot name="header" :data="modelObject"></slot>
      </template>
      <div class="d-flex">
        <div class="order-handle mr-3">
          <EpMaterialIcon v-if="isEditing">drag_indicator</EpMaterialIcon>
        </div>
        <div class="w-100">
          <slot :data="modelObject" :index="index"></slot>
        </div>
      </div>

    </EpCollapse>
  </draggable>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import draggable from 'vuedraggable';
import { DEFAULT_DRAGGABLE_PROPERTIES } from '@shared/utils/defaults';

@Component({
  components: {
    EpCollapse,
    EpMaterialIcon,
    draggable,
  },
})
export default class EpDraggableCollapse extends Vue {
  @Prop({ required: true })
  value!: any[];

  @Prop({ required: false, default: false })
  isEditing!: boolean;

  set model(val) {
    this.$emit('input', val);
  }

  get model() {
    return this.value;
  }

  get defaultDragOptions() {
    return {
      ...DEFAULT_DRAGGABLE_PROPERTIES,
      disabled: !this.isEditing,
      group: {
        name: 'EpDraggableCollapse',
      },
    };
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
