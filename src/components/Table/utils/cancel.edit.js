import { stub } from '@/utils/function';

/**
 * @export
 * @param props
 */
export const cancelEdit = (props) => {
  const {
    formRef,
    editableFields = {},
    setEditingKey = stub
  } = props;

  setEditingKey('');
  formRef.setFieldsValue(editableFields);
};
