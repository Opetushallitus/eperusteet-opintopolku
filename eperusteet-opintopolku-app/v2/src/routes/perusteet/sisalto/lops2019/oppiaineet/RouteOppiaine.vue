<template>
<div id="default-anchor" class="content">
    <div v-if="oppiaine">
        <h2 class="otsikko" slot="header">{{ $kaanna(oppiaine.nimi) }}</h2>

        <div class="teksti">
            <div v-if="koodi">
                <strong>{{ $t('koodi') }}</strong>
                <p>{{ koodi.arvo }}</p>
            </div>

            <div v-if="hasTehtava">
                <h3>{{ $t('oppiaine-ja-tehtava') }}</h3>
                <div v-html="$kaanna(oppiaine.tehtava.kuvaus)"></div>
            </div>

            <div v-if="hasLaajaAlaiset">
                <h3>{{ $t('laaja-alaiset-osaamiset') }}</h3>
                <div v-html="$kaanna(oppiaine.laajaAlaisetOsaamiset.kuvaus)"></div>
            </div>

            <div v-if="hasTavoitteet">
                <h3>{{ $t('tavoitteet') }}</h3>
                <div v-if="tavoitteet.kuvaus" v-html="$kaanna(tavoitteet.kuvaus)"></div>
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
                <div v-html="$kaanna(oppiaine.arviointi.kuvaus)"></div>
            </div>

            <div v-if="hasModuulit">
                <h3>{{ $t('moduulit') }}</h3>

                <div v-if="hasPakollisetModuulit">
                    <h4>{{ $t('pakolliset-moduulit') }}</h4>
                    <div v-if="oppiaine.pakollisetModuulitKuvaus" v-html="$kaanna(oppiaine.pakollisetModuulitKuvaus)"></div>
                    <div v-for="(moduuli, idx) in pakollisetModuulit"
                         :key="idx">
                        <router-link :to="{ name: 'lops2019moduuli', params: { moduuliId: moduuli.id } }">
                            {{ $kaanna(moduuli.nimi) }}
                        </router-link>
                    </div>
                </div>

                <div v-if="hasValinnaisetModuulit">
                    <h4>{{ $t('valinnaiset-moduulit') }}</h4>
                    <div v-if="oppiaine.valinnaisetModuulitKuvaus" v-html="$kaanna(oppiaine.valinnaisetModuulitKuvaus)"></div>
                    <div v-for="(moduuli, idx) in valinnaisetModuulit"
                         :key="idx">
                        <router-link :to="{ name: 'lops2019moduuli', params: { moduuliId: moduuli.id } }">
                            {{ $kaanna(moduuli.nimi) }}
                        </router-link>
                    </div>
                </div>
            </div>

            <div v-if="hasOppimaarat">
                <h3>{{ $t('oppimaarat') }}</h3>
                <div v-for="(oppimaara, idx) in oppimaarat"
                     :key="idx">
                    <router-link :to="{ name: 'lops2019oppiaine', params: { oppiaineId: oppimaara.id } }">
                        {{ $kaanna(oppimaara.nimi) }}
                    </router-link>
                </div>
            </div>
        </div>

        <ep-previous-next-navigation :active-node="current" :flattened-sidenav="flattenedSidenav"></ep-previous-next-navigation>
    </div>
    <ep-spinner v-else />
</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Lops2019OppiaineStore } from '@/stores/Lops2019OppiaineStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { PerusteDataStore } from '@/stores/PerusteDataStore';
import EpPreviousNextNavigation from  '@/components/EpPreviousNextNavigation/EpPreviousNextNavigation.vue';

@Component({
  components: {
    EpSpinner,
    EpPreviousNextNavigation,
  }
})
export default class RouteOppiaine extends Vue {

  @Prop({ required: true })
  private perusteDataStore!: PerusteDataStore;

  @Prop({ required: true })
  private lops2019oppiaineStore!: Lops2019OppiaineStore;

  get oppiaine() {
    return this.lops2019oppiaineStore.oppiaine;
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

  get hasPakollisetModuulit() {
    return !_.isEmpty(this.pakollisetModuulit);
  }

  get valinnaisetModuulit() {
    return _.filter(this.moduulit, { pakollinen: false });
  }

  get hasValinnaisetModuulit() {
    return !_.isEmpty(this.valinnaisetModuulit);
  }

  get oppimaarat() {
    if (this.oppiaine) {
      return this.oppiaine.oppimaarat;
    }
  }

  get hasOppimaarat() {
    return !_.isEmpty(this.oppimaarat);
  }

  get current() {
    return this.perusteDataStore.current;
  }

  get flattenedSidenav() {
    return this.perusteDataStore.flattenedSidenav;
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
