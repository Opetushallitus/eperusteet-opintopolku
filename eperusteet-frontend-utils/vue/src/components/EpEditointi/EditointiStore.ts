import * as _ from 'lodash';
import Vue from 'vue';
import VueScrollTo from 'vue-scrollto';
import { reactive, computed } from '@vue/composition-api';
import { Computed } from '../../utils/interfaces';
import { ILukko, Revision } from '../../tyypit';
import VueRouter, { RawLocation } from 'vue-router';
import { fail } from '../../utils/notifications';
import { createLogger } from '../../utils/logger';

export interface EditointiKontrolliValidation {
  valid: boolean;
  message?: string;
}

export interface KayttajaProvider {
  userOid: Computed<string>;
}

export interface EditoitavaFeatures {
  editable?: boolean;
  previewable?: boolean;
  removable?: boolean;
  lockable?: boolean;
  validated?: boolean;
  recoverable?: boolean;
  hideable?: boolean;
  isHidden?: boolean;
  copyable?: boolean;
}

export interface IEditoitava {
  /**
   * Loads most recent version of the data to be edited
   */
  load: (supportDataProvider: (data: any) => void) => Promise<unknown>;

  /**
   * Try to acquire lock. Return true on success.
   */
  acquire?: () => Promise<ILukko | null>;

  /**
   * Release locked resource.
   */
  release?: () => Promise<void>;

  /**
   * Get current lock information if any
   */
  lock?: () => Promise<ILukko | null>;

  /**
   * Start editing of the resource
   */
  start?: () => Promise<void>;

  /**
   * Called right after user cancels editing.
   */
  cancel?: () => Promise<void>;

  /**
   * Save current resource
   */
  save?: (data: any) => Promise<any>;

  /**
   * Remove the resource
   */
  remove?: (data?: any) => Promise<void>;

  /**
   * Returns true if editing is started immediately after data fetch
   */
  editAfterLoad: () => Promise<boolean>;

  /**
   * called after load
   */
  postLoad?: () => Promise<void>;

  /**
   * Get preview url location
   */
  preview?: () => Promise<RawLocation | null>;

  /**
   * Hide the resource
   */
  hide?: (data: any) => Promise<void>;

  /**
   * Unhide the resource
   */
  unHide?: (data: any) => Promise<void>;

  /**
   * Replace current data with restored revision
   */
  restore?: (rev: number) => Promise<void>;

  /**
   * Get all revisions of the resource
   */
  revisions?: () => Promise<Revision[]>;

  /**
   * copy the resource
   */
  copy?: (data: any) => Promise<boolean> | Promise<void>;

  /**
   * Save preventing validations
   */
  validator?: Computed<any>;

  /**
   * Dynamic features that are enabled
   */
  features?: (data: Computed<any>, supportData: Computed<any>) => Computed<EditoitavaFeatures>;
}

export interface EditointiKontrolliRestore {
  numero: number;
  modal?: any;
  routePushLatest?: boolean;
}

export interface EditointiStoreConfig {
  router: VueRouter;
  kayttajaProvider: KayttajaProvider;
}

export class EditointiStore {
  private static allEditingEditors: EditointiStore[] = [];
  private static router: VueRouter;
  private static kayttajaProvider: KayttajaProvider;
  private logger = createLogger(EditointiStore);
  private isFirstRun = true;

  public static install(
    vue: typeof Vue,
    config: EditointiStoreConfig,
  ) {
    if (!config.router) {
      throw new Error('vue-router missing');
    }
    if (!config.kayttajaProvider) {
      throw new Error('kayttajaProvider missing');
    }
    EditointiStore.router = config.router;
    EditointiStore.kayttajaProvider = config.kayttajaProvider;
  }

  private readonly state = reactive({
    data: null as any | null,
    supportData: null as any | null,
    revisions: [] as Revision[],
    backup: null as string | null,
    disabled: true,
    isLoading: false,
    isSaving: false,
    isEditingState: false,
    isRemoved: false,
    isNew: false,
    currentLock: null as ILukko | null,
  });

  public static anyEditing() {
    return EditointiStore.allEditingEditors.length > 0;
  }

  public static async cancelAll() {
    for (const editor of EditointiStore.allEditingEditors) {
      if (editor.cancel) {
        await editor.cancel(true);
      }
    }
  }

  public constructor(
    private config: IEditoitava,
  ) {
    this.logger.debug('Initing editointikontrollit with: ', _.keys(config));
    this.config = config;
  }

  public get hooks() {
    return this.config;
  }

