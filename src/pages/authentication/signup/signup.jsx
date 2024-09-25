import React from 'react';
import { useIntl, useParams } from '@umijs/max';
import { CheckCircleOutlined } from '@ant-design/icons';

import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';
import { Button, Form } from 'antd';

import Page from '@/components/Page';
import { PasswordFields } from '@/components/Authentication/PasswordFields';

import { translate } from '@/services/business.service';

import styles from './signup.module.less';

const MODEL_NAME = 'businessEmployeesModel';

/**
 * @constant
 * @param props
 * @returns {JSX.Element}
 */
const LandingSignup = props => {
  const intl = useIntl();

  /* These props are provided by withFirebaseAuth HOC */
  const {
    createUserWithEmailAndPassword,
    setError,
    user,
    error
  } = props;

  const params = useParams();

  const {
    authModel,
    businessEmployeesModel,
    spinOn = [
      `${MODEL_NAME}/prepareRegistration`
    ],
    onPrepareInvitation = stub,
    onConfirmInvitation = stub
  } = props;

  const [formRef] = Form.useForm();

  effectHook(() => {
    onPrepareInvitation(params);
  }, []);

  const { invitedUser, entityForm, notification } = businessEmployeesModel;

  const MIN_PASSWORD_LENGTH = authModel.MIN_PASSWORD_LENGTH;

  /**
   * @constant
   * @param values
   */
  const onFinish = values => {
    createUserWithEmailAndPassword(values.email, values.password);
    onConfirmInvitation({
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      isBusinessUser: true
    });
  };

  const { description } = notification;

  return (
      <Page ableFor={{ action: 'signup', subject: 'business' /* invitedUser?.business?.id */ }}
            spinOn={[...spinOn]}>
        <div className={styles.suW}>
          <h1 dangerouslySetInnerHTML={{
            __html: t(intl, 'profile.welcome.hello', { name: invitedUser?.name })
          }}/>
          <h1>
            {t(intl, 'notifications.descriptionInvitation', {
              invitedBy: description?.invitedBy,
              business: description?.business,
              roles: description?.roles?.map(r => t(intl, r)).join(', '),
              tasks: description?.tasks.map(t => translate(intl, t.name, t.category)).join(', ')
            })}
          </h1>
          <Form layout={'vertical'}
                size={'large'}
                form={formRef}
                fields={entityForm}
                onFinish={onFinish}>
            <PasswordFields minPassword={MIN_PASSWORD_LENGTH}
                            className={styles.formSection}/>
            <div className={styles.confirm}>
              <Button type={'primary'} htmlType={'submit'}
                      icon={<CheckCircleOutlined/>} size={'large'}>
                {t(intl, 'form.confirm')}
              </Button>
            </div>
          </Form>
        </div>
      </Page>
  );
};

export default LandingSignup;
