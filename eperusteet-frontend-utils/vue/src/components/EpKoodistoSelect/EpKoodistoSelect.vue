<template>
  <div v-if="isEditing">
    <slot name="default" :open="openDialog">
      <div class="bg-danger">Painike puuttuu</div>
    </slot>
    <b-modal id="koodistoModal"
            ref="editModal"
            size="xl"
            :ok-title="multiselect ? $t('lisaa-valitut') : $t('lisaa-valittu')"
            :cancel-title="$t('peruuta')"
            @ok="lisaaValitut"
            :ok-disabled="innerModel.length === 0"
            @hidden="alusta">
      <template #modal-header>
        <slot name="header">
          <h2>{{ $t('hae-koodistosta') }} ({{koodisto}})</h2>
        </slot>
      </template>

      <template #default>
        <div class="d-flex flex-row align-items-center">
          <div class="flex-grow-1">
            <ep-search v-model="query"></ep-search>
            <ep-toggle class="pt-3 pl-1" v-model="vanhentuneet" :isSWitch="false">{{$t('nayta-myos-vanhentuneet')}}</ep-toggle>
          </div>
          <div>
            <ep-spinner v-if="isLoading" />
          </div>
        </div>
        <div v-if="items">
          <b-table
            ref="koodistoTable"
            responsive
            borderless
            striped
            fixed
            hover
            :items="items"
            :fields="fields"
            :selectable="true"
            @row-selected="onRowSelected"
            select-mode="single"
            selected-variant=''>

            <template v-slot:cell(nimi)="{ item }">
              <span v-if="multiple">
                <EpMaterialIcon v-if="item.selected" class="checked mr-2" size="20px">check_box</EpMaterialIcon>
                <EpMaterialIcon v-else class="checked mr-2" size="20px">check_box_outline_blank</EpMaterialIcon>
              </span>
              <span class="btn-link">
                {{ $kaanna(item.nimi) }}
              </span>
            </template>

            <template v-slot:cell(arvo)="{ item }">
              <span class="font-weight-bold">
                {{ item.koodiArvo }}
              </span>
            </template>

            <template v-slot:cell(versio)="{ item }">
              {{ item.versio }}
            </template>

            <template v-slot:cell(voimaantulo)="{ item }">
              {{ $sd(item.voimassaAlkuPvm) }}
            </template>

            <template v-slot:cell(paattyminen)="{ item }">
              <span v-if="item.voimassaLoppuPvm">{{ $ago(item.voimassaLoppuPvm) }}</span>
            </template>

          </b-table>

          <b-pagination
            v-if="raw"
            v-model="sivu"
            :total-rows="raw.kokonaismäärä"
            :per-page="raw.sivukoko"
            aria-controls="koodistot"
            align="center" />

          <div v-if="multiselect && innerModel.length > 0">
            <h4>{{$t('valittu')}} {{innerModel.length}} {{$t('kpl')}}</h4>
            <div v-for="(koodi, index) in innerModel" :key="'valitut'+index">
              {{ $kaanna(koodi.nimi) }}
            </div>
          </div>

        </div>
        <ep-spinner v-else />
      </template>
    </b-modal>
  </div>
  <div v-else-if="value && value.arvo">
    {{ $kaanna(value.nimi) }} <span v-if="naytaArvo">{{ value.arvo }}</span>
  </div>
  <div class="font-italic" v-else>
    <slot name="empty">{{ $t('ei-asetettu') }}</slot>
  </div>
</template>

<script lang="ts">
import { Vue, Watch, Component, Prop } from 'vue-property-decorator';
import EpButton from '../EpButton/EpButton.vue';
import EpToggle from '../forms/EpToggle.vue';
import EpSearch from '../forms/EpSearch.vue';
import EpSpinner from '../EpSpinner/EpSpinner.vue';
import { KoodistoSelectStore } from './KoodistoSelectStore';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import _ from 'lodash';

@Component({
  components: {
    EpButton,
    EpSearch,
    EpSpinner,
    EpToggle,
    EpMaterialIcon,
  },
})
export default class EpKoodistoSelect extends Vue {
  @Prop({ default: null })
  private value!: any;

