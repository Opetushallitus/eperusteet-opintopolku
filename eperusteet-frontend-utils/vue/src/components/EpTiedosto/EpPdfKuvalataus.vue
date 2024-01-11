<template>
  <ep-form-content :name="tyyppi">

    <div class="kuvaus">{{$t('pdf-tiedosto-kuvaus')}}</div>
    <EpTiedostoInput @input="onInput"
                     v-model="file"
                     :file-types="fileTypes"
                     :file="fileOrUrl"
                     ref="fileInput">
      <slot>
        <div class="justify-content-around align-items-center h-100 m-3">
          <div v-if="kuvaUrl">
            <img :src="kuvaUrl" />
            <div class="vali-viiva justify-content-center">
              <ep-button @click="removeImage()" variant="link" icon="delete" class="mt-2">
                <slot name="poista">{{ $t('poista') }}</slot>
              </ep-button>
            </div>
          </div>

          <div v-else-if="file">
            <div class="h-100 justify-content-around align-items-center">
              <figure>
                <img v-if="previewUrl" :src="previewUrl" />
                <figcaption>{{ $t('fu-valittu-tiedosto') }}: {{ file ? file.name : '' }}</figcaption>
              </figure>
            </div>
            <div class="justify-content-center">
              <ep-button v-if="fileValidi" @click="saveImage()" variant="link" icon="save" class="mr-5">
                <slot name="tallenna">{{ $t('tallenna') }}</slot>
              </ep-button>
              <ep-button @click="file = null" variant="link" icon="keyboard_return">
                <slot name="peruuta">{{ $t('peruuta') }}</slot>
              </ep-button>
            </div>
          </div>
        </div>
      </slot>
    </EpTiedostoInput>
  </ep-form-content>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { Kielet } from '../../stores/kieli';
import _ from 'lodash';
import { fail } from '@shared/utils/notifications';
import EpButton from '../EpButton/EpButton.vue';
import EpFormContent from '../forms/EpFormContent.vue';
import EpTiedostoInput from '@shared/components/EpTiedosto/EpTiedostoInput.vue';

@Component({
  components: {
    EpTiedostoInput,
    EpButton,
    EpFormContent,
  },
})
export default class EpPdfKuvalataus extends Vue {
  private file = null;
  private previewUrl = null;
  private fileMaxSize = 1 * 1024 * 1024;
  private fileTypes: string [] = ['image/jpeg', 'image/png'];

  @Prop({ required: true })
  private tyyppi!: string;

  @Prop({ required: true })
  private kuvaUrl!: string;

  @Watch('kieli')
  private kieliChanged() {
    this.file = null;
  }

  get kieli() {
    return Kielet.getSisaltoKieli;
  }

  get fileOrUrl() {
    return this.file || this.kuvaUrl;
  }

  get fileValidi() {
    return this.file != null && (this.file as any).size <= this.fileMaxSize && _.includes(this.fileTypes, (this.file as any).type);
  }

  // Luodaan esikatselukuva kuvan valitsemisen jälkeen
  private onInput(file: any) {
    this.previewUrl = null;
    if (file != null && file.size > this.fileMaxSize) {
      fail('pdf-tiedosto-kuva-liian-suuri');
    }

    else if (file != null && !_.includes(this.fileTypes, file.type)) {
      fail('pdf-tiedosto-kuva-vaara-tyyppi');
    }

    else if (file != null) {
      // Luodaan uusi lukija ja rekisteröidään kuuntelija
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };

      // Ladataan kuva Base64 muodossa
      reader.readAsDataURL(file);
    }
  }

  async saveImage() {
    this.$emit('saveImage', this.file, this.tyyppi);
  }

  async removeImage() {
    this.$emit('removeImage', this.tyyppi);
    this.file = null;
  }
}

</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

.dokumentit {

  .kuvaus {
    font-size: 0.8rem;
    color: $gray;
  }

  img {
    max-width: 500px;
    max-height: 500px;
  }
}
</style>
