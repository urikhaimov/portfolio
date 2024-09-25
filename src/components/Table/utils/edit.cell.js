import React, { Suspense, useState } from 'react';
import { Form, Popconfirm, Typography, Tooltip } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import classnames from 'classnames';

import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';
import { effectHook } from '@/utils/hooks';

import { requiredField } from '@/components/Form';

import { handleSaveRow } from './save.row';
import { cancelEdit } from './cancel.edit';
import { handleDelete } from './delete.cell';
import { fieldCell } from './field.cell';
import {
  dynamicValidator,
  notValidFields,
  isRowEditing,
  customValidatorFn
} from './table.utils';

import styles from '../table.module.less';

/**
 * @export
 * @param props
 * @return {Element}
 * @constructor
 */
export const EditableCell = (props) => {
  const {
    intl,
    formRef,
    editing,
    editable,
    editingKey,
    dataIndex,
    title,
    required,
    fieldType,
    children,
    unique,
    dataSource,
    record = {},
    onChange = stub,
    ...restProps
  } = props;

  const [errorField, setErrorField] = useState(false);

  const _title = typeof title === 'string' ? title :
      title?.props?.children?.toString();

  effectHook(() => {
  }, [], () => {
    setErrorField(false);
  });

  /**
   * @constant
   * @type {React.ReactNode|*}
   */
  const fieldProps = {
    onChange(e) {
      onChange({
        value: e.target.value,
        dataIndex,
        record,
        formRef
      });
    },
    className: classnames({ ['ant-input-status-error']: errorField }),
    placeholder: t(intl, 'form.placeholder', { field: _title })
  };

  const shouldEdit = !!(editing && editable && record?.key === editingKey);

  return (
      <td>
        <Suspense fallback={<LoadingOutlined/>}>
          {shouldEdit ? (
              <Form.Item name={dataIndex}
                         shouldUpdate
                         style={{ margin: 0 }}
                         rules={[
                           requiredField(intl, _title, required),
                           (formRef) => {
                             return required ?
                                 dynamicValidator({
                                   props,
                                   setErrorField,
                                   formRef,
                                   validatorFn: customValidatorFn({
                                     formRef,
                                     fieldType,
                                     dataIndex
                                   })
                                 }) :
                                 Promise.resolve();
                           }
                         ]}>
                {fieldCell({
                  fieldType,
                  fieldProps,
                  value: record[dataIndex]
                })}
              </Form.Item>
          ) : (
              children
          )}
        </Suspense>
      </td>
  );
};

/**
 * @export
 * @param props
 */
export const editRow = (props) => {
  const {
    record,
    formRef,
    keyType = 'key',
    editableFields = {},
    setEditingKey = stub
  } = props;

  formRef.setFieldsValue({
    ...editableFields,
    ...record
  });

  setEditingKey(record[keyType]);
};

/**
 * @export
 * @param props
 * @return {{dataIndex: string, title: string, render: (function(*, *): React.JSX.Element)}}
 */
export const editOperations = (props) => {
  const {
    intl,
    columns,
    editingKey,
    formRef,
    cancelable,
    keyType = 'key',
    dataSource = [],
    editableFields = {},
    onCancel = stub,
    onEdit = stub,
    onSave = stub,
    onDelete = stub,
    setCancelable = stub,
    setDataSource = stub,
    setEditingKey = stub
  } = props;

  return {
    title: 'Actions',
    dataIndex: 'actions',
    width: 150,
    render: (_, record) => {

      /**
       * @constant
       * @type {boolean}
       */
      const editing = isRowEditing({
        record,
        editingKey,
        keyType
      });

      /**
       * @constant
       * @type {array|boolean}
       */
      const isNotValidFields = notValidFields({
        keyType,
        editingKey,
        columns,
        formRef,
        dataSource
      });

      let _tooltip = [];

      if (isNotValidFields?.length) {
        const _duplicate = isNotValidFields.some(e => e.reason === 'Duplicate');
        const _empty = isNotValidFields.some(e => e.reason === 'Empty');

        if (_duplicate) _tooltip.push(t(intl, 'table.error.unique'));
        if (_empty) _tooltip.push(t(intl, 'table.error.blank'));
      }

      const basicProps = {
        formRef,
        editableFields,
        setEditingKey
      };

      return (
          <span className={styles.actions}>
            {!!editing ? (
                <>
                  <Tooltip title={_tooltip?.length ? _tooltip.join(', ') : null}>
                    <Typography.Link disabled={false}
                                     onClick={async (e) => {
                                       e.preventDefault();
                                       e.stopPropagation();

                                       const errors = await handleSaveRow({
                                         editingKey,
                                         keyType,
                                         columns,
                                         dataSource,
                                         setDataSource,
                                         onSave,
                                         ...basicProps
                                       });

                                       if (errors) {
                                         // TODO (teamco): Do something.
                                       }
                                     }}>
                      {t(intl, 'actions.save')}
                    </Typography.Link>
                  </Tooltip>
                  <Popconfirm title={t(intl, 'message.cancelConfirm')}
                              onConfirm={e => {
                                e.preventDefault();
                                e.stopPropagation();

                                cancelEdit({ ...basicProps });
                                if (cancelable) {
                                  // TODO (teamco): do something.
                                } else {
                                  // Handle delete new (unsaved) row.
                                  handleDelete({
                                    [keyType]: record[keyType],
                                    keyType,
                                    dataSource,
                                    setDataSource
                                  });
                                }

                                setCancelable(true);
                                onCancel();
                              }}>
                    <Typography.Link>
                      {t(intl, 'actions.cancel')}
                    </Typography.Link>
                  </Popconfirm>
                </>
            ) : (
                <>
                  <Typography.Link disabled={editingKey !== ''}
                                   onClick={e => {
                                     e.preventDefault();
                                     e.stopPropagation();

                                     editRow({ record, ...basicProps });
                                     onEdit({ record });
                                   }}>
                    {t(intl, 'actions.edit', { type: '' })}
                  </Typography.Link>
                  <Popconfirm title={t(intl, 'message.deleteConfirm', { instance: t(intl, 'table.row') })}
                              onConfirm={e => {
                                e.preventDefault();
                                e.stopPropagation();

                                handleDelete({
                                  [keyType]: record[keyType],
                                  keyType,
                                  dataSource,
                                  setDataSource,
                                  onDelete
                                });
                              }}>
                    <Typography.Link disabled={editingKey !== ''}>
                      {t(intl, 'actions.delete')}
                    </Typography.Link>
                  </Popconfirm>
                </>
            )}
        </span>
      );
    }
  };
};