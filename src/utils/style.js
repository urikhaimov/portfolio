/**
 * Define reset matrix css
 * @param domElement
 */
export function resetMatrix(domElement) {
  const _style = domElement.getAttribute('style');
  _style &&
  domElement.setAttribute(
      'style',
      _style.replace(
          /matrix\(([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+)\) /g,
          ''
      )
  );
}

/**
 * @static
 * @param target
 * @param css
 */
export function toggle(target, css) {
  css = typeof css === 'string' ? css.split(' ') : css;
  for (let i in css) {
    if (css.hasOwnProperty(i)) {
      target.classList.toggle(css[i]);
    }
  }
}
