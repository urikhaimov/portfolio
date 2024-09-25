/**
 * @export
 * @description Changes camel case to a human-readable format.
 * So helloWorld, hello-world and hello_world becomes "Hello World".
 * @param str
 * @return {string}
 */
export function prettifyCamelCase(str) {
  let output = '';
  const len = str.length;
  let char;

  for (let i = 0; i < len; i++) {
    char = str.charAt(i);

    if (!i) {
      output += char.toUpperCase();
    } else if (char !== char.toLowerCase() && char === char.toUpperCase()) {
      output += ' ' + char;
    } else if (char === '-' || char === '_') {
      output += ' ';
    } else {
      output += char;
    }
  }

  return output;
}

/**
 * @export
 * @param {number} price
 * @param {string} language
 * @param {string} currency
 * @return {string}
 */
export const toPrice = (price, language, currency) => {
  return new Intl.NumberFormat(language, { style: 'currency', currency }).
      formatToParts(price).
      map(val => val.value).
      join('');
};

export const toNumber = (number, language) => {
  return number.toLocaleString(language);
};