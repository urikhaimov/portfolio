import { stub } from '@/utils/function';

import { notValidFields } from './table.utils';
import { cancelEdit } from './cancel.edit';

/**
 * @export
 * @param props
 * @return {Promise<boolean>}
 */
const updateSave = async (props) => {
  const {
    formRef,
    editingKey,
    keyType = 'key',
    dataSource = [],
    editableFields = {},
    onSave = stub,
    setDataSource = stub,
    setEditingKey = stub
  } = props;

  const formFields = await formRef.getFieldsValue();
  let row = {};

  Object.keys(editableFields).forEach(f => {
    row[f] = formFields[f];
  });

  const newData = [...dataSource];
  const index = newData.findIndex((item) => editingKey === item[keyType]);

  if (index > -1) {
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });

  } else {

    newData.push(row);
  }

  setDataSource(newData);
  onSave({ dataSource: newData });
  cancelEdit({
    formRef,
    editableFields,
    setEditingKey
  });

  return true;
};

/**
 * @export
 * @param props
 * @return {Promise<boolean>}
 */
export const handleSaveRow = async (props = {}) => {
  const {
    formRef,
    editingKey,
    keyType = 'key',
    columns = [],
    dataSource = [],
    editableFields = {},
    setDataSource = stub,
    setEditingKey = stub,
    onSave = stub
  } = props;

  // Handle external validators
  const errors = formRef.getFieldsError().filter(e => e.errors.length);
  const dataIdx = errors.map(e => e.name[0]).filter(e => typeof editableFields[e] !== 'undefined');

  if (dataIdx.length) {
    return dataIdx;
  }

  const _isNotValid = notValidFields({
    keyType,
    editingKey,
    columns,
    formRef,
    dataSource
  });

  // Handle internal validators
  return _isNotValid?.length ?
      _isNotValid :
      await updateSave({
        editingKey,
        keyType,
        formRef,
        dataSource,
        editableFields,
        setDataSource,
        setEditingKey,
        onSave
      });
};