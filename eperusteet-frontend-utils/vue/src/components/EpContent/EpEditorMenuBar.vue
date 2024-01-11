<template>
<div v-if="isEditable">
  <editor-menu-bar :editor="editor"
                   :focused="true"
                    v-slot="data">
    <div class="editor-toolbar" :class="{ 'd-none': !alwaysVisible && !data.focused}">
      <div class="btn-toolbar" role="toolbar">
        <div class="btn-group mr-2" role="group" v-for="(group, idx) in groups" :key="idx">
          <b-button v-for="feature in group"
                  :key="feature.command"
                  :delay="100"
                  :title="$t('editor-' + feature.command)"
                  :variant="'outline'"
                  :disabled="feature.disabled"
                  :class="{ 'active': !feature.disabled && data.isActive[feature.command] && data.isActive[feature.command]() }"
                  @click="feature.customClick ? feature.customClick(data) : data.commands[feature.command](feature.params)">
            <EpMaterialIcon v-if="feature.icon" :color="'#444'">{{ feature.icon }}</EpMaterialIcon>
            <span v-if="feature.text">{{ $t(feature.text) }}</span>
          </b-button>
        </div>
      </div>
      <div class="btn-toolbar sub-bar" role="toolbar" v-if="layout === 'normal' && data.isActive.table()">
        <div class="btn-group mr-2" role="group" v-for="(group, idx) in helperTable" :key="idx">
          <b-button v-for="feature in group"
                  :key="feature.command"
                  :title="$t('editor-' + feature.command)"
                  :variant="'outline'"
                  :disabled="feature.disabled"
                  :class="{ 'active': !feature.disabled && data.isActive[feature.command] && data.isActive[feature.command]() }"
                  @click="feature.customClick ? feature.customClick(data) : data.commands[feature.command](feature.params)">
            <EpPublicImage v-if="feature.icon" :image="feature.icon" class="icon-opacity"></EpPublicImage>
          </b-button>
        </div>
      </div>
      <b-modal ref="link-modal"
               :title="$t('lisaa-muokkaa-linkki')"
               :ok-title="$t('ok')"
               :cancel-title="$t('peruuta')"
               @ok="editLink(data)"
               @keyup.enter="editLink(data)"
               @hidden="linkValue = null"
               :ok-disabled="linkInvalid"
               size="xl">

        <b-form-group class="mx-4">

          <template v-if="navigationFlattened">
            <b-form-radio class="p-2" v-model="linkkiTyyppi" value="sisainen" name="linkkiTyyppi">{{ $t('sisainen-linkki') }}</b-form-radio>
            <EpMultiSelect
              v-if="linkkiTyyppi === 'sisainen'"
              v-model="internalLink"
              :is-editing="true"
              :search-identity="labelSearchIdentity"
              :options="navigationFlattened"
              :placeholder="$t('valitse-sivu') + '...'">
              <template slot="singleLabel" slot-scope="{ option }">
                {{ $kaanna(option.label) }}
              </template>
              <template slot="option" slot-scope="{ option }">
                <span :style="'padding-left: ' + 10*option.depth +'px'"> {{ $kaanna(option.label) }}</span>
              </template>
            </EpMultiSelect>

            <b-form-radio class="p-2 mt-3" v-model="linkkiTyyppi" value="ulkoinen" name="linkkiTyyppi" >{{ $t('ulkoinen-linkki') }}</b-form-radio>
            <b-form-input v-if="linkkiTyyppi === 'ulkoinen'"
                          v-model="linkValue"
                          :placeholder="linkPlaceholder"
                          :state="!linkInvalid"></b-form-input>
          </template>
          <b-form-input v-else v-model="linkValue" :placeholder="linkPlaceholder"></b-form-input>

        </b-form-group>

      </b-modal>
    </div>
  </editor-menu-bar>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, InjectReactive } from 'vue-property-decorator';
import { EditorMenuBar } from 'tiptap';
import { NavigationNodeDto } from '@shared/tyypit';
import EpMultiSelect from '@shared/components/forms/EpMultiSelect.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import { deepFind } from '@shared/utils/helpers';
import EpPublicImage from '@shared/components/EpPublicImage/EpPublicImage.vue';

@Component({
  components: {
    EditorMenuBar,
    EpMultiSelect,
    EpMaterialIcon,
    EpPublicImage,
  },
})
export default class EpEditorMenuBar extends Vue {
  @Prop({ required: true })
  private editor!: any;

  @Prop({ required: true })
  private isEditable!: boolean;

  @Prop({ required: true })
  private layout!: string;

  @Prop({ default: true })
  private alwaysVisible!: boolean;

  @InjectReactive('navigation')
  private navigation!: NavigationNodeDto;

  private linkValue: string | null = null;
  private internalLink: NavigationNodeDto | null = null;
  private linkkiTyyppi: 'ulkoinen' | 'sisainen' | null = null;
  private linkPlaceholder: string = 'https://...';

  get id() {
    return (this as any)._uid;
  }

  get history() {
    return [{
      command: 'undo',
      icon: 'undo',
    }, {
      command: 'redo',
      icon: 'redo',
    }];
  }

  get textManipulation() {
    return [{
      command: 'bold',
      icon: 'format_bold',
    }, {
      command: 'italic',
      icon: 'format_italic',
    }, {
      command: 'strike',
      icon: 'strikethrough_s',
    }];
  }

