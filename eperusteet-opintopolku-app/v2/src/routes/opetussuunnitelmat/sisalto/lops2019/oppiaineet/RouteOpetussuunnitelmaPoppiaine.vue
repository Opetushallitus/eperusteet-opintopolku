<template>
<div class="content">
  <div v-if="oppiaine">
    <h2 class="otsikko" slot="header">{{ $kaanna(oppiaine.nimi) }}</h2>

    <div class="teksti">
      <div>
        <div v-if="koodi">
          <strong>{{ $t('koodi') }}</strong>
          <p>{{ koodi }}</p>
        </div>

        <div v-if="hasTehtava">
          <h3>{{ $t('tehtava') }}</h3>
          <ep-content-viewer v-if="oppiaine.tehtava.kuvaus"
                             :value="$kaanna(oppiaine.tehtava.kuvaus)"
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
            <div>
              <em v-if="tavoitealue.kohde">{{ $kaanna(tavoitealue.kohde) }}</em>
            </div>
            <ul>
              <li v-for="(tavoite, idx) in tavoitealue.tavoitteet" :key="idx">
                <span>{{ $kaanna(tavoite.tavoite) }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div v-if="hasLaajaAlainenOsaaminen">
          <h3>{{ $t('laaja-alainen-osaaminen') }}</h3>
          <ep-content-viewer v-if="oppiaine.laajaAlainenOsaaminen.kuvaus"
                             :value="$kaanna(oppiaine.laajaAlainenOsaaminen.kuvaus)"
                             :termit="termit"
                             :kuvat="kuvat" />
          <div v-for="(lao, idx) in oppiaine.laajaAlainenOsaaminen" :key="idx">
            <div v-if="kooditFormatted[lao.koodi]">
              <strong>
                {{ $kaanna(kooditFormatted[lao.koodi].nimi) }}{{ kooditFormatted[lao.koodi].koodiArvo ? ' (' + kooditFormatted[lao.koodi].koodiArvo + ')' : ''}}
              </strong>
              <ep-content-viewer :value="$kaanna(lao.kuvaus)"
                                 :termit="termit"
                                 :kuvat="kuvat" />
            </div>
          </div>
        </div>
      </div>

      <div v-if="hasOpintojaksot">
        <h3 id="opintojaksot">{{ $t('opintojaksot') }}</h3>
        <div v-for="(opintojakso, idx) in opintojaksotExtended" :key="idx">
          <router-link v-if="opintojakso.location" :to="opintojakso.location">
            {{ $kaanna(opintojakso.nimi) }}
            <span v-if="opintojakso.laajuus">
              ({{ opintojakso.laajuus }} op)
            </span>
          </router-link>
        </div>
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

import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpColorIndicator from '@shared/components/EpColorIndicator/EpColorIndicator.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import OppiaineEsitys from '@/routes/perusteet/sisalto/lops2019/oppiaineet/OppiaineEsitys.vue';
import { OpetussuunnitelmaDataStore } from '@/stores/OpetussuunnitelmaDataStore';
import { Lops2019OpetussuunnitelmaPoppiaineStore } from '@/stores/Lops2019OpetussuunnitelmaPoppiaineStore';

@Component({
  components: {
    EpSpinner,
    EpColorIndicator,
    EpContentViewer,
    OppiaineEsitys,
  },
})
export default class RouteOpetussuunnitelmaPoppiaine extends Vue {
  @Prop({ required: true })
  private opetussuunnitelmaDataStore!: OpetussuunnitelmaDataStore;

  @Prop({ required: true })
  private lops2019OpetussuunnitelmaPoppiaineStore!: Lops2019OpetussuunnitelmaPoppiaineStore;

  get termit() {
    return this.opetussuunnitelmaDataStore.termit;
  }

  get kuvat() {
    return this.opetussuunnitelmaDataStore.kuvat;
  }

  get oppiaine() {
    return this.lops2019OpetussuunnitelmaPoppiaineStore.oppiaine;
  }

  get koodit() {
    return this.lops2019OpetussuunnitelmaPoppiaineStore.koodit;
  }

  get kooditFormatted() {
    const koodit: any = {};
    if (this.koodit) {
      _.each(this.koodit, koodi => {
        koodit[koodi.koodiUri!] = koodi;
      });
    }
    return koodit;
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

  get hasLaajaAlainenOsaaminen() {
    if (this.oppiaine) {
      return !_.isEmpty(this.oppiaine.laajaAlainenOsaaminen);
    }
  }

  get opintojaksot() {
    if (this.oppiaine && this.oppiaine.koodi) {
      return _.filter(this.opetussuunnitelmaDataStore.opintojaksot, oj => {
        const uri = this.oppiaine!.koodi!;
        return _.some(oj.oppiaineet, { koodi: uri });
      });
    }
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
        };
      });
    }
  }

  get hasOpintojaksot() {
    return !_.isEmpty(this.opintojaksot);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
