import { Node, Mark } from 'tiptap';
import Vue from 'vue';
import _ from 'lodash';

import { IKasiteHandler, ITermi } from './KasiteHandler';
import { domAttrsGetter } from '@shared/utils/helpers';
import { Kielet } from '@shared/stores/kieli';
import TermiEditor from './TermiEditor.vue';
import EpContent from '@shared/components/EpContent/EpContent.vue';

export default class TermiExtension extends Mark {
  public constructor(private handler: IKasiteHandler) {
    super();
  }

  get name() {
    return 'termi';
  }

  get extensions() {
    return [];
  }

  get schema() {
    return {
      attrs: {
        'data-viite': {
          default: '',
        },
      },
      inclusive: false,
      parseDOM: [{
        tag: 'abbr[data-viite]',
        getAttrs: domAttrsGetter('data-viite'),
      }],
      toDOM: (node: any) => ['abbr', node.attrs, 0],
    };
  }

  commands(params) {
    const { type } = params;
    return (attrs) => (state, dispatch) => {
      const { from, to } = state.selection;
      return dispatch(state.tr.addMark(from, to, type.create(attrs)));
    };
  }

  get view() {
    const handler = this.handler;
    return Vue.extend({
      components: {
        TermiEditor,
        EpContent,
      },
      props: ['node', 'updateAttrs', 'view'],
      data() {
        return {
          abbrdata: null as ITermi | null,
        };
      },
      mounted() {
        if (!(this as any).node.attrs['data-viite']) {
          (this as any).showTermiSelector();
        }
      },
      methods: {
        async showTermiSelector() {
          if (!this.view.editable) {
            return;
          }

          const self = (this as any);
          const h = this.$createElement;
          const t = (v: string): string => Kielet.i18n.t(v) as string;
          const kasiteTitle = h('div', {}, t('valitse-kasite'));
          const editor = h(TermiEditor, {
            props: {
              value: self.dataViite,
              handler,
            },
            on: {
              async input(avain: string) {
                self.dataViite = avain;
              },
            },
          });
          this.$bvModal.msgBoxOk([editor], {
            buttonSize: 'sm',
            centered: true,
            size: 'lg',
            title: [kasiteTitle],
          });
        },
      },
      watch: {
        dataViite: {
          async handler(value: string) {
            if (!value) {
              return;
            }

            try {
              (this as any).abbrdata = await handler.getOne(value);
            }
            catch (err) {
              (this as any).abbrdata = null;
              throw err;
            }
          },
          immediate: true,
        },
      },
      computed: {
        dataViite: {
          get() {
            return (this as any).node.attrs['data-viite'];
          },
          set(value: any) {
            (this as any).updateAttrs({
              'data-viite': value,
            });
          },
        },
        title() {
          if ((this as any).abbrdata) {
            const selitys = (this as any).$kaanna((this as any).abbrdata.selitys);
            const data = document.createElement('div');
            data.innerHTML = selitys;
            if (data) {
              return _.trim(data.textContent || data.innerText || '');
            }
            else {
              return '';
            }
          }
          else {
            return (this as any).$t('termia-ei-kuvattu');
          }
        },
      },
      template: `
        <abbr :class="{ 'virheellinen': !dataViite }" :data-viite="dataViite" @click="showTermiSelector" :title="title"></abbr>
      `,
    });
  }
}
