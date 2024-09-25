import React from 'react';
import { useIntl } from '@umijs/max';
import { Col, Form, Input, Row, Tag } from 'antd';
import { MailOutlined } from '@ant-design/icons';

import { t } from '@/utils/i18n';
import { layout } from '@/utils/layout';

import { translate } from '@/services/business.service';

/**
 * @export
 * @param props
 * @return {Element}
 * @constructor
 */
export const InvitationDetails = props => {
  const intl = useIntl();

  const {
    data,
    testId,
    className,
    colProps = layout.halfColumn,
    disabled = true
  } = props;

  const nameMsg = t(intl, 'form.fullName');
  const emailMsg = t(intl, 'form.email');
  const businessMsg = t(intl, 'business');
  const servicesMsg = t(intl, 'business.services');
  const roleMsg = t(intl, 'business.role');

  return (
      <div data-testid={testId}>
        <Row gutter={[24, 24]} className={className}>
          <Col {...colProps}>
            <Form.Item label={t(intl, 'message.info.invitedBy')}
                       name={['metadata', 'invitedBy']}>
              <Input readOnly={disabled}/>
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label={businessMsg} name={['business', 'name']}>
              <Input readOnly={disabled}/>
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label={nameMsg} name={['name']}>
              <Input readOnly={disabled}/>
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label={emailMsg} name={['email']}>
              <Input addonBefore={<MailOutlined/>} readOnly={disabled}/>
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label={roleMsg}>
              {(data?.roles || [])?.map((role, idx) => (
                  <Tag color={'cyan'} key={idx}>{role}</Tag>
              ))}
            </Form.Item>
          </Col>
          <Col {...colProps}>
            <Form.Item label={servicesMsg}>
              {(data?.tasks || []).map((task, idx) => (
                  <Tag color={'geekblue'} key={idx}>{task}</Tag>
              ))}
            </Form.Item>
          </Col>
        </Row>
      </div>
  );
};