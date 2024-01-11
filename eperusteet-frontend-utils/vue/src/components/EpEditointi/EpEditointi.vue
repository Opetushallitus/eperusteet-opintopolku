<template>
  <div class="editointi-container">
    <ep-spinner class="mt-5" v-if="!store || !store.data.value"></ep-spinner>
    <div class="editointikontrolli" v-else>
      <div v-sticky sticky-offset="{ top: 0 }" sticky-z-index="600" v-if="!hasFooterSlot">
        <template v-if="hasCustomHeaderSlot">
          <slot name="customheader"
            :isEditing="isEditing"
            :support-data="innerSupport"
            :data="inner"
            :cancel="cancel"
            :save="save"
            :disabled="disabled"
            :validation="validation"
            :isSaving="isSaving"
            :modify="modify"
            :remove="remove"
            :editable="features.editable"/>
        </template>
        <div v-else class="ylapaneeli d-print-none">
          <div class="d-flex align-items-center flex-md-row flex-column justify-content-between" :class="{ container: useContainer }">
            <div class="d-flex flex-wrap flex-xl-nowrap align-items-center justify-content-between">
              <div class="headerline" v-if="inner">
                <slot name="header"
                      :isEditing="isEditing"
                      :data="inner"
                      :support-data="innerSupport"
                      :validation="validation"/>
              </div>
              <div class="muokattu text-nowrap" v-if="!isEditing">
                <slot name="postHeader" :data="inner"></slot>
                <span class="text-truncate" v-if="latest">{{ $t('muokattu') }}: {{ $sdt(latest.pvm) }}, {{ nimi }}</span>
              </div>
            </div>
            <div>
              <div class="floating-editing-buttons d-flex align-items-center" v-if="!versiohistoriaVisible">
                <ep-button class="ml-4"
                           v-if="isEditing"
                           @click="cancel()"
                           :disabled="disabled"
                           variant="link">
                  <slot name="peruuta">{{ $t('peruuta') }}</slot>
                </ep-button>
                <ep-button class="ml-4"
                           @click="save()"
                           v-if="isEditing"
                           :disabled="disabled || (validation && validation.$invalid)"
                           variant="primary"
                           :show-spinner="isSaving"
                           :help="saveHelpText">
                  <slot name="tallenna">{{ $t('tallenna') }}</slot>
                </ep-button>
                <b-dropdown class="mx-4"
                            v-if="isEditing && !disabled && (features.removable || features.hideable)"
                            size="md"
                            variant="link"
                            :disabled="disabled"
                            toggle-class="text-decoration-none"
                            no-caret="no-caret"
                            right>
                  <template slot="button-content">
                    <EpMaterialIcon>more_horiz</EpMaterialIcon>
                  </template>
                  <b-dropdown-item
                    @click="remove()"
                    key="poista"
                    :disabled="!features.removable || disabled">
                    <slot name="poista">{{ poistoteksti }}</slot>
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="!hidden && features.hideable"
                    @click="hide()"
                    key="piilota"
                    :disabled="disabled">
                    <slot name="piilota">{{ $t('piilota') }}</slot>
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="hidden"
                    @click="unHide()"
                    key="palauta"
                    :disabled="!features.hideable || disabled">
                    <slot name="palauta">{{ $t('palauta') }}</slot>
                  </b-dropdown-item>
                </b-dropdown>
                <div v-if="currentLock && features.lockable" class="d-flex align-items-center ml-2 mr-2">
                  <div>
                    <EpMaterialIcon class="mr-1" :color="'#555'">lock</EpMaterialIcon>
                    {{ $t('sivu-lukittu') }}
                  </div>
                  <div class="flex-grow-1 ml-3">
                    <div>
                      {{ currentLock.haltijaNimi || currentLock.haltijaOid }}
                    </div>
                    <div class="text-muted">
                      {{ $t('vapautuu') }}: {{ $ago(currentLock.vanhentuu) }}
                    </div>
                  </div>
                </div>
                <ep-button id="editointi-muokkaus"
                           v-tutorial
                           variant="link"
                           icon="edit"
                           v-oikeustarkastelu="muokkausOikeustarkastelu"
                           @click="modify()"
                           v-else-if="!isEditing && features.editable && !versiohistoriaVisible"
                           :show-spinner="isSaving || loading"
                           :disabled="disabled">
                  <slot name="muokkaa">{{ $t('muokkaa') }}</slot>
                </ep-button>
                <div v-else-if="!isEditing && features.copyable" v-oikeustarkastelu="muokkausOikeustarkastelu">
                  <slot name="kopioi" :data="inner" :support-data="innerSupport">
                    <ep-button id="editointi-kopiointi"
                              v-tutorial
                              variant="link"
                              icon="edit"
                              v-oikeustarkastelu="muokkausOikeustarkastelu"
                              @click="copy()"
                              :show-spinner="isSaving"
                              :disabled="disabled">
                      <slot name="kopioi-teksti">{{ $t('kopioi-muokattavaksi') }}</slot>
                    </ep-button>
                  </slot>
                </div>
                <span v-else-if="muokkausEiSallittu" class="disabled-text">
                  {{$t('muokkausta-ei-sallittu')}}
                </span>
                <b-dropdown class="mx-4"
                            v-if="katseluDropDownValinnatVisible"
                            size="md"
                            variant="link"
                            :disabled="disabled"
                            toggle-class="text-decoration-none"
                            no-caret="no-caret"
                            right
                            v-oikeustarkastelu="{ oikeus: 'luku' }">
                  <template slot="button-content">
                    <EpMaterialIcon>more_horiz</EpMaterialIcon>
                  </template>
                  <b-dropdown-item
                    v-oikeustarkastelu="muokkausOikeustarkastelu"
                    @click="remove()"
                    key="poista"
                    v-if="features.removable && !disabled">
                    <slot name="poista">{{ poistoteksti }}</slot>
                  </b-dropdown-item>
                  <b-dropdown-item
                  v-oikeustarkastelu="muokkausOikeustarkastelu"
                    v-if="!hidden && features.hideable && !disabled"
                    @click="hide()"
                    key="piilota">
                    <slot name="piilota">{{ $t('piilota') }}</slot>
                  </b-dropdown-item>
                  <b-dropdown-item
                  v-oikeustarkastelu="muokkausOikeustarkastelu"
                    v-if="hidden && features.hideable && !disabled"
                    @click="unHide()"
                    key="palauta">
                    <slot name="palauta">{{ $t('palauta') }}</slot>
                  </b-dropdown-item>
                  <b-dropdown-item :disabled="!features.previewable || disabled">
                    {{ $t('esikatsele-sivua') }}
                  </b-dropdown-item>
                  <b-dropdown-item v-if="store.validate && !disabled">
                    {{ $t('validoi') }}
                  </b-dropdown-item>
                  <b-dropdown-item v-if="features.recoverable" :disabled="!historia || disabled">
                    <ep-versio-modaali :value="current"
                      :versions="historia"
                      :current="current"
                      :per-page="10"
                      @restore="restore($event)" />
                  </b-dropdown-item>
                </b-dropdown>
                <ep-round-button class="ml-2"
                                 :disabled="disabled"
                                 id="editointi-muokkaus-comments"
                                 v-tutorial
                                 v-if="hasKeskusteluSlot"
                                 @click="toggleSidebarState(1)"
                                 icon="comment"
                                 variant="lightblue fa-flip-horizontal" />
                <ep-round-button class="ml-2"
                                 :disabled="disabled"
                                 id="editointi-muokkaus-question"
                                 v-tutorial
                                 v-if="hasOhjeSlot"
                                 @click="toggleSidebarState(2)"
                                 icon="question_mark"
                                 variant="green" />
                <ep-round-button class="ml-2"
                                 :disabled="disabled"
                                 v-if="hasPerusteSlot"
                                 @click="toggleSidebarState(3)"
                                 icon="account_balance"
                                 variant="pink" />
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center versiohistoria" v-if="versiohistoriaVisible">
          <div class="headerline">
            <span>{{ $t('muokkaushistoria') }}: {{ $t('versionumero') }} {{ versionumero }}</span>
          </div>
          <div class="flex-fill">
            <b-pagination :value="versionumero"
              @input="updateVersionumero"
              :total-rows="versions"
              :per-page="1"
              :hide-goto-end-buttons="true"
              size="sm"
              class="mb-0">
              <template v-slot:prev-text>
                <EpMaterialIcon>chevron_left</EpMaterialIcon>
              </template>
              <template v-slot:next-text>
                <EpMaterialIcon>chevron_right</EpMaterialIcon>
              </template>
            </b-pagination>
          </div>
          <div class="floating-editing-buttons">
            <ep-button variant="link"
                       icon="menu">
              <ep-versio-modaali :value="current"
                :versions="historia"
                :current="current"
                :per-page="10"
                @restore="restore($event)">
                {{ $t('palaa-listaan') }}
              </ep-versio-modaali>
            </ep-button>
            <ep-button variant="link"
                       @click="restore({ numero: current.numero, routePushLatest: true })"
                       icon="keyboard_return">
              {{ $t('palauta-tama-versio') }}
            </ep-button>
            <div class="btn">
              <router-link :to="{ query: {} }">
                <EpMaterialIcon :background="'inherit'" :color="'inherit'">close</EpMaterialIcon>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div v-if="inner">
        <div class="threads">
          <div class="actual-content">
            <div v-if="hasInfoSlotContent" class="info d-flex">
              <EpMaterialIcon class="mr-1" :color="'#2a2a2a'">info</EpMaterialIcon>
              <slot name="info"></slot>
            </div>
            <div class="sisalto">
              <slot v-if="hidden && !isEditing" name="piilotettu">{{$t('sisalto-piilotettu')}}</slot>
              <slot v-else :isEditing="isEditing" :support-data="innerSupport" :data="inner" :validation="validation" :isCopyable="features.copyable"></slot>
            </div>
          </div>
          <div class="rightbar rb-keskustelu" v-if="hasKeskusteluSlot && sidebarState === 1">
            <div class="rbheader"><b>{{ $t('keskustelu') }}</b></div>
            <div class="rbcontent">
              <slot name="keskustelu" :isEditing="isEditing" :support-data="innerSupport" :data="inner" :validation="validation"></slot>
            </div>
          </div>
          <div class="rightbar rb-ohje" v-if="hasOhjeSlot && sidebarState === 2">
            <div class="rbheader"><b>{{ $t('ohje') }}</b></div>
            <div class="rbcontent">
              <slot name="ohje" :isEditing="isEditing" :support-data="innerSupport" :validation="validation" :data="inner"></slot>
            </div>
          </div>
          <div class="rightbar rb-peruste" v-if="hasPerusteSlot && sidebarState === 3">
            <div class="rbheader"><b>{{ $t('perusteen-teksti') }}</b></div>
            <div class="rbcontent">
              <slot name="peruste" :isEditing="isEditing" :support-data="innerSupport" :validation="validation" :data="inner"></slot>
            </div>
          </div>
        </div>
      </div>
      <template v-if="hasFooterSlot">
        <div v-if="inner" class="alapaneeli py-3 px-2">
          <slot name="footer"
            :isEditing="isEditing"
            :support-data="innerSupport"
            :data="inner"
            :cancel="cancel"
            :save="save"
            :disabled="disabled"
            :validation="validation"
            :isSaving="isSaving"
            :modify="modify"
            :remove="remove"
            :editable="features.editable"/>
        </div>
        <EpSpinner v-else />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { Watch, Component, Mixins, Prop } from 'vue-property-decorator';
