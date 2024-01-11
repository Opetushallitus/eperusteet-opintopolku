import _ from 'lodash';
import { Kielet } from '../stores/kieli';
import { Kieli } from '../tyypit';
import { createLogger } from './logger';
import { Virheet } from '@shared/stores/virheet';

/**
 * Resolves async props from route's meta object
 * and pass those to childroutes.
 */

const logger = createLogger('resolveRouterMetaProps');

export async function resolveRouterMetaProps(to) {
  let props = {};

  try {
    for (const record of to.matched) {
      if (_.isObject(record.meta.resolve)) {
        if (_.isArray(record.meta.resolve.cacheBy)) {
          const key = _.pick(to.params, record.meta.resolve.cacheBy);
          if (record.meta.resolve._cache && _.isEqual(key, record.meta.resolve._cache)) {
            props = _.merge(props, record.props);
            continue;
          }
          else {
            record.meta.resolve._cache = key;
          }
        }

        if (_.isFunction(record.meta.resolve.props)) {
          const resolvedProps = await record.meta.resolve.props(to, props);
          if (!resolvedProps.default) {
            throw new Error('Default component props are missing: ' + record.name);
          }
          props = _.merge(resolvedProps, props);
        }
        else {
          throw new Error('Resolve is missing props: ' + record.name);
        }
      }

      record.props = _.merge(record.props, props);
    }
  }
  catch (err) {
    logger.error(err);
    const error = { err: '500', path: '' };
    if (err.response) {
      error.err = err.response.status;
      error.path = err.response.config?.url;
    }
    Virheet.lisaaVirhe(error);
  }
}

/**
 * Change language changes
 */
export function changeLang(to, from) {
  let fromKieli = from.params.lang || Kieli.fi;
  let toKieli = to.params.lang || Kieli.fi;

  if (fromKieli !== toKieli) {
    Kielet.setUiKieli(toKieli);
    Kielet.setSisaltoKieli(toKieli);
  }
}

export function removeQueryParam(to, router, queryParam) {
  if (_.has(to.query, queryParam)) {
    const toquery = _.omit(to.query, queryParam);
    router.push({ query: toquery });
  }
}
