import Vue from 'vue';

interface NotificationConfig {
  title: string;
  kind?: 'info' | 'warn' | 'error' | 'success';
  text?: string;
}

export interface CheckedConfig {
  success?: string;
  failure?: string;
}

declare module 'vue/types/vue' {
  interface Vue {
    $notification: (config: NotificationConfig) => Promise<void>;
    $success: (title: string) => Promise<void>;
    $info: (title: string) => Promise<void>;
    $fail: (title: string, text?: string) => Promise<void>;
    $warning: (title: string, text?: string) => Promise<void>;
  }
}

export class Notifikaatiot {
  public static install(vue: typeof Vue) {
    if (!vue.prototype.$notify) {
      throw new Error('Vue.use(require("vue-notification"))');
    }

    vue.prototype.$notification = function(config: NotificationConfig) {
      this.$notify({
        title: config.title,
        type: config.kind || 'info',
        text: config.text,
      });
    };

    vue.prototype.$success = function(title: string) {
      this.$notify({
        title,
        type: 'success',
      });
    };

    vue.prototype.$info = function(title: string) {
      this.$notify({
        title,
        type: 'info',
      });
    };

    vue.prototype.$fail = function(title: string, text: string = '') {
      this.$notify({
        title,
        type: 'error',
        text,
        duration: 5000,
      });
    };

    vue.prototype.$warning = function(title: string, text: string = '') {
      this.$notify({
        title,
        type: 'warn',
        text,
        duration: 5000,
      });
    };
  }
}
