import React, { memo, useRef, useState } from 'react';
import { Form, Input, Select, Space } from 'antd';
import { useIntl } from '@umijs/max';
import classnames from 'classnames';

import {
  formatPhoneNumberIntl,
  isPossiblePhoneNumber,
  isValidPhoneNumber,
  parsePhoneNumber
} from 'react-phone-number-input';

import { CountryFlag } from './countryFlag';

import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';
import { effectHook } from '@/utils/hooks';
import { fieldName, requiredField } from '@/utils/form';
import { findValue } from '@/utils/object';

import 'react-phone-number-input/style.css';

import styles from './form.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const Phone = (props) => {
  const intl = useIntl();

  const {
    isEdit,
    formRef,
    disabled,
    className,
    status = null,
    ns = 'phone',
    required = true,
    isStrict = true,
    extension = true,
    countryCodes = [],
    sPhones = [],
    placeholder = t(intl, 'form.phone', 'actions.enter'),
    setStatus = stub,
    onBlur = stub,
    onChange = stub
  } = props;

  const inputRef = useRef(null);

  const [parsed, setParsed] = useState(null);

  /**
   * @export
   * @return {{_country, _phone, _extension}}
   */
  const getFieldsValue = () => {
    const fields = formRef?.getFieldsValue();

    const { country, nationalNumber, extension } = findValue(fields, ns) || {};

    return {
      _country: country,
      _phone: nationalNumber,
      _extension: extension
    };
  };

  effectHook(() => {
    if (formRef && getFieldsValue()._phone) {
      onPhoneValidator().catch(error => console.warn(error));
    }
  }, [formRef, getFieldsValue()._phone]);

  effectHook(() => {
    if (formRef && parsed) {
      // TODO (teamco): Do something.
      formRef?.validateFields().then(
          () => {
          },
          () => {
          }
      );
    }
  }, [formRef, parsed]);

  const findPhone = (sPhones, parsed) => {
    return sPhones.find(p =>
        p.numberDetails.nationalNumber.replace(/ /g, '') === parsed?.number &&
        p.numberDetails.country === parsed?.country
    );
  };

  /**
   * @const countryOptions
   * @type {array}
   */
  const countryOptions = countryCodes.map((code) => {
    return {
      value: code,
      label: (
          <div className={styles.flags}>
            <CountryFlag country={code} title={code}/>
            {code}
          </div>
      )
    };
  });

  /**
   * @const setPhoneNumber
   * @param [phone]
   * @param [ext]
   * @return {*}
   */
  const setPhoneNumber = (phone = null, ext = null) =>
      formRef.setFields([
        { name: fieldName(ns, ['nationalNumber']), value: phone },
        { name: fieldName(ns, ['extension']), value: ext }
      ]);

  /**
   * @function numberInputChanged
   * @param phone
   */
  function numberInputChanged(phone) {
  }

  /**
   * @constant
   * @param [parsed]
   * @return {string}
   */
  const getFormatted = (parsed) => {
    let _parsed = parsed;

    if (!parsed) {
      const { _country, _phone } = getFieldsValue();
      _parsed = _phone && parsePhoneNumber(_phone, _country);
    }

    return formatPhoneNumberIntl(_parsed?.number);
  }

  /**
   * @const onPhoneValidator
   * @return {Promise<never>|Promise<void>}
   */
  const onPhoneValidator = () => {

    const {
      _country,
      _phone,
      _extension
    } = getFieldsValue();

    /**
     * @private
     * @param msg
     * @description A function that sets the status to 'error', triggers onChange with false,
     * and returns a rejected Promise with the message 'message.invalidPhone'.
     * @return {Promise} a rejected Promise with the message 'message.invalidPhone'
     */
    const _onReject = (msg = t(intl, 'form.phone.invalidPhone')) => {
      setStatus({ msg, error: true });
      formRef.setFields([
        {
          name: [fieldName(ns, 'nationalNumber')],
          value: _phone,
          errors: [msg]
        }
      ]);

      return Promise.reject(msg);
    };

    const _parsed = _phone && parsePhoneNumber(_phone, _country);

    if (_parsed) {
      const _isValid = isValidPhoneNumber(_parsed.number);
      const _isPossible = isPossiblePhoneNumber(_parsed.number);
      const _formatted = getFormatted(_parsed);

      const _isIncluded = findPhone(sPhones, _parsed);

      if (_isIncluded && !isEdit) {
        if (extension) {
          if ((
              typeof _extension === 'string' &&
              _isIncluded?.numberDetails?.extension === _extension
          ) || (
              !_isIncluded?.numberDetails?.extension && !_extension
          )) {
            return _onReject(t(intl, 'form.phone.exists'));
          }
        } else {
          return _onReject(t(intl, 'form.phone.exists'));
        }
      }

      if (isStrict ? _isValid : _isPossible) {
        setStatus({ msg: 'success', error: false });
        setPhoneNumber(_formatted, _extension);
        onChange(_parsed);
        setParsed(_parsed);
        return Promise.resolve();
      }

      return _onReject();
    }

    return _onReject();
  };

  /**
   * @function selectCountry
   */
  function selectCountry() {
    setStatus(null);
    setParsed(null);
    setPhoneNumber();
  }

  return (
      <div className={classnames(styles.phoneNumber, className)}>
        <Form.Item noStyle>
          <Space.Compact className={styles.phoneSpace}>
            <Form.Item noStyle
                       name={fieldName(ns, ['country'])}
                       rules={[requiredField(intl, t(intl, 'form.phone.countryCode'), true)]}>
              <Select showSearch
                      role={'presentation'}
                      disabled={disabled}
                      style={{ width: 150 }}
                      options={countryOptions}
                      onSelect={selectCountry}/>
            </Form.Item>
            <Form.Item noStyle
                       shouldUpdate
                       hasFeedback
                       // normalize={() => parsed && getFormatted(parsed)}
                       validateStatus={status ? (status?.error ? 'error' : 'success') : null}
                       name={fieldName(ns, ['nationalNumber'])}
                       rules={[requiredField(intl, t(intl, 'form.phone'), required)]}>
              <Input role={'presentation'}
                     disabled={disabled}
                     ref={inputRef}
                     placeholder={placeholder}
                     autoComplete={'off'}
                     autofill={'off'}
                     onChange={(e) => {
                       onChange(e.target.value);
                     }}
                     onBlur={e => {
                       onPhoneValidator().catch(error => console.warn(error));
                       onBlur(e.target.value);
                     }}/>
            </Form.Item>
            {extension ? (
                <Form.Item noStyle name={fieldName(ns, ['extension'])}>
                  <Input placeholder={t(intl, 'form.phone.extension')}
                         style={{ width: 125 }}
                         disabled={disabled}
                         autoComplete={'off'}
                         autofill={'off'}
                         onBlur={onBlur}/>
                </Form.Item>
            ) : null}
          </Space.Compact>
        </Form.Item>
        {status?.error && (
            <div className={styles.error}>
              {status?.msg}
            </div>
        )}
      </div>
  );
};

export default memo(Phone);
