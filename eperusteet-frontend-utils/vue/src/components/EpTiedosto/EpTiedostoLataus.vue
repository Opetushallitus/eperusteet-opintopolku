<template>
  <div>
    <EpTiedostoInput @input="onInput"
                     :file-types="fileTypes"
                     :file="file"
                     ref="fileInput">
      <slot>
        <div v-if="file" class="pl-2 d-inline-block">
          <div>{{ $t('valittu-tiedosto') }}: {{ file ? file.name : '' }}</div>
          <div class="text-right pl-2 pt-4">
            <ep-button @click="cancel" class="pl-5">
              <slot name="peruuta">{{ $t('peruuta') }}</slot>
            </ep-button>
          </div>
        </div>
      </slot>
    </EpTiedostoInput>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpButton from '../EpButton/EpButton.vue';
import _ from 'lodash';
import EpTiedostoInput from '@shared/components/EpTiedosto/EpTiedostoInput.vue';

export interface FileData {
  file: File;
  binary?: ArrayBuffer;
  content?: string;
}

@Component({
  components: {
    EpButton,
    EpTiedostoInput,
  },
})
export default class EpTiedostoLataus extends Vue {
  @Prop({ default: null })
  private value!: FileData;

  @Prop({ required: true })
  private fileTypes!: string[];

  @Prop({ default: false })
  private asBinary!: boolean;

  get file() {
    if (this.value) {
      return this.value.file;
    }
  }

  handleFail() {
    this.$fail((this as any).$t('tiedosto-luku-virhe'));
    this.$emit('input', null);
    this.resetFile();
  }

  async onInput(file: File) {
    if (file != null && !_.includes(this.fileTypes, file.type)) {
      this.$fail((this as any).$t('tiedostotyyppi-ei-sallittu'));
    }

    else if (file != null) {
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
    (this as any).$refs['fileInput'].resetFile();
  }
}
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

</style>
