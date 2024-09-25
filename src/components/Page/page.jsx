import React, { memo } from 'react';

import Page403 from '@/pages/403';

import Loader from '@/components/Loader';

import { isSpinning } from '@/utils/state';
import { effectHook } from '@/utils/hooks';
import { Can } from '@/utils/auth/can';
import { stub } from '@/utils/function';

import styles from '@/components/Page/page.module.less';

/**
 * @function
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
function Page(props) {
  const {
    testId,
    loading,
    authModel,
    pageModel,
    className,
    spinOn = [],
    ableFor: {
      action = 'read',
      subject
    },
    onQuery = stub
  } = props;

  const { ability } = authModel;

  effectHook(onQuery);

  const spinning = isSpinning(loading, spinOn);

  return (
      <div className={className} data-testid={testId}>
        <Loader spinning={!!spinning}
                loading={loading}
                spinOn={[
                  'authModel/signIn',
                  'authModel/signOut',
                  ...spinOn
                ]}/>
        <Can I={action} a={subject}>
          <div className={styles.pC}>
            {props.children}
          </div>
        </Can>
        <Page403 ableFor={props.ableFor}/>
      </div>
  );
}

export default memo(Page);