import { validationMixin } from 'vuelidate';
import Sticky from 'vue-sticky-directive';
import { EditointiStore } from './EditointiStore';
import { setItem, getItem } from '../../utils/localstorage';
import { Revision } from '../../tyypit';
import EpVersioModaali from './EpVersioModaali.vue';
import '@shared/stores/kieli';
import EpButton from '@shared/components/EpButton/EpButton.vue';
import EpRoundButton from '@shared/components/EpButton/EpRoundButton.vue';
import EpSpinner from '@shared/components/EpSpinner/EpSpinner.vue';
import { parsiEsitysnimi } from '@shared/utils/kayttaja';
import EpMaterialIcon from '@shared/components/EpMaterialIcon/EpMaterialIcon.vue';

@Component({
  validations() {
    return {
      inner: this.validator,
    };
  },
  directives: {
    Sticky,
  },
  components: {
    EpMaterialIcon,
    EpButton,
    EpRoundButton,
    EpSpinner,
    EpVersioModaali,
  },
})
export default class EpEditointi extends Mixins(validationMixin) {
  @Prop({ required: true })
  private store!: EditointiStore;

  @Prop({ required: false })
  private type!: string | null;

  /// Tämä on esitettävä versionumero eikä rev.numero
  @Prop({ required: false, type: Number })
  private versionumero!: number | null;

