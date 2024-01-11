<template>
  <div class="imageselector">
    <ep-spinner v-if="isLoading" />
    <div v-else>
      <div>
        <div class="imgselect" v-if="!imageData">
          <div class="mb-4">{{$t('kuvalisays-modal-selite')}}</div>
          <ep-form-content name="valitse-kuva">
            <vue-select
              :disabled="options.length === 0"
              v-model="selected"
              :filter-by="filterBy"
              :placeholder="options.length > 0 ? $t('valitse') : $t('ei-lisattyja-kuvia')"
              :options="options"
              label="id"
              :clearable="true">
              <template #selected-option="option">
                <img class="preview-selected" :src="option.src">
              </template>
              <template #option="option">
                <img class="preview" :src="option.src">
                {{ option.nimi }}
              </template>
            </vue-select>
          </ep-form-content>
        </div>

        <div v-if="!selected || imageData">
          <ep-kuva-lataus v-model="imageData" :saved="imageSaved" @saveImage="saveImage" @cancel="peruuta"></ep-kuva-lataus>
        </div>

        <div v-if="selected || imageData">
          <ep-form-content name="kuvateksti" class="mt-3">
            <ep-field
              v-model="kuvateksti"
              @input="onKuvatekstichange"
              :is-editing="true"
              :validation="$v.kuvateksti"
              :help="'teksti-naytetaan-kuvan-alla'"/>
          </ep-form-content>

          <ep-form-content class="mt-3">
            <label slot="header">{{$t('kuvan-vaihtoehtoinen-teksti')}} *</label>
            <ep-field
              v-model="vaihtoehtoinenteksti"
              @input="onVaihtoehtoinentekstiChange"
              :is-editing="true"
              :validation="$v.vaihtoehtoinenteksti"
              :help="'teksti-naytetaan-ruudunlukijalaitteelle'"/>
          </ep-form-content>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-end mt-3">
      <b-button class="mr-3" variant="link" @click="close(false)">{{$t('peruuta')}}</b-button>
      <b-button variant="primary" squared @click="close(true)">{{$t('lisaa-kuva')}}</b-button>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Mixins } from 'vue-property-decorator';
import VueSelect from 'vue-select';

import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpField from '@shared/components/forms/EpField.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import { Kielet } from '@shared/stores/kieli';
import EpKuvaLataus, { ImageData } from '@shared/components/EpTiedosto/EpKuvaLataus.vue';
import { IKuvaHandler, ILiite } from './KuvaHandler';

@Component({
  components: {
    EpSpinner,
    VueSelect,
    EpFormContent,
    EpField,
    EpKuvaLataus,
  },
  validations: {
    vaihtoehtoinenteksti: {
      [Kielet.getSisaltoKieli.value]: {
        required,
      },
    },
  },
} as any)
export default class ImageModal extends Mixins(validationMixin) {
  @Prop({ required: true })
  private loader!: IKuvaHandler;

  @Prop({ required: true })
  private value!: {value?: string};

  @Prop({ required: true })
  private kuvatekstiProp!: {};

  @Prop({ required: true })
  private vaihtoehtotekstiProp!: {};

  private imageSaved: boolean = false;
  private imageData: ImageData | null = null;
  private isLoading = true;
  private files: ILiite[] = [];
  private kuvateksti: any = {};
  private vaihtoehtoinenteksti: any = {};

  async mounted() {
    this.kuvateksti = {
      [Kielet.getSisaltoKieli.value]: this.kuvatekstiProp || this.vaihtoehtotekstiProp,
    };

    this.vaihtoehtoinenteksti = {
      [Kielet.getSisaltoKieli.value]: this.vaihtoehtotekstiProp,
    };

    try {
      this.isLoading = true;
      this.files = await this.loader.hae();
    }
    catch (er) {
      throw er;
    }
    finally {
      this.isLoading = false;
    }

    this.$emit('onKuvatekstichange', this.kuvateksti[Kielet.getSisaltoKieli.value]);
    this.$emit('onVaihtoehtoinentekstiChange', this.vaihtoehtoinenteksti[Kielet.getSisaltoKieli.value]);
  }

  get id() {
    return (this as any)._uid;
  }

  get options() {
    return this.files;
  }

  close(save) {
    this.$emit('onClose', save);
  }

  private filterBy(option, label, search) {
    return (option.nimi || '')
      .toLowerCase()
      .indexOf(search.toLowerCase()) > -1;
  }

  private async saveImage() {
    if (this.imageData) {
      const formData = new FormData();
      formData.append('file', this.imageData.file);
      formData.append('nimi', this.imageData.file.name);
      formData.append('width', _.toString(this.imageData.width));
      formData.append('height', _.toString(this.imageData.height));
      try {
        const tallenettuId = await this.loader.api().post(this.loader.endpoint(), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        this.imageSaved = true;
        this.files = await this.loader.hae();
        this.selected = { id: tallenettuId.data };

        (this as any).$success(this.$t('kuva-tallennettu-onnistuneesti'));
      }
      catch (err) {
        (this as any).$fail(this.$t('kuva-lisays-epaonnistui'));
      }
    }
  }

  set selected(liite: any) {
    if (liite) {
      this.$emit('input', liite.id);
      (this as any).$v.$touch();
    }
    else {
      this.$emit('input', null);
    }
  }

  get selected() {
    const it = _.findIndex(this.files, f => f.id === this.value.value);
    if (it >= 0) {
      return this.files[it];
    }
  }

  private onKuvatekstichange(kuvateksti) {
    this.$emit('onKuvatekstichange', kuvateksti[Kielet.getSisaltoKieli.value]);
  }

  private onVaihtoehtoinentekstiChange(vaihtoehtoinenteksti) {
    this.$emit('onVaihtoehtoinentekstiChange', vaihtoehtoinenteksti[Kielet.getSisaltoKieli.value]);
  }

  private peruuta() {
    this.imageData = null;
    this.selected = null;
    this.imageSaved = false;
  }
}

</script>

<style scoped lang="scss">
.imageselector {
  .imgselect {
    margin-bottom: 12px;
  }

  label.uploadbtn {
    width: 100%;
  }

  img.preview-selected {
    width: 100%;
  }

  img.preview {
    width: 40%;
  }

  img.esikatselukuva {
    width: 100%;
    margin-bottom: 10px;
    border: 3px solid #eee;
  }

  input {
    margin-bottom: 10px;
  }

  .buttons {
    width: 100%;
  }

  /deep/ #fileInput {
    display: none;
  }
}
</style>
