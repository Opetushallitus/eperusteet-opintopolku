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

      <div class="sisalto pb-4">
        <ep-content-viewer :value="$kaanna(tiedote.sisalto)"/>
      </div>

      <div
        class="tiedote-lisainfo p-3"
        v-if="tiedoteMapped.perusteet.length > 0 || tiedoteMapped.tutkinnonosat.length > 0 || tiedoteMapped.osaamisalat.length > 0">

        <h3>{{$t('tiedotteeseen-liittyy')}}</h3>

        <div class="mt-4" v-if="tiedoteMapped.perusteet.length > 0">
          <h4>{{$t('perusteet')}}</h4>
          <span class="peruste" v-for="(peruste, index) in tiedoteMapped.perusteet" :key="'peruste'+peruste.id">
            <span v-if="index > 0">, </span>
            <router-link :to="peruste.route">{{$kaanna(peruste.nimi)}}</router-link>
          </span>
        </div>

        <ep-spinner v-if="!tutkinnonosienPerusteet" />
        <uutisen-koodit
          v-else
          :kooditPerusteilla="tutkinnonosienPerusteet"
          class="mt-4">
          <h4 slot="header">{{$t('tutkinnonosat')}}</h4>
          <h4 slot="popover-header">{{$t('perusteet-joissa-tutkinnon-osia-on')}}</h4>
        </uutisen-koodit>

        <ep-spinner v-if="!osaamisalojenPerusteet" />
        <uutisen-koodit
          v-else
          :kooditPerusteilla="osaamisalojenPerusteet"
          class="mt-4">
          <h4 slot="header">{{$t('osaamisalat')}}</h4>
          <h4 slot="popover-header">{{$t('perusteet-joissa-osaamisaloja-on')}}</h4>
        </uutisen-koodit>

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
import EpButton from '@shared/components/EpButton/EpButton.vue';
import UutisenKoodit from './UutisenKoodit.vue';

@Component({
  components: {
    EpSpinner,
    EpHeader,
    EpSearch,
    EpContentViewer,
    EpButton,
    UutisenKoodit,
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

  get tiedoteMapped() {
    return {
      ...this.tiedote,
      perusteet: this.perusteRoutes(this.perusteet),
    };
  }

  get perusteet() {
    return this.tiedoteStore.tiedote?.perusteet;
  }

  get osaamisalojenPerusteet() {
    return this.tiedoteStore.tiedotteenOsaamisalaPerusteet;
  }

  get tutkinnonosienPerusteet() {
    return this.tiedoteStore.tiedotteenTutkinnonosaPerusteet;
  }

  perusteRoutes(perusteet) {
    return _.map(perusteet, peruste => {
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

  .tiedote-lisainfo {
    border: 1px solid $gray-lighten-3;
    border-radius: 3px;
  }

}
</style>
