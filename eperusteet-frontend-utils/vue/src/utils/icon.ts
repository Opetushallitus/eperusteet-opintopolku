import * as _ from 'lodash';
import { createLogger } from './logger';

const logger = createLogger('Icon');

function changeIcons(isModeDark: boolean) {
  const links = document.getElementsByTagName('link');
  if (isModeDark) {
    logger.info('Set dark mode');
    _.each(links, link => {
      if (link.hasAttribute('href') && _.includes(link.getAttribute('href'), 'favicon')) {
        const href = _.replace(link.getAttribute('href')!, 'favicon', 'favicon-inverted');
        link.setAttribute('href', href);
      }
    });
  }
  else {
    logger.info('Set light mode');
    _.each(links, link => {
      if (link.hasAttribute('href') && _.includes(link.getAttribute('href'), 'favicon')) {
        const href = _.replace(link.getAttribute('href')!, 'favicon-inverted', 'favicon');
        link.setAttribute('href', href);
      }
    });
  }
}

export function registerIconColorSchemeChange() {
  try {
    if (_.isFunction(window.matchMedia)) {
      const matcher = window.matchMedia('(prefers-color-scheme: dark)');

      // Register listener
      matcher.addEventListener('change', () => {
        if (matcher.matches) {
          changeIcons(true);
        }
        else {
          changeIcons(false);
        }
      });

      // Init state
      if (matcher.matches) {
        changeIcons(true);
      }
      else {
        changeIcons(false);
      }
    }
  }
  catch (e) {
    logger.error(e);
  }
}
