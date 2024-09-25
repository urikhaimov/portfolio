import React from 'react';
import { Link, useIntl, history } from '@umijs/max';
import { Badge, Button, Tooltip } from 'antd';
import {
  AuditOutlined,
  BellTwoTone,
  LogoutOutlined,
  ProfileOutlined,
  SyncOutlined,
  WifiOutlined
} from '@ant-design/icons';
import classnames from 'classnames';

import DropdownButton from '@/components/Buttons/dropdown.button';

import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';

import styles from './landing.layout.module.less';

/**
 * @export
 * @param props
 * @return {Element}
 * @constructor
 */
export const HeaderActions = props => {
  const intl = useIntl();

  const {
    testId,
    user,
    ability,
    loading,
    mode,
    badge,
    setOpenLogin = stub,
    onSignOut = stub,
    onCloseMenu = stub
  } = props;

  const isOnline = props.isOnline || window.navigator.onLine;

  const userItems = [
    {
      label: (
          <div>
            <Link to={`/profile`}
                  disabled={ability.cannot('access', user?.id)}>
              {t(intl, 'profile')}
            </Link>
          </div>
      ),
      key: 'profile',
      icon: <ProfileOutlined/>
    },
    {
      label: (
          <div>
            <Link to={'/businesses'}
                  disabled={ability.cannot('access', 'businesses')}>
              {t(intl, 'businesses')}
            </Link>
          </div>
      ),
      key: 'businesses',
      icon: <AuditOutlined/>
    },
    { type: 'divider' },
    {
      label: (
          <div>
            <Link to={'/'}
                  onClick={onSignOut}
                  disabled={ability.cannot('access', 'logout')}>
              {t(intl, 'auth.signOut')}
            </Link>
          </div>
      ),
      key: 'signOut',
      icon: <LogoutOutlined/>
    }
  ];

  const wifiMsg = isOnline ?
      t(intl, 'message.success.connected') :
      t(intl, 'error.noConnection');

  const userOptions = mode === 'horizontal' ? (
      <>
        <Badge count={badge?.count} showZero className={styles.notifications}>
          <BellTwoTone onClick={() => history.push('/notifications')}/>
        </Badge>
        <Tooltip placement={'bottom'} title={wifiMsg}>
          <WifiOutlined className={classnames(styles.wifi, {
            [styles.connected]: isOnline
          })}/>
        </Tooltip>
        <DropdownButton key={'manage'}
                        overlay={userItems}
                        overlayClassName={styles.actionsMenu}
                        spinOn={[
                          'authModel/signIn',
                          'authModel/signOut'
                        ]}
                        disabled={false}
                        loading={loading}
                        placement={'bottom'}>
          <div>
            <img src={user?.metadata?.photoURL}
                 alt={user?.displayName}
                 referrerPolicy={'no-referrer'}/>
            <span>{user?.displayName}</span>
          </div>
        </DropdownButton>
      </>
  ) : (
      <div className={styles.drawerActions}>
        <Button icon={<ProfileOutlined/>}
                size={'large'}
                disabled={ability.cannot('access', user?.id)}
                onClick={() => {
                  history.push(`/profile`);
                  onCloseMenu();
                }}>
          {t(intl, 'profile')}
        </Button>
        <Button icon={<LogoutOutlined/>}
                type={'primary'}
                danger
                size={'large'}
                disabled={ability.cannot('access', 'logout')}
                onClick={() => {
                  onSignOut();
                  onCloseMenu();
                }}>
          {t(intl, 'auth.signOut')}
        </Button>
      </div>
  );

  const authBtns = (size, signinType = 'text', signupType = 'primary') => (
      <>
        <Button size={size} type={signinType} onClick={() => {
          setOpenLogin(true);
          onCloseMenu();
        }}>
          {t(intl, 'auth.signin')}
        </Button>
        <Button size={size} type={signupType}>{t(intl, 'auth.signup')}</Button>
      </>
  );

  const authOptions = mode === 'horizontal' ? authBtns('medium') : (
      <div className={styles.drawerActions}>
        {authBtns('large', 'default')}
      </div>
  );

  return (
      <div className={styles.userActions} data-testid={testId}>
        {user ? userOptions : authOptions}
      </div>
  );
};