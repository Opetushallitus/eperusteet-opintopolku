<template>
  <div>
    <h4 v-if="file">{{$t('kuva')}}</h4>
    <h4 v-else>{{$t('lataa-uusi-kuva')}}</h4>
    <span v-if="!file">({{$t('max-koko') + ' ' + fileMaxSizeInMb + $t('megatavu-lyhenne')}})</span>

    <EpTiedostoInput @input="onInput" :file-types="fileTypes" :file="file">
      <slot>
        <div class="justify-content-around align-items-center h-100" v-if="file">
          <div class="h-100 justify-content-around align-items-center">
            <figure><img v-if="previewUrl" :src="previewUrl" :width="previewWidth" :height="previewHeight"/>
              <figcaption v-if="!saved">{{ $t('fu-valittu-tiedosto') }}: {{ file ? file.name : '' }}</figcaption>
              <figcaption v-if="!saved && file" :class="!fileValidi ? 'error' : ''">
                {{ $t('fu-tiedosto-koko') }}: {{ fileSize }} {{ !fileValidi ? '(' +  $t('max-koko') + ' ' + fileMaxSizeInMb + $t('megatavu-lyhenne') + ')' : '' }}
              </figcaption>
            </figure>
          </div>

          <div class="mb-3" v-if="!saved">
            <div class="d-flex align-items-center">
              <ep-form-content name="kuvan-leveys" class="mb-3">
                <div class="d-flex align-items-center">
                  <ep-field v-model="value.width" :is-editing="true" type="number"></ep-field>
                  <span class="ml-1 mr-3">px</span>
                </div>
              </ep-form-content>

              <ep-form-content name="kuvan-korkeus" class="mb-3">
                <div class="d-flex align-items-center">
                  <ep-field v-model="value.height" :is-editing="true" type="number"></ep-field>
                  <span class="ml-1">px</span>
                </div>
              </ep-form-content>
            </div>

            <ep-toggle :is-switch="false" v-model="keepAspectRatio">{{$t('sailyta-mittasuhteet')}}</ep-toggle>
          </div>

          <div class="justify-content-center">
            <div v-if="!saved">
              <ep-button @click="saveImage()" class="mr-3" v-if="fileValidi">
                <slot name="tallenna">{{ $t('tallenna') }}</slot>
              </ep-button>
              <ep-button @click="cancel" variant="link">
                <slot name="peruuta">{{ $t('peruuta') }}</slot>
              </ep-button>
            </div>
            <div v-else>
              <ep-button @click="cancel" variant="link">
                {{ $t('valitse-toinen-kuva') }}
              </ep-button>
            </div>
          </div>
        </div>
      </slot>
    </EpTiedostoInput>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import EpButton from '../EpButton/EpButton.vue';
import { fail } from '@shared/utils/notifications';
import _ from 'lodash';
import EpField from '@shared/components/forms/EpField.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpToggle from '@shared/components/forms/EpToggle.vue';
import EpTiedostoInput from '@shared/components/EpTiedosto/EpTiedostoInput.vue';

export interface ImageData {
  file: File ;
  height: number;
  width: number;
  preview: string;
  previewUrl: string;
}

@Component({
  components: {
    EpButton,
    EpField,
    EpFormContent,
    EpToggle,
    EpTiedostoInput,
  },
})
export default class EpKuvaLataus extends Vue {
  private fileMaxSizeInMb = 1;
  private fileMaxSize = this.fileMaxSizeInMb * 1024 * 1024;
  private fileTypes: string [] = ['image/jpeg', 'image/png'];
  private keepAspectRatio: boolean = true;
  private changeBlock: boolean = false;
  private originalHeightRatio: number = 0;
  private originalWidthRatio: number = 0;
  private previewWidth: number = 0;
  private previewHeight: number = 0;

  mounted() {
    if (this.value) {
      this.originalHeightRatio = this.height / this.width;
      this.originalWidthRatio = this.width / this.height;
      this.recalcPreview();
    }
  }

  @Prop()
  private value!: ImageData;

  @Prop()
  private saved!: boolean;

  get previewUrl() {
    if (this.value) {
      return this.value.previewUrl;
    }
  }

  get file() {
    if (this.value) {
      return this.value.file;
    }
  }

  get fileValidi() {
    return this.file != null && (this.file as any).size <= this.fileMaxSize && _.includes(this.fileTypes, (this.file as any).type);
  }

  get fileSize() {
    let size = 0;
    if (this.file) {
      size = this.file.size / 1024;
    }
    return size > 1024 ? (size / 1024).toFixed(2) + this.$t('megatavu-lyhenne') : size.toFixed(1) + this.$t('kilotavu-lyhenne');
  }

  // Luodaan esikatselukuva kuvan valitsemisen jälkeen
  async onInput(file: File) {
    if (file != null && file.size > this.fileMaxSize) {
      fail('pdf-tiedosto-kuva-liian-suuri');
    }

    if (file != null && !_.includes(this.fileTypes, file.type)) {
      fail('pdf-tiedosto-kuva-vaara-tyyppi');
    }

    if (file != null) {
      // Luodaan uusi lukija ja rekisteröidään kuuntelija
      const reader = new FileReader();

      // Ladataan kuva Base64 muodossa
      reader.readAsDataURL(file);
      reader.onload = (evt: any) => {
        let img = new Image();
        img.onload = () => {
          this.$emit('input', {
            file,
            width: img.width,
            height: img.height,
            preview: reader.result,
            previewUrl: evt.target.result,
          } as ImageData);
        };
        img.src = evt.target.result;
      };
    }
  }

  async saveImage() {
    this.$emit('saveImage');
  }

  cancel() {
    this.$emit('cancel');
  }

  get width() {
    return this.value?.width;
  }

  get height() {
    return this.value?.height;
  }

  @Watch('width')
  widthChange(newVal) {
    if (newVal && this.keepAspectRatio && !this.changeBlock) {
      this.changeBlock = true;
      this.value.height = this.round(this.width * this.originalHeightRatio);
    }
    else if (this.changeBlock) {
      this.changeBlock = false;
    }

    this.recalcPreview();
  }

  @Watch('height')
  heightChange(newVal) {
    if (newVal && this.keepAspectRatio && !this.changeBlock) {
      this.changeBlock = true;
      this.value.width = this.round(this.height * this.originalWidthRatio);
    }
    else if (this.changeBlock) {
      this.changeBlock = false;
    }

    this.recalcPreview();
  }

  recalcPreview() {
    this.previewWidth = this.width;
    this.previewHeight = this.height;
    if (this.width > this.height) {
      if (this.width > 500) {
        this.previewWidth = 500;
      }
      this.previewHeight = this.round(this.previewWidth * ((this.height / this.width)));
    }
    else {
      if (this.height > 500) {
        this.previewHeight = 500;
      }
      this.previewWidth = this.round(this.previewHeight * (this.width / this.height));
    }
  }

  round(number) {
    return _.toNumber(parseFloat(number).toFixed(0));
  }
}

</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

.error {
  color: $invalid;
}
</style>
