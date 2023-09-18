<template>
  <div>
    <slot />

    <p class="kuvaus">{{ $t('kooste-kuvaus-maaraykset') }}</p>

    <div v-if="!maaraykset">
      <ep-spinner />
    </div>
    <div v-else-if="maaraykset.length === 0">
      {{$t('ei-maarayksia')}}
    </div>
    <div v-else class="haku">
      <div class="search">
        <ep-search v-model="query" :sr-placeholder="$t('etsi-maarayksia')"/>
      </div>
      <div class="content">

        <EpLinkki v-for="(maarays, index) in maarayksetPaged" :key="'maarays' + index" class="maarays" :url="$kaanna(maarays.url)">
          <div class="d-flex sisalto">
            <EpMaterialIcon icon-shape="outlined" :color="'#5BCA13'" size="2rem">picture_as_pdf</EpMaterialIcon>
            <div class="nimi align-self-center" >{{$kaanna(maarays.nimi)}}</div>
          </div>
        </EpLinkki>

        <div class="pagination d-flex justify-content-center" v-if="maaraykset.length > (perPage - 1)">
          <EpBPagination v-model="page"
                         :items-per-page="perPage"
                         :total="total"
                         aria-controls="maaraykset-lista">
          </EpBPagination>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';
import { MaarayksetStore } from '@/stores/MaarayksetStore';
import { Kielet } from '@shared/stores/kieli';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpLinkki from '@shared/components/EpLinkki/EpLinkki.vue';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';
import pdfkuva from '@assets/img/icons/pdfkuva_lataus.svg';

@Component({
  components: {
    EpSpinner,
    EpSearch,
    EpLinkki,
    EpBPagination,
    EpMaterialIcon,
  },
})
export default class RouteAmmatillinenMaaraykset extends Vue {
  @Prop({ required: true })
  private maarayksetStore!: MaarayksetStore;

  private query = '';
  private page = 1;
  private perPage = 20;

  @Watch('query')
  onQueryChanged() {
    this.page = 1;
  }

  get maaraykset() {
    return this.maarayksetStore.maaraykset.value;
  }

  get maarayksetPaged() {
    if (this.maaraykset) {
      return _.chain(this.maaraykset)
        .filter(maarays => Kielet.search(this.query, maarays.nimi))
        .drop(this.perPage * (this.page - 1))
        .take(this.perPage)
        .value();
    }
  }

  get total() {
    return _.size(this.maaraykset);
  }

  get pdfKuva() {
    return pdfkuva;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  margin-top: 20px;

  .maarays {
    border: 1px solid rgb(232, 232, 233);
    border-radius: 5px;
    border-width: 1px;
    margin-bottom: 10px;

    .sisalto {
      padding: 15px;

      .nimi {
        font-weight: 600;
        margin-left: 20px;
        color: $black;
      }
    }
  }

}

.pagination {
  margin-top: 10px;
}

</style>
