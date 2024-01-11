<template>
  <div>
    <hr v-if="first && !borderTop" />
    <div :class="classess" v-if="!disableHeader" :style="styles.collapse" @click="togglefull ? toggle(): null" @keyup.enter="togglefull ? toggle(): null">
      <!-- Button tagia ei voida käyttää, sillä ml-auto ei toimi.-->
      <!-- Käytetään button rolea saavutettavuuden takaamiseksi.-->
      <div v-if="hasHeaderSlot"
           class="collapse-button d-flex align-items-center mb-2"
           @click="!togglefull ? toggle(): null"
           @keyup.enter="!togglefull ? toggle(): null"
           role="button"
           tabindex="0"
           :aria-expanded="toggled"
           :style="styles.header">
        <slot name="icon" :toggled="toggled" v-if="chevronLocation === 'left' && collapsable">
          <div class="align-self-start mr-2">
            <EpMaterialIcon v-if="toggled" size="28px">expand_less</EpMaterialIcon>
            <EpMaterialIcon v-else size="28px">expand_more</EpMaterialIcon>
          </div>
        </slot>
        <div class="align-self-start header">
          <div :class="{'header-toggled': toggled}">
            <slot name="header" :toggled="toggled"></slot>
          </div>
        </div>
        <slot name="icon" :toggled="toggled" v-if="chevronLocation === 'right'  && collapsable">
          <div class="ml-auto">
            <EpMaterialIcon v-if="toggled" size="28px">expand_less</EpMaterialIcon>
            <EpMaterialIcon v-else size="28px">expand_more</EpMaterialIcon>
          </div>
        </slot>
      </div>
      <div v-if="toggled">
        <slot></slot>
      </div>
    </div>
    <slot v-else></slot>
    <hr v-if="borderBottom" />
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { setItem, getItem } from '../../utils/localstorage';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpMaterialIcon,
  },
})
export default class EpCollapse extends Vue {
  @Prop({ default: true })
  private expandedByDefault!: boolean;

  @Prop({ default: false })
  private disableHeader!: boolean;

  @Prop({ default: true })
  private usePadding!: boolean;

  @Prop({ default: '' })
  private tyyppi!: string;

  @Prop({ default: false })
  private borderTop!: boolean;

  @Prop({ default: true })
  private borderBottom!: boolean;

  @Prop({ default: 'right' })
  private chevronLocation!: 'right' | 'left';

  @Prop({ default: true })
  private collapsable!: boolean;

  @Prop({ default: false })
  private first!: boolean;

  @Prop({ default: false, type: Boolean })
  private blue!: Boolean;

  @Prop({ required: false, default: false })
  private shadow!: boolean;

  @Prop({ required: false, default: false })
  private togglefull!: boolean;

  private toggled = false;

  get hasHeaderSlot() {
    return !!this.$scopedSlots.header;
  }

  get styles() {
    let style = {
      header: {},
      collapse: {},
    };

    if (this.blue) {
      style = {
        header: {
          'color': '#001A58',
        },
        collapse: {
          'padding': '20px 20px 0px 20px',
          'border-radius': '30px',
          'border': '1px solid #C8F1FF',
          'background': '#E6F6FF',
        },
      };
    }

    if (this.usePadding) {
      style = {
        header: {
          ...style.header,
          'margin-bottom': '10px',
          'margin-top': '10px',
        },
        collapse: {
          ...style.collapse,
          'padding-top': '20px',
          'padding-bottom': '20px',
        },
      };
    }

    return style;
  }

  get classess() {
    let result = 'ep-collapse';
    if (this.borderTop) {
      result += ' topborder';
    }

    if (this.shadow) {
      result += ' shadow-tile';
    }

    if (this.togglefull) {
      result += ' togglefull';
    }

    return result;
  }

  isToggled() {
    try {
      if (this.tyyppi) {
        const item = getItem('toggle-' + this.tyyppi);
        if (_.isObject(item)) {
          return (item as any).toggled;
        }
      }
      return true;
    }
    catch (err) {
      return true;
    }
  }

  mounted() {
    this.toggled = this.tyyppi
      ? this.isToggled()
      : this.expandedByDefault;
  }

  toggle(toggle: boolean | null = null) {
    if (this.collapsable) {
      if (!toggle) {
        this.toggled = !this.toggled;
      }
      else {
        this.toggled = toggle;
      }
      if (this.tyyppi) {
        setItem('toggle-' + this.tyyppi, {
          toggled: this.toggled,
        });
      }
    }
  }
}

</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';
@import '../../styles/_mixins.scss';

@include shadow-tile;

.topborder {
  border-top: 1px;
  border-top-style: solid;
  border-top-color: #eeeeee;
}

.bottomborder {
  border-bottom: 1px;
  border-bottom-style: solid;
  border-bottom-color: #eeeeee;
}

.ep-collapse {
  margin-top: 5px;

  .collapse-button {
    cursor: pointer;
    outline: none;

    label {
      cursor: pointer;
    }
  }

  .header-toggled {
    user-select: none;
  }

  &.togglefull {
    cursor: pointer;
  }
}

.shadow-tile {
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 0.7rem;
}

::v-deep .osaamistasot {
  .row:nth-of-type(even) {
    background-color: $table-even-row-blue !important;
  }
  .row:nth-of-type(odd) {
    background-color: $table-odd-row-blue !important;
  }
}

::v-deep .table-responsive {
  tr:first-child td {
    background: $table-header-color !important;
  }
}

</style>
