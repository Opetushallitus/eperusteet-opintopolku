<template>
  <span class="material-icons-outlined clickable numerointi" :class="{'numerointi-active': model}" @click="toggleNumerointi">format_list_numbered</span>
</template>

<script lang="ts">
import * as _ from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  components: {

  },
})
export default class NavigateNumberToggle extends Vue {
  @Prop({ required: true })
  private value!: boolean;

  get model() {
    return this.value;
  }

  set model(value) {
    this.$emit('input', value);
  }

  toggleNumerointi() {
    this.model = !this.model;
  }
}
</script>

<style scoped lang="scss">
@import '@shared/styles/_variables.scss';

.numerointi {
  font-size: 2rem;
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently */

  &-active {
    color: $blue-lighten-5;
  }
}

</style>
