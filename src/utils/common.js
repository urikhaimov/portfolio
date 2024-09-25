/**
 * @export
 * @param min
 * @param max
 * @return {number}
 */
export const generateRandom = (min, max) => Math.floor(Math.random() * (max - min)) + min;

/**
 * @export
 * @return {string}
 */
export const uuid = () => ((+new Date()) * Math.random()).toString(36);

/**
 * @export
 * @param testId
 * @param [ns]
 * @param [delimiter]
 * @return {string|null}
 */
export const getTestId = ({ testId, ns = 'test', delimiter = '-' }) => testId ? `${testId}${delimiter}${ns}` : null;
