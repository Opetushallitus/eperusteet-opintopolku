<template>
<div>
  <div v-if="koodi">
    <strong>{{ $t('koodi') }}</strong>
    <p>{{ koodi.arvo }}</p>
  </div>

  <div v-if="hasTehtava">
    <h3>{{ $t('oppiaine-ja-tehtava') }}</h3>
    <ep-content-viewer v-if="oppiaine.tehtava.kuvaus"
                       :value="$kaanna(oppiaine.tehtava.kuvaus)"
                       :termit="termit"
                       :kuvat="kuvat" />
  </div>

  <div v-if="hasLaajaAlaiset">
    <h3>{{ $t('laaja-alaisen-osaamisen-osa-alueet') }}</h3>
    <ep-content-viewer v-if="oppiaine.laajaAlaisetOsaamiset.kuvaus"
                       :value="$kaanna(oppiaine.laajaAlaisetOsaamiset.kuvaus)"
                       :termit="termit"
                       :kuvat="kuvat" />
  </div>

  <div v-if="hasTavoitteet">
    <h3>{{ $t('tavoitteet') }}</h3>
    <ep-content-viewer v-if="tavoitteet.kuvaus"
                       :value="$kaanna(tavoitteet.kuvaus)"
                       :termit="termit" :kuvat="kuvat" />
    <div v-for="(tavoitealue, idx) in tavoitteet.tavoitealueet" :key="idx">
      <strong v-if="tavoitealue.nimi">{{ $kaanna(tavoitealue.nimi )}}</strong>
      <p v-if="tavoitealue.kohde">{{ $kaanna(tavoitealue.kohde) }}</p>
      <ul>
        <li v-for="(tavoite, idx) in tavoitealue.tavoitteet" :key="idx">
          <span>{{ $kaanna(tavoite) }}</span>
        </li>
      </ul>
    </div>
  </div>

  <div v-if="hasArviointi">
    <h3>{{ $t('arviointi') }}</h3>
    <ep-content-viewer :value="$kaanna(oppiaine.arviointi.kuvaus)"
                       :termit="termit"
                       :kuvat="kuvat" />
  </div>

  <hr v-if="hasOpintojaksot || hasModuulit" class="mt-4 mb-4"/>

  <div v-if="hasOpintojaksot" class="mb-4">
    <h3 id="opintojaksot">{{ $t('opintojaksot') }}</h3>
    <router-link :to="opintojakso.location" v-for="(opintojakso, idx) in opintojaksotExtended" :key="idx">
      <div class="d-flex justify-content-between opintojakso mb-2" >
        <div class="font-weight-bold">
          <span>{{ $kaanna(opintojakso.nimi) }}</span>
          <span v-if="opintojakso.koodiLabel" class="koodi ml-2">({{ opintojakso.koodiLabel }})</span>
        </div>
        <div v-if="opintojakso.laajuus" class="opintopiste">
          {{opintojakso.laajuus}} {{$t('opintopiste')}}
        </div>
      </div>
    </router-link>
  </div>

  <div v-if="hasModuulit">
    <h3 id="moduulit">{{ $t('moduulit') }}</h3>

    <div v-if="hasPakollisetModuulit" class="mb-4">
      <h4>{{ $t('pakolliset-moduulit') }}</h4>
      <ep-content-viewer v-if="oppiaine.pakollisetModuulitKuvaus"
                         :value="$kaanna(oppiaine.pakollisetModuulitKuvaus)"
                         :termit="termit"
                         :kuvat="kuvat" />

      <div class="d-flex flex-wrap">
        <div v-for="(moduuli, idx) in pakollisetModuulitExtended" :key="idx">
          <router-link :to="moduuli.location">
            <ep-opintojakson-moduuli class="m-1" :moduuli="moduuli"/>
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="hasValinnaisetModuulit" class="mb-4">
      <h4>{{ $t('valinnaiset-moduulit') }}</h4>
      <ep-content-viewer v-if="oppiaine.valinnaisetModuulitKuvaus"
                         :value="$kaanna(oppiaine.valinnaisetModuulitKuvaus)"
                         :termit="termit"
                         :kuvat="kuvat" />

      <div class="d-flex flex-wrap">
        <div v-for="(moduuli, idx) in valinnaisetModuulitExtended" :key="idx">
          <router-link :to="moduuli.location">
            <ep-opintojakson-moduuli class="m-1" :moduuli="moduuli"/>
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <div v-if="hasOppimaarat">
    <h3 id="oppimaarat">{{ $t('oppimaarat') }}</h3>
    <div v-for="(oppimaara, idx) in oppimaaratExtended" :key="idx">
      <router-link v-if="oppimaara.location" :to="oppimaara.location">
        {{ $kaanna(oppimaara.nimi) }}
      </router-link>
      <div v-else>
        {{ $kaanna(oppimaara.nimi) }}
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import VueScrollTo from 'vue-scrollto';
import { Vue, Component, Prop } from 'vue-property-decorator';

import { Lops2019OppiaineKaikkiDto, TermiDto, Lops2019OpintojaksoDto } from '@shared/api/ylops';
import { LiiteDtoWrapper } from '@shared/tyypit';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { NavigationNode } from '@shared/utils/NavigationBuilder';
import EpOpintojaksonModuuli from '@shared/components/EpOpintojaksonModuuli/EpOpintojaksonModuuli.vue';

