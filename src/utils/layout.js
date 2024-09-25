/**
 * @export
 * @type {*}
 */
export const layout = {
  rowProps: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  colProps: {
    3: {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 8,
      xl: 8,
      xxl: 8
    }
  },
  fullColumn: { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 },
  halfColumn: { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 },
  thirdColumn: { xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 8 },
  quarterColumn: { xs: 24, sm: 12, md: 12, lg: 6, xl: 6, xxl: 6 }
};

/**
 * @export
 * @param props
 * @return {{}}
 */
export const offsetOf = props => {
  const { span, offset } = props;
  const _colProps = {};

  Object.keys(span).forEach(c => {
    _colProps[c] = span[c] - offset * 2;
  });

  return _colProps;
};
