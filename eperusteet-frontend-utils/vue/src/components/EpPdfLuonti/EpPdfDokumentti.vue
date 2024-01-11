<template>
  <div>
    <ep-spinner v-if="dokumenttiLataa" />
    <div v-else>
      <div class="row pdf-box align-items-center justify-content-between"
           :class="{'luotu': dokumenttiLuotu, 'ei-luotu': !dokumenttiLuotu, 'polling': polling, 'epaonnistui': dokumenttiEpaonnistui}">
        <div class="col col-auto ikoni">
          <EpMaterialIcon size="48px">picture_as_pdf</EpMaterialIcon>
        </div>
        <div class="col-lg teksti">
            <span v-if="dokumenttiLuotu">
              {{pdfnimi}}.pdf
            </span>
          <span v-else-if="dokumenttiEpaonnistui">
              {{$t('pdf-tiedosto-luonti-epaonnistui')}}
            </span>
          <span v-else>
              {{$t('pdf-tiedostoa-ei-ole-viela-luotu')}}
            </span>
        </div>
        <div class="col-sm-3 text-left luomisaika" v-if="dokumenttiLuotu && !polling">
          <span class="luontitiedot">{{$t('luotu')}}: {{$sdt(dokumentti.valmistumisaika)}}</span>
          <span class="luontitiedot" v-if="dokumentti.julkaisuDokumentti || isKvLiite">{{$t('julkaistu')}}</span>
          <span class="luontitiedot" v-else>{{$t('tyoversio')}}</span>
        </div>
        <div class="col-sm-2 text-left" v-if="dokumenttiLuotu">
          <a class="btn btn-link pl-0" :href="dokumenttiHref" target="_blank" rel="noopener noreferrer" variant="link">
            <EpMaterialIcon class="mr-1" icon-shape="outlined" size="18px">visibility</EpMaterialIcon>
            <span>{{ $t('esikatsele-ja-lataa') }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpButton,
    EpFormContent,
    EpSpinner,
    EpMaterialIcon,
  },
})
export default class EpPdfDokumentti extends Vue {
  @Prop({ required: true })
  protected dokumentti!: any;

  @Prop({ required: true })
  protected dokumenttiHref!: string;

  @Prop({ required: false, default: false })
  protected polling?: boolean;

  @Prop({ required: true })
  protected pdfnimi!: string;

  get dokumenttiLuotu() {
    return this.dokumentti != null && this.dokumenttiHref != null;
  }

  get dokumenttiEpaonnistui() {
    return this.dokumentti && this.dokumentti.tila as any === 'epaonnistui';
  }

  get dokumenttiLataa() {
    return !this.dokumentti || (this.dokumentti.tila as any === 'valmis' && !this.dokumenttiHref);
  }

  get isKvLiite() {
    return this.dokumentti.generatorVersion === 'kvliite';
  }
}

</script>

<style lang="scss" scoped>
@import "@shared/styles/_variables.scss";

.luontitiedot {
  display: block;
}

.pdf-box {
  margin: 25px 0;
  width: 100%;
  border-radius: 2px;
  padding: 25px;

  &.luotu {
    background-color: $gray-lighten-10;

    .ikoni {
      color: $blue-lighten-6;
    }

    @media(max-width: 575px) {

      .ikoni {
        display: none;
      }
    }

    .teksti {
      font-weight: 600;
    }
  }

  &.ei-luotu {
    border: 1px solid $gray-lighten-9;
    color: $gray-lighten-2;
    font-style: italic;
  }

  &.epaonnistui {
    border-color: $red;
    color: $red;
    font-style: normal;
  }

  .polling {
    opacity: 0.5;
  }
}

</style>