  @Prop({ default: 'palautus-onnistui' })
  private labelRestoreSuccess!: string;

  @Prop({ default: 'palautus-epaonnistui' })
  private labelRestoreFail!: string;

  @Prop({ default: 'tallennus-onnistui' })
  private labelSaveSuccess!: string;

  @Prop({ default: 'tallennus-epaonnistui' })
  private labelSaveFail!: string;

  @Prop({ default: 'poista' })
  private labelRemove!: string;

  @Prop({ default: 'tata-toimintoa-ei-voida-perua' })
  private labelRemoveConfirm!: string;

  @Prop({ default: 'poisto-onnistui' })
  private labelRemoveSuccess!: string;

  @Prop({ default: 'poisto-epaonnistui' })
  private labelRemoveFail!: string;

  @Prop({ default: 'piilotus-onnistui' })
  private labelHideSuccess!: string;

  @Prop({ default: 'piilotus-epaonnistui' })
  private labelHideFail!: string;

  @Prop({ default: 'palautus-onnistui' })
  private labelUnHideSuccess!: string;

  @Prop({ default: 'palautus-epaonnistui' })
  private labelUnHideFail!: string;

  @Prop({ default: 'kopio-varmistus' })
  private labelCopyConfirm!: string;

  @Prop({ default: 'varmista-kopiointi' })
  private labelCopyTopic!: string;

