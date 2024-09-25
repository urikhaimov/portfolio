import React from 'react';
import { Button, Tooltip } from 'antd';
import { PlusSquareTwoTone } from '@ant-design/icons';
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
export const AddButton = props => {
  const intl = useIntl();

  const {
    loading,
    className,
    children,
    ableFor = {},
    size = 'large',
    type = 'text',
    disabled = false,
    icon = <PlusSquareTwoTone/>,
    tooltip = t(intl, 'actions.addNew', { type: '' }),
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
                  icon={icon}>
            {children}
          </Button>
        </Tooltip>
      </Can>
  );
};