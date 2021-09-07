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

        <div v-if="hasTehtava || hasPerusteenOppianeenTehtava" class="mt-4">
          <h3>{{ $t('tehtava') }}</h3>
          <ep-content-viewer v-if="hasPerusteenOppianeenTehtava"
                             :value="$kaanna(perusteenOppiaine.tehtava.kuvaus)"
                             :termit="termit"
                             :kuvat="kuvat" />
          <ep-content-viewer v-if="hasTehtava"
                             :value="$kaanna(oppiaine.tehtava.kuvaus)"
                             :termit="termit"
                             :kuvat="kuvat" />
        </div>

        <div v-if="hasTavoitteet || hasPerusteenOppiaineenTavoitteet" class="mt-4">
          <h3>{{ $t('tavoitteet') }}</h3>
          <div v-if="hasPerusteenOppiaineenTavoitteet">
            <ep-content-viewer v-if="perusteenOppiaineenTavoitteet"
                              :value="$kaanna(perusteenOppiaineenTavoitteet.kuvaus)"
                              :termit="termit" :kuvat="kuvat" />
            <div v-for="(tavoitealue, idx) in perusteenOppiaineenTavoitteet.tavoitealueet" :key="'perusteenoppianeentavoite'+idx">
              <strong v-if="tavoitealue.nimi">{{ $kaanna(tavoitealue.nimi )}}</strong>
              <div>
                <em v-if="tavoitealue.kohde">{{ $kaanna(tavoitealue.kohde) }}</em>
              </div>
              <ul>
                <li v-for="(tavoite, idx) in tavoitealue.tavoitteet" :key="idx">
                  <span>{{ $kaanna(tavoite) }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div v-if="hasTavoitteet">
            <ep-content-viewer v-if="tavoitteet.kuvaus"
                              :value="$kaanna(tavoitteet.kuvaus)"
                              :termit="termit" :kuvat="kuvat" />
            <div v-for="(tavoitealue, idx) in tavoitteet.tavoitealueet" :key="'tavoite'+idx">
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
        </div>

        <div v-if="hasArviointi || hasPerusteenOppianeenArviointi" class="mt-4">
          <h3>{{ $t('arviointi') }}</h3>

          <ep-content-viewer v-if="hasPerusteenOppianeenArviointi"
                            :value="$kaanna(perusteenOppiaine.arviointi.kuvaus)"
                            :termit="termit"
                            :kuvat="kuvat" />

          <ep-content-viewer v-if="hasArviointi"
                            :value="$kaanna(oppiaine.arviointi.kuvaus)"
                            :termit="termit"
                            :kuvat="kuvat" />
        </div>

        <div v-if="hasLaajaAlainenOsaaminen || hasPerusteenOppiaineenLaajaAlainenOsaaminen" class="mt-4">
          <h3>{{ $t('laaja-alainen-osaaminen') }}</h3>

          <ep-content-viewer v-if="hasPerusteenOppiaineenLaajaAlainenOsaaminen"
                             :value="$kaanna(perusteenOppiaine.laajaAlaisetOsaamiset.kuvaus)"
                             :termit="termit"
                             :kuvat="kuvat" />

          <div v-if="hasLaajaAlainenOsaaminen">
            <ep-content-viewer v-if="oppiaine.laajaAlainenOsaaminen.kuvaus"
                              :value="$kaanna(oppiaine.laajaAlainenOsaaminen.kuvaus)"
                              :termit="termit"
                              :kuvat="kuvat" />
            <div v-for="(lao, idx) in oppiaine.laajaAlainenOsaaminen" :key="'lao'+idx">
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
      </div>

      <div v-if="hasOpiskeluymparistoTyotavat || hasPerusteenOpiskeluymparistoTyotavat" class="mt-4">
        <h3>{{ $t('opiskeluymparisto-ja-tyotavat') }}</h3>
        <ep-content-viewer v-if="hasPerusteenOpiskeluymparistoTyotavat"
                            :value="$kaanna(perusteenOppiaine.opiskeluymparistoTyotavat.kuvaus)"
                            :termit="termit"
                            :kuvat="kuvat" />
        <ep-content-viewer v-if="hasOpiskeluymparistoTyotavat"
                            :value="$kaanna(oppiaine.opiskeluymparistoTyotavat.kuvaus)"
                            :termit="termit"
                            :kuvat="kuvat" />
      </div>

      <div v-if="hasOpintojaksot" class="mt-4">
        <h3 id="opintojaksot">{{ $t('opintojaksot') }}</h3>
        <div v-for="(opintojakso, idx) in opintojaksotExtended" :key="'opintojakso'+idx">
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
import { KoodistoKoodiDto, Opetussuunnitelmat } from '@shared/api/ylops';
import { KoodistoLops2019LaajaAlaiset } from '@shared/utils/perusteet';

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

  private koodit: KoodistoKoodiDto[] = [];

  get opetussuunnitelmaId() {
    return _.toNumber(this.$route.params.opetussuunnitelmaId);
  }

  async mounted() {
    this.koodit = (await Opetussuunnitelmat.getKoodistonKoodit(this.opetussuunnitelmaId, KoodistoLops2019LaajaAlaiset)).data;
  }

  get termit() {
    return this.opetussuunnitelmaDataStore.kaikkiTermit;
  }

  get kuvat() {
    return this.opetussuunnitelmaDataStore.kuvat;
  }

  get oppiaineId() {
    return _.toNumber(this.$route.params.oppiaineId);
  }

  get oppiaine() {
    return this.opetussuunnitelmaDataStore.getJulkaistuSisalto({ id: this.oppiaineId });
  }

  get perusteenOppiaine() {
    if (this.oppiaine.perusteenOppiaineUri) {
      return _.find(this.opetussuunnitelmaDataStore.getJulkaistuPerusteSisalto('lops2019.oppiaineet'), oppiaine => oppiaine.koodi.uri === this.oppiaine.perusteenOppiaineUri);
    }
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

  get hasPerusteenOppianeenTehtava() {
    if (this.perusteenOppiaine) {
      return this.perusteenOppiaine.tehtava && this.perusteenOppiaine.tehtava.kuvaus;
    }
  }

  get tavoitteet() {
    if (this.oppiaine) {
      return this.oppiaine.tavoitteet;
    }
  }

  get hasArviointi() {
    if (this.oppiaine) {
      return this.oppiaine.arviointi && this.oppiaine.arviointi.kuvaus;
    }
  }

  get hasPerusteenOppianeenArviointi() {
    if (this.perusteenOppiaine) {
      return this.perusteenOppiaine.arviointi && this.perusteenOppiaine.arviointi.kuvaus;
    }
  }

  get hasOpiskeluymparistoTyotavat() {
    return this.oppiaine && this.oppiaine.opiskeluymparistoTyotavat && !_.isEmpty(this.oppiaine.opiskeluymparistoTyotavat.kuvaus);
  }

  get hasPerusteenOpiskeluymparistoTyotavat() {
    return this.perusteenOppiaine && this.perusteenOppiaine.opiskeluymparistoTyotavat && !_.isEmpty(this.perusteenOppiaine.opiskeluymparistoTyotavat.kuvaus);
  }

  get perusteenOppiaineenTavoitteet() {
    if (this.perusteenOppiaine) {
      return this.perusteenOppiaine.tavoitteet;
    }
  }

  get hasLaajaAlainenOsaaminen() {
    if (this.oppiaine) {
      return !_.isEmpty(this.oppiaine.laajaAlainenOsaaminen);
    }
  }

  get hasPerusteenOppiaineenLaajaAlainenOsaaminen() {
    if (this.perusteenOppiaine) {
      return this.perusteenOppiaine.laajaAlaisetOsaamiset && this.perusteenOppiaine.laajaAlaisetOsaamiset.kuvaus;
    }
  }

  get hasTavoitteet() {
    if (this.tavoitteet) {
      return !_.isEmpty(this.tavoitteet) && !_.isEmpty(this.tavoitteet.tavoitealueet);
    }
  }

  get hasPerusteenOppiaineenTavoitteet() {
    if (this.perusteenOppiaineenTavoitteet) {
      return !_.isEmpty(this.perusteenOppiaineenTavoitteet) && !_.isEmpty(this.perusteenOppiaineenTavoitteet.tavoitealueet);
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
    if (this.current) {
      const opintojaksot = _.find(this.current.children, { type: 'opintojaksot' });
      if (opintojaksot) {
        return _.map(opintojaksot.children, oj => {
          return {
            ...oj,
            nimi: oj.label,
          };
        });
      }
    }
  }

  get current() {
    return this.opetussuunnitelmaDataStore.current;
  }

  get hasOpintojaksot() {
    return !_.isEmpty(this.opintojaksotExtended);
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.content {
  padding: 0 $content-padding;
}
</style>
