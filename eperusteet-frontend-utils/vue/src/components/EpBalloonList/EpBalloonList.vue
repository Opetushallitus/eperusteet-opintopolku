<template>
  <div>
    <draggable
      v-bind="defaultDragOptions"
      tag="div"
      v-model="inner">

      <div class="balloon-wrapper" v-for="(item, idx) in inner" :key="idx">
        <div class="balloon d-flex">
          <div class="order-handle mr-2" slot="left" v-if="draggable">
            <EpMaterialIcon>drag_indicator</EpMaterialIcon>
          </div>
          <slot v-bind="{ item }">
          </slot>
        </div>
      </div>

    </draggable>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import draggable from 'vuedraggable';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpMaterialIcon,
    draggable,
  },
})
export default class EpBalloonList extends Vue {
  @Prop({ required: true, type: Array })
  private value!: any[];

  @Prop({ required: false, default: false, type: Boolean })
  private isEditing!: boolean;

  @Prop({ required: false, default: false, type: Boolean })
  private sortable!: boolean;

  get inner() {
    return this.value;
  }

  set inner(value: any[]) {
    this.$emit('input', value);
  }

  get defaultDragOptions() {
    return {
      animation: 300,
      emptyInsertThreshold: 10,
      handle: '.order-handle',
      disabled: !this.draggable,
      ghostClass: 'dragged',
      group: {
        name: 'balloonsorts',
      },
    };
  }

  get draggable() {
    return this.isEditing && this.sortable;
  }
}
</script>

<style lang="scss" scoped>

.balloon-wrapper {
  margin-bottom: 6px;

  .balloon {
    background: #e6f6ff;
    border-radius: 60px;
    padding: 8px 8px 8px 18px;
    border: 1px solid #cdeeff;
  }
}

</style>
