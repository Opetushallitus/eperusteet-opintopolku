<template>
<div v-b-modal.epversiomodaali>
  <slot>{{ $t('muokkaushistoria') }}</slot>
  <b-modal id="epversiomodaali"
           ref="epversiomodaali"
           size="lg"
           :title="$t('historia')"
           :hide-footer="true">
    <b-table responsive
             striped
             :items="versionsFormatted"
             :fields="fields"
             :per-page="perPage"
             :current-page="currentPage">
      <template v-slot:cell(actions)="row">
        <div class="float-right">
          <div v-if="!row.item.valittu">
            <ep-button variant="link"
                       icon="visibility"
                       @click="changeVersion(row.item.index)">
              {{ $t('katsele') }}
            </ep-button>
            <ep-button variant="link"
                       icon="keyboard_return"
                       @click="$emit('restore', { numero: row.item.numero, modal: $refs['epversiomodaali'] })">
              {{ $t('palauta') }}
            </ep-button>
          </div>
          <ep-button v-else
                     variant="link"
                     disabled>
            {{ $t('valittu-versio') }}
          </ep-button>
        </div>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      align="center"
      aria-controls="epversiomodaali"></b-pagination>
  </b-modal>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Prop, Component, Mixins } from 'vue-property-decorator';
import { Revision } from '../../tyypit';
import EpButton from '../../components/EpButton/EpButton.vue';
import EpFormContent from '../../components/forms/EpFormContent.vue';
import EpValidation from '../../mixins/EpValidation';
import { parsiEsitysnimi } from '@shared/utils/kayttaja';

@Component({
  components: {
    EpButton,
    EpFormContent,
  },
})
export default class EpVersioModaali extends Mixins(EpValidation) {
  @Prop({ required: true })
  private versions!: Revision[];

  @Prop({ required: true })
  private current!: any;

  @Prop({ required: true })
  private value!: number;

  private currentPage = 1;

  @Prop({ default: 5 })
  private perPage!: number;

  get fields() {
    return [{
      key: 'index',
      label: this.$t('versio'),
    }, {
      key: 'ajankohta',
      label: this.$t('ajankohta'),
    }, {
      key: 'muokkaaja',
      label: this.$t('muokkaaja'),
    }, {
      key: 'actions',
      label: '',
    }];
  }

  get currentIndex() {
    return _.findIndex(this.versions, this.current);
  }

  get versionsFormatted() {
    const versions = _.map(this.versions, (rev) => ({
      ...rev,
      muokkaaja: parsiEsitysnimi(rev.kayttajanTieto) || parsiEsitysnimi(rev),
      ajankohta: rev.pvm ? (this as any).$sdt(rev.pvm) : '-',
      kommentti: rev.kommentti || '-',
      valittu: false,
    }));
    if (versions.length > 0) {
      versions[this.currentIndex].valittu = true;
    }
    return versions;
  }

  changeVersion(versionumero) {
    this.$router.push({ query: { versionumero } }).catch(() => {});
  };

  get rows() {
    return this.versionsFormatted.length;
  }
}

</script>

<style scoped lang="scss">
</style>
