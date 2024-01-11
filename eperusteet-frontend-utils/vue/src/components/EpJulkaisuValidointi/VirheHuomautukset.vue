<template>
  <div>
    <div class="validointi p-2" v-for="(virhehuomautus, index) in virhehuomautukset" :key="'virheet'+index">
      <router-link v-if="virhehuomautus.route" :to="virhehuomautus.route">
        <IkoniTeksti :tyyppi="tyyppi">
          {{$t(virhehuomautus.kuvaus)}}
          <span v-if="virhehuomautus.navigationNode && virhehuomautus.navigationNode.label">({{$kaanna(virhehuomautus.navigationNode.label)}})</span>
        </IkoniTeksti>
      </router-link>
      <IkoniTeksti v-else :tyyppi="tyyppi">
        {{$t(virhehuomautus.kuvaus)}}
        <span v-if="virhehuomautus.navigationNode &&  virhehuomautus.navigationNode.label">({{$kaanna(virhehuomautus.navigationNode.label)}})</span>
      </IkoniTeksti>
    </div>
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';
import { VirheHuomautus } from './EpJulkaisuValidointi.vue';
import IkoniTeksti from './IkoniTeksti.vue';

@Component({
  components: {
    IkoniTeksti,
  },
})
export default class VirheHuomautukset extends Vue {
  @Prop({ required: true })
  private virhehuomautukset!: VirheHuomautus[];

  @Prop({ required: true })
  private tyyppi!: 'virhe' | 'huomautus';
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

  .validointi {
    &:nth-of-type(even) {
      background-color: $table-even-row-bg-color;
    }
    &:nth-of-type(odd) {
      background-color: $table-odd-row-bg-color;
    }
  }

</style>
