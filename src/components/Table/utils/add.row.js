import React, { useId } from 'react';
import { Button, Tooltip } from 'antd';
import { InsertRowAboveOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import { stub } from '@/utils/function';

import { scrollToRow } from './table.utils';

import styles from '../table.module.less';

/**
 * @export
 * @param props
 */
export const handleAdd = (props) => {
  const {
    formRef,
    gridRef,
    editableFields = {},
    dataSource = [],
    keyType = 'key',
    setEditingKey = stub,
    setDataSource = stub
  } = props;

  const newKey = useId();

  const newData = {
    [keyType]: newKey,
    ...editableFields
  };

  formRef.setFieldsValue(editableFields);

  setDataSource([...dataSource, newData]);
  setEditingKey(newData[keyType]);

  try {
    setTimeout(() => {
      const body = gridRef?.current?.querySelector(`.ant-table-body`);
      const tr = body?.querySelector(`tr[data-row-key="${newKey}"]`);
      scrollToRow(body, tr);
    }, 500);
  } catch(e) {
    console.warn('Unable to scroll', e);
  }
};

/**
 * @export
 * @param props
 * @return {React.JSX.Element|null}
 * @constructor
 */
export const AddRowButton = (props = {}) => {
  const {
    formRef,
    gridRef,
    addable,
    addTitle,
    onEditHelper,
    editingKey,
    icon = <InsertRowAboveOutlined/>,
    size = 'small',
    type = 'primary',
    addHelper = null,
    addDisabled = true,
    editableFields = {},
    dataSource = [],
    onAdd = stub,
    setCancelable = stub,
    setEditingKey = stub,
    setDataSource = stub
  } = props;

  const isInEdit = !!editingKey ? onEditHelper : null;

  return addable ? (
      <div className={styles.helper}>
        {addHelper ? (
            <Tooltip title={addHelper}
                     placement={'topRight'}>
              <QuestionCircleOutlined/>
            </Tooltip>
        ) : null}
        <Tooltip title={isInEdit}>
          <Button type={type}
                  size={size}
                  icon={icon}
                  disabled={addDisabled || !!editingKey}
                  onClick={(e) => {
                    e.preventDefault();

                    handleAdd({
                      formRef,
                      gridRef,
                      editableFields,
                      dataSource,
                      setEditingKey,
                      setDataSource
                    });

                    setCancelable(false);
                    onAdd(formRef);
                  }}>
            {addTitle}
          </Button>
        </Tooltip>
      </div>
  ) : null;
};