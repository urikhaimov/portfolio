import React from 'react';
import { Modal, Spin } from 'antd';
import { useIntl } from '@umijs/max';

import { t } from '@/utils/i18n';
import { isSpinning } from '@/utils/state';
import { stub } from '@/utils/function';

import AuthButton from '@/components/Buttons/auth.button';

import styles from './login.module.less';

const { GoogleBtn } = AuthButton;

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const LoginForm = props => {
  const intl = useIntl();

  const {
    error,
    disabled,
    openLogin = false,
    mask = true,
    wrapClassName,
    loading,
    user,
    onCancel = stub,
    onSignIn = stub
  } = props;

  const modalHeader = (
      <div className={styles.modalHeader}>
        <h4>{t(intl, 'auth.signInTitle')}</h4>
        <h6>{t(intl, 'auth.signInDesc')}</h6>
      </div>
  );

  const isLoading = isSpinning(loading, [
    'authModel/signIn',
    'authModel/defineAbilities',
    'firebaseModel/signInWithGoogle',
    'firebaseModel/refreshSignIn'
  ], !!user);

  return (
      <Modal title={modalHeader}
             width={450}
             centered
             open={openLogin}
             mask={mask}
             onCancel={onCancel}
             wrapClassName={wrapClassName}
             footer={null}>
        <Spin spinning={isLoading}>
          <>
            <GoogleBtn key={0}
                       loading={isLoading}
                       disabled={disabled}
                       onClick={onSignIn}/>
          </>
        </Spin>
      </Modal>
  );
};

export default LoginForm;
