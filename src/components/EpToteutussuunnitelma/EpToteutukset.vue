<template>
  <div>
    <ep-collapse
      v-for="toteutus in toteutukset"
      :key="toteutus.id"
      class="mb-3"
      :shadow="false"
      :border-bottom="false"
      :use-padding="false"
      :expanded-by-default="toteutukset.length === 1"
      blue
    >
      <h4 slot="header">
        {{ $kaanna(toteutus.otsikko) }}
      </h4>

      <template v-if="toteutus.tutkintonimikkeetJaOsaamisalat && toteutus.tutkintonimikkeetJaOsaamisalat.length > 0">
        <div class="font-600 mt-3">
          {{ $t('tutkintonimikkeet-ja-osaamisalat') }}
        </div>
        <b-table
          striped
          :items="toteutus.tutkintonimikkeetJaOsaamisalat"
          :fields="koodiFields"
        />
      </template>

      <div v-if="toteutus.tavatjaymparisto">
        <ep-form-content
          class="col-md-12"
          name="tavat-ja-ymparisto"
        >
          <ep-content-viewer
            :value="$kaanna(toteutus.tavatjaymparisto.teksti)"
            :kuvat="kuvat"
          />
        </ep-form-content>
      </div>

      <div v-if="toteutus.arvioinnista">
        <ep-form-content
          class="col-md-12"
          name="osaamisen-arvioinnista"
        >
          <ep-content-viewer
            :value="$kaanna(toteutus.arvioinnista.teksti)"
            :kuvat="kuvat"
          />
        </ep-form-content>
      </div>

      <div v-if="toteutus.vapaat && toteutus.vapaat.length > 0">
        <ep-form-content
          v-for="(vapaa, index) in toteutus.vapaat"
          :key="'vapaa'+index"
          class="col-md-12 mt-4"
        >
          <label slot="header">{{ $kaanna(vapaa.nimi) }}</label>
          <ep-content-viewer
            :value="$kaanna(vapaa.teksti)"
            :kuvat="kuvat"
          />
          <hr v-if="index < toteutus.length-1">
        </ep-form-content>
      </div>
    </ep-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EpContentViewer from '@shared/components/EpContentViewer/EpContentViewer.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';

@Component({
  components: {
    EpContentViewer,
    EpCollapse,
    EpFormContent,
  },
})
export default class EpToteutukset extends Vue {
  @Prop({ required: true })
  toteutukset!: any[];

  @Prop({ required: true })
  kuvat!: any[];

  get koodiFields() {
    return [{
      key: 'nimi',
      label: this.$t('nimi') as string,
      thStyle: { width: '40%' },
      formatter: (value:any) => {
        return this.$kaanna(value);
      },
    }, {
      key: 'koodiArvo',
      label: this.$t('koodi') as string,
    }] as any[];
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.font-600 {
  font-weight: 600;
}

</style>
