import React from 'react';
import { Spin } from 'antd';
import classnames from 'classnames';

import { isSpinning } from '@/utils/state';

import styles from './loader.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const Loader = (props) => {
  const {
    loading,
    testId,
    className,
    wrapperClassName,
    type = 'layout',
    spinning = false,
    spinOn = [],
    style = {}
  } = props;

  const _spinning = spinning || isSpinning(loading, spinOn);

  const _className = classnames(styles.loader, className, {
    [styles.layout]: type === 'layout' && _spinning,
    [styles.page]: type === 'page' && _spinning,
    [styles.contained]: type === 'container' && _spinning,
    [styles.sider]: type === 'sider' && _spinning,
    [styles.none]: !_spinning
  });

  return (
      <div className={_className}
           style={style}
           data-testid={testId}>
        <Spin wrapperClassName={wrapperClassName}
              spinning={_spinning}/>
      </div>
  );
};

export default Loader;
