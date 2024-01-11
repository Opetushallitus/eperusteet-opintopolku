<template>

<div class="ep-content">
  <ep-editor-menu-bar
    :layout="layout"
    :is-editable="isEditable"
    :editor="editor"
    :help="toolbarHelp"
    v-sticky="isSticky"
    sticky-offset="{ top: 50 }"
    sticky-z-index="500"
    />
  <editor-content
    ref="content"
    :editor="editor"
    :class="{ 'content-invalid': validation && validationError, 'content-valid': validation && !validationError }"
    v-observe-visibility="visibilityChanged"/>
  <div class="valid-feedback" v-if="!validationError && validMessage && isEditable">{{ $t(validMessage) }}</div>
  <div class="invalid-feedback" v-else-if="validationError && invalidMessage && isEditable">{{ $t(invalidMessage) }}</div>
  <div class="invalid-feedback" v-else-if="validationError && !invalidMessage && isEditable">{{ $t('validation-error-' + validationError, validation.$params[validationError]) }}</div>
  <small class="form-text text-muted" v-if="help && isEditable">{{ $t(help) }}</small>
</div>

</template>

<script lang="ts">

import * as _ from 'lodash';
import { Component, InjectReactive, Mixins, Prop, Watch } from 'vue-property-decorator';
import { Editor, EditorContent } from 'tiptap';
import { delay } from '@shared/utils/delay';
import { Kielet } from '@shared/stores/kieli';
import {
  Blockquote,
  Bold,
  Underline,
  Strike,
  Italic,
  HardBreak,
  History,
  BulletList,
  Link,
  ListItem,
  OrderedList,
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from 'tiptap-extensions';

import EpEditorMenuBar from './EpEditorMenuBar.vue';
import Sticky from 'vue-sticky-directive';
import { EditorLayout } from '@shared/tyypit';
import EpValidation from '@shared/mixins/EpValidation';
import { IKasiteHandler } from './KasiteHandler';
import TermiExtension from './TermiExtension';
import ImageExtension from './ImageExtension';
import { IKuvaHandler } from './KuvaHandler';
import CustomLink from './CustomLink';
import { ObserveVisibility } from 'vue-observe-visibility';
import { ILinkkiHandler } from './LinkkiHandler';
import { fixTipTapContent } from '@shared/utils/helpers';

const striptag = document.createElement('span');

@Component({
  components: {
    EditorContent,
    EpEditorMenuBar,
  },
  directives: {
    Sticky,
    ObserveVisibility,
  },
})
export default class EpContent extends Mixins(EpValidation) {
  @Prop({ required: true })
  value!: Object;

  @Prop({ default: false })
  isEditable!: boolean;

  @Prop()
  locale!: string;

  @Prop({ required: true })
  layout!: EditorLayout;

  @Prop({ default: false })
  isPlainString!: boolean;

  @Prop({ default: '' })
  toolbarHelp!: string;

  @Prop({ default: '' })
  help!: string;

  @Prop({ default: true })
  sticky!: boolean;

  @Prop({ required: false })
  kasiteHandler!: IKasiteHandler;

  @Prop({ required: false })
  kuvaHandler!: IKuvaHandler;

  @InjectReactive('linkkiHandler')
  private linkkiHandler!: ILinkkiHandler;

  @InjectReactive('kuvaHandler')
  private injectedKuvaHandler!: IKuvaHandler;

  @InjectReactive('kasiteHandler')
  private injectedKasiteHandler!: IKasiteHandler;

  private editor: any = null;

  private focused = false;
  private isVisible = true;

  get annettuKuvaHandler() {
    return this.kuvaHandler || this.injectedKuvaHandler;
  }

  get annettuKasiteHandler() {
    return this.kasiteHandler || this.injectedKasiteHandler;
  }

  get lang() {
    return this.locale || Kielet.getSisaltoKieli.value || 'fi';
  }

  get localizedValue() {
    if (!this.value) {
      return '';
    }
    else if (this.isPlainString) {
      return this.value || '';
    }
    else if (_.isObject(this.value)) {
      return (this.value as any)[this.lang] || '';
    }
    else {
      return this.value;
    }
  }

  mounted() {
    let linkImplementation: any = null;
    try {
      linkImplementation = new CustomLink(this.linkkiHandler);
    }
    catch (err) {
      linkImplementation = new Link();
    }

    const extensions = [
      new HardBreak(),
      new History(),
      new Blockquote(),
      new Bold(),
      new Italic(),
      new Strike(),
      linkImplementation,
      new BulletList(),
      new OrderedList(),
      new ListItem(),
      new Table({ resizable: true }),
      new TableHeader(),
      new TableCell(),
      new TableRow(),
    ];

    if (this.annettuKasiteHandler) {
      extensions.push(new TermiExtension(this.annettuKasiteHandler));
    }

    if (this.annettuKuvaHandler) {
      extensions.push(new ImageExtension(this.annettuKuvaHandler));
    }

    this.editor = new Editor({
      content: fixTipTapContent(this.localizedValue),
      editable: this.isEditable,
      onUpdate: () => {
        this.setUpEditorEvents();
      },
      onFocus: () => {
        this.focused = true;
      },
      onBlur: () => {
        this.focused = false;
      },
      extensions,
    });
  }

  @Watch('isEditable', { immediate: true })
  onChange(val: boolean, oldVal: boolean) {
    if (val === oldVal) {
      return;
    }

    this.$nextTick(() => {
      if (!this.editor) {
        return;
      }

      this.editor.setOptions({
        editable: val,
      });

      if (val) {
        this.setClass('form-control');
      }
      else {
        this.setClass('');
      }
    });
  }

  async setClass(c: string) {
    await delay();
    // HACK: give prose mirror 10 vue ticks.
    for (let count = 0; count < 10; ++count) {
      if (this.$refs.content) {
        const pm = (this.$refs.content as any).$el?.firstChild;
        if (pm) {
          (this.$refs.content as any).$el.firstChild.className = 'ProseMirror ' + c;
          break;
        }
      }
      await this.$nextTick();
    }
  }

  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy();
    }
  }

  @Watch('localizedValue', {
    immediate: true,
  })
  onValueUpdate(val: string) {
    if (this.editor && !this.focused) {
      this.editor.setContent(this.localizedValue);
    }
  }

  setUpEditorEvents() {
    const data = this.editor.getHTML();
    striptag.innerHTML = data;
    const isValid = !_.isEmpty(striptag.innerText || striptag.textContent) || striptag.getElementsByTagName('img').length > 0;
    const stripped = isValid ? data : null;
    if (this.isPlainString) {
      this.$emit('input', stripped);
    }
    else {
      this.$emit('input', {
        ...this.value,
        [Kielet.getSisaltoKieli.value as unknown as string]: stripped,
      });
    }
  }

  @Watch('lang')
  onEditableChange(val: boolean) {
    if (this.editor) {
      this.editor.setContent(this.localizedValue);
    }
  }

  visibilityChanged(isVisible) {
    this.isVisible = isVisible;
  }

  get isSticky() {
    return this.sticky && this.isVisible;
  }
}

