import dayjs from 'dayjs';

/**
 * @export
 * @type {string}
 */
export const DEFAULT_TIME_FORMAT = 'HH:mm';

/**
 * @export
 * @type {string}
 */
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

/**
 * @export
 * @type {string}
 */
export const DEFAULT_DATE_TIME_FORMAT = `${DEFAULT_DATE_FORMAT} ${DEFAULT_TIME_FORMAT}:ss`;

/**
 * @constant
 * @type {function(*=): dayjs.Dayjs}
 */
export const nextDayOf = (amount = 1) => dayjs().add(amount, 'day').endOf('day');

/**
 * @constant
 * @param ts
 * @returns {Date}
 */
const toDate = ts => {
  if (isNaN(new Date(ts).getDate())) {
    ts = parseInt(ts, 10);
  }
  return new Date(ts);
};

/**
 * @export
 * @param {number|string} ts
 * @return {string}
 */
export const tsToDate = ts => toDate(ts).toLocaleDateString();

/**
 * @export
 * @param {number|string} ts
 * @return {string}
 */
export const tsToTime = ts => toDate(ts).toLocaleTimeString();

/**
 * @export
 * @param {number|string} ts
 * @return {string}
 */
export const tsToLocaleDateTime = ts => {
  return `${tsToDate(ts)} ${tsToTime(ts)}`;
};

/**
 * @export
 * @param props
 */
export const delayedFn = props => {
  const { callback, ts } = props;

  const _ts = setTimeout(() => {
    callback();
    clearTimeout(_ts);
  }, ts);
};

/**
 * @export
 * @param {Date} date
 * @return {`${string} 00:00:00`}
 */
export const dateFormat = date => {
  return `${dayjs(date).format(DEFAULT_DATE_FORMAT)} 00:00:00`;
};

/**
 * @export
 * @param {number} datetime
 * @return {string}
 */
export const dateTimeFormat = datetime => {
  return `${dayjs(datetime).format(DEFAULT_DATE_TIME_FORMAT)}`;
};

/**
 * @export
 * @param current
 * @param [unitOfTime]
 * @return {boolean}
 */
export const disabledDate = (current, unitOfTime = 'day') => current && current < dayjs().endOf(unitOfTime);

/**
 * @export
 * @param seconds
 * @return {*}
 */
export function hms(seconds) {
  return [3600, 60].reduceRight((p, b) =>
      r => [Math.floor(r / b)].concat(p(r % b)), r => [r])(seconds).
      map(a => a.toString().padStart(2, '0'));
}

/**
 * @export
 * @param [data]
 * @return {*}
 */
export const timeToDayjs = (data = {}) => {
  const hours = {};

  Object.keys(data || {}).forEach(day => {
    hours[day] = data[day] || [];
    hours[day] = hours[day].map(
        ({ eventType, startAt, endAt }) => {
          return {
            eventType,
            startAt: dayjs(`2024-11-12 ${startAt}`),
            endAt: dayjs(`2024-11-12 ${endAt}`)
          };
        });
  });

  return hours;
};

/**
 * @export
 * @param [data]
 * @return {*}
 */
export const timeFromDayjs = (data = {}) => {
  const hours = {};

  Object.keys(data || {}).forEach(day => {
    hours[day] = data[day] || [];
    hours[day] = hours[day].map(
        ({ eventType, startAt, endAt }) => {
          return {
            eventType,
            startAt: startAt.format(DEFAULT_TIME_FORMAT),
            endAt: endAt.format(DEFAULT_TIME_FORMAT)
          };
        });
  });

  return hours;
};