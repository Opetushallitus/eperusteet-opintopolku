<template>
<div class="paikalliset">
  <h2 class="otsikko">{{ $t('paikalliset-opetussuunnitelmat') }}</h2>

  <div class="peruste-nav">
    <div class="d-flex">
      <div class="peruste" v-for="(peruste, idx) in perusteet" :key="idx">
        <div class="peruste-select" :class="{ active: activePeruste === peruste.id}">
          <button class="btn btn-link" @click="setActivePeruste(peruste)">
            {{ $kaanna(peruste.nimi) }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="opetussuunnitelma" v-for="(ops, idx) in opetussuunnitelmat" :key="idx">
    <div class="d-flex align-items-center">
      <div class="opsicon-wrapper">
        <div class="opsicon"></div>
      </div>
      <div class="nimi flex-fill">
        <div class="ops">
          <router-link :to="{ name: 'ops', params: { 'opsId': ops.id } }">
            {{ $kaanna(ops.nimi) }}
          </router-link>
        </div>
        <div class="organisaatiot">
          <div v-if="ops.toimijat.length > 0">
            <span class="otsikko">{{ $t('toimijat') }}</span>
            <span class="mr-1">:</span>
            <span class="toimijat" v-for="(toimija, tidx) in ops.toimijat" :key="tidx">
              {{ $kaanna(toimija.nimi) }}<span v-if="tidx < ops.toimijat.length - 1">, </span>
            </span>
          </div>
          <div v-if="ops.oppilaitokset.length > 0">
            <span class="otsikko">{{ $t('oppilaitokset') }}</span>
            <span class="mr-1">:</span>
            <span class="toimijat" v-for="(oppilaitos, tidx) in ops.oppilaitokset" :key="tidx">
              {{ $kaanna(oppilaitos.nimi) }}<span v-if="tidx < ops.oppilaitokset.length - 1">, </span>
            </span>
          </div>
        </div>
      </div>
      <div class="perusteen-nimi">
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Watch, Component, Vue, Prop } from 'vue-property-decorator';
import { PerusteKoosteStore } from '@/stores/PerusteKoosteStore';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import _ from 'lodash';

@Component({
  components: {
    EpSpinner,
    EpHeader,
  },
})
export default class RouteKooste extends Vue {
  @Prop({ required: true })
  private perusteKoosteStore!: PerusteKoosteStore;

  get activePeruste() {
    return this.perusteKoosteStore.perusteId;
  }

  setActivePeruste(peruste) {
    console.log(peruste);
    this.perusteKoosteStore.perusteId = peruste.id;
  }

  get perusteet() {
    return this.perusteKoosteStore.perusteet;
  }

  get opetussuunnitelmat() {
    return _.chain(this.perusteKoosteStore.opetussuunnitelmat)
      .map(ops => ({
        ...ops,
        toimijat: _.filter(ops.organisaatiot, org =>
          _.includes(org.tyypit, 'Koulutustoimija')),
        oppilaitokset: _.filter(ops.organisaatiot, org =>
          _.includes(org.tyypit, 'Oppilaitos')),
      }))
      .value();
  }

}
</script>

<style scoped lang="scss">
@import '../../styles/_variables.scss';

.paikalliset {
  margin: 0 10px 10px 10px;
  margin-top: 31px;

  h2.otsikko {
    font-weight: bolder;
    margin-bottom: 43px;
  }

  .peruste-nav {
    margin-bottom: 8px;

    .peruste {
      .peruste-select {
        margin: 8px;
        button {
          font-weight: bold;
          color: #575757;
        }

        &.active {
          border-bottom: #0143da 5px solid;
          button {
            color: #0143da;
          }
        }
      }
    }
  }

  .opetussuunnitelma {
    border: 1px solid #DADADA;
    border-radius: 2px;
    min-height: 80px;
    margin-bottom: 10px;

    .opsicon-wrapper {
      padding: 20px 25px 20px 25px;

      .opsicon {
        height: 40px;
        width: 40px;
        background: url('../../../public/img/icons/opskortti.svg');
        background-size: 40px 40px;
      }
    }

    .nimi {
      padding: 0px;

      .ops {
        margin-bottom: 8px;
      }
    }

    .perusteen-nimi {
      padding: 20px;
    }

    .organisaatiot {
      .toimijat {
        color: #555;
        font-size: smaller;
      }

      .otsikko {
        color: #2B2B2B;
        font-size: smaller;
      }
    }
  }
}

</style>