  get linkTermiKuva() {
    return [...this.linking,
      ...(!_.isFunction(_.get(this.editor.commands, 'termi')) ? [] : [{
        icon: 'book',
        command: 'termi',
        disabled: this.editor.selection.from === this.editor.selection.to,
      }]), ...(!_.isFunction(_.get(this.editor.commands, 'image')) ? [] : [{
        icon: 'add_photo_alternate',
        command: 'image',
      }]),
    ];
  }

  get linking() {
    return [{
      icon: 'add_link',
      command: 'link',
      disabled: this.editor.selection.from === this.editor.selection.to,
      customClick: (data) => {
        const isNew = !data.isActive.link();
        const attrs = data.getMarkAttrs('link');
        this.linkValue = null;
        this.internalLink = null;
        this.linkkiTyyppi = null;

        if (!isNew && attrs) {
          this.linkValue = attrs.href;

          if (attrs.href && attrs.href !== '#') {
            this.linkkiTyyppi = 'ulkoinen';
          }

          if (attrs.routenode) {
            this.linkkiTyyppi = 'sisainen';
            this.internalLink = deepFind({ id: _.get(JSON.parse(attrs.routenode), 'id') }, this.navigationFlattened);
          }
        }

        (this as any).$refs['link-modal'].show();
      },
    }];
  }

  get lists() {
    return [{
      command: 'bullet_list',
      icon: 'list',
    }, {
      command: 'ordered_list',
      icon: 'format_list_numbered_rtl',
    }];
  }

  get tables() {
    return [{
      command: 'createTable',
      params: {
        rowsCount: 3,
        colsCount: 3,
        withHeaderRow: false,
      },
      icon: 'grid_on',
    }];
  }

  get helperToolbar() {
    return null;
  }

  get helperTable() {
    const RemoveColor = '#e44e4e';
    const AddColor = '#5BCA13';
    const MergeColor = '#ffd024';

    const tables = [{
      color: RemoveColor,
      command: 'deleteTable',
      icon: 'poista-taulukko.svg',
      text: 'poista-taulu',
    }];

    const columns = [{
      color: AddColor,
      command: 'addColumnBefore',
      icon: 'kolumni-vasen.svg',
      text: 'lisaa-sarake-ennen',
    }, {
      color: AddColor,
      command: 'addColumnAfter',
      icon: 'kolumni-oikea.svg',
      text: 'lisaa-sarake-jalkeen',
    }, {
      color: RemoveColor,
      command: 'deleteColumn',
      icon: 'poista-kolumni.svg',
      text: 'poista-sarake',
    }];

    const rows = [{
      command: 'addRowBefore',
      color: AddColor,
      icon: 'rivi-alas.svg',
      text: 'lisaa-rivi-ennen',
    }, {
      command: 'addRowAfter',
      color: AddColor,
      icon: 'rivi-alas.svg',
      text: 'lisaa-rivi-jalkeen',
    }, {
      command: 'deleteRow',
      color: RemoveColor,
      icon: 'poista-rivi.svg',
      text: 'poista-rivi',
    }, {
      command: 'toggleCellMerge',
      color: MergeColor,
      icon: 'yhdista-solut.svg',
      text: 'yhdista-solut',
    }];

    return [
      columns,
      rows,
      tables,
    ];
  }

  get groups() {
    if (this.layout === 'normal') {
      return _.filter([
        this.history,
        this.textManipulation,
        this.linkTermiKuva,
        this.lists,
        this.tables,
      ], v => !_.isEmpty(v));
    }
    else if (this.layout === 'simplified_w_links') {
      return [
        this.history,
        this.textManipulation,
        this.linking,
        this.lists,
      ];
    }
    else if (this.layout === 'simplified') {
      return [
        this.history,
        this.textManipulation,
        this.lists,
      ];
    }
    else {
      return [
        this.history,
      ];
    }
  }

  get linkInvalid() {
    return this.linkkiTyyppi === 'ulkoinen' && !this.linkValue?.startsWith('http');
  }

  private editLink(data) {
    if (!_.isEmpty(this.linkValue)) {
      data.commands.link({
        href: this.linkValue,
      } as any);
    }

    if (!_.isEmpty(this.internalLink)) {
      data.commands.link({
        href: '#',
        routenode: JSON.stringify(_.pick(this.internalLink, ['id', 'type', 'koodi', 'meta'])),
      } as any);
    }

    this.linkValue = null;
    this.internalLink = null;
  }

  get navigationFlattened() {
    if (this.navigation) {
      return _.chain(this.flattenedNavi(this.navigation))
        .filter(node => !!node.label)
        .map(node => {
          return {
            ...node,
            $isDisabled: !_.has(node, 'id'),
          };
        })
        .value();
    }
  }

  flattenedNavi(navi: NavigationNodeDto, depth = -1) {
    return [
      {
        ...navi,
        depth,
      },
      ..._.flatten(_.map(navi.children, child => this.flattenedNavi(child, depth + 1))),
    ];
  }

  labelSearchIdentity(obj: any) {
    return _.toLower(this.$kaanna(obj.label));
  }
}
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";

.sub-bar {
  margin-top: 0;
  border-top: 2px solid #E0E0E1;
}

/deep/ .active {
  background: #c1c1c1 !important;
  border-radius: 0;
}

.editor-toolbar {
  background-color: #f1f1f1;
  border: 2px solid #E0E0E1;
  border-bottom: none;
  padding: 0;
}

.icon-opacity {
  opacity: 0.7;
}

</style>
