import React, { memo, useState } from 'react';
import { Tabs } from 'antd';
import {
  InboxOutlined,
  NotificationOutlined,
  SendOutlined
} from '@ant-design/icons';
import { useParams, useIntl } from '@umijs/max';

import Page from '@/components/Page/page.connect';

import { notificationsMetadata } from './notifications.metadata';
import { expendableNotification } from './metadata/notification.expendable';

import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';

import styles from './notifications.module.less';
import MainTable from '@/components/Table/table';
import SendMessage from '@/pages/notifications/metadata/send.message';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const Notifications = (props) => {
  const intl = useIntl();

  const {
    authModel,
    notificationModel,
    loading,
    onQuery,
    onRead,
    onSendMessage
  } = props;

  const { user } = authModel;
  const { notifications = {} } = notificationModel;

  /**
   * @type {{user}}
   */
  const params = useParams();

  const [visibleMessage, setVisibleMessage] = useState(
      { visible: false, props: {} });
  const [activeTab, setActiveTab] = useState('inbox');

  effectHook(() => {
    user && onQuery(params?.user);
  }, [user]);

  const subTitle = (
      <>
        <NotificationOutlined/>
        {t(intl, 'notifications.actions.manage')}
      </>
  );

  const { ability } = authModel;
  const component = 'notifications';
  const disabled = !ability.can('read', component);

  const tableProps = {
    pagination: { pageSize: 15 },
    expandable: expendableNotification({ setVisibleMessage }),
    onExpand(expanded, record) {
      if (activeTab === 'inbox' && !record.read) {
        onRead(record.id);
      }
    }
  };

  const sendProps = {
    onSendMessage,
    visibleMessage,
    setVisibleMessage
  };

  const items = [
    {
      label: (
          <>
            <InboxOutlined/>
            {t(intl, 'notifications.inbox')}
          </>
      ),
      key: 'inbox',
      disabled,
      children: (
          <MainTable data={notifications.inbox}
                     {...tableProps}
                     {...notificationsMetadata({ loading })} />
      )
    },
    {
      label: (
          <>
            <SendOutlined/>
            {t(intl, 'notifications.sent')}
          </>
      ),
      key: 'sent',
      disabled,
      children: (
          <MainTable data={notifications.sent}
                     {...tableProps}
                     {...notificationsMetadata({ loading })} />)
    }
  ];

  const pageHeaderProps = {
    subTitle,
    loading,
    disabled,
    component,
    actions: {
      exportBtn: false,
      closeBtn: false,
      saveBtn: false,
      newBtn: false,
      menuBtn: false
    }
  };

  return (
      <Page className={styles.notifications}
            ableFor={{ subject: component }}
            spinOn={[
              'authModel/defineAbilities',
              'notificationModel/query'
            ]}>
        <Tabs activeKey={activeTab}
              className={styles.tabs}
              onChange={key => {
                setActiveTab(key);
                onQuery(params?.user, key);
              }}
              tabPosition={'left'}
              items={items}/>
        <SendMessage {...sendProps}/>
      </Page>
  );
};

export default memo(Notifications);
