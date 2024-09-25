const DEFAULTS = {
  splitBy: ' ',
  joinBy: '+'
};

/**
 * @export
 * @param {array} strs
 * @return {string}
 */
export const toMapProps = (strs = []) => {
  const _strs = Array.isArray(strs) ? strs : [strs.toString()];
  return _strs.map(str =>
      (str || '').split(DEFAULTS.splitBy).join(DEFAULTS.joinBy)).join(DEFAULTS.joinBy);
};

/**
 * @export
 * @param {string} str
 * @return {string}
 */
export const fromMapProps = (str = '') => {
  return (str || '').split(DEFAULTS.joinBy).join(DEFAULTS.splitBy);
};