  @Prop({ required: true })
  private store!: KoodistoSelectStore;

  @Prop({ default: true })
  private isEditing!: boolean;

  @Prop({ required: false, default: false, type: Boolean })
  private multiple!: boolean;

  @Prop({ required: false, default: true, type: Boolean })
  private naytaArvo!: boolean;

  @Prop({ required: false, default: () => ['nimi', 'arvo', 'voimaantulo'] })
  private defaultFields!: string[];

  @Prop({ required: false })
  private additionalFields!: any[];

  private isLoading = false;
  private query = '';
  private vanhentuneet = false;
  private innerModel: any[] = [];

  get selectedUris() {
    return _.map(this.innerModel, 'uri');
  }

  get raw() {
    if (!this.store) {
      return null;
    }
    return this.store.data.value;
  }

  get items() {
    if (!this.raw) {
      return null;
    }

    return _(this.raw?.data)
      .map(x => {
        const nimi = _.mapValues(_.keyBy(x.metadata, v => _.toLower(v.kieli)), v => v.nimi);
        const kuvaus = _.mapValues(_.keyBy(x.metadata, v => _.toLower(v.kieli)), v => v.kuvaus);
        return {
          ...x,
          nimi,
          kuvaus,
          selected: _.includes(this.selectedUris, x.koodiUri),
        };
      })
      .value();
  }

  get sivu() {
    if (!this.raw) {
      return 1;
    }
    return this.raw.sivu + 1;
  }

  set sivu(value: number) {
    this.store.query(this.query, value - 1);
  }

  @Watch('query')
  async onQueryChange(newValue) {
    await this.initStoreQuery(newValue, this.sivu - 1, this.vanhentuneet);
  }

  @Watch('vanhentuneet')
  async onVanhentuneetChange(newValue) {
    await this.initStoreQuery(this.query, this.sivu - 1, newValue);
  }

  async initStoreQuery(query, sivu, vanhentuneet) {
    this.isLoading = true;
    await this.store.query(query, sivu, !vanhentuneet);
    this.isLoading = false;
  }

  openDialog() {
    (this.$refs.editModal as any).show();
    this.onQueryChange('');
  }

  get multiselect() {
    return _.isArray(this.value) || this.multiple;
  }

  onRowSelected(items) {
    if (!_.isEmpty(items)) {
      const row = {
        uri: items[0].koodiUri,
        arvo: items[0].koodiArvo,
        nimi: items[0].nimi,
        versio: items[0].versio,
        koodisto: items[0].koodisto?.koodistoUri || items[0].koodisto,
        ..._.pick(items[0], _.map(this.additionalFields, 'key')),
      };

      if (!this.multiselect) {
        this.$emit('input', row);
        this.$emit('add', row, this.value);
        (this.$refs.editModal as any).hide();
      }
      else {
        if (_.includes(this.selectedUris, row.uri)) {
          this.innerModel = _.filter(this.innerModel, koodi => koodi.uri !== row.uri);
        }
        else {
          this.innerModel = [
            ...this.innerModel,
            row,
          ];
        }
      }
    }
  }

  lisaaValitut() {
    if (this.multiselect) {
      this.$emit('input', this.innerModel);
      this.$emit('add', this.innerModel);
    }
  }

  alusta() {
    this.innerModel = [];
  }

  get fields() {
    return [
      ..._.filter([{
        key: 'nimi',
        label: this.$t('nimi'),
      }, {
        key: 'arvo',
        label: this.$t('arvo'),
        thStyle: { width: '6rem' },
      }, {
        key: 'voimaantulo',
        label: this.$t('voimaantulo'),
        thStyle: { width: '10rem' },
      }], field => _.includes(this.defaultFields, field.key)),
      ...(this.additionalFields ? this.additionalFields : []),
    ];
  }

  get koodisto() {
    return this.store.koodisto.value;
  }
}
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

  .checked {
    color: $paletti-blue;
  }
</style>
