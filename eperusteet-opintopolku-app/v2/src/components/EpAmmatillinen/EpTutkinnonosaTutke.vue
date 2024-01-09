<template>
  <div>
    <ep-form-content class="col-md-12 mb-5" :showHeader="false" v-if="tutkinnonosa.kuvaus">
      <span v-html="$kaanna(tutkinnonosa.kuvaus)" />
    </ep-form-content>

    <ep-form-content class="col-md-12 mb-5" name="osa-alueet" v-if="tutkinnonosa.osaAlueet && osaAlueet.length > 0" header-type="h3">
      <ep-ammatillinen-osaalueet :arviointiasteikot="arviointiasteikot" :osaalueet="osaAlueet" />
    </ep-form-content>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import EpFormContent from '@shared/components/forms/EpFormContent.vue';
import EpCollapse from '@shared/components/EpCollapse/EpCollapse.vue';
import EpAmmatillinenArvioinninKohdealueet from '@/components/EpAmmatillinen/EpAmmatillinenArvioinninKohdealueet.vue';
import EpAmmatillinenOsaalueet from '@/components/EpAmmatillinen/EpAmmatillinenOsaalueet.vue';
import * as _ from 'lodash';
import { Kielet } from '@shared/stores/kieli';

@Component({
  components: {
    EpFormContent,
    EpCollapse,
    EpAmmatillinenArvioinninKohdealueet,
    EpAmmatillinenOsaalueet,
  },
})
export default class EpTutkinnonosaTutke extends Vue {
  @Prop({ required: true })
  private tutkinnonosa: any;

  @Prop({ required: true })
  private arviointiasteikot!: any[];

  @Prop({ required: false })
  private perusteenKielet?: any[];

  get sisaltoKieli() {
    return Kielet.getSisaltoKieli.value;
  }

  get osaAlueet() {
    return _.filter(this.tutkinnonosa.osaAlueet, osaalue => !!osaalue.nimi[this.sisaltoKieli]);
  }
}
</script>

<style scoped lang="scss">

</style>
