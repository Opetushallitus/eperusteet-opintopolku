<template>
  <b-table responsive
           striped
           hover
           :items="items"
           :fields="fields">
    <template v-slot:cell(nimi)="data">
      {{ $kaanna(data.value) }}
    </template>
    <template v-slot:cell(muokattu)="data">
      {{ $ago(data.value) }}
    </template>
    <template v-slot:cell(actions)="row">
      <ep-button variant="link"
                 icon="keyboard_return"
                 @click="palauta(row.item)"
                 :showSpinner="isPalautettu(row.item)">
        {{ $t('palauta') }}
      </ep-button>
    </template>
  </b-table>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import Poistettu from './PoistetutHakuTable.vue';
import EpSpinnerInline from '@shared/components/EpSpinner/EpSpinnerInline.vue';
import _ from 'lodash';

@Component({
  components: {
    EpButton,
    EpSpinnerInline,
  },
})
export default class PoistettuTable extends Vue {
  @Prop({ required: true })
  private poistetut!: Poistettu[];

  palautettu: Poistettu[] = [];

  get items() {
    return this.poistetut;
  }

  get fields() {
    return [{
      label: this.$t('nimi'),
      key: 'nimi',
      sortable: true,
      class: 'align-middle',
    }, {
      label: this.$t('poistoajankohta'),
      key: 'muokattu',
      sortable: true,
      class: 'align-middle',
    }, {
      label: this.$t('poistaja'),
      key: 'muokkaaja',
      sortable: true,
      class: 'align-middle',
    }, {
      key: 'actions',
      label: '',
      thStyle: { borderBottom: '0px' },
      class: 'align-middle',
    }];
  }

  isPalautettu(item) {
    return _.includes(this.palautettu, item);
  }

  palauta(poistettu) {
    this.palautettu = [...this.palautettu, poistettu];
    this.$emit('palauta', poistettu);
  }
}

</script>
