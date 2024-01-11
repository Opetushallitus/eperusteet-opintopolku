<template>
  <div>
    <div v-if="isEditing">

      <draggable
        v-bind="tavoitealueOptions"
        tag="div"
        v-model="tavoitealueet">

        <div v-for="(tavoitealue, tavoitealueIndex) in tavoitealueet" :key="'tavoite'+tavoitealueIndex" class="pb-2 tavoitealue editing">
          <div v-if="tavoitealue.tavoiteAlueTyyppi === 'OTSIKKO'" class="m-2">
            <div class="order-handle m-2" slot="left">
              <EpMaterialIcon>drag_indicator</EpMaterialIcon>
              <span class="otsikko"> {{$t('tavoitealueen-otsikko')}}</span>
            </div>
            <b-row>
              <b-col cols="11">
                <ep-koodisto-select :store="tavoitealueetKoodisto" v-model="tavoitealue.otsikko" :is-editing="isEditing" :naytaArvo="false">
                  <template #default="{ open }">
                    <b-input-group>
                      <b-form-input
                        :value="tavoitealue.otsikko ? $kaanna(tavoitealue.otsikko.nimi) : ''"
                        disabled></b-form-input>
                      <b-input-group-append>
                        <b-button @click="open" variant="primary">
                          {{ $t('hae-koodistosta') }}
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </template>
                </ep-koodisto-select>
              </b-col>
              <b-col cols="1">
                <div class="default-icon clickable mt-2" @click="poistaTavoitealue(tavoitealue)">
                  <EpMaterialIcon icon-shape="outlined" :color="'inherit'">delete</EpMaterialIcon>
                </div>
              </b-col>
            </b-row>
          </div>

          <div v-if="tavoitealue.tavoiteAlueTyyppi === 'TAVOITESISALTOALUE'" class="m-2 tavoitesisaltoalue">
            <div class="order-handle m-2" slot="left">
              <EpMaterialIcon>drag_indicator</EpMaterialIcon>
              <span class="otsikko pl-1"> {{$t('tavoitteet')}}</span>
            </div>
            <div class="ml-4">
              <EpTavoitealueTavoitteet v-model="tavoitealue.tavoitteet" />
            </div>
            <div class="mt-3 ml-4">
              <div class="otsikko mb-2"> {{$t('keskeiset-sisaltoalueet')}}</div>
              <EpTavoitealueKeskeisetSisaltoalueet v-model="tavoitealue.keskeisetSisaltoalueet"  />
            </div>
            <div class="text-right">
              <ep-button variant="link" @click="poistaTavoitealue(tavoitealue)" icon="delete">
                {{ $t('poista-tavoitteet-ja-sisaltoalueet') }}
              </ep-button>
            </div>
          </div>
        </div>
      </draggable>

      <div class="d-flex flex-column">
        <ep-button variant="outline" icon="add" @click="lisaaTavoitealue('OTSIKKO')">
          {{ $t('lisaa-tavoitealueen-otsikko') }}
        </ep-button>
        <ep-button variant="outline" icon="add" @click="lisaaTavoitealue('TAVOITESISALTOALUE')">
          {{ $t('lisaa-tavoitteet-ja-sisaltoalueet') }}
        </ep-button>
      </div>

    </div>

    <div v-if="!isEditing">

      <div v-for="(tavoitealue, tavoitealueIndex) in tavoitealueet" :key="'tavoite'+tavoitealueIndex" class="tavoitealue">
        <template v-if="tavoitealue.tavoiteAlueTyyppi === 'OTSIKKO'">
          <hr v-if="tavoitealueIndex > 0" class="mt-0 mb-5"/>
          <div class="otsikko mb-3">{{$kaanna(tavoitealue.otsikko.nimi)}}</div>
        </template>

        <div v-if="tavoitealue.tavoiteAlueTyyppi === 'TAVOITESISALTOALUE'" class="tavoitesisaltoalue mb-5">

          <div v-if="tavoitealue.tavoitteet && tavoitealue.tavoitteet.length > 0" class="mb-45">
            <div class="tavoitteet mb-2">{{$t('tavoitteet')}}</div>
            <div v-for="(tavoite, index) in tavoitealue.tavoitteet" :key="tavoitealueIndex+'tavoitealue'+index" class="tavoite mb-3">
              {{$kaanna(tavoite.nimi)}}
            </div>
          </div>

          <div v-if="tavoitealue.keskeisetSisaltoalueet && tavoitealue.keskeisetSisaltoalueet.length > 0">
            <div class="tavoitteet mb-2">{{$t('keskeiset-sisaltoalueet')}}</div>
            <div v-for="(keskeisetSisaltoalueet, index) in tavoitealue.keskeisetSisaltoalueet" :key="tavoitealueIndex+'tavoitealue'+index" class="keskeinensisaltoalue p-2">
              {{$kaanna(keskeisetSisaltoalueet)}}
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import _ from 'lodash';
import { KoodistoSelectStore } from '../EpKoodistoSelect/KoodistoSelectStore';
import { Koodisto } from '@shared/api/eperusteet';
import draggable from 'vuedraggable';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpKoodistoSelect from '@shared/components/EpKoodistoSelect/EpKoodistoSelect.vue';
import EpTavoitealueKeskeisetSisaltoalueet from './EpTavoitealueKeskeisetSisaltoalueet.vue';
import EpTavoitealueTavoitteet from './EpTavoitealueTavoitteet.vue';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  components: {
    EpKoodistoSelect,
    EpButton,
    draggable,
    EpTavoitealueKeskeisetSisaltoalueet,
    EpTavoitealueTavoitteet,
    EpMaterialIcon,
  },
})
export default class EpTavoitesisaltoalueTavoitealueet extends Vue {
  @Prop({ required: true })
  private value!: any[];

