<template>
  <ep-header tyyppi="maarayskokoelma" :murupolku="murupolku">
    <template slot="header">
      <div>
        <EpSpinner v-if="!maarays"/>
        <template v-else>
          {{$kaanna(maarays.nimi)}}

          <div class="d-flex mt-3">
            <div class="asiasana mr-2" v-for="(asiasana, index) in maarays.asiasanat[kieli].asiasana" :key="'asiasana' + index">
              {{ asiasana }}
            </div>
          </div>
        </template>

      </div>
    </template>

    <EpSpinner v-if="!maarays"/>

    <div v-else class="maarays d-flex flex-column-reverse flex-md-row">
      <div class="pdf mr-4 mb-4 mr-5">

        <img :src="kuva" :alt="$t('maarays')" class="kuva"/>
        <div class="nimi font-weight-bold d-flex align-items-end">
          <div>{{$kaanna(maarays.nimi)}}</div>
        </div>

        <a class="url d-inline-flex" v-if="maaraysPdfUrl" :href="maaraysPdfUrl" target="_blank" rel="noopener noreferrer">
          <div>{{$t('avaa-maarays-pdf')}}</div>
          <EpMaterialIcon class="ml-3">arrow_forward</EpMaterialIcon>
        </a>
      </div>

      <div class="tiedot">
        <ep-form-content name="voimaantulo" headerType="h3" headerClass="h6">
          {{$sd(maarays.voimassaoloAlkaa)}} <EpVoimassaolo :voimassaolo="maarays"/>
        </ep-form-content>

        <ep-form-content name="maarayksen-paatospaivamaara" headerType="h3" headerClass="h6">
          {{$sd(maarays.maarayspvm)}}
        </ep-form-content>

        <ep-form-content name="maarayksen-diaarinumero" headerType="h3" headerClass="h6">
          {{ maarays.diaarinumero }}
        </ep-form-content>

        <ep-form-content v-if="peruste" name="peruste" headerType="h3" headerClass="h6">
          <router-link :to="perusteRoute">
            {{$kaanna(peruste.nimi)}}
          </router-link>
        </ep-form-content>

        <ep-form-content name="koulutus-tai-tutkinto" headerType="h3" headerClass="h6">
          <KoulutustyyppiSelect v-for="koulutustyyppi in maarays.koulutustyypit" :key="koulutustyyppi" :value="koulutustyyppi" nocolor/>
        </ep-form-content>

        <ep-form-content v-if="liittyykoToiseenMaaraykseenOtsikko" :name="liittyykoToiseenMaaraykseenOtsikko" headerType="h3" headerClass="h6">
          <router-link v-for="muuttuva in maarays.muutettavatMaaraykset" :key="'muuttaa'+muuttuva.id" :to="{name: 'maarays', params: {maaraysId: muuttuva.id}}" class="d-block">
            {{ $kaanna(muuttuva.nimi) }} ({{muuttuva.diaarinumero}})
          </router-link>

          <router-link v-for="korvattava in maarays.korvattavatMaaraykset" :key="'korvaa'+korvattava.id" :to="{name: 'maarays', params: {maaraysId: korvattava.id}}" class="d-block">
            {{ $kaanna(korvattava.nimi) }} ({{korvattava.diaarinumero}})
          </router-link>

          <div v-if="maarays.muutettavatMaaraykset.length === 0 && maarays.korvattavatMaaraykset.length === 0">{{$t('maaraysta-ei-loydy-maarayskokoelmasta')}}</div>
        </ep-form-content>

        <ep-form-content name="kuvaus" headerType="h3" headerClass="h6">
          <ep-content-viewer :value="$kaanna(maarays.kuvaus)"  />
        </ep-form-content>

        <ep-form-content name="liitteet" headerType="h3" headerClass="h6" v-if="liitteet.length > 0">
          <div v-for="liite in liitteet" :key="'liite'+liite.id">
            <a :href="liite.url" target="_blank" rel="noopener noreferrer">{{$kaanna(liite.nimi)}}</a> <span>(pdf)</span>
          </div>
        </ep-form-content>

      </div>
    </div>

  </ep-header>
</template>

<script lang="ts">
import { Maaraykset, MaarayksetParams, MaaraysDto, MaaraysLiiteDtoTyyppiEnum, baseURL, MaaraysDtoLiittyyTyyppiEnum, Perusteet, PerusteDto } from '@shared/api/eperusteet';
import * as _ from 'lodash';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpHeader from '@/components/EpHeader/EpHeader.vue';
import { Kielet } from '@shared/stores/kieli';
import maaraysDoc from '@assets/img/images/maarays_doc.svg';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpVoimassaolo from '@shared/components/EpVoimassaolo/EpVoimassaolo.vue';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import { Meta } from '@shared/utils/decorators';
import EpMaterialIcon from '@shared/components//EpMaterialIcon/EpMaterialIcon.vue';
import KoulutustyyppiSelect from '@shared/components/forms/EpKoulutustyyppiSelect.vue';
import { koulutustyyppiTheme } from '@shared/utils/perusteet';

