import React, { useState } from 'react';
import { Button, ColorPicker, DatePicker, Divider, Form, Input, Modal, Switch } from 'antd';
import { useIntl } from '@umijs/max';
import dayjs from 'dayjs';

import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

import styles from '../calendar.module.less';
import { placeholderField, requiredField } from '@/utils/form';
import Phone from '@/components/Form/Phone';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const EventForm = props => {
  const intl = useIntl();
  const [formRef] = Form.useForm();

  const {
    loading,
    calendar,
    modalForm,
    initialValues = {},
    countryCodes = [],
    isOpen = false,
    status = null,
    DATE_FORMAT = 'YYYY-MM-DD HH:mm',
    setOpen = stub,
    setStatus = stub
  } = props;

  const [disabled, setDisabled] = useState(true);

  const { info, type } = modalForm || {};

  const handleOk = () => {
    handleCancel();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleEdit = () => {
    setDisabled(false);
  };

  const onFinish = (formValues) => {
    debugger
    // onSave([formValues]);
  };

  const formProps = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
    layout: 'horizontal',
    size: 'large',
    autoComplete: 'off',
    scrollToFirstError: true,
    loading,
    onFinish
  };

  const saveMsg = t(intl, 'actions.save');
  const cancelMsg = t(intl, 'actions.cancel');
  const newMsg = t(intl, 'actions.addNew', { type: t(intl, 'event') });
  const editMsg = t(intl, 'actions.edit', { type: t(intl, 'event') });

  const yesMsg = t(intl, 'actions.yes');
  const noMsg = t(intl, 'actions.no');
  const title = t(intl, 'event.title');
  const startAt = t(intl, 'event.startAt');
  const endAt = t(intl, 'event.endAt');
  const color = t(intl, 'event.color');
  const name = t(intl, 'event.extend.name');
  const email = t(intl, 'form.email');
  const phone = t(intl, 'form.phone');

  const btnProps = {
    loading,
    type: 'primary',
    size: 'large'
  };

  const inputProps = {
    disabled,
    autoComplete: 'off',
    autofill: 'off'
  };

  return (
      <Modal title={disabled ? newMsg : editMsg}
             className={styles.modalForm}
             centered
             width={700}
             open={isOpen}
             onOk={() => handleOk()}
             onCancel={() => handleCancel()}
             footer={[
               disabled ?
                   <Button {...btnProps} key={'edit'} onClick={handleEdit}>{editMsg}</Button> :
                   <Button {...btnProps} key={'save'} onClick={handleOk}>{saveMsg}</Button>,
               <Button {...btnProps} key={'cancel'} type={'default'}
                       onClick={handleCancel}>{cancelMsg}</Button>
             ]}>
        <Form {...formProps}
              form={formRef}
              rootClassName={styles.form}
              initialValues={initialValues}>
          <Form.Item label={t(intl, 'event.allDay')}
                     name={'allDay'}
                     valuePropName={'checked'}>
            <Switch disabled={disabled}
                    checkedChildren={yesMsg}
                    unCheckedChildren={noMsg}/>
          </Form.Item>
          <Form.Item label={title}
                     name={'title'}
                     rules={[requiredField(intl, title)]}>
            <Input {...inputProps} placeholder={placeholderField(intl, title, 'actions.enter')}/>
          </Form.Item>
          <Form.Item label={startAt}
                     name={'start'}
                     rules={[requiredField(intl, startAt)]}>
            <DatePicker showTime
                        disabled={disabled}
                        use12Hours={true}
                        format={DATE_FORMAT}/>
          </Form.Item>
          <Form.Item label={endAt}
                     name={'end'}
                     rules={[requiredField(intl, endAt)]}>
            <DatePicker showTime
                        disabled={disabled}
                        use12Hours={true}
                        format={DATE_FORMAT}/>
          </Form.Item>
          <Form.Item label={color} name={'color'}>
            <ColorPicker disabled={disabled}/>
          </Form.Item>
          <div className={styles.extended}>
            <Form.Item label={name}
                       name={['extendedProps', 'name']}
                       rules={[requiredField(intl, name)]}>
              <Input {...inputProps} placeholder={placeholderField(intl, name, 'actions.enter')}/>
            </Form.Item>
            <Form.Item label={phone}
                       name={['extendedProps', 'phone']}
                       rules={[requiredField(intl, phone)]}>
              <Phone style={{ width: 'auto' }}
                     extension={true}
                     ns={['extendedProps', 'phone']}
                     disabled={disabled}
                     isEdit={!disabled}
                     sPhones={[]}
                     status={status}
                     setStatus={setStatus}
                     formRef={formRef}
                     countryCodes={countryCodes}/>
            </Form.Item>
            <Form.Item label={email}
                       name={['extendedProps', 'email']}
                       rules={[
                         { type: 'email', message: t(intl, 'auth.emailNotValid') }
                       ]}>
              <Input {...inputProps} type={'email'}
                     placeholder={placeholderField(intl, email, 'actions.enter')}/>
            </Form.Item>
          </div>
        </Form>
      </Modal>
  );
};