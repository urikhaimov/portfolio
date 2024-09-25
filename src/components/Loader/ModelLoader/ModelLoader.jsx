import React from 'react';

import { prettifyCamelCase } from '@/utils/string';
import { isSpinning } from '@/utils/state';

import styles from './model.loader.module.less';

/**
 * @export
 * @param props
 * @return {React.JSX.Element|null}
 * @constructor
 */
export const ModelLoader = props => {
  const { loading, spinOn = [] } = props;

  const spinning = isSpinning(loading, spinOn, true);

  return spinning?.status && DEBUG ? (
      <div className={styles.spinner}>
        {spinning?.effects?.map((effect, idx) => {
          const tip = prettifyCamelCase(effect.replace(/\w+Model\//, ''));
          return (
              <div key={idx}>{tip}</div>
          );
        })}
      </div>
  ) : null;
};