import React, { memo } from 'react';
import { Form, Input } from 'antd';
import { useIntl } from '@umijs/max';

import { effectHook } from '@/utils/hooks';
import { requiredField } from '@/utils/form';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const HiddenField = props => {
  const intl = useIntl();

  const {
    label,
    name = [],
    disabled = false,
    required = false
  } = props;

  const isString = typeof name === 'string';
  const _name = isString ? name : [...name].filter(n => n);

  return (
      <Form.Item label={label} name={_name} noStyle
                 rules={[requiredField(intl, label, required)]}>
        <Input type={'hidden'} disabled={disabled}/>
      </Form.Item>
  );
};

export default memo(HiddenField);