  public readonly data = computed(() => this.state.data);
  public readonly supportData = computed(() => this.state.supportData);
  public readonly revisions = computed(() => this.state.revisions);
  public readonly disabled = computed(() => this.state.disabled);
  public readonly isLoading = computed(() => !this.state.data || this.state.isLoading);
  public readonly isSaving = computed(() => this.state.isSaving);
  public readonly isEditing = computed(() => this.state.isEditingState);
  public readonly isRemoved = computed(() => this.state.isRemoved);
  public readonly validator = computed(() => this.config.validator?.value || {});
  public readonly isNew = computed(() => this.state.isNew);

  public readonly features = computed(() => {
    const Default = {
      editable: true,
      hideable: true,
      isHidden: false,
      lockable: true,
      previewable: false,
      recoverable: true,
      removable: true,
      validated: true,
      copyable: false,
    };

    const provided = this.config.features ? this.config.features(this.data.value, this.supportData.value).value : Default;
    const features = {
      ...Default,
      ...provided,
    };

    const cfg = this.config || {};
    return {
      editable: cfg.save && features.editable,
      hideable: cfg.hide && features.hideable,
      isHidden: features.isHidden || false,
      lockable: cfg.lock && cfg.release && features.lockable,
      recoverable: cfg.restore && cfg.revisions && features.recoverable,
      removable: cfg.remove && features.removable,
      validated: cfg.validator && features.validated,
      previewable: features.previewable || false,
      copyable: features.copyable || false,
    };
  });

  public readonly currentLock = computed(() => {
    const now = new Date();
    const cl = this.state.currentLock;
    if (cl?.oma || (cl?.vanhentuu && now > new Date(cl.vanhentuu as unknown as number))) {
      return null;
    }
    return this.state.currentLock;
  });

  public get hasPreview() {
    return !!this.config.preview;
  }

  public async updateRevisions() {
    if (this.config.revisions) {
      this.logger.debug('Haetaan historia');
      this.state.revisions = await this.config.revisions();
    }
  }

  public async updateLockInfo() {
    if (this.config.lock) {
      this.logger.debug('Haetaan mahdollinen lukko');
      this.state.currentLock = await this.config.lock();
    }
  }

  public async init() {
    this.logger.debug('init');
    this.state.isNew = !!(this.config.editAfterLoad && await this.config.editAfterLoad());
    await this.fetch();
    await this.updateRevisions();
    await this.updateLockInfo();
    this.state.disabled = false;

    if (this.state.isNew && this.isFirstRun) {
      this.isFirstRun = false;
      await this.start();
    }

    if (this.config.postLoad) {
      await this.config.postLoad();
    }
  }

  public async start() {
    this.state.disabled = true;
    this.state.isLoading = true;

    // Ei editointia uudestaan
    if (this.isEditing.value) {
      this.logger.warn('Editointi jo käynnissä');
      this.state.disabled = false;
      return;
    }

    // Poiston jälkeisen editoinnin esto
    if (this.state.isRemoved) {
      this.logger.warn('Poistettua resurssia ei voi editoida');
      this.state.disabled = false;
      return;
    }

    try {
      this.logger.debug('Aloitetaan editointi');
      if (!this.state.isNew) {
        await this.init();
      }
      this.state.isEditingState = true;

      await this.lock();

      if (this.config.start) {
        await this.config.start();
      }
      EditointiStore.allEditingEditors = [
        ...EditointiStore.allEditingEditors,
        this,
      ];
    }
    catch (err) {
      this.logger.error('Editoinnin aloitus epäonnistui:', err);
      this.state.currentLock = null;
    }
    finally {
      this.state.disabled = false;
      this.state.isLoading = false;

      const navbar = document.getElementById('navigation-bar');
      const navbarHeight = navbar ? (-1 * navbar.getBoundingClientRect().height) : 0;
      const target = document.getElementById('scroll-anchor');
      if (target) {
        VueScrollTo.scrollTo('#scroll-anchor', {
          offset: navbarHeight,
          x: false,
          y: true,
        });
      }
    }
  }

  public async lock() {
    // Resurssin lukitseminen
    if (this.config.acquire) {
      this.logger.debug('Lukitaan resurssi');
      this.state.currentLock = await this.config.acquire();
    }
  }

  public async unlock() {
    // Resurssin lukitseminen
    if (this.config.release) {
      this.logger.debug('Vapautetaan resurssi');
      try {
        await this.config.release();
      }
      finally {
        this.state.currentLock = null;
      }
    }
  }

