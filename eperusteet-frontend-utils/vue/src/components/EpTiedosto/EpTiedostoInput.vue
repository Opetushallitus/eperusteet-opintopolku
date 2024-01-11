<template>
  <div>
    <div class="tiedosto-lataus ei-tiedostoa" v-if="!fileSelected">
      <b-form-file
        ref="file-input"
        :accept="accept"
        :placeholder="placeholder"
        :drop-placeholder="dropPlaceholder"
        :browse-text="browseText"
        @input="onInput"></b-form-file>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import _ from 'lodash';

@Component
export default class EpTiedostoInput extends Vue {
  @Prop({ required: false })
  private file!: any;

  @Prop({ required: true })
  private fileTypes!: string[];

  async onInput(file: File) {
    this.$emit('input', file);
  }

  get accept() {
    return _.join(this.fileTypes, ', ');
  }

  get fileSelected() {
    return !!this.file;
  }

  get placeholder() {
    return this.$t('fu-placeholder');
  }

  get dropPlaceholder() {
    return this.$t('fu-placeholder');
  }

  get browseText() {
    return this.$t('fu-browse-text');
  }

  resetFile() {
    if (!this.fileSelected) {
      (this as any).$refs['file-input'].reset();
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

.tiedosto-lataus {
  margin: 0;
  width:100%;
  border-width: 1px;
  border-color: $gray-lighten-2;
  border-style: dashed;
  border-radius: 10px;
  position: relative;

    &.tiedosto {
      background-color: $white;
      border-style: none;
    }

    &.ei-tiedostoa {
      height: 100px;
      background-color: $gray-lighten-7;
    }

  .custom-file::v-deep{
    height: 100%;
    flex-direction: column;
    justify-content: center;
    display: flex;

    input {
      display: none;
    }

    .custom-file-label {
      width: 100%;
      background-image: url('~@assets/img/icons/lataus_ikoni.svg');
      background-repeat: no-repeat;
      background-position: left;
      border: 0;
      margin-left: 30px;
      margin-top: 10px;
      height: 50px;
      background-color: inherit;
      padding-top: 0;
      padding-left: 60px;
      position: relative;
      border-radius: 0;
    }

    .custom-file-label::after {
      text-decoration: underline;
      color: blue;
      padding: 0 0 0 0.20rem;
      display: inline;
      position: relative;
      background-color: $gray-lighten-7;
    }
  }
}
</style>