  @Prop({ default: 'kopioi' })
  private labelCopyConfirmButton!: string;

  @Prop({ default: 'kopion-luonti-onnistui' })
  private labelCopySuccess!: string;

  @Prop({ default: 'kopion-luonti-epaonnistui' })
  private labelCopyFail!: string;

  @Prop({ required: false })
  private preModify!: Function;

  @Prop({ required: false })
  private allowCancel!: Function;

  @Prop({ required: false })
  private allowSave!: Function;

  @Prop({ required: false })
  private postSave!: Function;

  @Prop({ required: false })
  private postRemove!: Function;

  @Prop({ required: false, default: false })
  private useContainer!: boolean;

  @Prop({ required: false, default: true })
  private confirmRemove!: boolean;

  @Prop({ required: false,
    default: () => ({
      oikeus: 'muokkaus',
    }) })
  private muokkausOikeustarkastelu!: any;

  private sidebarState = 0;

  private state: any = null;
  private isInitialized = false;
  private isValidating = false;

  private currentPage = 1;

  private updateVersionumero(versionumero) {
    this.$router.push({ query: { versionumero } }).catch(() => {});
  }

  @Watch('data')
  private onDataChange(newValue: any, oldValue: any) {
    this.$emit('input', newValue);
  }

  @Watch('store', { immediate: true })
  async onStoreChange(newValue: EditointiStore | null, oldValue: EditointiStore | null) {
    if (!newValue) {
      return;
    }

    if (!(newValue instanceof EditointiStore)) {
      throw new Error('Store must be EditointiStore');
    }

    await this.store.clear();
    await this.store.init();
    this.isInitialized = true;
    const sidebarState = await getItem('ep-editointi-sidebar-state') as any;
    if (sidebarState) {
      this.sidebarState = sidebarState!.value;
    }
  }

  get nimi() {
    if (this.latest) {
      return parsiEsitysnimi(this.latest.kayttajanTieto) || parsiEsitysnimi(this.latest);
    }
  }

  get inner() {
    if (this.store && this.store.data) {
      return this.store.data.value;
    }
    return null;
  }

  get innerSupport() {
    if (this.store && this.store.supportData) {
      return this.store.supportData.value;
    }
    return null;
  }

  get errorValidationData() {
    return this.inner || null;
  }

  get hasPreview() {
    return this.store.hasPreview || false;
  }

  get currentLock() {
    return this.store.currentLock?.value || null;
  }

  get isSaving() {
    return this.store.isSaving?.value || false;
  }

  get isEditable() {
    return this.features.editable || false;
  }

