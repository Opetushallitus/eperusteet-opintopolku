<template>
  <div v-if="muutostiedot" class="muutostiedot">
    <div v-if="muutostiedot.length > 0">
      <div v-for="(kohdeTapahtumat, index) in muutostiedot" :key="index">
        <ep-form-content :name="kohdeTapahtumat.kohde" headerType="h3" headerClass="h6">
          <div v-for="(tapahtuma, index) in kohdeTapahtumat.tapahtumat" :key="index">
            {{ $t('muutoshistoria-' + tapahtuma.tapahtuma)}}
            <ul>
              <li v-for="(tieto, i) in tapahtuma.muokkaustiedot" :key="i">
                <EpRouterLink :muokkaustieto="tieto"></EpRouterLink>
              </li>
            </ul>
          </div>
        </ep-form-content>
        <hr v-if="index !== muutostiedot.length - 1">
      </div>
    </div>
    <div v-if="muutostiedot.length === 0">
      {{ $t('muutostietoja-ei-ole-saatavilla') }}
    </div>
  </div>
  <div v-else>
    <EpSpinner/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import { MuokkaustietoStore } from '@shared/stores/MuokkaustietoStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import EpRouterLink from '@shared/components/EpJulkaisuHistoriaJulkinen/EpRouterLink.vue';

@Component({
  components: {
    EpFormContent,
    EpSpinner,
    EpRouterLink,
  },
})
export default class EpMuutosvertailu extends Vue {
  @Prop({ required: true })
  private julkaisu!: any;

  private muokkaustietoStore = new MuokkaustietoStore();

  async mounted() {
    await this.muokkaustietoStore.getVersionMuutokset(this.julkaisuData.peruste.id, this.julkaisuData.revision);
  }

  get julkaisuData() {
    return this.julkaisu;
  }

  get muutostiedot() {
    return this.muokkaustietoStore.muutostiedot.value;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables';

.muutostiedot {
  background-color: $blue-lighten-8;
  border: 1px solid $blue-lighten-4;
  padding: 15px;
}

ul.no-bullets {
  list-style-type: none;
}
</style>
