import _ from 'lodash';

/**
 * @export
 * @param entity
 * @param [defaultValue]
 * @return {null|*}
 */
export const setAs = (entity, defaultValue = null) => {
  return typeof entity === 'undefined' ? defaultValue : entity;
};

/**
 * @export
 * @function findValue
 * @param data
 * @param nested
 * @return {*}
 */
export function findValue(data, nested) {
  return Array.isArray(nested) ?
      _.get(data, nested.join('.')) :
      _.get(data, nested);
}