import Vue from 'vue'
import Router from 'vue-router'

import Root from '@/routes/Root.vue';
import Home from "@/routes/home/RouteHome.vue";
import Kooste from "@/routes/kooste/RouteKooste.vue";

import { Virheet } from '@/stores/virheet';
import { SovellusVirhe } from "@/tyypit";

import { createLogger } from '@/stores/logger';

Vue.use(Router);
const logger = createLogger('Router');

export const router = new Router({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes: [{
    path: '/',
    redirect: () => '/fi',
  }, {
    path: '/:lang',
    component: Root,
    children: [
      {
        path: '',
        name: 'root',
        component: Home,
      },
      {
        path: 'kooste/:koulutustyyppi',
        name: 'kooste',
        component: Kooste,
      },
    ],
  }, {
    path: '*',
    redirect: (to) => {
      logger.error('Unknown route', to);
      return {
        name: 'virhe',
        params: {
          lang: 'fi',
          ...to.params,
        },
        query: {
          // virhe: JSON.stringify({}),
        },
      };
    },
  }],
});

Virheet.onError((virhe: SovellusVirhe) => {
  logger.error('Route error', virhe);
  router.push({
    name: 'virhe',
    query: {
      // virhe: JSON.stringify(virhe),
    },
  });
});
