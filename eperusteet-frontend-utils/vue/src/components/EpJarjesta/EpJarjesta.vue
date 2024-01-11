<template>
<draggable v-bind="options"
           tag="div"
           class="tree-container"
           :value="value"
           @input="emitter"
           :key="value.length">
  <div v-for="(node, idx) in value" :key="idx">
    <div class="box d-flex align-items-center" :class="{ 'new-box': node.$uusi, 'box-draggable': isEditable }" >
      <div class="handle">
        <EpMaterialIcon v-if="isEditable && !options.disabled">drag_indicator</EpMaterialIcon>
      </div>
      <slot name="chapter">
        <div class="chapter">
          {{ prefix }}{{ idx + 1 }}
        </div>
      </slot>
      <div class="name">
        <slot :node="node"></slot>
      </div>
      <div
        v-if="node[childField] && node[childField] != null && node[childField].length > 0"
        class="actions ml-auto"
        role="button"
        tabindex="0"
        @click="toggle(idx)"
        @keyup.enter="toggle(idx)"
        :aria-expanded="!node.$closed">
        <EpMaterialIcon v-if="node.$closed" size="28px">expand_more</EpMaterialIcon>
        <EpMaterialIcon v-else size="28px">expand_less</EpMaterialIcon>
      </div>
    </div>
    <div class="children" v-if="!node.$closed && node[childField] && node[childField] != null">
      <ep-jarjesta
          v-model="node[childField]"
          :is-editable="isEditable"
          :prefix="prefix + (idx + 1) + '.'"
          :child-field="childField"
          :sortable="node.sortable"
          :group="node.group ? node.group + idx : (uniqueChildGroups ? group + idx : group)">
        <slot v-for="(_, name) in $slots" :name="name" :slot="name"></slot>
        <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="data">
          <slot :name="name" v-bind="data" />
        </template>
      </ep-jarjesta>
    </div>
  </div>
</draggable>
</template>

<script lang="ts">

import { Vue, Prop, Component } from 'vue-property-decorator';
import draggable from 'vuedraggable';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  name: 'EpJarjesta',
  components: {
    draggable,
    EpMaterialIcon,
  },
})
export default class EpJarjesta extends Vue {
  @Prop({
    required: false,
    type: String,
    default: '',
  })
  private prefix!: string;

  @Prop({
    required: false,
    type: Boolean,
    default: false,
  })
  private isEditable!: boolean;

  @Prop({
    required: true,
    type: Array,
    default: null,
  })
  private value!: any[];

  @Prop({
    required: false,
    default: 'lista',
  })
  private childField!: string;

  @Prop({ default: null })
  private rootGroup!: string | null;

  @Prop({ default: null })
  private group!: string | null;

  @Prop({ required: false, default: true })
  private sortable!: boolean;

  @Prop({ default: false, required: false })
  private uniqueChildGroups!: boolean;

  @Prop({ default: false })
  private useHandle!: boolean ;

  get options() {
    return {
      animation: 300,
      disabled: !this.isEditable || !this.sortable,
      forceFallback: true,
      ghostClass: 'placeholder',
      group: this.rootGroup ? this.rootGroup : this.group,
      handle: this.useHandle && '.handle',
    };
  }

  toggle(idx) {
    Vue.set(this.value[idx], '$closed', !this.value[idx].$closed);
    this.emitter(this.value);
  }

  emitter(value) {
    this.$emit('input', value);
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.flip-move {
  transition: transform 0.5s;
}

.placeholder {
  opacity: 0.5;
}

.drag-area-empty {
  min-height: 7px;
}

.children {
  margin-left: 26px;
}

.box {
  min-height: 40px;
  max-width: 512px;
  min-width: 312px;
  border: 1px solid #CCD9F8;
  border-radius: 4px;
  background-color: rgba(230,246,255,0.6);
  padding: 8px 12px;
  margin-bottom: 8px;

  .handle {
    color: #668DEA;
    margin-right: 8px;
    cursor: grab;
  }

  .actions {
    float: right;
  }

  .actions {
    cursor: pointer;
  }

  .chapter {
    color: #668DEA;
    font-size: 16px;
    margin-right: 8px;
    user-select: none;
  }

  &.new-box {
    background-color: rgba(210,226,255,1.0);
    border: 1px solid #ACB9F8;
  }
}

.box-draggable {
  cursor: grab;
}

</style>
