<template>
  <div>
    <template v-if="isEditing">
      <draggable
        v-bind="defaultDragOptions"
        tag="div"
        v-model="innerModel">
        <div v-for="(model, i) in innerModel" :key="group+i" class="pt-3 pb-2 px-3 mb-2 jarjestaja">
          <div class="d-flex">
            <div class="order-handle mr-3 pt-1" slot="left">
              <EpMaterialIcon>drag_indicator</EpMaterialIcon>
            </div>
            <div class="w-100">

              <b-input-group :label="$t('organisaation-nimi')" class="mb-4">
                <b-form-input :value="$kaanna(model.nimi)" :disabled="true"></b-form-input>
                <b-input-group-append>
                  <b-button @click="open(i)" variant="primary">
                    {{ $t('hae-organisaatio') }}
                  </b-button>
                </b-input-group-append>
              </b-input-group>

              <b-form-group :label="$t('linkki-toteutussuunnitelmaan-tai-koulutuksen-jarjestajan-kotisivuille')" class="mb-4">
                <ep-input
                  v-model="model.url"
                  :is-editing="isEditing"/>
              </b-form-group>

              <b-form-group :label="$t('kaytannon-toteutus')" class="mb-0">
                <ep-content
                  layout="normal"
                  v-model="model.kuvaus"
                  :is-editable="isEditing"
                  :kuvaHandler="kuvaHandler"/>
              </b-form-group>
            </div>
          </div>

          <div class="text-right">
            <ep-button variant="link" icon="delete" @click="poista(i)">
              {{ $t('poista-koulutuksen-jarjestaja') }}
            </ep-button>
          </div>
        </div>
      </draggable>
      <EpButton v-if="isEditing"
                variant="outline"
                icon="add"
                @click="lisaa()">
        <slot name="default">{{ $t('lisaa-koulutuksen-jarjestaja') }}</slot>
      </EpButton>

      <b-modal id="koulutuksenjarjestajaModal"
            ref="editModal"
            size="xl"
            :ok-title="$t('peruuta')"
            :ok-only="true">
        <template #modal-header>
          <h2>{{ $t('valitse-koulutuksen-jarjestaja') }}</h2>
        </template>

        <template #default>
          <ep-spinner v-if="!koulutuksenJarjestajat" />
          <template v-else>
            <div class="d-flex flex-row align-items-center">
              <div class="flex-grow-1">
                <ep-search v-model="query"></ep-search>
              </div>
            </div>
            <div v-if="items">
              <b-table
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
                  <span class="btn-link">
                    {{ $kaanna(item.nimi) }}
                  </span>
                </template>

              </b-table>

              <b-pagination
                v-model="sivu"
                :total-rows="kokonaismaara"
                :per-page="10"
                aria-controls="koodistot"
                align="center" />

            </div>
          </template>
        </template>
      </b-modal>

    </template>
    <template v-else-if="innerModel.length > 0">
      <div v-for="(model, i) in innerModel" :key="group+i" class="pt-3 pb-2 px-3 mb-2 jarjestaja">

        <h3>{{$kaanna(model.nimi)}}</h3>
         <b-form-group :label="$t('toteutussuunnitelman-tai-koulutuksen-jarjestajan-verkkosivut')" class="mb-4">
          <EpLinkki :url="model.url[kieli]" />
        </b-form-group>

        <b-form-group :label="$t('kaytannon-toteutus')" class="mb-0">
          <slot name="kuvaus" v-bind="{ model }">
            <ep-content
              layout="normal"
              v-model="model.kuvaus"
              :is-editable="isEditing"
              :kuvaHandler="kuvaHandler"/>
          </slot>
        </b-form-group>

      </div>
    </template>
  </div>

</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import _ from 'lodash';
import EpInput from '@shared/components/forms/EpInput.vue';
import draggable from 'vuedraggable';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import { Koulutustoimijat, KoulutuksenJarjestajaDto } from '@shared/api/amosaa';
import { Kielet } from '@shared/stores/kieli';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpContent from '@shared/components/EpContent/EpContent.vue';
import EpLinkki from '@shared/components/EpLinkki/EpLinkki.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpButton,
    EpInput,
    draggable,
    EpSearch,
    EpContent,
    EpLinkki,
    EpMaterialIcon,
  },
})
export default class EpKoulutuksenJarjestajaSelect extends Vue {
  @Prop({ required: true })
  private value!: KoulutuksenJarjestajaDto[];

  @Prop({ default: false })
  private isEditing!: boolean;

  @Prop({ required: false, default: 'koulutuksenjarjestajaSort' })
  private group!: string;

  @Prop({ default: false })
  private kuvaHandler!: any;

  private query = '';
  private koulutuksenJarjestajat: any[] | null = null;
  private sivu = 1;
  private valittuIndex = -1;

  async mounted() {
    this.koulutuksenJarjestajat = (await Koulutustoimijat.getKoulutuksenJarjestajat()).data;
  }

  get innerModel() {
    return this.value;
  }

  set innerModel(innerModel) {
    this.$emit('input', innerModel);
  }

  open(i) {
    (this.$refs.editModal as any).show();
    this.valittuIndex = i;
  }

  onRowSelected(row) {
    this.innerModel.splice(this.valittuIndex, 1, {
      ...this.innerModel[this.valittuIndex],
      nimi: row[0].nimi,
    });

    (this.$refs.editModal as any).hide();
  }

  lisaa() {
    this.innerModel = [
      ...this.innerModel,
      {},
    ];
  }

  get kieli() {
    return Kielet.getSisaltoKieli.value;
  }

  poista(poistettavaIndex) {
    this.innerModel = _.filter(this.innerModel, (teksti, index) => index !== poistettavaIndex);
  }

  get defaultDragOptions() {
    return {
      animation: 300,
      emptyInsertThreshold: 10,
      handle: '.order-handle',
      disabled: !this.isEditing,
      ghostClass: 'dragged',
      group: {
        name: this.group,
      },
    };
  }

  get koulutuksenjarjestajatSorted() {
    return _.chain(this.koulutuksenJarjestajat)
      .filter(kt => _.includes(_.toLower(kt['nimi'][Kielet.getSisaltoKieli.value]), _.toLower(this.query)))
      .sortBy(kt => kt['nimi'][Kielet.getSisaltoKieli.value])
      .value();
  }

  get items() {
    return _.slice(this.koulutuksenjarjestajatSorted, (this.sivu - 1) * 10, ((this.sivu - 1) * 10) + 10);
  }

  get kokonaismaara() {
    return _.size(this.koulutuksenjarjestajatSorted);
  }

  get fields() {
    return [
      {
        key: 'nimi',
        label: this.$t('nimi'),
      },
    ];
  }
}
</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

  .jarjestaja {
    border: 1px solid $gray-lighten-8;
    border-radius: 3px;
  }

</style>
