import React, { useState } from 'react';
import { useIntl, useParams } from '@umijs/max';
import { Button, Checkbox, Form } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';
import { requiredField } from '@/utils/form';
import { logger } from '@/utils/console';

import Page from '@/components/Page';

import { translate } from '@/services/business.service';
import { isDevelopment } from '@/services/common.service';

import { InvitationDetails } from './invitation.details';

import styles from '../signup.module.less';

const MODEL_NAME = 'businessEmployeesModel';

/**
 * @constant
 * @param props
 * @returns {JSX.Element}
 */
const InvitationSignup = props => {
  const intl = useIntl();

  const params = useParams();

  const {
    authModel,
    businessEmployeesModel,
    spinOn = [
      `${MODEL_NAME}/prepareInvitation`,
      `${MODEL_NAME}/confirmInvitation`
    ],
    onPrepareInvitation = stub,
    onConfirmInvitation = stub
  } = props;

  const [formRef] = Form.useForm();
  const [confirmed, setConfirmed] = useState(false);

  const { invitedUser = {}, entityForm } = businessEmployeesModel;
  const { name, business, metadata } = invitedUser || {};

  effectHook(() => {
    onPrepareInvitation(params);
  }, []);

  const onFinish = () => {
    formRef.validateFields().then(() => {
      onConfirmInvitation(invitedUser, params?.employeeId);
    }).catch((...errors) => {
      if (isDevelopment()) {
        logger({ type: 'warn', errors });
      }
    });
  };

  const bRoles = (business?.roles || [])?.map(r => t(intl, r));

  let bTasks = [];
  Object.keys(business?.assignedServices || {})?.forEach(s => {
    const _service = business?.assignedServices[s];
    const _translated = translate(intl, _service.name, _service.category);
    bTasks.push(_translated);
  });

  const confirmMsg = t(intl, 'business.inviteConfirm');

  return (
      <Page ableFor={{ action: 'signup', subject: 'business' /* invitedUser?.business?.id */ }}
            spinOn={[...spinOn]}>
        <div className={styles.suW}>
          <h1 dangerouslySetInnerHTML={{
            __html: t(intl, 'profile.welcome.hello', { name })
          }}/>
          <h1>
            {t(intl, 'notifications.descriptionInvitation', {
              invitedBy: metadata?.invitedBy,
              business: business?.name,
              roles: bRoles.join(', '),
              tasks: bTasks.join(', ')
            })}
          </h1>
          <Form layout={'vertical'}
                size={'large'}
                form={formRef}
                fields={entityForm}
                onFinish={onFinish}>
            <InvitationDetails data={{ roles: bRoles, tasks: bTasks }}/>
            <Form.Item label={false} name={['confirm']}
                       layout={'horizontal'}
                       valuePropName={'checked'}
                       rules={[
                         requiredField(intl, t(intl, 'message.confirmation'), true),
                         {
                           validator: (_, value) =>
                               value ? Promise.resolve() : Promise.reject()
                         }
                       ]}>
              <Checkbox onChange={({ target }) => setConfirmed(target.checked)}>
                {confirmMsg}
              </Checkbox>
            </Form.Item>
            <div className={styles.confirm}>
              <Button type={'primary'} htmlType={'submit'}
                      disabled={!confirmed}
                      icon={<CheckCircleOutlined/>} size={'large'}>
                {t(intl, 'form.confirm')}
              </Button>
            </div>
          </Form>
        </div>
      </Page>
  );
};

export default InvitationSignup;
