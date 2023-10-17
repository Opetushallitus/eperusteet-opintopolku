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

    <div v-else class="maarays d-flex flex-column flex-md-row">
      <div class="pdf mr-4 mb-4 mr-5">

        <img :src="kuva" :alt="$t('maarays')" class="kuva"/>
        <div class="nimi font-weight-bold d-flex align-items-end">
          <div>{{$kaanna(maarays.nimi)}}</div>
        </div>

      </div>

      <div class="tiedot">
        <ep-form-content name="voimaantulo" headerType="h3" headerClass="h6">
          {{$sd(maarays.voimassaoloAlkaa)}} <EpVoimassaolo :voimassaolo="maarays"/>
        </ep-form-content>

        <ep-form-content name="maarays-annettu" headerType="h3" headerClass="h6">
          {{$sd(maarays.maarayspvm)}}
        </ep-form-content>

        <ep-form-content name="maarayksen-diaarinumero" headerType="h3" headerClass="h6">
          {{ maarays.diaarinumero }}
        </ep-form-content>

        <ep-form-content name="koulutustyyppi" headerType="h3" headerClass="h6">
          {{$t(maarays.koulutustyyppi)}}
        </ep-form-content>

        <ep-form-content name="muuttaa-maaraysta" v-if="maarays.muutettavaMaaraykset.length > 0" headerType="h3" headerClass="h6">
          <router-link v-for="maarays in maarays.muutettavaMaaraykset" :key="'muuttaa'+maarays.id" :to="{name: 'maarays', params: {maaraysId: maarays.id}}" class="d-block">
            {{ $kaanna(maarays.nimi) }} ({{maarays.diaarinumero}})
          </router-link>
        </ep-form-content>

        <ep-form-content name="korvaa-maarayksen" v-if="maarays.korvattavatMaaraykset.length > 0" headerType="h3" headerClass="h6">
          <router-link v-for="maarays in maarays.korvattavatMaaraykset" :key="'korvaa'+maarays.id" :to="{name: 'maarays', params: {maaraysId: maarays.id}}" class="d-block">
            {{ $kaanna(maarays.nimi) }} ({{maarays.diaarinumero}})
          </router-link>
        </ep-form-content>

        <ep-form-content name="kuvaus" headerType="h3" headerClass="h6">
          <ep-content-viewer :value="$kaanna(maarays.kuvaus)"  />
        </ep-form-content>

      </div>
    </div>

  </ep-header>
</template>

<script lang="ts">
import { Maaraykset, MaaraysDto } from '@shared/api/eperusteet';
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

@Component({
  components: {
    EpSpinner,
    EpHeader,
    EpFormContent,
    EpVoimassaolo,
    EpContentViewer,
  },
})
export default class RouteMaarays extends Vue {
  private maarays: MaaraysDto | null = null;

  @Watch('maaraysId', { immediate: true })
  async maaraysChange() {
    this.maarays = null;
    this.maarays = (await Maaraykset.getMaarays(this.maaraysId)).data;
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
      }
      .nimi {
        height: 350px;
        width: 250px;
        margin-top: -360px;
        margin-left: 15px;
        margin-right: 15px;
      }
    }
  }

</style>
