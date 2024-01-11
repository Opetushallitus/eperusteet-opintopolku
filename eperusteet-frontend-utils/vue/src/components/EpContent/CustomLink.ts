import { Link } from 'tiptap-extensions';
import { domAttrsGetter, mapNodeAttrs } from '@shared/utils/helpers';
import Vue from 'vue';
import _ from 'lodash';
import { ILinkkiHandler } from './LinkkiHandler';

export default class CustomLink extends Link {
  constructor(private linkkiHandler?: ILinkkiHandler) {
    super();
  }

  get schema() {
    return {
      attrs: {
        href: {
          default: null,
        },
        routenode: {
          default: null,
        },
      },
      inclusive: false,
      parseDOM: [{
        tag: 'a',
        getAttrs: domAttrsGetter('href', 'routenode'),
      }],
      toDOM: (node: any) => [
        'a',
        {
          ...node.attrs,
          target: '_blank',
          rel: 'noopener noreferrer nofollow',
        },
      ],
    };
  }

  get view() {
    const linkkiHandler = this.linkkiHandler;
    return Vue.extend({
      components: {
      },
      props: ['node', 'updateAttrs', 'view', 'linkkiHandler'],
      data() {
        return { };
      },
      computed: {
        href: {
          get() {
            return (this as any).node.attrs['href'];
          },
          set(value: any) {
            (this as any).updateAttrs({
              'href': value,
            });
          },
        },
        routeNode: {
          get() {
            return (this as any).node.attrs['routenode'];
          },
          set(value: any) {
            (this as any).updateAttrs({
              'routenode': value,
            });
          },
        } as any,
        nodeRoute: {
          get() {
            if (this.routeNode && linkkiHandler) {
              return linkkiHandler.nodeToRoute(JSON.parse(this.routeNode as any));
            }

            return undefined;
          },
        },
      },
      template: `
        <router-link v-if="nodeRoute" :to="nodeRoute"></router-link>
        <a v-else :href="href" target="_blank" rel="noopener noreferrer nofollow"></a>
      `,
    });
  }
}
