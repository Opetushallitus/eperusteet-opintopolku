<template>

  <router-view v-if="kurssi" />

  <div v-else class="content">
    <h2>{{$kaanna(oppiaine.nimi)}}</h2>

    <div class="mt-4" v-if="oppiaine.koodi">
      <h3>{{ $t('koodi')}}</h3>
      <span>{{oppiaine.koodi.arvo}}</span>
    </div>

    <div class="mt-4" v-if="oppiaine.tehtava">
      <h3>{{ $kaanna(oppiaine.tehtava.otsikko)}}</h3>
      <ep-content-viewer :value="$kaanna(oppiaine.tehtava.teksti)" :kuvat="kuvat" />
    </div>

    <div class="mt-4" v-if="oppiaine.tyotavat">
      <h3>{{ $kaanna(oppiaine.tyotavat.otsikko)}}</h3>
      <ep-content-viewer :value="$kaanna(oppiaine.tyotavat.teksti)" :kuvat="kuvat" />
    </div>

    <div class="mt-4" v-if="oppiaine.ohjaus">
      <h3>{{ $kaanna(oppiaine.ohjaus.otsikko)}}</h3>
      <ep-content-viewer :value="$kaanna(oppiaine.ohjaus.teksti)" :kuvat="kuvat" />
    </div>

    <div class="mt-4" v-if="oppiaine.arviointi">
      <h3>{{ $kaanna(oppiaine.arviointi.otsikko)}}</h3>
      <ep-content-viewer :value="$kaanna(oppiaine.arviointi.teksti)" :kuvat="kuvat" />
    </div>

    <div class="mt-4" v-if="oppiaine.sisaltoalueinfo">
      <h3>{{ $kaanna(oppiaine.sisaltoalueinfo.otsikko)}}</h3>
      <ep-content-viewer :value="$kaanna(oppiaine.sisaltoalueinfo.teksti)" :kuvat="kuvat" />
    </div>

    <div class="mt-4" v-if="oppiaine.pakollinenKurssiKuvaus">
      <h3>{{ $t('pakollinen-kurssi-kuvaus-header')}}</h3>
      <ep-content-viewer :value="$kaanna(oppiaine.pakollinenKurssiKuvaus)" :kuvat="kuvat" />
    </div>

    <div class="mt-4" v-if="oppiaine.syventavaKurssiKuvaus">
      <h3>{{ $t('syventava-kurssi-kuvaus-header')}}</h3>
      <ep-content-viewer :value="$kaanna(oppiaine.syventavaKurssiKuvaus)" :kuvat="kuvat" />
    </div>

    <div class="mt-4" v-if="oppiaine.soveltavaKurssiKuvaus">
      <h3>{{ $t('soveltava-kurssi-kuvaus-header')}}</h3>
      <ep-content-viewer :value="$kaanna(oppiaine.soveltavaKurssiKuvaus)" :kuvat="kuvat" />
    </div>

    <div class="mt-5" v-if="oppimaarat && oppimaarat.length > 0">
      <h3>{{$t('oppimaarat')}}</h3>
      <div v-for="oppimaara in oppimaarat" :key="'oppimaara'+oppimaara.id" class="taulukko-rivi-varitys px-2 py-3">
        <router-link :to="oppimaara.route">
          {{$kaanna(oppimaara.nimi)}}
        </router-link>
      </div>
    </div>

    <div class="mt-5" v-if="kurssit && kurssit.length > 0">
      <h3>{{$t('kurssit')}}</h3>
      <div v-for="kurssi in kurssit" :key="'kurssi'+kurssi.id" class="taulukko-rivi-varitys px-2 py-3">
        <router-link :to="kurssi.route">
          {{$kaanna(kurssi.nimi)}}
        </router-link>
      </div>
    </div>

    <ep-button class="mt-5" variant="link" @click="toggleTavoite()" v-if="tavoitteet.length > 0">
      {{$t('avaa-sulje-kaikki')}}
    </ep-button>

    <ep-collapse
      ref="tavoitecollapse"
      v-for="(tavoite, index) in tavoitteet"
      :key="'tavoite'+index"
      :border-bottom="false"
      :expandedByDefault="false"
      :shadow="true">

      <template v-slot:header>
        <h3 v-html="$kaanna(tavoite.tavoite)"></h3>
      </template>

      <div class="mt-4">

        <div v-if="tavoite.tavoitteistaJohdetutOppimisenTavoitteet">
          <h4>{{$t('tavoitteista-johdetut-oppimisen-tavoitteet')}}</h4>
          <span v-html="$kaanna(tavoite.tavoitteistaJohdetutOppimisenTavoitteet)"></span>
        </div>

        <div v-if="tavoite.kohdealue">
          <h4>{{$t('kohdealueet')}}</h4>
          <span v-html="$kaanna(tavoite.kohdealue.nimi)"></span>
        </div>

        <div class="mt-4" v-if="tavoite.laajaalaisetosaamiset.length > 0">
          <h4>{{$t('laaja-alaisen-osaamisen-alueet')}}</h4>

          <ep-collapse class="lao" v-for="(lao, index) in tavoite.laajaalaisetosaamiset" :key="'lao'+index"
            :borderBottom="false" :expanded-by-default="false" chevronLocation="left">
            <template v-slot:header>
              <h5 v-html="$kaanna(lao.nimi)"></h5>
            </template>

            <div v-html="$kaanna(lao.kuvaus)" />

          </ep-collapse>

          <div class="mt-4" v-if="tavoite.kohdeTeksti">
            <h4>{{ $t('arvioinnin-kohde') }}</h4>
            <span v-html="$kaanna(tavoite.kohdeTeksti)"></span>
          </div>
        </div>

        <div class="mt-4" v-if="tavoite.arvioinninkohteet && tavoite.arvioinninkohteet.length > 0">
          <h4 class="mb-0 pb-0">{{$kaanna(tavoite.arvioinninOtsikko)}}</h4>
          <ep-arvioinninkohteet-table :arvioinninkohteet="tavoite.arvioinninkohteet" />
        </div>

        <div class="mt-4" v-if="tavoite.vapaaTeksti ">
          <ep-content-viewer :value="$kaanna(tavoite.vapaaTeksti)" :kuvat="kuvat" />
        </div>

      </div>

    </ep-collapse>

  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpArvioinninkohteetTable from '@shared/components/EpArvioinninkohteetTable/EpArvioinninkohteetTable.vue';

