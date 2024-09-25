import React from 'react';
import { useIntl, useOutletContext } from '@umijs/max';
import { Button, Divider, Modal } from 'antd';
import { InfoCircleTwoTone } from '@ant-design/icons';

import { t } from '@/utils/i18n';

import styles from './button.module.less';

/**
 * @export
 * @param props
 * @return {Element}
 * @constructor
 */
export const InfoButton = (props) => {
  const intl = useIntl();
  const { modalApi } = useOutletContext();

  const {
    info = {},
    disabled = false,
    isLoading = false
  } = props;

  const {
    belongsTo,
    updatedBy,
    createdBy,
    createdAt,
    updatedAt
  } = info || {};

  /**
   * @function information
   */
  const information = () => {
    modalApi.info({
      className: styles.modalApi,
      centered: true,
      title: t(intl, 'message.info', { type: t(intl, 'business') }),
      content: (
          <ul>
            <li>
              {t(intl, 'message.info.belongsTo')}
              <span>{belongsTo}</span>
            </li>
            <li><Divider/></li>
            <li>
              {t(intl, 'message.info.createdBy')}
              <span>{createdBy}</span>
            </li>
            <li>
              {t(intl, 'message.info.createdAt')}
              <span>{createdAt}</span>
            </li>
            <li><Divider/></li>
            <li>
              {t(intl, 'message.info.updatedBy')}
              <span>{updatedBy}</span>
            </li>
            <li>
              {t(intl, 'message.info.updatedAt')}
              <span>{updatedAt}</span>
            </li>
          </ul>
      ),
      footer: (
          <div className={styles.modalFooter}>
            <Button key={'back'} onClick={Modal.destroyAll}>
              {t(intl, 'actions.cancel')}
            </Button>
          </div>
      )
    });
  };

  return (
      <Button disabled={disabled}
              loading={isLoading}
              type={'text'}
              onClick={information}
              className={styles.infoBtn}
              icon={<InfoCircleTwoTone/>}/>
  );
};