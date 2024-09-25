import _ from 'lodash';
import dayjs from 'dayjs';

/**
 * @param {string} dateA - a date, represented in string format
 * @param {string} dateB - a date, represented in string format
 */
const dateSort = (dateA, dateB) => dayjs(dateA).diff(dayjs(dateB));

/**
 * @param {number|string} a
 * @param {number|string} b
 */
const defaultSort = (a, b) => {
  if (a < b) return -1;
  if (b < a) return 1;
  return 0;
};

/**
 * @constant findInPath
 * @param pathArray
 * @param a
 * @return {*}
 */
const findInPath = (pathArray = [], a) => {
  let _a;
  for (let path of pathArray) {
    _a = _.get(a, path);
    if (_a) break;
  }

  return _a;
};

/**
 * @param {string|array} paths
 * @param {string} type
 * @return {*}
 */
const nestedSort = (paths, type = 'default') => {
  let pathArray = paths;
  if (typeof paths === 'string') {
    pathArray = [paths];
  }

  return (a, b) => {
    const _a = findInPath(pathArray, a);
    const _b = findInPath(pathArray, b);

    if (type === 'date') return dateSort(_a, _b);

    return defaultSort(_a, _b);
  };
};

export const Sorter = {
  DEFAULT: defaultSort,
  NESTED: nestedSort,
  DATE: dateSort
};