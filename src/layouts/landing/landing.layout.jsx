import React, { Suspense, useState } from 'react';
import { Outlet, Helmet, useIntl, useParams } from '@umijs/max';
import classnames from 'classnames';
import {
  ConfigProvider,
  Drawer,
  FloatButton,
  Form,
  Layout,
  message,
  Modal,
  notification
} from 'antd';
import ReactInterval from 'react-interval';
import { useScrollIndicator } from 'react-use-scroll-indicator';

import Loader from '@/components/Loader';

import { AbilityContext } from '@/utils/auth/can';
import { effectHook } from '@/utils/hooks';
import { handleMobile } from '@/utils/window';
import { stub } from '@/utils/function';

import { LandingHeader } from './landing.header';

import styles from './landing.layout.module.less';

const { Content, Footer } = Layout;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const LandingLayout = (props) => {
  const intl = useIntl();

  const {
    appModel,
    authModel,
    notificationModel,
    loading,
    onNotification = stub,
    onToggleTheme = stub,
    onInitLayout = stub,
    onRefreshSignIn = stub,
    onSignOut = stub,
    onHandleNotificationApi = stub,
    onHandleModalApi = stub,
    onHandleMessageApi = stub
  } = props;

  const [openMenu, setOpenMenu] = useState(false);

  const {
    meta,
    menus,
    theme,
    layout,
    language = 'en-US',
    interval: { timeout, enabled }
  } = appModel;

  const { employeeId } = useParams();

  const { user, ability } = authModel;
  const { isOnline, notificationBadge } = notificationModel;

  const [modalApi, modalHolder] = Modal.useModal();
  const [messageApi, messageHolder] = message.useMessage();
  const [notificationApi, notificationHolder] = notification.useNotification({
    stack: { threshold: 3 }
  });

  let title = meta?.name;
  if (meta?.title) {
    title = `${title} ${meta?.title}`;
  }

  effectHook(() => {
    onRefreshSignIn();
    onHandleMessageApi(messageApi, intl);
    onHandleNotificationApi(notificationApi);
    onHandleModalApi(modalApi);
    handleMobile();
  });

  effectHook(() => {
    if (employeeId) {
      // TODO (teamco): Do something.
    } else {
      onInitLayout();
    }
  }, [employeeId]);

  const onOpenMenu = () => setOpenMenu(true);
  const onCloseMenu = () => setOpenMenu(false);

  const [state] = useScrollIndicator();

  const progress = state?.value;

  const headerProps = {
    ability,
    theme,
    menus,
    user,
    loading,
    isOnline,
    notificationBadge,
    onSignOut,
    onOpenMenu,
    onToggleTheme,
    drawer: openMenu,
    slogan: meta?.name
  };

  const content = (
      <Layout className={styles.sL}>
        {layout?.header && (<LandingHeader {...headerProps}/>)}
        <Content>
          <Form.Provider>
            <div className={styles.sLC}>
              <Suspense fallback={(
                  <Loader spinning={loading.effects['appModel/query']}/>
              )}>
                <div className={classnames(styles.sLCW, {
                  [styles.sLCWH]: layout?.header,
                  [styles.sLCWF]: layout?.footer,
                  [styles.sLCWHF]: layout?.header && layout?.footer
                })}>
                  <Outlet context={{ messageApi, notificationApi, modalApi }}/>
                </div>
              </Suspense>
              <FloatButton.BackTop/>
            </div>
          </Form.Provider>
        </Content>
        {layout?.footer && (
            <Footer className={styles.sLF}>
              <div className={styles.footer}>
                <div>Uri Khaimov</div>
                <div>{new Date().getFullYear()}</div>
              </div>
            </Footer>
        )}
      </Layout>
  );

  return ability ? (
      <AbilityContext.Provider value={ability}>
        <ConfigProvider locale={language}
                        theme={theme}
                        direction={meta?.direction}>
          <div className={classnames(styles.landing, {
            [styles.dark]: theme === 'dark',
            [styles.light]: theme === 'light'
          })}>
            <Helmet>
              <meta charSet={meta?.charSet}/>
              <title>{title}</title>
            </Helmet>
            <ReactInterval timeout={timeout}
                           enabled={enabled}
                           callback={onNotification}/>
            <div className={styles.progress}
                 style={{ width: `${progress}%` }}/>
            {messageHolder}
            {notificationHolder}
            {modalHolder}
            {content}
            <Drawer title={meta?.name}
                    onClose={onCloseMenu}
                    className={styles.drawerMenu}
                    open={openMenu}>
              <LandingHeader {...headerProps}
                             mode={'vertical'}
                             onCloseMenu={onCloseMenu}/>
            </Drawer>
          </div>
        </ConfigProvider>
      </AbilityContext.Provider>
  ) : (
      <Loader spinning={true}/>
  );
};
