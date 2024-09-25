import React, { memo } from 'react';
import { Button, Result } from 'antd';
import classnames from 'classnames';
import { useIntl, history } from '@umijs/max';

import { effectHook } from '@/utils/hooks';
import { logger } from '@/utils/console';
import { t } from '@/utils/i18n';
import { Can } from '@/utils/auth/can';
import { stub } from '@/utils/function';

import Loader from '@/components/Loader';

import styles from './error.module.less';

/**
 * @export
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const ErrorPage = props => {
  const intl = useIntl();

  const {
    loading,
    errorModel,
    status,
    subject,
    className,
    spinOn = [],
    title = t(intl, 'error.warning'),
    subTitle = t(intl, 'error.warningMsg'),
    onQuery = stub
  } = props;

  const { errors = [] } = errorModel;

  const MODEL_NAME = 'errorModel';

  const { href } = window.location;
  const url = new URL(href);
  const referrer = url.searchParams.get('referrer');

  const extra = referrer ? (
      <Button type={'default'} onClick={() => history.push(referrer)}>
        {t(intl, 'actions.back')}
      </Button>
  ) : null;

  const _error = (
      <Can I={'read'} a={subject}>
        <Loader loading={loading}
                spinOn={[
                  `${MODEL_NAME}/query`,
                  `${MODEL_NAME}/saveError`,
                  ...spinOn
                ]}/>
        <div className={styles.errorFlexCenter}>
          <Result extra={extra}
                  status={status}
                  title={title}
                  subTitle={subTitle}
                  className={classnames(styles[subject], className)}/>
        </div>
      </Can>
  );

  effectHook(() => {
    DEBUG && errors?.length && logger({ type: 'warn', log: errors });
  }, [JSON.stringify(errors), DEBUG]);

  effectHook(() => {
    onQuery({ status, title });
  });

  return _error;
};

export default memo(ErrorPage);