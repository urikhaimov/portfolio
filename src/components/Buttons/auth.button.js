import React from 'react';
import { useIntl } from '@umijs/max';
import { Button, Tooltip } from 'antd';
import {
  FacebookOutlined,
  GoogleOutlined,
  TwitterOutlined
} from '@ant-design/icons';

import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const AuthButton = (props) => {
  const intl = useIntl();

  const {
    testId,
    className,
    provider,
    loading,
    onClick = stub,
    disabled = false,
    icon = null,
    tooltip = false,
    size = 'default'
  } = props;

  const _btn = (
      <Button loading={loading}
              data-testid={testId}
              className={className}
              onClick={onClick}
              icon={icon}
              disabled={disabled}
              size={size}>
        {provider}
      </Button>
  );

  return tooltip ? (
      <Tooltip title={t(intl, 'auth.signInWith', { provider })}>
        {_btn}
      </Tooltip>
  ) : _btn;
};

/**
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const GoogleBtn = (props) => {
  const {
    className,
    testId,
    loading,
    disabled = false,
    tooltip = false,
    onClick = stub
  } = props;

  return (
      <AuthButton provider={'Google'}
                  className={className}
                  loading={loading}
                  testId={testId}
                  disabled={disabled}
                  tooltip={tooltip}
                  icon={<GoogleOutlined/>}
                  onClick={onClick}/>
  );
};

/**
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const FacebookBtn = props => {
  const {
    className,
    testId,
    loading,
    disabled = false,
    tooltip = false,
    onClick = stub
  } = props;

  return (
      <AuthButton provider={'Facebook'}
                  loading={loading}
                  testId={testId}
                  className={className}
                  tooltip={tooltip}
                  disabled={disabled}
                  icon={<FacebookOutlined/>}
                  onClick={onClick}/>
  );
};

/**
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const TwitterBtn = (props) => {
  const {
    className,
    testId,
    loading,
    disabled = false,
    tooltip = false,
    onClick = stub
  } = props;

  return (
      <AuthButton provider={'Twitter'}
                  loading={loading}
                  testId={testId}
                  className={className}
                  tooltip={tooltip}
                  disabled={disabled}
                  icon={<TwitterOutlined/>}
                  onClick={onClick}/>
  );
};

export default {
  GoogleBtn,
  FacebookBtn,
  TwitterBtn
};
