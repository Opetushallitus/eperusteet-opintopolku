<template>
<div>
  <div>
    <router-view />
  </div>
  <ep-footer />
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  EpFooter,
} from '@/components';

@Component({
  components: {
    EpFooter,
  },
})
export default class Root extends Vue {
}
</script>
