import Vue from 'vue';
import { Kielet } from '@shared/stores/kieli';

type NotificationKind = 'info' | 'warn' | 'error' | 'success';

interface NotificationConfig {
  title: string;
  kind?: NotificationKind;
  text?: string;
}

export function notify(config: NotificationConfig) {
  (Vue as any).notify({
    title: Kielet.i18n.t(config.title),
    type: config.kind || 'info',
    text: config.text && Kielet.i18n.t(config.text),
  });
}

export function success(title: string) {
  (Vue as any).notify({
    title: Kielet.i18n.t(title),
    type: 'success',
  });
}

export function info(title: string) {
  (Vue as any).notify({
    title: Kielet.i18n.t(title),
    type: 'info',
  });
}

export function fail(title: string, reason?: string, duration?: number) {
  (Vue as any).notify({
    title: Kielet.i18n.t(title),
    type: 'error',
    text: reason ? Kielet.i18n.t(reason) : reason,
    duration: duration || 5000,
  });
}

export function warning(title: string, reason?: string) {
  (Vue as any).notify({
    title: Kielet.i18n.t(title),
    type: 'warn',
    text: reason ? Kielet.i18n.t(reason) : reason,
    duration: 5000,
  });
}

export interface CheckedConfig {
  success?: string;
  failure?: string;
}
