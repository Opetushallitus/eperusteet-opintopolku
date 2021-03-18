<template>
<div>
  <ep-header :murupolku="murupolku" :koulutustyyppi="koulutustyyppi">
    <template slot="header">
      <div v-if="tiedote">
        {{ $kaanna(tiedote.otsikko) }}
      </div>
      <ep-spinner v-else />
    </template>
    <template slot="subheader">
    <div v-if="tiedote">
      <div class="aikaleima">
        {{ $sd(tiedote.luotu) }}
      </div>
    </div>
    <ep-spinner v-else />
    </template>
    <div v-if="tiedote" class="tiedote">
      <div class="mb-4" v-if="perusteRoutes.length > 0">
        {{$t('katso-peruste')}}:
        <span class="peruste" v-for="(peruste, index) in perusteRoutes" :key="'peruste'+peruste.id">
          <span v-if="index > 0">, </span>
          <router-link :to="peruste.route">{{$kaanna(peruste.nimi)}}</router-link>
        </span>
      </div>

      <div class="sisalto">
        <ep-content-viewer :value="$kaanna(tiedote.sisalto)"/>
      </div>
    </div>
    <ep-spinner v-else />
  </ep-header>
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Prop, Component, Vue } from 'vue-property-decorator';
import { TiedoteStore } from '@/stores/TiedoteStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpSearch from '@shared/components/forms/EpSearch.vue';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { Meta } from '@shared/utils/decorators';
import { koulutustyyppiStateName } from '@shared/utils/perusteet';

@Component({
  components: {
    EpSpinner,
    EpHeader,
    EpSearch,
    EpContentViewer,
  },
})
export default class RouteUutinen extends Vue {
  @Prop({ required: true })
  private tiedoteStore!: TiedoteStore;
  private page = 1;
  private query = '';

  mounted() {
    if (this.$route) {
      this.tiedoteStore.fetchUutinen(_.parseInt(this.$route.params.tiedoteId));
    }
  }

  get tiedote() {
    return this.tiedoteStore.tiedote;
  }

  get perusteet() {
    return this.tiedoteStore.tiedote?.perusteet;
  }

  get perusteRoutes() {
    return _.map(this.perusteet, peruste => {
      return {
        ...peruste,
        route: {
          name: 'peruste',
          params: {
            perusteId: peruste.id,
            koulutustyyppi: koulutustyyppiStateName(peruste.koulutustyyppi!),
          },
        },
      };
    });
  }

  get koulutustyyppi() {
    if (this.tiedote && this.tiedote.peruste) {
      return this.tiedote.peruste.koulutustyyppi;
    }
  }

  get murupolku() {
    const murut = [{
      label: 'ajankohtaista',
      location: {
        name: 'uutiset',
      },
    }];

    if (this.tiedote) {
      murut.push({
        label: this.tiedote.otsikko,
        location: {
          name: 'uutinen',
          params: {
            tiedoteId: this.tiedote.id,
          },
        },
      } as any);
    }

    return murut;
  }

  @Meta
  getMetaInfo() {
    if (this.tiedote) {
      return {
        title: (this as any).$kaanna(this.tiedote.otsikko),
      };
    }
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
@import '@shared/styles/_mixins.scss';

.aikaleima {
  font-weight: bold;
  font-size: small;
}

.tiedote {
  padding-left: 15px;
  padding-right: 15px;

  .sisalto {
    @include teksti-sisalto;
  }
}
</style>
