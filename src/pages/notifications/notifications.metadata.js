import React from 'react';
import { useIntl } from '@umijs/max';
import { Tooltip } from 'antd';

import { t } from '@/utils/i18n';
import { tsToLocaleDateTime } from '@/utils/timestamp';

import { adaptTranslations } from '@/locales';

import { Sorter } from '@/components/Main/Table/utils/sorter';

/**
 * @export
 * @param loading
 * @return {*}
 */
export const notificationsMetadata = ({ loading }) => {
  const intl = useIntl();

  return {
    width: '100%',
    size: 'middle',
    columns: [
      {
        title: t(intl, 'notifications.type'),
        dataIndex: 'type',
        filterable: true,
        filterBy: {
          resolver: (key) => t(intl, key)
        },
        sortable: true,
        render(type) {
          return t(intl, adaptTranslations(type, 'notifications'));
        }
      },
      {
        title: t(intl, 'table.title'),
        dataIndex: 'title',
        ellipsis: true,
        filterable: true,
        filterSearch: true,
        resizable: true,
        sortable: true,
        render(title, record) {
          return (
              <Tooltip placement={'topLeft'} title={title}>
                {record.read ? title : (<strong>{title}</strong>)}
              </Tooltip>
          );
        }
      },
      {
        title: t(intl, 'notifications.status'),
        dataIndex: 'status',
        width: 150,
        filterable: true,
        filterBy: {
          resolver: (key) => t(intl, key)
        },
        sortable: true,
        render(status) {
          return t(intl, adaptTranslations(status, 'status'));
        }
      },
      {
        title: t(intl, 'form.createdAt'),
        dataIndex: 'metadata',
        width: 170,
        sortable: true,
        sorter: Sorter.NESTED('metadata.createdAt'),
        filterable: true,
        filterBy: {
          nested: 'metadata.createdAt',
          resolver: (createdAt) => tsToLocaleDateTime(createdAt)
        },
        render: (metadata) => tsToLocaleDateTime(metadata.createdAt)
      }
    ],
    loading: loading.effects['notifications/query']
  };
};
