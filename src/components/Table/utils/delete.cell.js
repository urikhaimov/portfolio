import { stub } from '@/utils/function';

/**
 * @export
 * @param props
 */
export const handleDelete = (props = {}) => {
  const {
    keyType = 'key',
    dataSource = [],
    setDataSource = stub,
    onDelete = stub
  } = props;

  const newData = dataSource.filter((item) => item[keyType] !== props[keyType]);

  setDataSource(newData);
  onDelete({ dataSource: newData });
};