</script>

<style scoped lang="scss">

@import "../../styles/_variables.scss";

.ep-content {
  padding: 0;
  word-break: break-word;

  /deep/ abbr {
    text-decoration: none !important;
    border-bottom: 1px dotted #999;
    cursor: help;
  }

  /deep/ .form-control {
    height: auto !important;
  }

  /deep/ table {
    border-collapse: collapse;
    border-color: #999;
    border-spacing: 1px;
    display: table;
    margin: 0;
    overflow: hidden;
    table-layout: fixed;
    width: 100%;

    td, th {
      vertical-align: top;
      border: 1px solid #ddd;
      padding: 4px;
    }
  }

  /deep/ abbr.virheellinen {
    color: $invalid;
  }

  /deep/ .form-control.ProseMirror {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
  }

  /deep/ [contenteditable]:focus {
    outline: none !important;
    box-shadow: none !important;
  }

  /deep/ .tableWrapper .selectedCell {
    background-color: $gray-lighten-5;
  }

  .content-invalid /deep/ .form-control {
    border-color: $invalid;
  }

  .content-valid /deep/ .form-control {
    border-color: $valid;
  }

  // Alleviivataan editorissa oleva virheellinen linkki, jolla ei ole hreffiä.
  /deep/ a:not([href]):not([class]) {
    text-decoration: underline;
    text-decoration-style: dotted;
    text-decoration-color: red;
  }
}

// Piilotettu Bootstrapissa oletuksena
/deep/ .invalid-feedback,
/deep/ .valid-feedback {
  display: block;
}

</style>