  public async cancel(skipRedirectBack = false) {
    this.state.disabled = true;
    if (!this.isEditing.value) {
      this.logger.warn('Ei voi perua');
      return;
    }

    this.logger.debug('Perutaan editointi');
    if (this.config.cancel) {
      await this.config.cancel!();
    }

    if (this.state.backup) {
      this.state.data = JSON.parse(this.state.backup);
    }
    // this.config.setData!(JSON.parse(this.state.backup));
    this.state.isEditingState = false;
    _.remove(EditointiStore.allEditingEditors, (editor) => editor === this);
    this.state.disabled = false;

    await this.unlock();

    if (this.state.isNew && !skipRedirectBack) {
      EditointiStore.router?.go(-1);
    }
  }

  public async remove() {
    this.state.disabled = true;
    this.state.isEditingState = false;
    _.remove(EditointiStore.allEditingEditors, (editor) => editor === this);
    try {
      if (this.config.remove) {
        await this.config.remove(this.state.data);
        this.logger.debug('Poistettu');
        this.state.isRemoved = true;
      }
    }
    catch (err) {
      const syy = _.get(err, 'response.data.syy');
      if (syy) {
        fail('poisto-epaonnistui', err.response.data.syy);
      }
      else {
        this.logger.error('poisto-epaonnistui', err);
        fail('poisto-epaonnistui');
      }
      this.state.isRemoved = false;
      throw err;
    }
    this.state.disabled = false;
  }

  public async save() {
    this.state.disabled = true;
    this.state.isSaving = true;

    if (!this.isEditing.value) {
      this.logger.warn('Ei voi tallentaa ilman editointia');
    }
    else if (this.config.save) {
      try {
        const after = await this.config.save(this.state.data);
        this.logger.success('Tallennettu onnistuneesti');
        await this.unlock();
        await this.fetchRevisions();
        await this.init();
        this.state.isEditingState = false;
        _.remove(EditointiStore.allEditingEditors, (editor) => editor === this);
        if (after && _.isFunction(after)) {
          await after();
        }
      }
      catch (err) {
        this.state.isEditingState = true;
        this.state.disabled = false;
        this.state.isSaving = false;
        throw err;
      }
    }
    else {
      this.logger.debug('Tallentaminen ei mahdollista');
    }
    this.state.disabled = false;
    this.state.isSaving = false;
  }

  public async restore(event: EditointiKontrolliRestore) {
    try {
      await this.config.restore!(event.numero);
      this.logger.success('Palautettu onnistuneesti');

      // Piilotetaan modaali
      if (event.modal && _.isFunction(event.modal.hide)) {
        event.modal.hide();
      }

      // Päivitetään näkymä uusimpaan
      if (event.routePushLatest) {
        await EditointiStore.router?.push({ query: {} });
      }

      await this.fetch();
      await this.fetchRevisions();
    }
    catch (err) {
      const syy = _.get(err, 'response.data.syy');
      if (syy) {
        fail('palautus-epaonnistui', err.response.data.syy);
      }
      else {
        this.logger.error('Palautus epäonnistui', err);
        fail('palautus-epaonnistui');
      }
    }
  }

  public async preview() {
    if (this.config.preview) {
      return this.config.preview();
    }
    return null;
  }

  private async fetchRevisions() {
    if (this.config.revisions) {
      this.state.revisions = await this.config.revisions();
    }
  }

  private async fetch() {
    this.state.backup = null;

    const data = await this.config.load((data: any) => {
      this.state.supportData = data;
    });

    if (_.isObject(data) || _.isArray(data)) {
      const dataStr = JSON.stringify(data);
      this.state.backup = dataStr;
      this.state.data = JSON.parse(dataStr);
      return this.state.data;
    }
    else {
      throw new Error('Source must be an object or an array');
    }
  }

  public async clear() {
    this.state.data = null;
    this.state.supportData = null;
  }

  public async hide() {
    this.state.disabled = true;
    this.state.isEditingState = false;
    if (this.config.hide) {
      await this.config.hide(this.state.data);
      await this.init();
      this.logger.debug('Piilotettu');
      this.state.isRemoved = true;
    }
    this.state.disabled = false;
  }

  public async unHide() {
    this.state.disabled = true;
    this.state.isEditingState = false;
    if (this.config.unHide) {
      await this.config.unHide(this.state.data);
      await this.init();
      this.logger.debug('palautettu');
    }
    this.state.disabled = false;
  }

  public async copy() {
    this.state.isSaving = true;
    this.state.disabled = true;
    try {
      if (this.config.copy) {
        const doInit = await this.config.copy(this.state.data);
        this.logger.debug('Kopioitu');

        if (doInit) {
          await this.init();
        }
      }
    }
    finally {
      this.state.disabled = false;
      this.state.isSaving = false;
    }
  }

  public setData(data: any) {
    this.state.data = data;
  }

  public mergeData(data: any) {
    this.state.data = {
      ...this.state.data,
      ...data,
    };
  }
}

export function editointi(config: IEditoitava) {
  return new EditointiStore(config);
}
