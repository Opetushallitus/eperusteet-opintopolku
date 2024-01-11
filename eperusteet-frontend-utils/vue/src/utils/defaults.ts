export const ENV_PREFIX = process.env.NODE_ENV === 'production' ? '' : 'https://eperusteet.opintopolku.fi';

export const DEFAULT_DRAGGABLE_PROPERTIES = {
  animation: 300,
  emptyInsertThreshold: 10,
  handle: '.order-handle',
  ghostClass: 'dragged',
  forceFallback: true,
};
