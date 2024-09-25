import React from 'react';
import { Col, Form, Select, Tooltip } from 'antd';
import { useIntl } from '@umijs/max';
import { QuestionCircleTwoTone } from '@ant-design/icons';

import { layout } from '@/utils/layout';
import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';
import { fieldName, placeholderField, requiredField } from '@/utils/form';

import styles from '@/components/Address/addresses.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const AddressType = props => {
  const intl = useIntl();

  const {
    ns,
    disabled,
    helper = false,
    addressTypeDisabled = false,
    addressTypes = [],
    selectType = stub
  } = props;

  const typeLabel = t(intl, 'address.type');

  return (
      <>
        <Col {...layout.halfColumn}>
          <Form.Item label={typeLabel}
                     tooltip={helper && requiredField(intl, typeLabel).message}
                     rules={[requiredField(intl, typeLabel, true)]}
                     name={fieldName(ns, 'addressType')}>
            <Select autoComplete={'off'}
                    disabled={disabled || addressTypeDisabled}
                    style={{ width: '100%' }}
                    popupClassName={styles.largeFormItems}
                    onChange={value => selectType(value)}
                    placeholder={placeholderField(intl, typeLabel)}>
              {[...addressTypes].map((address, idx) => (
                  <Select.Option key={idx}
                                 value={address?.type}>
                    <div className={styles.question}>
                      <Tooltip title={t(intl, `address.type.${address.type}.helper`)}>
                        <QuestionCircleTwoTone/>
                      </Tooltip>
                      {t(intl, `address.type.${address.type}`)}
                    </div>
                  </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </>
  );
};