@Component({
  components: {
    EpColorIndicator,
    EpContentViewer,
    EpOpintojaksonModuuli,
  },
})
export default class OppiaineEsitys extends Vue {
  @Prop({ required: false, default: true })
  private isPerusteView!: boolean;

  @Prop({ required: true })
  private oppiaine!: Lops2019OppiaineKaikkiDto;

  @Prop({ required: false, type: Array })
  private termit!: TermiDto[];

  @Prop({ required: false, type: Array })
  private kuvat!: LiiteDtoWrapper[];

  @Prop({ required: false, type: Array })
  private navOppimaarat!: NavigationNode[];

  @Prop({ required: false })
  private opintojaksot!: Lops2019OpintojaksoDto[];

  updated() {
    // Odotetaan myös alikomponenttien päivittymistä
    this.$nextTick(() => {
      if (this.$route && this.$route.hash && this.oppiaine) {
        if (this.$route.hash === '#moduulit' && this.hasModuulit) {
          VueScrollTo.scrollTo('#moduulit');
        }
        else if (this.$route.hash === '#oppimaarat' && this.hasOppimaarat) {
          VueScrollTo.scrollTo('#oppimaarat');
        }
      }
    });
  }

  get koodi() {
    if (this.oppiaine) {
      return this.oppiaine.koodi;
    }
  }

  get hasTehtava() {
    if (this.oppiaine) {
      return this.oppiaine.tehtava && this.oppiaine.tehtava.kuvaus;
    }
  }

  get hasLaajaAlaiset() {
    if (this.oppiaine) {
      return this.oppiaine.laajaAlaisetOsaamiset && this.oppiaine.laajaAlaisetOsaamiset.kuvaus;
    }
  }

  get tavoitteet() {
    if (this.oppiaine) {
      return this.oppiaine.tavoitteet;
    }
  }

  get hasTavoitteet() {
    if (this.tavoitteet) {
      return !_.isEmpty(this.tavoitteet) && !_.isEmpty(this.tavoitteet.tavoitealueet);
    }
  }

  get hasArviointi() {
    if (this.oppiaine) {
      return this.oppiaine.arviointi && this.oppiaine.arviointi.kuvaus;
    }
  }

  get moduulit() {
    if (this.oppiaine) {
      return this.oppiaine.moduulit;
    }
  }

  get hasModuulit() {
    return !_.isEmpty(this.moduulit);
  }

  get pakollisetModuulit() {
    return _.filter(this.moduulit, { pakollinen: true });
  }

  get pakollisetModuulitExtended() {
    if (this.pakollisetModuulit) {
      return _.map(this.pakollisetModuulit, moduuli => {
        return {
          ...moduuli,
          location: {
            name: this.isPerusteView ? 'lops2019moduuli' : 'lops2019OpetussuunnitelmaModuuli',
            params: { moduuliId: _.toString(moduuli.id) },
          },
          koodiLabel: _.get(moduuli, 'koodi.arvo'),
        };
      });
    }
  }

  get hasPakollisetModuulit() {
    return !_.isEmpty(this.pakollisetModuulit);
  }

  get valinnaisetModuulit() {
    return _.filter(this.moduulit, { pakollinen: false });
  }

  get valinnaisetModuulitExtended() {
    if (this.valinnaisetModuulit) {
      return _.map(this.valinnaisetModuulit, moduuli => {
        return {
          ...moduuli,
          location: {
            name: this.isPerusteView ? 'lops2019moduuli' : 'lops2019OpetussuunnitelmaModuuli',
            params: { moduuliId: _.toString(moduuli.id) },
          },
          koodiLabel: _.get(moduuli, 'koodi.arvo'),
        };
      });
    }
  }

  get hasValinnaisetModuulit() {
    return !_.isEmpty(this.valinnaisetModuulit);
  }

  get oppimaarat() {
    if (this.oppiaine) {
      return this.oppiaine.oppimaarat;
    }
  }

  get oppimaaratExtended() {
    if (!_.isEmpty(this.navOppimaarat)) {
      return _.map(this.navOppimaarat, oppimaara => ({
        ...oppimaara,
        nimi: oppimaara.label,
      }));
    }
    else if (this.oppimaarat) {
      return _.map(this.oppimaarat, oppimaara => {
        return {
          ...oppimaara,
          location: {
            name: this.isPerusteView ? 'lops2019oppiaine' : 'lops2019OpetussuunnitelmaOppiaine',
            params: { oppiaineId: _.toString(oppimaara.id) },
          },
        };
      });
    }
  }

  get hasOppimaarat() {
    return !_.isEmpty(this.oppimaarat);
  }

  get hasOpintojaksot() {
    return !_.isEmpty(this.opintojaksot);
  }

  get opintojaksotExtended() {
    if (this.opintojaksot) {
      return _.map(this.opintojaksot, oj => {
        return {
          ...oj,
          location: {
            name: 'lops2019OpetussuunnitelmaOpintojakso',
            params: { opintojaksoId: _.toString(oj.id) },
          },
          koodiLabel: _.get(oj, 'koodi'),
        };
      });
    }
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';
  span.code-field {
    margin-left: 5px;
    font-size: 80%;
    text-transform: uppercase;
  }

  .opintojakso {
    border-radius: 1rem;
    padding: 10px 20px;
    background-color: $blue-lighten-4;
    color: $blue-darken-1;

    .opintopiste {
      color: $gray;
    }
  }

  .opintojakso:hover {
    background-color: $blue-lighten-3;
  }
</style>