@Component({
  components: {
    EpSpinner,
    EpHeader,
    EpFormContent,
    EpVoimassaolo,
    EpContentViewer,
    EpMaterialIcon,
    KoulutustyyppiSelect,
  },
})
export default class RouteMaarays extends Vue {
  private maarays: MaaraysDto | null = null;
  private peruste: PerusteDto | null = null;

  @Watch('maaraysId', { immediate: true })
  async maaraysChange() {
    this.maarays = null;
    this.maarays = (await Maaraykset.getMaarays(this.maaraysId)).data;
    if (this.maarays.peruste) {
      this.peruste = (await Perusteet.getPerusteenTiedot(this.maarays.peruste.id!)).data;
    }
  }

  @Meta
  getMetaInfo() {
    return {
      title: this.maarays ? this.$kaanna(this.maarays.nimi) : this.$t('maarays'),
    };
  }

  get maaraysId() {
    return _.toNumber(this.$route.params.maaraysId);
  }

  get kieli() {
    return Kielet.getSisaltoKieli.value;
  }

  get kuva() {
    return maaraysDoc;
  }

  get murupolku() {
    return [
      {
        label: 'route-maarayskokoelma',
        location: {
          name: 'maaraykset',
        },
      },
      {
        label: 'tiedot',
        location: {
          name: 'maarays',
          params: {
            maaraysId: this.maaraysId,
          },
        },
      },
    ];
  }

  get liitteet() {
    return _.chain(this.kaikkiLiitteet)
      .filter(liite => liite.tyyppi !== MaaraysLiiteDtoTyyppiEnum.MAARAYSDOKUMENTTI)
      .map(liite => {
        return {
          ...liite,
          url: baseURL + MaarayksetParams.getMaaraysLiite(_.toString(liite.id)).url,
        };
      })
      .value();
  }

  get kaikkiLiitteet() {
    if (this.maarays?.liitteet) {
      return this.maarays?.liitteet[this.kieli].liitteet;
    }
  }

  get maaraysPdfUrl() {
    const maaraysLiite = _.find(this.kaikkiLiitteet, liite => liite.tyyppi === MaaraysLiiteDtoTyyppiEnum.MAARAYSDOKUMENTTI);
    if (maaraysLiite) {
      return baseURL + MaarayksetParams.getMaaraysLiite(_.toString(maaraysLiite.id)).url;
    }

    if (this.peruste && this.maarayskirje) {
      return `${baseURL}/perusteet/${this.peruste.id!}/liitteet/${this.maarayskirje.id}`;
    }
  }

  get maarayskirje() {
    if (this.peruste?.maarayskirje?.liitteet) {
      return this.peruste?.maarayskirje?.liitteet[this.kieli] || null;
    }
  }

  get liittyykoToiseenMaaraykseenOtsikko() {
    if (this.maarays?.liittyyTyyppi === MaaraysDtoLiittyyTyyppiEnum.EILIITY) {
      return null;
    }

    if (this.maarays?.liittyyTyyppi === MaaraysDtoLiittyyTyyppiEnum.MUUTTAA) {
      return 'muuttaa-maaraysta';
    }

    if (this.maarays?.liittyyTyyppi === MaaraysDtoLiittyyTyyppiEnum.KORVAA) {
      return 'korvaa-maarayksen';
    }
  }

  get perusteRoute() {
    if (this.peruste) {
      return {
        name: 'peruste',
        params: {
          koulutustyyppi: koulutustyyppiTheme(this.peruste.koulutustyyppi!),
          perusteId: _.toString(this.peruste.id),
        },
      };
    }
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .asiasana {
    font-size: 0.7rem;
    font-weight: 400;

    padding: 5px 10px;
    border: 1px solid $gray-lighten-3;
    border-radius: 10px;
    background-color: $gray-lighten-5;
  }

  .maarays {
    .pdf {
      .kuva {
        height: 350px;

        @media (max-width: 767.98px) {
          display:none;
        }
      }
      .nimi {
        height: 350px;
        width: 250px;
        margin-top: -360px;
        margin-left: 15px;
        margin-right: 15px;
        margin-bottom: 30px;

        @media (max-width: 767.98px) {
          display:none !important;
        }
      }
      .url {
        color: $white;
        background-color: $blue-lighten-5;
        padding: 10px 20px;
        display: inline-block;
        border-radius: 2rem;
      }
    }
  }

</style>
