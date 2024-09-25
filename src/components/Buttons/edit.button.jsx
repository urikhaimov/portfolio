import React from 'react';
import { Button, Tooltip } from 'antd';
import { EditTwoTone } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import classnames from 'classnames';

import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';
import { Can } from '@/utils/auth/can';

import styles from './button.module.less';

/**
 * @export
 * @param props
 * @return {Element}
 * @constructor
 */
export const EditButton = props => {
  const intl = useIntl();

  const {
    loading,
    className,
    ableFor = {},
    size = 'large',
    icon = <EditTwoTone/>,
    type = 'text',
    disabled = false,
    tooltip = t(intl, 'actions.edit', { type: '' }),
    onClick = stub
  } = props;

  const { action = 'update', subject } = ableFor;

  return (
      <Can I={action} a={subject}>
        <Tooltip title={tooltip}>
          <Button loading={loading}
                  className={classnames(styles.editBtn, className)}
                  onClick={onClick}
                  disabled={disabled}
                  size={size}
                  type={type}
                  icon={icon}/>
        </Tooltip>
      </Can>
  );
};