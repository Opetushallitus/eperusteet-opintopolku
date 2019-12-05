<template>
<div class="content">
  <div v-if="opintojakso">
    <h2 class="otsikko" slot="header">{{ $kaanna(opintojakso.nimi)}}</h2>

    <div class="teksti">
      <div v-if="opintojakso.koodi">
        <h3 class="opintojakso-tieto-otsikko">{{ $t('koodi') }}</h3>
        <p>{{ opintojakso.koodi }}</p>
      </div>

      <div v-if="hasOppiaineet">
        <h3 class="opintojakso-tieto-otsikko">{{ $t('oppiaineet') }}</h3>
        <ul>
          <li v-for="(oppiaine, idx) in oppiaineetExtended" :key="idx">
            <div v-if="oppiaine.node">
              <router-link v-if="oppiaine.node.location" :to="oppiaine.node.location">
                {{ $kaanna(oppiaine.node.label) }}
              </router-link>
            </div>
          </li>
        </ul>
      </div>

      <div v-if="opintojakso.laajuus">
        <h3 class="opintojakso-tieto-otsikko">{{ $t('laajuus') }}</h3>
        <p>{{ opintojakso.laajuus }}</p>
      </div>
    </div>


    <div v-if="hasModuulit">
      <h3>{{ $t('opintojakson-moduulit') }}</h3>
      <div class="d-flex flex-wrap">
        <div v-for="(moduuli, idx) in moduulitExtended" :key="idx">
          <ep-opintojakson-moduuli :moduuli="moduuli" class="mr-2 mb-2" />
        </div>
      </div>

      <div v-if="hasTavoitteet">
        <h3>{{ $t('tavoitteet') }}</h3>
        <ul>
          <li v-for="(tavoite, idx) in tavoitteet" :key="idx">
            <ep-content-viewer :value="$kaanna(tavoite.kuvaus)"
                               :termit="termit"
                               :kuvat="kuvat" />
          </li>
        </ul>
      </div>

      <div v-if="hasKeskeisetSisallot">
        <h3>{{ $t('keskeiset-sisallot') }}</h3>
        <ul>
          <li v-for="(ks, idx) in keskeisetSisallot" :key="idx">
            <ep-content-viewer :value="$kaanna(ks.kuvaus)"
                               :termit="termit"
                               :kuvat="kuvat" />
          </li>
        </ul>
      </div>

      <div v-if="hasLaajaAlainenOsaaminen">
        <h3>{{ $t('laaja-alaiset-sisallot') }}</h3>
        <div v-for="(lao, idx) in laajaAlainenOsaaminenExtended" :key="idx">
          <h4 class="opintojakso-lao-otsikko">{{ $kaanna(lao.nimi) }}</h4>
          <ep-content-viewer :value="$kaanna(lao.kuvaus)"
                             :termit="termit"
                             :kuvat="kuvat" />
        </div>
      </div>

      <div v-if="hasArviointi">
        <h3>{{ $t('arviointi') }}</h3>
        <ep-content-viewer v-if="opintojakso.arviointi"
                           :value="$kaanna(opintojakso.arviointi)"
                           :termit="termit"
                           :kuvat="kuvat" />
      </div>


      <div v-if="hasKuvaus">
        <ep-content-viewer v-if="opintojakso.kuvaus"
                           :value="$kaanna(opintojakso.kuvaus)"
                           :termit="termit"
                           :kuvat="kuvat" />
      </div>
    </div>

    <slot name="previous-next-navigation" />
  </div>
  <ep-spinner v-else />
</div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';

import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { Lops2019OpintojaksoDto } from '@shared/api/tyypit';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpOpintojaksonModuuli from '@shared/components/EpOpintojaksonModuuli/EpOpintojaksonModuuli.vue';
import { getLaajaAlaisetKoodit } from '@shared/utils/perusteet';


@Component({
  components: {
    EpSpinner,
    EpContentViewer,
    EpOpintojaksonModuuli,
  }
})
export default class RouteOpetussuunnitelmaOpintojakso extends Vue {

  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  get termit() {
    return this.opetussuunnitelmaDataStore.termit;
  }

  get kuvat() {
    return this.opetussuunnitelmaDataStore.kuvat;
  }

  get opintojakso() {
    if (this.$route) {
      return _.find(this.opetussuunnitelmaDataStore.opintojaksot, oj => {
        return oj.id === _.parseInt(this.$route.params.opintojaksoId);
      }) as Lops2019OpintojaksoDto;
    }
  }

  get oppiaineet() {
    if (this.opintojakso) {
      return this.opintojakso.oppiaineet;
    }
  }

  get oppiaineetExtended() {
    return _.map(this.oppiaineet, (oa: any) => {
      if (oa.koodi) {
        const node = this.navigationByUri[oa.koodi];
        if (node) {
          const { location, label } = node;
          oa.node = {
            location,
            label
          };
        }
      }

      return oa;
    });
  }

  get hasOppiaineet() {
    return !_.isEmpty(this.oppiaineet);
  }

  get moduulit() {
    if (this.opintojakso) {
      return this.opintojakso.moduulit;
    }
  }

  get moduulitExtended() {
    return _.map(this.moduulit, (moduuli: any) => {
      if (moduuli.koodiUri) {
        const node = this.navigationByUri[moduuli.koodiUri];
        if (node) {
          const { path, children, ...filtered } = node;
          moduuli.node = filtered;
          if (path && path.length >= 3) {
            const oaNode = path[path.length - 3];
            moduuli.node.location.params.oppiaineId = _.get(oaNode, 'location.params.oppiaineId');
            return moduuli;
          }
        }
      }
    });
  }

  get hasModuulit() {
    return !_.isEmpty(this.moduulit);
  }

  get tavoitteet() {
    if (this.opintojakso) {
      return this.opintojakso.tavoitteet;
    }
  }

  get hasTavoitteet() {
    return !_.isEmpty(this.tavoitteet);
  }

  get keskeisetSisallot() {
    if (this.opintojakso) {
      return this.opintojakso.keskeisetSisallot;
    }
  }

  get hasKeskeisetSisallot() {
    return !_.isEmpty(this.keskeisetSisallot);
  }

  get laajaAlainenOsaaminen() {
    if (this.opintojakso) {
      return this.opintojakso.laajaAlainenOsaaminen;
    }
  }

  get laajaAlainenOsaaminenExtended() {
    return _.chain(getLaajaAlaisetKoodit())
      .map(lo => ({
        ...lo,
        ..._.find(this.laajaAlainenOsaaminen, { koodi: lo.koodi }),
      }))
      .filter('kuvaus')
      .value();
  }

  get hasLaajaAlainenOsaaminen() {
    return !_.isEmpty(this.laajaAlainenOsaaminen);
  }

  get hasArviointi() {
    if (this.opintojakso) {
      return this.opintojakso.arviointi;
    }
  }

  get hasKuvaus() {
    if (this.opintojakso) {
      return this.opintojakso.kuvaus;
    }
  }

  get navigationByUri() {
    return this.opetussuunnitelmaDataStore.navigationByUri;
  }

}
</script>

<style scoped lang="scss">
@import '../../../../../styles/_variables.scss';
@import '../../../../../styles/_mixins.scss';

.content {
  padding: 0 $content-padding;

  .otsikko, .teksti {
    @include teksti-sisalto;
  }

  .opintojakso-tieto-otsikko {
    font-size: 1em;
    font-weight: bold;
  }

  .opintojakso-lao-otsikko {
    font-size: 1em;
    font-weight: bold;
  }
}
</style>
