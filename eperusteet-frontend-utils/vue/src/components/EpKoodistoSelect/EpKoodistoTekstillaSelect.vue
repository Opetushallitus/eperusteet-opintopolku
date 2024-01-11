<template>
  <div v-if="koodit">

    <div v-for="(koodi, index) in innerModel" :key="'lao'+index" class="mb-4">

      <div class="d-flex w-100 justify-content-between align-items-center" v-if="kooditByUri[koodi.koodiUri]">
        <div class="font-weight-bold">{{$kaanna(kooditByUri[koodi.koodiUri].nimi)}}</div>
        <div v-if="isEditing">
          <ep-button variant="link" icon="delete" @click="poistaKoodi(koodi)">
            {{ $t('poista') }}
          </ep-button>
        </div>
      </div>

      <slot name="lisateksti" :item="koodi"/>

      <EpContent
          v-model="koodi[tekstiField]"
          layout="normal"
          :is-editable="isEditing"
          :kuvaHandler="kuvaHandler"/>
    </div>

    <b-dropdown v-if="isEditing" variant="primary" class="mb-4">
      <span slot="button-content">
        <slot name="default">Painike puuttuu</slot>
      </span>
      <b-dropdown-item-button
        @click="addKoodi(koodi)"
        v-for="(koodi, index) in koodit"
        :key="index+'addKoodiTekstilla'">
        {{ $kaanna(koodi.nimi) }}
      </b-dropdown-item-button>
    </b-dropdown>
  </div>

</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpButton from '../EpButton/EpButton.vue';
import { KoodistoSelectStore } from './KoodistoSelectStore';
import _ from 'lodash';
import EpKoodistoSelect from '@shared/components/EpKoodistoSelect/EpKoodistoSelect.vue';
import EpContent from '@shared/components/EpContent/EpContent.vue';

@Component({
  components: {
    EpButton,
    EpKoodistoSelect,
    EpContent,
  },
})
export default class EpKoodistoTekstillaSelect extends Vue {
  @Prop({ required: true })
  private value!: any[];

  @Prop({ required: true })
  private store!: KoodistoSelectStore;

  @Prop({ default: false })
  private isEditing!: boolean;

  @Prop({ default: false })
  private kuvaHandler!: any;

  @Prop({ required: false, default: 'teksti' })
  private tekstiField!: string;

  async mounted() {
    await this.store.query();
  }

  get innerModel() {
    return this.value;
  }

  set innerModel(innerModel) {
    this.$emit('input', innerModel);
  }

  addKoodi(koodi) {
    this.innerModel = [
      ...this.innerModel,
      {
        koodiUri: koodi.koodiUri,
        [this.tekstiField]: null,
      },
    ];
  }

  poistaKoodi(poistettava) {
    this.innerModel = _.filter(this.innerModel, koodi => koodi.koodiUri !== poistettava.koodiUri);
  }

  get koodit() {
    return _(this.store?.data.value?.data)
      .map(koodi => {
        const nimi = _.mapValues(_.keyBy(koodi.metadata, v => _.toLower(v.kieli)), v => v.nimi);
        return {
          ...koodi,
          nimi,
        };
      })
      .value();
  }

  get kooditByUri() {
    return _.keyBy(this.koodit, 'koodiUri');
  }
}
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

</style>