  get validation() {
    return this.$v?.inner || null;
  }

  get validator() {
    return this.store.validator.value || null;
  }

  get isEditing() {
    return this.store.isEditing?.value || false;
  }

  get revisions() {
    return this.store.revisions?.value || [];
  }

  get features() {
    return this.store.features?.value || {};
  }

  get disabled() {
    return this.store.disabled?.value || false;
  }

  get loading() {
    return this.store.isLoading.value;
  }

  get versions() {
    return this.historia.length - 1; // Ei näytetä nykyistä versiota
  }

  get hidden() {
    return this.features.isHidden || false;
  }

  get poistoteksti() {
    if (!this.type) {
      return this.$t(this.labelRemove);
    }
    return this.$t('poista-' + this.type);
  }

  get katseluDropDownValinnatVisible() {
    return !this.isEditing
      && !this.disabled
      && (this.features.recoverable || this.features.removable || this.features.hideable)
      && !this.versiohistoriaVisible;
  }

  get muokkausEiSallittu() {
    return !this.isEditing
      && this.latest
      && !this.features.editable;
  }

  get versiohistoriaVisible() {
    return this.current && this.current !== this.latest;
  }

  get hasKeskusteluSlot() {
    return this.$scopedSlots.keskustelu;
  }

  get hasPerusteSlot() {
    return this.$scopedSlots.peruste;
  }

  get hasOhjeSlot() {
    return this.$scopedSlots.ohje;
  }

  get hasInfoSlotContent() {
    return this.$slots.info;
  }

  get hasFooterSlot() {
    return this.$scopedSlots.footer;
  }

  get hasCustomHeaderSlot() {
    return this.$scopedSlots.customheader;
  }

  private toggleSidebarState(val: number) {
    if (val === this.sidebarState) {
      this.sidebarState = 0;
    }
    else {
      this.sidebarState = val;
    }
    setItem('ep-editointi-sidebar-state', {
      value: this.sidebarState,
    });
  }

  get saveHelpText() {
    if (this.disabled) {
      return 'tallenna-kaynnissa';
    }
    else if (this.disabled) {
      return 'tallenna-tila-virhe-ohje';
    }
    else if (this.validation?.$invalid) {
      return 'tallenna-validointi-virhe-ohje';
    }
    else {
      return '';
    }
  }

  get current() {
    if (!_.isEmpty(this.historia)) {
      if (this.versionumero) {
        const current = this.historia[this.historia.length - this.versionumero];
        if (current) {
          return current;
        }
        else {
          // Poistetaan ei olemassa oleva versionumero tilasta
          let query = _.assign({}, this.$route.query);
          delete query.versionumero;
          this.$router.replace({ query });
        }
      }
      else {
        return this.latest;
      }
    }
  }

  get latest() {
    return _.first(this.historia) || null;
  }

  get historia() {
    const revs = this.revisions || [];
    return _.map(revs, (rev, index: number) => ({
      ...rev,
      index: revs.length - index,
    } as Revision & { index: number }));
  }

  async onValidationImpl(validation) {
    this.$v.$touch();
    setTimeout(() => {
      this.isValidating = false;
    });
  }

  async remove() {
    try {
      if (!this.confirmRemove || await this.vahvista(this.$t('varmista-poisto') as string, this.$t('poista') as string)) {
        const poistoTeksti = this.$t(this.labelRemoveSuccess);
        await this.store.remove();
        this.$success(poistoTeksti as string);

        if (this.postRemove) {
          await this.postRemove();
        }
      }
    }
    catch (err) {
      this.$fail(this.$t(this.labelRemoveFail) as string);
    }
  }

  async copy() {
    try {
      if (await this.vahvista(
          this.$t(this.labelCopyTopic) as string,
          this.$t(this.labelCopyConfirmButton) as string,
          this.$t(this.labelCopyConfirm) as string)) {
        await this.store.copy();
        this.$success(this.$t(this.labelCopySuccess) as string);
      }
    }
    catch (err) {
      this.$fail(this.$t(this.labelCopyFail) as string);
    }
  }

  async restore(ev: any) {
    try {
      await this.store.restore(ev);
      this.$success(this.$t(this.labelRestoreSuccess) as string);
    }
    catch (err) {
      this.$fail(this.$t(this.labelRestoreFail) as string);
    }
  }

