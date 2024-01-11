<template>
  <div>
    <slot name="header"></slot>

    <b-table
      v-if="value && value.length > 0"
      responsive
      borderless
      striped
      fixed
      hover
      :items="value"
      :fields="fields"
      :selectable="true"
      select-mode="single"
      selected-variant=''>

      <template v-slot:cell(nimi)="{ item }">
        <span>
          {{ $kaanna(item.nimi) }}
        </span>
      </template>

      <template v-slot:cell(poisto)="{ item }" v-if="isEditing">
        <ep-button variant="link" icon="delete" @click="remove(item)" />
      </template>

    </b-table>

    <ep-koodisto-select v-if="isEditing"
      :store="store"
      v-model="koodi"
      :is-editing="isEditing"
      :naytaArvo="false"
      :multiple="true"
      :defaultFields="koodistoSelectDefaultFields">
      <template #default="{ open }">
        <ep-button @click="open" icon="add" variant="outline">
          <slot name="button-text">lisaa-koodi</slot>
        </ep-button>

      </template>

      <span slot="empty"></span>
    </ep-koodisto-select>

  </div>

</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpButton from '../EpButton/EpButton.vue';
import { KoodistoSelectStore } from './KoodistoSelectStore';
import EpKoodistoSelect from '@shared/components/EpKoodistoSelect/EpKoodistoSelect.vue';

@Component({
  components: {
    EpButton,
    EpKoodistoSelect,
  },
})
export default class EpKoodistoSelectTable extends Vue {
  @Prop({ default: null })
  private value!: any;

  @Prop({ default: true })
  private isEditing!: boolean;

  @Prop({ default: true })
  private showKoodiArvo!: boolean;

  @Prop({ required: true })
  private store!: KoodistoSelectStore;

  get koodi() {
    return this.value;
  }

  set koodi(koodi) {
    this.$emit('input', koodi);
  }

  remove(koodi) {
    this.$emit('remove', koodi);
  }

  get koodistoSelectDefaultFields() {
    return this.showKoodiArvo ? ['nimi', 'arvo'] : ['nimi'];
  }

  get fields() {
    return [{
      key: 'nimi',
      label: this.$t('nimi'),
    },
    ...(this.showKoodiArvo
      ? [
        {
          key: 'arvo',
          label: this.$t('koodi'),
          thStyle: { width: '10rem' },
        },
      ] : []),
    {
      key: 'poisto',
      label: '',
      thStyle: { width: '5rem' },
    }];
  }
}
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

</style>