@Component({
  components: {
    EpCollapse,
    EpButton,
    EpContentViewer,
    EpArvioinninkohteetTable,
  },
})
export default class RouteAipeOppiaine extends Vue {
  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  get oppiaineId() {
    return _.toNumber(this.$route.params.oppiaineId);
  }

  get oppiaine() {
    return this.perusteDataStore.getJulkaistuPerusteSisalto({ id: this.oppiaineId });
  }

  get vaiheId() {
    return _.toNumber(this.$route.params.vaiheId);
  }

  get vaihe() {
    return this.perusteDataStore.getJulkaistuPerusteSisalto({ id: this.vaiheId });
  }

  get oppimaarat() {
    if (this.oppiaine.oppimaarat) {
      return _.map(this.oppiaine.oppimaarat, oppimaara => {
        return {
          ...oppimaara,
          route: { name: 'aipeoppiaine', params: { oppiaineId: _.toString(oppimaara.id) } },
        };
      });
    }
  }

  get kurssit() {
    if (this.oppiaine) {
      return _.map(this.oppiaine.kurssit, kurssi => {
        return {
          ...kurssi,
          route: { name: 'aipekurssi', params: { kurssiId: _.toString(kurssi.id) } },
        };
      });
    }
  }

  get tavoitteet() {
    if (this.oppiaine) {
      return _.map(this.oppiaine.tavoitteet, (tavoite: any) => {
        return {
          ...tavoite,
          kohdealue: this.kohdealueetById[_.head(tavoite.kohdealueet) as any],
          laajaalaisetosaamiset: _.map(tavoite.laajattavoitteet, lao => this.laajaAlaisetOsaamisetById[lao as any]),
          kohdeTeksti: this.arvioinninKohteenTeksti(tavoite),
        };
      });
    }
  }

  arvioinninKohteenTeksti(tavoite) {
    const hyvanOsaamisenArvio = _.find(tavoite.arvioinninkohteet, (arvioinninkohde: any) => arvioinninkohde.arvosana === 8);

    if (hyvanOsaamisenArvio && !_.isEmpty(hyvanOsaamisenArvio.arvioinninKohde)) {
      return hyvanOsaamisenArvio.arvioinninKohde;
    }

    return tavoite.arvioinninKuvaus;
  };

  get laajaAlaisetOsaamisetById() {
    return _.keyBy(this.perusteDataStore.getJulkaistuPerusteSisalto('aipe.laajaalaisetosaamiset'), 'id');
  }

  get kohdealueetById() {
    if (this.vaihe) {
      return _.keyBy(this.vaihe.opetuksenKohdealueet, 'id');
    }
    else {
      return {};
    }
  }

  get kurssi() {
    return this.$route.params.kurssiId;
  }

  get fields() {
    return [{
      key: 'nimi',
      thStyle: {
        display: 'none',
      },
    }];
  }

  toggleTavoite() {
    _.forEach(this.$refs.tavoitecollapse, (tavoite: any) => tavoite.toggle());
  }

  get kuvat() {
    return this.perusteDataStore.kuvat;
  }
}

</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;

  ::v-deep .ep-button .btn-link {
    padding-left: 0px;
  }

  .lao {
    ::v-deep .ep-collapse {
      padding-top: 0px;
      padding-bottom: 0px;
    }
  }
}
</style>
