<template>
  <div v-if="valmaTelmaSisalto">
    <template v-if="valmaTelmaSisalto.osaamistavoite && valmaTelmaSisalto.osaamistavoite.length > 0">
      <div
        v-for="(osaamistavoite, index) in valmaTelmaSisalto.osaamistavoite"
        :key="'osaamistavoite'+index"
        class="mb-5"
      >
        <h3>{{ $kaanna(osaamistavoite.nimi) }}</h3>
        <h4 class="mt-3">
          {{ $kaanna(osaamistavoite.kohde) }}
        </h4>
        <ul>
          <li
            v-for="(tavoite, tindex) in osaamistavoite.tavoitteet"
            :key="'osaamistavoitetavoite'+tindex"
          >
            {{ $kaanna(tavoite) }}
          </li>
        </ul>
      </div>
    </template>

    <template v-if="valmaTelmaSisalto.osaamisenarviointiTekstina || valmaTelmaSisalto.osaamisenarviointi">
      <h3>{{ $t('osaamisen-arviointi') }}</h3>

      <template v-if="valmaTelmaSisalto.osaamisenarviointi">
        <h4 class="mt-3">
          {{ $kaanna(valmaTelmaSisalto.osaamisenarviointi.kohde) }}
        </h4>

        <ul>
          <li
            v-for="(tavoite, tindex) in valmaTelmaSisalto.osaamisenarviointi.tavoitteet"
            :key="'osaamisenarviointitavoite'+tindex"
          >
            {{ $kaanna(tavoite) }}
          </li>
        </ul>
      </template>

      <div v-if="valmaTelmaSisalto.osaamisenarviointiTekstina">
        <span v-html="$kaanna(valmaTelmaSisalto.osaamisenarviointiTekstina)" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class EpValmaTelmaSisalto extends Vue {
  @Prop()
  private valmaTelmaSisalto!: any;
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

</style>
