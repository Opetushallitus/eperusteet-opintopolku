<template>
  <div>
    <div class="tiedosto-lataus" :class="file ? 'tiedosto' : 'ei-tiedosto'">

      <b-form-file ref="file-input" v-if="!file" :accept="accept" :placeholder="placeholder" :drop-placeholder="dropPlaceholder" :browse-text="browseText" @input="onInput"></b-form-file>

      <template v-if="file">
        <slot name="file-selected" :file="file">
          <div class="pl-2 d-inline-block">
            <div>{{ $t('valittu-tiedosto') }}: {{ file ? file.name : '' }}</div>
            <div class="text-right pl-2 pt-4">
              <ep-button @click="cancel" class="pl-5">
                <slot name="peruuta">{{ $t('peruuta') }}</slot>
              </ep-button>
            </div>
          </div>
        </slot>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';

import EpButton from '../EpButton/EpButton.vue';
import _ from 'lodash';

export interface FileData {
  file: File;
  binary?: ArrayBuffer;
  content?: string;
}

@Component({
  components: {
    EpButton,
  },
})
export default class EpTiedostoLataus extends Vue {
  // private fileMaxSize = 1 * 1024 * 1024;

  @Prop({ default: null })
  private value!: FileData;

  @Prop({ required: true })
  private fileTypes!: string[];

  @Prop({ default: false })
  private asBinary!: boolean;

  @Prop({ default: 1 * 1024 * 1024 })
  private fileMaxSize!: number;

  get accept() {
    return _.join(this.fileTypes, ', ');
  }

  get file() {
    if (this.value) {
      return this.value.file;
    }
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

  handleFail() {
    this.$fail((this as any).$t('tiedosto-luku-virhe'));
    this.$emit('input', null);
    this.resetFile();
  }

  // Luodaan esikatselukuva kuvan valitsemisen jälkeen
  async onInput(file: File) {
    if (file != null && file.size > this.fileMaxSize) {
      this.$fail((this as any).$t('pdf-tiedosto-kuva-liian-suuri'));
    }

    if (file != null && !_.includes(this.fileTypes, file.type)) {
      this.$fail((this as any).$t('pdf-tiedosto-kuva-vaara-tyyppi'));
    }

    if (file != null) {
      // Luodaan uusi lukija ja rekisteröidään kuuntelija
      const reader = new FileReader();
      if (this.asBinary) {
        reader.onload = () => {
          try {
            if (reader.result) {
              this.$emit('input', {
                file,
                binary: reader.result,
              } as FileData);
            }
          }
          catch (e) {
            this.handleFail();
          }
        };
        reader.readAsBinaryString(file);
      }
      else {
        reader.onload = evt => {
          try {
            if (evt.target) {
              this.$emit('input', {
                file,
                content: JSON.parse((evt.target.result as any)),
              } as FileData);
            }
          }
          catch (e) {
            this.handleFail();
          }
        };
        reader.readAsText(file);
      }
    }
  }

  cancel() {
    this.$emit('input', null);
  }

  resetFile() {
    (this as any).$refs['file-input'].reset();
  }
}

</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

.kuvaus {
  font-size: 0.8rem;
  color: $gray;
}

.tiedosto-lataus {
  margin: 0px 0px;
  width:100%;
  border-width: 1px;
  border-color: $gray-lighten-2;
  border-style: dashed;
  border-radius: 10px;
  position: relative;

  img {
    max-width: 500px;
    max-height: 500px;
  }

  &.tiedosto {
    background-color: $white;
    border-style: none;
  }

  &.ei-tiedosto {
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
      background-image: url('../../../public/img/icons/lataus_ikoni.svg');
      background-repeat: no-repeat;
      background-position: left;
      border: 0px;
      margin-left: 30px;
      margin-top: 10px;
      height: 50px;
      background-color: inherit;
      padding-top: 0px;
      padding-left: 60px;
      position: relative;
      border-radius: 0;
    }

    .custom-file-label::after {
      padding: 60px 310px 0px 0px;
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
