<template>
<div>
  <div class="kooste-header">
    <div class="container">
      <div>
        <div class="murupolku">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <router-link class="breadcrumb-home" :to="{ name: 'root' }">
                  <!-- <fas icon="home"></fas> -->
                  {{ $t('eperusteet') }}
                </router-link>
              </li>
              <!-- <li class="breadcrumb-item" :v-for="(item, idx) in items" :key="idx"> -->
              <!--   <router-link class="breadcrumb-normal" :to="{ name: 'root' }">      -->
              <!--     tässä on tekstiä                                               -->
              <!--   </router-link>                                                      -->
              <!-- </li>                                                                 -->
            </ol>
          </nav>
          <slot name="murupolku"></slot>
        </div>
        <div class="nimi">
          <slot name="header"></slot>
        </div>
      </div>
    </div>
  </div>
  <div class="container sisalto">
    <slot></slot>
  </div>
</div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class EpHeader extends Vue {

  get items() {
    return [{
    }];
  }
}
</script>


<style scoped lang="scss">
.kooste-header {
  height: 150px;
  box-shadow: 0 2px 6px 0 rgba(0,45,153,0.08);
  background: #fee; // FIXME: puuttuu kuva

  .murupolku {
    padding-top: 25px;
    height: 75px;
  }

  .nimi {
    margin-top: 0px;
    height: 75px;
    font-size: 28px;
    color: #001A58;
  }

  ol.breadcrumb {
    background: none;
    margin: 0px;
    padding: 0px;

    .breadcrumb-home {
      color: #2B2B2B;
      font-weight: bolder;
    }

    .breadcrumb-normal {
      color: #2B2B2B;
    }
  }
}

.container.sisalto {
  margin-top: 40px;
  margin-bottom: 40px;
}

</style>
