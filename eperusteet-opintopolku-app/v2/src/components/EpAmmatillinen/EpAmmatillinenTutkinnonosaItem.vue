<template>
  <div v-if="sisalto.sisaltotyyppi === 'tutkinnonosa'" class="d-flex" @click.prevent>
    <div v-if="sisalto.tutkinnonosa.tyyppi === 'normaali'">
      <div v-if="sisalto.perusteet.length === 1" class="nimikkeet">
        <span>{{ $kaanna(sisalto.perusteet[0].nimi) }},</span>
        <span v-for="(voimassaolotieto, index) in sisalto.perusteet[0].voimassaoloTieto" :key="'voimassa' + index">
                <span v-if="index > 0">|</span>
                {{$t(voimassaolotieto.teksti)}}: {{ $sd(voimassaolotieto.paiva) }}
              </span>
        <EpVoimassaolo :voimassaolo="sisalto"></EpVoimassaolo>
      </div>

      <EpCollapse v-else
                  :borderBottom="false"
                  :expandedByDefault="false"
                  :chevronLocation="'right'"
                  :use-padding="false">
        <template v-slot:header>
          <span class="ato-text">{{ $t('ammatillinen-tutkinnon-osa') }} | </span>
          <span class="peruste-count">{{ sisalto.perusteet.length }} {{sisalto.perusteet.length > 1 ? $t('tutkinnon-perustetta') : $t('tutkinnon-peruste') }}</span>
        </template>

        <div v-for="(peruste, oidx) in sisalto.perusteet" :key="oidx" class="nimikkeet">
          <router-link :to="{ name: 'tutkinnonosa', params: { perusteId: peruste.id, tutkinnonOsaViiteId: sisalto.id }, query: { redirect: 'true' }}">
            {{ $kaanna(peruste.nimi) }},
          </router-link>
          <div class="peruste-rivi">
                  <span v-for="(voimassaolotieto, index) in peruste.voimassaoloTieto" :key="'voimassa' + index">
                    <span v-if="index > 0">|</span>
                    {{$t(voimassaolotieto.teksti)}}: {{ $sd(voimassaolotieto.paiva) }}
                  </span>
            <EpVoimassaolo :voimassaolo="sisalto"></EpVoimassaolo>
          </div>
        </div>
      </EpCollapse>
    </div>

    <div v-else class="ato-text">
      <span>{{ $t('yhteinen-tutkinnon-osa') }} | </span>
      <span>{{ sisalto.perusteet.length }} {{sisalto.perusteet.length > 1 ? $t('tutkinnon-perustetta') : $t('tutkinnon-peruste') }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import EpVoimassaolo from '@shared/components/EpVoimassaolo/EpVoimassaolo.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';

@Component({
  components: {
    EpCollapse,
    EpVoimassaolo,
  },
})
export default class EpAmmatillinenTutkinnonosaItem extends Vue {
  @Prop({ required: true })
  private sisalto!: any;
}
</script>

<style scoped lang="scss">

.ato-text {
  color: #000;
  font-size: small;
}

.peruste-count {
  color: #3367E3;
  font-size: small;
}

.nimikkeet {
  font-size: small;
  padding-bottom: 5px;

  @media(max-width: 992px) {
    width: 100% !important;
    padding-bottom: 10px;
  }

  .kohde {
    font-weight: 600;
  }
}

.alatiedot {
  font-size: smaller;
}

</style>
