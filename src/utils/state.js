/**
 * @export
 * @constant STATUSES
 * @type {{inactive: string, deleted: string, pending: string, draft: string, active: string, suspended: string}}
 */
export const STATUSES = {
  pending: 'PENDING',
  active: 'ACTIVE',
  inactive: 'INACTIVE',
  suspended: 'SUSPENDED',
  deleted: 'DELETED',
  draft: 'DRAFT'
};

/**
 * @export
 * @type {{system: string, user: string}}
 */
export const NOTIFICATIONS = {
  system: 'SYSTEM',
  invite: 'INVITE',
  user: 'USER'
}

/**
 * @export
 * @param loading
 * @param {array} [spinEffects]
 * @param {boolean} [condition]
 * @return {boolean|{effects: string[], status: boolean}}
 */
export const isSpinning = (loading = { effects: [] }, spinEffects = [], condition = false) => {
  const spinning = Object.keys(loading.effects).filter(effect =>
      spinEffects.indexOf(effect) > -1 &&
      loading.effects[effect]
  );

  return (spinning.length > 0 || condition) ?
      { status: true, effects: spinning } : false;
};