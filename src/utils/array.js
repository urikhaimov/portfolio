/**
 * @export
 * @param array
 * @return {*[]}
 */
export const shuffle = (array = []) => {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
};

/**
 * @export
 * @param {array} [arr]
 * @param {string} key
 * @return {*[]}
 */
export const sortBy = (key, arr = []) => {
  return arr.sort((a, b) => a[key].localeCompare(b[key]));
};