<template>
<div>
  <router-view />
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as _ from 'lodash';

@Component
export default class App extends Vue {

}
</script>

<style lang="scss" src="@shared/styles/app.scss"></style>
