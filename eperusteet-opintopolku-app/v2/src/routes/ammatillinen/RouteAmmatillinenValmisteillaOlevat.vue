<template>
  <div>
    <slot />
    <p class="kuvaus">{{ $t('kooste-kuvaus-valmisteilla-olevat-perusteet') }}</p>

    <ep-spinner v-if="!perusteet"/>
    <template v-else>

      <div class="valmisteilla-row m-2" v-for="peruste in perusteetMapped" :key="'peruste'+peruste.id">
        <div class="d-flex m-2">
          <div class="valmisteilla-data pl-2">
            <div class="nimi">{{ $kaanna(peruste.nimi) }}</div>
            <div class="d-flex">
              <div class="voimaantulo pr-1" v-if="peruste.voimassaoloAlkaa">
                {{$t('peruste-astuu-voimaan')}} {{ $sd(peruste.voimassaoloAlkaa) }}.
              </div>
              <div @click="toggle(peruste)">
                <div class="avaa-link btn-link" v-if="peruste.toggled">{{$t('piilota-aikataulu')}}</div>
                <div class="avaa-link btn-link" v-else>{{$t('nayta-aikataulu')}}</div>
              </div>
            </div>
          </div>
          <div class="ml-auto align-self-start">
            <EpMaterialIcon v-if="peruste.toggled">expand_less</EpMaterialIcon>
            <EpMaterialIcon v-else>expand_more</EpMaterialIcon>
          </div>
        </div>

        <div class="footer mt-3 ml-3 mr-3" v-if="peruste.toggled">
          <div v-for="(aikataulu, index) in peruste.perusteenAikataulut" :key="'aikataulu'+aikataulu.id" class="row perusteen-aikataulu">

            <div class="col col-auto center-block mb-4 pl-4 pr-0">
              <div class="paiva d-inline-block text-center">
                {{$sdm(aikataulu.tapahtumapaiva)}}
              </div>
              <div class="aikajana" v-if="index != peruste.perusteenAikataulut.length - 1">&nbsp;</div>
            </div>

            <div class="col pl-4">
              <div class="aikataulu px-3 py-2 mb-3">
                <div class="tavoite">{{$kaanna(aikataulu.tavoite)}}</div>
                <div class="voimaantulo">{{$sd(aikataulu.tapahtumapaiva)}}</div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <EpBPagination v-model="page"
                     :items-per-page="perPage"
                     :total="total"
                     aria-controls="perusteet-lista">
      </EpBPagination>
    </template>

  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { ValmisteillaOlevatStore } from '@/stores/ValmisteillaOlevatStore';
import { AmmatillisetKoulutustyypit } from '@shared/utils/perusteet';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpBPagination from '@shared/components/EpBPagination/EpBPagination.vue';
import EpMaterialIcon from '@shared/components//EpMaterialIcon/EpMaterialIcon.vue';
import * as _ from 'lodash';

@Component({
  components: {
    EpSpinner,
    EpBPagination,
    EpMaterialIcon,
  },
})
export default class RouteAmmatillinenValmisteillaOlevat extends Vue {
  @Prop({ required: true })
  private valmisteillaOlevatStore!: ValmisteillaOlevatStore;
  private query = {
    sivu: 0,
    sivukoko: 10,
    koulutustyyppit: AmmatillisetKoulutustyypit,
  }
  private toggled: number[]= [];

  async mounted() {
    await this.fetch();
  }

  async fetch() {
    await this.valmisteillaOlevatStore.fetch(this.query.sivu, this.query.sivukoko, this.query.koulutustyyppit);
  }

  @Watch('query')
  onQueryChanged() {
    this.page = 1;
  }

  get perusteet() {
    return this.valmisteillaOlevatStore.perusteet.value;
  }

  get perusteetMapped() {
    return _.map(this.perusteet!.data, peruste => {
      return {
        ...peruste,
        toggled: _.includes(this.toggled, peruste.id),
        perusteenAikataulut: _.sortBy(_.filter(peruste.perusteenAikataulut, 'julkinen'), 'tapahtumapaiva'),
      };
    });
  }

  toggle(peruste) {
    if (_.includes(this.toggled, peruste.id)) {
      this.toggled = _.filter(this.toggled, id => id !== peruste.id);
    }
    else {
      this.toggled = [
        ...this.toggled,
        peruste.id,
      ];
    }
  }

  get total() {
    return this.perusteet!.kokonaismäärä;
  }
  get pages() {
    return this.perusteet!.sivuja;
  }
  get perPage() {
    return this.perusteet!.sivukoko;
  }

  get page() {
    return this.perusteet!.sivu + 1;
  }
  set page(value) {
    this.query.sivu = value - 1;
    this.fetch();
  }
}
</script>

<style scoped lang="scss">

@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.kuvaus {
  font-size: small;
  color: $black;
}

.valmisteilla-row {
  border-radius: 0;
  border: 1px solid rgb(232, 232, 233);

  .valmisteilla-data {
    border-left: 3px solid $green-lighten-2;
  }

  .avaa-link {
    font-size: 0.8rem;
  }
}

.nimi {
  font-size: normal;
  font-weight: bolder;
  margin-bottom: 8px;
}

.voimaantulo {
  font-size: 0.8rem;
  color: $gray;
}

.aikataulu {
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;

  .tavoite {
    font-size: 0.9rem;
    font-weight: 600;
  }
}

.paiva {
  font-size: 0.6rem;
  width:45px;
  border-radius: 30px;
  padding: 10px;
  box-shadow: 1px 1px 5px 0 rgba(0,26,88,0.1);
  z-index: 15;
  background-color: #fff;
  color: $black;
}

.aikajana {
  z-index: 10;
  height: 100%;
  background: linear-gradient($gray-lighten-4, $gray-lighten-4) no-repeat center/2px 100%;
}
</style>
