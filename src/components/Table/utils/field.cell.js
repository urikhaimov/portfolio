import React, { isValidElement } from 'react';
import { Input, InputNumber } from 'antd';

/**
 * @export
 * @param fieldType
 * @param fieldProps
 * @param [value]
 * @return {Element}
 */
export const fieldCell = ({ fieldType, fieldProps, value }) => {
  let editNode;
  if (fieldType === 'number') {
    editNode = (<InputNumber {...fieldProps}/>);
  } else if (isValidElement(fieldType)) {
    // Custom React component.
    editNode = fieldType;
  } else if (typeof fieldType === 'function') {
    editNode = handleImportedField(fieldType, value);
  } else if (typeof fieldType?.component === 'function') {
    editNode = handleImportedField(fieldType?.component, value);
  } else {
    editNode = (<Input {...fieldProps}/>);
  }

  return editNode;
};

/**
 * @constant
 * @param fieldType
 * @param value
 * @return {null}
 */
const handleImportedField = (fieldType, value) => {
  let editNode;
  const cmp = fieldType(value);
  if (isValidElement(cmp)) {
    editNode = cmp;
  } else {
    // Custom React component.
    editNode = cmp?.component;
    if (!isValidElement(editNode)) {
      console.warn('Invalid React Element');
      editNode = null;
    }
  }

  return editNode;
};

/**
 * @export
 * @param formRef
 * @param {string} name
 * @param {array} [reasons]
 */
export const setFieldError = ({ formRef, name, reasons = ['Empty'] }) => {
  formRef.setFields([{ name, errors: [...reasons] }]);
};