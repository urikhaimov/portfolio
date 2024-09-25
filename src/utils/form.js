import React from 'react';
import { Form, Input, InputNumber } from 'antd';

import { t } from '@/utils/i18n';
import { logger } from '@/utils/console';
import { stub } from '@/utils/function';
import { isSpinning } from '@/utils/state';

import { isDevelopment } from '@/services/common.service';

/**
 * @export
 * @link https://github.com/yiminghe/async-validator#type
 * @param intl
 * @param field
 * @param {boolean} [required]
 * @param {string} [type]
 * @return {{message: string, required: boolean}}
 */
export const requiredField = (intl, field, required = true, type) => {
  const rule = {
    required,
    message: t(intl, 'event.field.required', { field })
  };

  if (type) {
    rule.type = type;
  }

  return rule;
};

/**
 * @export
 * @type {array}
 */
export const urlFieldValidation = [
  { type: 'url', warningOnly: true },
  { type: 'string', min: 6 }
];

/**
 * @export
 * @param intl
 * @param {string} label
 * @param {string} [type]
 * @return {string}
 */
export const placeholderField = (intl, label, type) => {
  return t(intl, 'form.placeholder', {
    field: label,
    type: t(intl, type || 'actions.select')
  });
};

/**
 * @export
 * @async
 * @param formRef
 * @param {function} [handler]
 * @return {*}
 */
export const validateFields = (formRef, handler = stub) => {
  formRef.validateFields().then(() => {
    handler();
  }).catch((...errors) => {
    if (isDevelopment()) {
      logger({ type: 'warn', errors });
    }
  });
};

/**
 * @export
 * @param {string|array|null} ns
 * @param {array|string} names
 * @return {array}
 */
export const fieldName = (ns, names) => {
  let _names = [];
  if (typeof names === 'string') {
    _names = [names];
  } else if (Array.isArray(names)) {
    _names = [...names];
  }

  const _ns = Array.isArray(ns) ? ns : [ns];

  return ns ? [..._ns, ..._names] : [..._names];
};

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const FormInput = props => {
  const {
    name,
    label,
    disabled,
    intl,
    type = 'text',
    rules = [],
    help,
    helper = false,
    extra = null,
    required = true,
    noStyle = false,
    ...rest
  } = props;

  const placeholder = placeholderField(intl, label, 'actions.enter');

  return (
      <Form.Item name={name}
                 label={label}
                 help={help}
                 extra={extra}
                 noStyle={noStyle}
                 tooltip={helper && required ? requiredField(intl, label).message : null}
                 rules={[
                   requiredField(intl, label, required),
                   ...rules
                 ]}>
        {type === 'number' ? (
            <InputNumber placeholder={placeholder}
                         disabled={disabled}
                         {...rest} />
        ) : (
            <Input type={type}
                   disabled={disabled}
                   placeholder={placeholder}
                   {...rest}/>
        )}
      </Form.Item>
  );
};

/**
 * @constant
 * @param {string} [ns]
 * @param {string} name
 * @param formRef
 * @return {*}
 */
export const resetField = (name, formRef, ns = '') => {
  formRef?.setFields([
    {
      name: fieldName(ns, name),
      value: null
    }
  ]);
};

/**
 * @constant
 * @param formRef
 * @param {array} [fNames]
 * @param {string} [ns]
 */
export const resetNestedFields = (formRef, fNames = [], ns = '') => {
  formRef.setFields([
    ...fNames.map(fName => ({ name: fieldName(ns, fName), value: null }))
  ]);
};

/**
 * @export
 * @param props
 * @param [MODEL_NAME]
 * @return {{layout: string, onFieldsChange, scrollToFirstError: boolean, className: string, onFinish: stub, fields}}
 */
export const formProps = (props, MODEL_NAME) => {
  const {
    className,
    entityForm,
    size = 'middle',
    layout = 'vertical',
    autoComplete = 'off',
    scrollToFirstError = true,
    spinOn = [],
    loading,
    onFinish = stub,
    onFieldsChange = stub
  } = props;

  /**
   * @constant
   * @param changedFields
   * @param allFields
   */
  const handleOnFieldsChange = (changedFields, allFields) => {
    if (isSpinning(loading, spinOn)) return false;

    onFieldsChange(changedFields, allFields, MODEL_NAME);
  };

  return {
    layout,
    size,
    className,
    autoComplete,
    scrollToFirstError,
    fields: entityForm,
    onFinish,
    onFieldsChange: handleOnFieldsChange
  };
};

/**
 * @export
 * @param entities
 * @param positives
 * @param key
 * @return {array}
 */
export const setAsPositives = ({ entities = [], positives = [], key }) => {
  const positivesMap = new Map(positives.map(p => [p.id, p]));
  let items = [];

  for (let item of entities) {
    const _current = positivesMap.get(item.id);

    if (_current) {
      items.push({ ...item, [key]: _current[key] });
    } else if (item[key]) {
      items.push({ ...item, [key]: false });
    }
  }

  return items;
};

/**
 * @export
 * @param entities
 * @param key
 * @return {array}
 */
export const setAsNegatives = ({ entities = [], key }) => {
  let items = [];

  for (let item of entities) {
    if (item[key]) {
      items.push({ ...item, [key]: false });
    }
  }

  return items;
};

/**
 * @export
 * @param entities
 * @param primaries
 * @param {string} [key]
 * @return {array}
 */
export const toggleEntityAs = ({ entities = [], selected = [], key }) => {
  return entities?.length ?
      setAsPositives({ entities, positives: selected, key }) :
      setAsNegatives({ entities, key });
};