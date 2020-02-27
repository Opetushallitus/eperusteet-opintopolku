<template>
<div class="content">
  <div v-if="opintojakso">
    <h2 class="otsikko" slot="header">{{ $kaanna(opintojakso.nimi)}}</h2>

    <div v-if="hasKuvaus">
      <ep-content-viewer v-if="opintojakso.kuvaus"
                         :value="$kaanna(opintojakso.kuvaus)"
                         :termit="termit"
                         :kuvat="kuvat" />
    </div>

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
            <div v-else>
              {{ oppiaine.koodi }}
            </div>
          </li>
        </ul>
      </div>

      <div v-if="opintojakso.laajuus" class="mb-5">
        <h3 class="opintojakso-tieto-otsikko">{{ $t('laajuus') }}</h3>
        <p>{{ opintojakso.laajuus }} {{ $t('opintopiste') }}</p>
      </div>
    </div>


    <div v-if="hasModuulit" class="mb-4">
      <h3>{{ $t('opintojakson-moduulit') }}</h3>
      <div class="d-flex flex-wrap">
        <div v-for="(moduuli, idx) in moduulitExtended" :key="idx">
          <ep-opintojakson-moduuli :moduuli="moduuli" class="mr-2 mb-2" />
        </div>
      </div>
    </div>

    <div v-if="paikallisetOpintojaksot" class="mb-4">
      <h3>{{ $t('paikallisen-oppiaineen-opintojaksot') }}</h3>

      <div v-for="(paikallinenOpintojakso, idx) in paikallisetOpintojaksot" :key="idx">
        <router-link :to="{name:'lops2019OpetussuunnitelmaOpintojakso', params:{opintojaksoId: paikallinenOpintojakso.id}}" tabindex="0">
          <div class="paikallinen-opintojakso-content">
            <span class="nimi">
              <span class="mr-2">{{ $kaanna(paikallinenOpintojakso.nimi) }}</span>
              <span v-if="paikallinenOpintojakso.koodi">({{ paikallinenOpintojakso.koodi }})</span>
            </span>
            <span class="pituus">{{ paikallinenOpintojakso.laajuus }} {{ $t('opintopiste') }}</span>
          </div>
        </router-link>
      </div>
    </div>

    <div v-if="hasTavoitteet" class="mb-4">
    <h3>{{ $t('tavoitteet') }}</h3>
    <ul>
      <li v-for="(tavoite, idx) in tavoitteet" :key="idx">
        <ep-content-viewer :value="$kaanna(tavoite.kuvaus)"
                           :termit="termit"
                           :kuvat="kuvat" />
      </li>
    </ul>
    <div v-if="paikallistenOpintojaksojenTavoitteet" class="mb-5">
      <div v-for="(paikallinenOpintojakso, idx) in paikallistenOpintojaksojenTavoitteet" :key="idx">
        <h5>{{ $kaanna(paikallinenOpintojakso.nimi)}}</h5>
        <ul>
          <li v-for="(tavoite, idx) in paikallinenOpintojakso.tavoitteet" :key="idx">
            <ep-content-viewer :value="$kaanna(tavoite.kuvaus)"
                              :termit="termit"
                              :kuvat="kuvat" />
          </li>
        </ul>
      </div>
    </div>
  </div>

    <div v-if="hasKeskeisetSisallot" class="mb-4">
      <h3>{{ $t('keskeiset-sisallot') }}</h3>
      <ul>
        <li v-for="(ks, idx) in keskeisetSisallot" :key="idx">
          <ep-content-viewer :value="$kaanna(ks.kuvaus)"
                             :termit="termit"
                             :kuvat="kuvat" />
        </li>
      </ul>
    </div>

    <div v-if="paikallistenOpintojaksojenKeskeisetSisallot" class="mb-5">
      <div v-for="(paikallinenOpintojakso, idx) in paikallistenOpintojaksojenKeskeisetSisallot" :key="idx">
        <h5>{{ $kaanna(paikallinenOpintojakso.nimi)}}</h5>
        <ul>
          <li v-for="(ks, idx) in paikallinenOpintojakso.keskeisetSisallot" :key="idx">
            <ep-content-viewer :value="$kaanna(ks.kuvaus)"
                              :termit="termit"
                              :kuvat="kuvat" />
          </li>
        </ul>
      </div>
    </div>

    <div v-if="hasLaajaAlainenOsaaminen" class="mb-4">
      <h3>{{ $t('laaja-alaiset-sisallot') }}</h3>
      <div v-for="(lao, idx) in laajaAlainenOsaaminenExtended" :key="idx">
        <h4 class="opintojakso-lao-otsikko">{{ $kaanna(lao.nimi) }} ({{lao.koodiArvo}})</h4>
        <ep-content-viewer :value="$kaanna(lao.kuvaus)"
                           :termit="termit"
                           :kuvat="kuvat" />
      </div>
    </div>

    <div v-if="paikallistenOpintojaksojenLaajaAlainenOsaaminenExtended" class="mb-5">
      <div v-for="(paikallinenOpintojakso, idx) in paikallistenOpintojaksojenLaajaAlainenOsaaminenExtended" :key="idx">
        <h5>{{ $kaanna(paikallinenOpintojakso.nimi)}}</h5>
        <div v-for="(lao, idx) in paikallinenOpintojakso.laajaAlainenOsaaminen" :key="idx">
          <h6 class="opintojakso-lao-otsikko">{{ $kaanna(lao.nimi) }} ({{lao.koodiArvo}})</h6>
          <ep-content-viewer :value="$kaanna(lao.kuvaus)"
                            :termit="termit"
                            :kuvat="kuvat" />
        </div>
      </div>
    </div>

    <div v-if="hasArviointi" class="mb-4">
      <h3>{{ $t('opintojakson-arviointi') }}</h3>
      <ep-content-viewer v-if="opintojakso.arviointi"
                         :value="$kaanna(opintojakso.arviointi)"
                         :termit="termit"
                         :kuvat="kuvat" />
    </div>

    <div v-if="paikallistenOpintojaksojenArviointi" class="mb-5">
      <div v-for="(paikallinenOpintojakso, idx) in paikallistenOpintojaksojenArviointi" :key="idx">
        <h5>{{ $kaanna(paikallinenOpintojakso.nimi)}}</h5>
        <ep-content-viewer v-if="paikallinenOpintojakso.arviointi"
                          :value="$kaanna(paikallinenOpintojakso.arviointi)"
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { Lops2019OpintojaksoDto } from '@shared/api/tyypit';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpOpintojaksonModuuli from '@shared/components/EpOpintojaksonModuuli/EpOpintojaksonModuuli.vue';
import { KoodistoLops2019LaajaAlaiset } from '@shared/utils/perusteet';
import { Ulkopuoliset } from '@shared/api/ylops';

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
  private laajaAlaisetKoodit: any | null = null;

  @Watch('opintojakso', {immediate: true})
  async opintojaksoChange(val) {
    if(this.opintojakso) {
      const koodit = await Promise.all(_.map(this.kaikkiLaajaalaisetOsaamiset, (lao) => Ulkopuoliset.yksiKoodistokoodi(KoodistoLops2019LaajaAlaiset, (lao as any).koodi)));
      this.laajaAlaisetKoodit = _.map(koodit, 'data');
    }
  }

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

  get kaikkiLaajaalaisetOsaamiset() {
    if(this.laajaAlainenOsaaminen) {
      return [
        ...this.laajaAlainenOsaaminen,
        ..._.chain(this.opintojakso!.paikallisetOpintojaksot)
          .map('laajaAlainenOsaaminen')
          .flatMap()
          .value(),
      ];
    }
  }

  get paikallisetOpintojaksot() {
    if(!_.isEmpty(this.opintojakso!.paikallisetOpintojaksot)) {
      return this.opintojakso!.paikallisetOpintojaksot;
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

  get paikallistenOpintojaksojenTavoitteet() {
    return _.chain(this.paikallisetOpintojaksot)
      .filter((paikallinenOpintojakso) => !_.isEmpty(paikallinenOpintojakso.tavoitteet))
      .value();
  }

  get keskeisetSisallot() {
    if (this.opintojakso) {
      return this.opintojakso.keskeisetSisallot;
    }
  }

  get paikallistenOpintojaksojenKeskeisetSisallot() {
    return _.chain(this.paikallisetOpintojaksot)
      .filter((paikallinenOpintojakso) => !_.isEmpty(paikallinenOpintojakso.keskeisetSisallot))
      .value();
  }

  get hasKeskeisetSisallot() {
    return !_.isEmpty(_.chain(this.keskeisetSisallot)
      .map('kuvaus')
      .filter(null)
      .value());
  }

  get laajaAlainenOsaaminen() {
    if (this.opintojakso) {
      return this.opintojakso.laajaAlainenOsaaminen;
    }
  }

  get laajaAlainenOsaaminenExtended() {
    return _.chain(this.laajaAlaisetKoodit)
      .map(lo => ({
        ...lo,
        ..._.find(this.laajaAlainenOsaaminen, { koodi: lo.koodiUri }) as any,
      }))
      .filter('kuvaus')
      .value();
  }

  get hasLaajaAlainenOsaaminen() {
    return !_.isEmpty(_.chain(this.laajaAlainenOsaaminen)
      .map('kuvaus')
      .filter(null)
      .value());
  }

  get paikallistenOpintojaksojenLaajaAlainenOsaaminenExtended() {
    return _.chain(this.paikallisetOpintojaksot)
      .filter((paikallinenOpintojakso) => !_.isEmpty(paikallinenOpintojakso.laajaAlainenOsaaminen))
      .map(paikallinenOpintojakso => ({
        ...paikallinenOpintojakso,
        laajaAlainenOsaaminen: _.chain(this.laajaAlaisetKoodit)
          .map(lo => ({
            ...lo,
            ..._.find(paikallinenOpintojakso.laajaAlainenOsaaminen, { koodi: lo.koodiUri }) as any,
          }))
          .filter('kuvaus')
          .value()
      }))
      .value();
  }

  get hasArviointi() {
    if (this.opintojakso) {
      return this.opintojakso.arviointi;
    }
  }

  get paikallistenOpintojaksojenArviointi() {
    return _.chain(this.paikallisetOpintojaksot)
      .filter((paikallinenOpintojakso) => !_.isEmpty(paikallinenOpintojakso.arviointi))
      .value();
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

  .paikallinen-opintojakso-content {
    border-radius: 24px;
    border: 1px solid #CDEEFF;
    padding: 14px 30px;
    display: flex;
    margin-top: 5px;
    margin-bottom: 5px;
    background-color: #E6F6FF;

    &.selectable{
      cursor:pointer;
    }

    span.nimi {
      flex: 1 0 auto;
    }

    span.pituus {
      min-width: 4em;
    }

    span.tyyppi {
      min-width: 6em;
    }

    &.selected {
      background-color: #3367E3;
      color: $white;
    }

    &:hover:not(.selected.selectable) {
      background-color: #C3EAFF;
    }
  }
}
</style>
