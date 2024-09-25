import React from 'react';
import { Modal, Button } from 'antd';

import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';
import request from '@/utils/request';

/**
 * @export
 * @function deleteWarning
 */
export const deleteWarning = ({ styles = {}, entity = '', onApprove = stub }) => {
  const { modalApi } = request.xhr.modal;
  const { intl } = request.xhr.message;

  modalApi.warning({
    className: styles['modalApi'],
    centered: true,
    title: t(intl, 'message.delete.warning', { type: entity }),
    content: t(intl, 'message.delete.confirm', { type: entity }),
    footer: (
        <div className={styles['modalFooter']}>
          <Button key={'back'} onClick={Modal.destroyAll}>
            {t(intl, 'actions.cancel')}
          </Button>
          <Button key={'confirm'}
                  type={'primary'}
                  danger
                  onClick={(e) => {
                    e.preventDefault();

                    Modal.destroyAll();
                    onApprove();
                  }}>
            {t(intl, 'actions.confirm')}
          </Button>
        </div>
    )
  });
};