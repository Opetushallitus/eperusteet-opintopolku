<template>
  <div v-if="kooditPerusteilla && kooditPerusteilla.length > 0">
    <div class="d-flex">
      <slot name="header" />

      <template v-if="perusteelliset.length > 0">
        <a
          :id="popovertarget"
          href="javascript:;"
          class="peruste-popover ml-3"
        >
          {{ $t('nayta-perusteet') }}
        </a>
        <b-popover
          :target="popovertarget"
          :placement="'right'"
          triggers="hover"
        >
          <div class="p-1">
            <slot name="popover-header" />
            <div
              v-for="koodi in perusteelliset"
              :key="koodi.uri"
              class="mt-4 koodi"
            >
              <h4>{{ $kaanna(koodi.nimi) }}</h4>
              <div
                v-for="peruste in koodi.perusteet"
                :key="koodi.uri+peruste.id"
                class="peruste p-2"
              >
                <router-link :to="{ name: 'peruste', params: { perusteId: peruste.id, koulutustyyppi: 'ammatillinen' } }">
                  {{ $kaanna(peruste.nimi) }}
                </router-link>
              </div>
            </div>
          </div>
        </b-popover>
      </template>
    </div>
    <span
      v-for="(koodi,index) in kooditPerusteilla"
      :key="'koodi'+koodi.uri"
    >
      <span v-if="index > 0">, </span>
      <span>{{ $kaanna(koodi.nimi) }}</span>
    </span>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { KoodiPerusteella } from '@/stores/TiedoteStore';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { KoodiDto } from '@shared/api/eperusteet';
import _ from 'lodash';

@Component({
  components: {
    EpSpinner,
  },
})
export default class UutisenKoodit extends Vue {
  @Prop({ required: true })
  private kooditPerusteilla!: KoodiPerusteella[];

  get popovertarget() {
    return this.kooditPerusteilla[0].uri;
  }

  get perusteelliset() {
    return _.filter(this.kooditPerusteilla, koodi => !_.isEmpty(koodi.perusteet));
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.peruste-popover {
  font-size: 0.8rem;
}

.koodi {
  .peruste:nth-of-type(even) {
    background-color: $table-even-row-bg-color;
  }
  .peruste:nth-of-type(odd) {
    background-color: $table-odd-row-bg-color;
  }
}

</style>
