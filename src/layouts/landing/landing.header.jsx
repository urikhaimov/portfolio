import React, { useState } from 'react';
import { Button, Layout } from 'antd';
import { MenuOutlined, MoonFilled, SunFilled } from '@ant-design/icons';
import { useIntl, history } from '@umijs/max';
import classnames from 'classnames';

import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';
import { isSpinning } from '@/utils/state';

import LandingLogin from '@/pages/authentication/login';

import Loader from '@/components/Loader';

import { HeaderActions } from './header.actions';

import barberLogo from '@/assets/images/barber-logo.png';

import styles from './landing.layout.module.less';

const { Header } = Layout;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const LandingHeader = props => {
  const intl = useIntl();

  const {
    testId,
    user,
    slogan,
    ability,
    theme,
    loading,
    isOnline,
    notificationBadge,
    mode = 'horizontal',
    spinOn = [
      'authModel/signIn',
      'authModel/signOut'
    ],
    menus = [],
    drawer = false,
    onToggleTheme = stub,
    onSignOut = stub,
    onCloseMenu = stub,
    onOpenMenu = stub
  } = props;

  const [openLogin, setOpenLogin] = useState(false);

  const _menus = [...menus];

  const spinning = isSpinning(loading, spinOn);

  return (
      <Header className={classnames({
        [styles.drawerWrapper]: mode === 'vertical',
        [styles.headerWrapper]: mode === 'horizontal'
      })}>
        <div className={styles.layoutHeader}>
          <div className={styles.headerMenu}>
            {mode === 'horizontal' && (
                <img onClick={() => history.push('/')}
                     src={barberLogo} alt={'logo'}
                     className={styles.logo}/>
            )}
            {_menus.map(({ key, locale, url, subject, icon }, idx) => (
                <Button key={key} type={'text'} icon={icon}
                        disabled={ability?.cannot('read', subject)}
                        onClick={() => history.push(url)}>
                  {t(intl, locale)}
                </Button>
            ))}
            <div className={styles.slogan}>{slogan}</div>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.toHide}>
              {mode === 'horizontal' && (
                  <Button type={'text'}
                          onClick={onToggleTheme}
                          icon={theme === 'dark' ? <SunFilled/> : <MoonFilled/>}/>
              )}
              <Loader spinning={!!spinning}
                      loading={loading}
                      type={'container'}
                      className={styles.loader}
                      spinOn={spinOn}/>
              <HeaderActions user={user}
                             mode={mode}
                             isOnline={isOnline}
                             badge={notificationBadge}
                             ability={ability}
                             loading={loading}
                             setOpenLogin={setOpenLogin}
                             onSignOut={onSignOut}
                             onCloseMenu={onCloseMenu}/>
            </div>
            {mode === 'horizontal' && (
                <Button type={'text'}
                        onClick={onOpenMenu}
                        className={styles.menuButton}><MenuOutlined/></Button>
            )}
          </div>
        </div>
        <LandingLogin openLogin={openLogin}
                      setOpenLogin={setOpenLogin}/>
      </Header>
  );
};