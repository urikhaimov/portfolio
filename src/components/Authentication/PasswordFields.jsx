import React, { useState } from 'react';
import { Col, Form, Input, Row } from 'antd';
import { LockTwoTone } from '@ant-design/icons';
import classnames from 'classnames';
import { useIntl } from '@umijs/max';

import { t } from '@/utils/i18n';
import { requiredField } from '@/utils/form';
import { layout } from '@/utils/layout';

import Strength from '@/pages/authentication/signup/sections/strength';
import { onUpdateMeter } from '@/pages/authentication/signup/sections/meter';

import styles from './authentication.module.less';

/**
 * @export
 * @param props
 * @return {Element}
 * @constructor
 */
export const PasswordFields = props => {
  const intl = useIntl();

  const {
    testId,
    className,
    minPassword,
    gutter = [24, 0],
    colProps = layout.halfColumn,
    autoComplete = 'new-password'
  } = props;

  const [meterValue, setMeterValue] = useState(null);
  const [meterText, setMeterText] = useState('');

  const confirmMsg = t(intl, 'auth.passwordConfirm');
  const passwordMsg = t(intl, 'auth.password');

  return (
      <div data-testid={testId}>
        <Row gutter={gutter}
             className={classnames(styles.passwordFields, className)}>
          <Col {...colProps}>
            <Form.Item label={passwordMsg}
                       name={['password']}
                       extra={t(intl, 'auth.passwordHelper', { length: minPassword })}
                       rules={[
                         requiredField(intl, passwordMsg, true),
                         ({ getFieldValue }) => ({
                           validator(_, value) {
                             if (value && getFieldValue('password').length < minPassword) {
                               return Promise.reject(t(intl, 'auth.passwordTooEasy', { length: minPassword }));
                             }
                             return Promise.resolve();
                           }
                         })
                       ]}>
              <Input.Password prefix={<LockTwoTone/>}
                              autoComplete={autoComplete}
                              onChange={e => onUpdateMeter({ e, setMeterValue, setMeterText })}/>
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label={confirmMsg}
                       name={['password_confirm']}
                       extra={t(intl, 'auth.passwordHelper', { length: minPassword })}
                       rules={[
                         requiredField(intl, confirmMsg, true),
                         ({ getFieldValue }) => ({
                           validator(_, value) {
                             if (!value || getFieldValue('password') === value) {
                               return Promise.resolve();
                             }
                             return Promise.reject(t(intl, 'auth.passwordConfirmNotValid'));
                           }
                         })
                       ]}>
              <Input.Password prefix={<LockTwoTone/>}
                              autoComplete={autoComplete}
                              onChange={e => onUpdateMeter({ e, setMeterValue, setMeterText })}/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Strength className={styles.passwordStrength}
                      meterValue={meterValue}
                      meterText={meterText}/>
          </Col>
        </Row>
      </div>
  );
};