  @Prop({ required: false, default: false, type: Boolean })
  private isEditing!: boolean;

  get tavoitealueet() {
    return this.value;
  }

  set tavoitealueet(value) {
    this.$emit('input', value);
  }

  private readonly tavoitealueetKoodisto = new KoodistoSelectStore({
    koodisto: 'tavoitealueet',
    async query(query: string, sivu = 0, koodisto: string) {
      const { data } = (await Koodisto.kaikkiSivutettuna(koodisto, query, {
        params: {
          sivu,
          sivukoko: 10,
        },
      }));
      return data as any;
    },
  });

  lisaaTavoitealue(tyyppi: 'OTSIKKO' | 'TAVOITESISALTOALUE') {
    this.tavoitealueet = [
      ...this.tavoitealueet,
      {
        tavoiteAlueTyyppi: tyyppi,
        ...(tyyppi === 'TAVOITESISALTOALUE' && { tavoitteet: [] }),
        ...(tyyppi === 'TAVOITESISALTOALUE' && { keskeisetSisaltoalueet: [] }),
      },
    ];
  }

  poistaTavoitealue(tavoitealue) {
    this.tavoitealueet = _.filter(this.tavoitealueet, rivi => rivi !== tavoitealue);
  }

  get defaultDragOptions() {
    return {
      animation: 300,
      emptyInsertThreshold: 10,
      handle: '.order-handle',
      disabled: !this.isEditing,
      ghostClass: 'dragged',
    };
  }
  get tavoitealueOptions() {
    return {
      ...this.defaultDragOptions,
      group: {
        name: 'tavoitealue',
      },
    };
  }

  get tavoitteetOptions() {
    return {
      ...this.defaultDragOptions,
      group: {
        name: 'tavoitteet',
      },
    };
  }

  get keskeisetSisaltoalueetOptions() {
    return {
      ...this.defaultDragOptions,
      group: {
        name: 'keskeisetsisaltoalueet',
      },
    };
  }
}
</script>

<style scoped lang="scss">
@import "../../styles/_variables.scss";

  .tavoitealue {
    &.editing {
      .tavoitesisaltoalue {
        border: 1px solid $gray-lighten-8;
        border-radius: 3px;

        .otsikko {
          color: $black;
        }
      }
    }
  }

  ::v-deep fieldset {
    padding-right: 0px;
  }

  ::v-deep .input-wrapper {
    flex: 1 1 0%;

    input {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .tavoitealue{
    .otsikko {
      font-size: 1.1rem;
      font-weight: 400;
    }

    .tavoitesisaltoalue {

      .tavoitteet {
        font-size: 1rem;
        font-weight: 600;
      }

      .keskeinensisaltoalue {
        &:nth-of-type(even) {
          background-color: $table-even-row-bg-color;
        }
        &:nth-of-type(odd) {
          background-color: $table-odd-row-bg-color;
        }
      }
    }
  }

  .mb-45 {
    margin-bottom: 2rem;
  }

</style>
