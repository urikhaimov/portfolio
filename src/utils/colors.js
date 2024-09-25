export const COLORS = {
  danger: '#ff4d4f',
  disabled: '#d9d9d9',
  warning: '#FFBF00',
  success: '#52c41a',
  tags: {
    magenta: 'magenta',
    red: 'red',
    volcano: 'volcano',
    orange: 'orange',
    gold: 'gold',
    lime: 'lime',
    green: 'green',
    cyan: 'cyan',
    blue: 'blue',
    geekblue: 'geekblue',
    purple: 'purple',
    processing: 'processing',
    success: 'success',
    error: 'error',
    warning: 'warning',
    default: 'default'
  }
};

/**
 * @export
 * @param {string} hex
 * @param {boolean} [bw] The bw option that will decide whether to invert to black or white;
 * so you'll get more contrast which is generally better for the human eye.
 * @return {string}
 */
export function invertHex(hex, bw = true) {
  // return short ? (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).slice(1).toUpperCase():

  /**
   * @description Pad each component with zeros and output.
   * @param {string} str
   * @param {number} len
   * @return {string}
   */
  function padZero(str, len = 2) {
    const zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }

  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }

  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }

  let r = parseInt(hex.slice(0, 2), 16),
      g = parseInt(hex.slice(2, 4), 16),
      b = parseInt(hex.slice(4, 6), 16);

  if (bw) {
    // https://stackoverflow.com/a/3943023/112731
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
        ? '#000000'
        : '#FFFFFF';
  }

  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);

  // pad each with zeros and return
  return '#' + padZero(r) + padZero(g) + padZero(b);
}
