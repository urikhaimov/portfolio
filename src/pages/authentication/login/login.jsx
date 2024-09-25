import React from 'react';
import { useIntl } from '@umijs/max';

import { effectHook } from '@/utils/hooks';
import { logger } from '@/utils/console';
import { t } from '@/utils/i18n';
import request from '@/utils/request';

import LoginForm from './login.form';

import styles from './login.module.less';

/**
 * @constant
 * @param props
 * @returns {JSX.Element}
 */
const LandingLogin = props => {
  const intl = useIntl();

  const {
    onSignInWithGoogle,
    authModel,
    firebaseModel,
    loading,
    openLogin = false,
    setOpenLogin
  } = props;

  const { user, ability } = authModel;
  const { error, credential } = firebaseModel;

  const { notificationApi } = request?.xhr?.notification || {};

  effectHook(() => {
    if (user) {
      setOpenLogin(false);
    }
  }, [user]);

  effectHook(() => {
    if (error) {
      const errorProps = {
        title: t(intl, 'error.number', { number: error?.code }),
        message: error?.message
      };

      logger({ type: 'warn', log: { error, credential } });

      notificationApi.error({
        message: error?.name,
        description: errorProps?.message,
        placement: 'topRight',
        duration: null
      });
    }
  }, [error]);

  return (
      <LoginForm user={user}
                 error={error}
                 loading={loading}
                 openLogin={openLogin}
                 onCancel={() => setOpenLogin(false)}
                 disabled={ability?.cannot('access', 'login')}
                 onSignIn={onSignInWithGoogle}
                 wrapClassName={styles.loginWrapper}/>
  );
};

export default LandingLogin;
