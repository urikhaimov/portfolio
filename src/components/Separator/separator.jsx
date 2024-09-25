import React from 'react';
import classnames from 'classnames';

import styles from './separator.module.less';

/**
 * @export
 * @param props
 * @return {Element}
 * @constructor
 */
export const Separator = props => {
  const { type, className } = props;

  return (
      <div className={classnames(styles.separator, className)}>
        <div className={styles[type]}/>
      </div>
  );
};