  async save() {
    try {
      if (!this.allowSave || await this.allowSave()) {
        await this.store.save();
        if (this.postSave) {
          await this.postSave();
        }
        this.$success(this.$t(this.labelSaveSuccess) as string);
      }
    }
    catch (err) {
      this.$fail(this.$t(this.labelSaveFail) as string);
      console.log(err);
    }
  }

  async cancel() {
    if (!this.allowCancel || await this.allowCancel()) {
      this.store.cancel();
    }
  }

  async hide() {
    try {
      await this.store.hide();
      this.$success(this.$t(this.labelHideSuccess) as string);
    }
    catch (err) {
      this.$fail(this.$t(this.labelHideFail) as string);
    }
  }

  async unHide() {
    try {
      await this.store.unHide();
      this.$success(this.$t(this.labelUnHideSuccess) as string);
    }
    catch (err) {
      this.$fail(this.$t(this.labelUnHideFail) as string);
    }
  }

  async modify() {
    if (this.preModify) {
      await this.preModify();
    }
    this.store.start();
  }

  public async vahvista(title: string, okTitle: string, label?: string) {
    let modalContent = [
      this.$createElement('strong', this.$t(this.labelRemoveConfirm) as string),
    ];
    if (label) {
      modalContent = [
        this.$createElement('div', label),
        this.$createElement('br', ''),
        ...modalContent,
      ];
    }

    const vahvistusSisalto = this.$createElement('div', {}, modalContent).children;
    return this.$bvModal.msgBoxConfirm((vahvistusSisalto as any), {
      title: title,
      okVariant: 'primary',
      okTitle: okTitle as any,
      cancelVariant: 'link',
      cancelTitle: this.$t('peruuta') as any,
      centered: true,
      ...{} as any,
    });
  }
}

</script>
<style scoped lang="scss">
@import '../../styles/variables';

.info {
  background: $blue-lighten-9;
  border: $blue-lighten-10 solid 1px;
  padding: 20px;
}

.icon {
  vertical-align: bottom;
}

.editointikontrolli {
  margin-top: 4px;

  .ylapaneeli {
    background: #fff;
    border-bottom: 1px solid #E7E7E7;
    padding: 5px 15px 5px 15px;

    .headerline {
      padding-right: 50px;
    }

    .upper-buttons {
      min-width: 240px;
    }

    .muokattu, .muokkaaja {
      color: #555;
      margin-right: 20px;
      font-size: 0.85rem;
    }

    @media (max-width: 767.98px) {
        .muokkaus-container {
          width:100%;
          border-top: 1px solid #E7E7E7;
        }
    }

  }

  .alapaneeli {
    background: #fff;
    border-top: 1px solid #E7E7E7;
  }

  .versiohistoria {
    background-color: #E6F6FF;
    border-bottom: 1px solid #E7E7E7;
    padding: 2px 15px;
    color: #2B2B2B;

    .headerline {
      padding-right: 50px;
    }

    /deep/ .pagination .page-item {
      &.active {
        .page-link {
          font-weight: 600;
          color: #575757;
        }
      }

      &.disabled {
        .page-link {
          color: #575757;
        }
      }

      & .page-link {
        background-color: transparent;
        border: none;
        color: #3367E3;
        font-weight: 400;
        font-size: 1rem;
      }
    }
  }

  .sisalto {
    margin-bottom: 5px;
    padding: 15px;
  }

  .threads {
    height: 100%;
    display: flex;

    .rightbar {
      border-left: 1px solid #eee;
      min-width: 460px;
      max-width: 460px;
      min-height: 100vh;
      height: 100%;

      .rbheader {
        padding: 20px;
      }

      .rbcontent {
        min-height: 100vh;
        height: 100%;
        font-size: 80%;
      }
    }

    .rb-ohje {
      .rbheader { background: #fcddf9; }
      .rbcontent { background: #fbf1fa; }
    }

    .rb-keskustelu {
      .rbheader { background: #ccd9f8; }
      .rbcontent { background: #f2f5fd; }
    }

    .rb-peruste {
      .rbheader { background: #d4ebdc; }
      .rbcontent { background: #f4faf6; }
    }

    .actual-content {
      width: 100%;
    }
  }
}
</style>
