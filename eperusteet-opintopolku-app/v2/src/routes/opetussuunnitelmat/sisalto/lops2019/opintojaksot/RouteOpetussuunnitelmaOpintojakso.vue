<template>
<div class="content">
  <div v-if="opintojakso">
    <h2 class="otsikko" slot="header">{{ $kaanna(opintojakso.nimi)}}</h2>

    <div class="teksti">
      <div v-if="opintojakso.koodi">
        <strong>{{ $t('koodi') }}</strong>
        <p>{{ opintojakso.koodi }}</p>
      </div>

      <div v-if="hasOppiaineet">
        <strong>{{ $t('oppiaineet') }}</strong>
        <ul>
          <li v-for="(oppiaine, idx) in oppiaineet" :key="idx">
            {{ oppiaine.koodi }}
          </li>
        </ul>
      </div>

      <div v-if="opintojakso.laajuus">
        <strong>{{ $t('laajuus') }}</strong>
        <p>{{ opintojakso.laajuus }}</p>
      </div>

      <div v-if="hasModuulit">
        <strong>{{ $t('opintojakson-moduulit') }}</strong>
        <ul>
          <li v-for="(moduuli, idx) in moduulit" :key="idx">
            {{ moduuli.koodiUri }}
          </li>
        </ul>
      </div>

      <div v-if="hasTavoitteet">
        <h3>{{ $t('tavoitteet') }}</h3>
        <pre>todo peruste</pre>
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
        <pre>todo peruste</pre>
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
        <pre>todo peruste</pre>
        <ul>
          <li v-for="(lao, idx) in laajaAlainenOsaaminen" :key="idx">
            <pre>{{ lao.koodi }}</pre>
            <ep-content-viewer :value="$kaanna(lao.kuvaus)"
                               :termit="termit"
                               :kuvat="kuvat" />
          </li>
        </ul>
      </div>

      <div v-if="hasArviointi">
        <h3>{{ $t('arviointi') }}</h3>
        <pre>todo peruste</pre>
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


@Component({
  components: {
    EpSpinner,
    EpContentViewer,
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
        return _.toString(oj.id) === _.toString(this.$route.params.opintojaksoId);
      }) as Lops2019OpintojaksoDto;
    }
  }

  get oppiaineet() {
    if (this.opintojakso) {
      return this.opintojakso.oppiaineet;
    }
  }

  get hasOppiaineet() {
    return !_.isEmpty(this.oppiaineet);
  }

  get moduulit() {
    if (this.opintojakso) {
      return this.opintojakso.moduulit;
    }
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
}
</style>
