<template>
  <div>
    <EpButton v-b-modal.arkistoidutModal variant="link" icon="folder">
      <slot name="title"><span>{{ $t('arkistoidut') }}</span></slot>
    </EpButton>
    <b-modal
      ref="arkistoidutModal"
      id="arkistoidutModal"
      size="lg"
      :hide-footer="true">
      <div slot="modal-title">{{ $t('arkistoidut') + ' (' + arkistoidut.length + ')' }}</div>
      <div class="search">
        <EpSearch v-model="query" />
      </div>
      <b-table
        responsive
        borderless
        striped
        :items="arkistoidutSortedFiltered"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage">
        <template #cell(nimi)="data">
          {{ $kaanna(data.value) }}
        </template>
        <template #cell(muokattu)="data">
          {{ $sdt(data.value) }}
        </template>
        <template #cell(siirtyminen)="data">
          <slot name="palauta" :data="data"></slot>
        </template>
      </b-table>
      <b-pagination
        v-model="currentPage"
        :total-rows="arkistoidutSortedFiltered.length"
        :per-page="perPage"
        aria-controls="arkistoidut"
        align="center">
      </b-pagination>
    </b-modal>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Prop, Component, Vue } from 'vue-property-decorator';

import { Kielet } from '@shared/stores/kieli';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

interface Palautettava {
  nimi: any;
  muokattu: any;
}

@Component({
  components: {
    EpButton,
    EpSearch,
    EpMaterialIcon,
  },
})
export default class EpArkistoidutModal extends Vue {
  @Prop()
  private arkistoidut!: Palautettava[];

  private query = '';
  private currentPage = 1;
  private perPage = 10;

  get arkistoidutSortedFiltered() {
    return _.chain(this.arkistoidut)
      .filter(arkistoitu => Kielet.search(this.query, arkistoitu.nimi))
      .orderBy('muokattu', 'desc')
      .value();
  }

  get fields() {
    return [{
      key: 'nimi',
      label: this.$t('nimi'),
    }, {
      key: 'muokattu',
      label: this.$t('poistettu'),
      sortable: true,
    }, {
      key: 'siirtyminen',
      label: '',
    }];
  }
}
</script>

<style lang="scss" scoped>
::v-deep .b-table.table-borderless thead th {
  border: none;
}
</style>
