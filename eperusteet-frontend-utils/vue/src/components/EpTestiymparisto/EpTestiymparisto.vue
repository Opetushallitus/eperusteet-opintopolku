<template>
  <div v-if="testiymparisto" class="testiymparisto">
    {{ testiymparisto }}
  </div>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {

  },
})
export default class EpTestiymparisto extends Vue {
  get testiymparistot() {
    return {
      'testiopintopolku': 'QA',
      'untuvaopintopolku': 'Untuva',
      'hahtuvaopintopolku': 'Hahtuva',
      'localhost': 'kehittäjä',
    };
  }

  get testiymparisto() {
    return this.testiymparistot[_.find(_.keys(this.testiymparistot), ymparisto => _.includes(window.location.origin, ymparisto)) || ''];
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.testiymparisto {
    display: inline-block;
    position: fixed;
    top: 10px;
    left: -35px;
    width: 120px;
    padding: 5px;
    z-index: 101;
    font-size: 12px;
    text-align: center;
    color: rgb(255, 255, 255);
    background-color: rgb(229, 57, 53);
    box-shadow: rgba(0, 0, 0, 0.176) 0px 6px 12px;
    transform: rotate(-45deg);
  }

</style>
