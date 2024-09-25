import { Sorter } from './sorter';

/**
 * @export
 * @param props
 * @return {array}
 */
export const sortColumns = (props) => {
  const {
    columns = []
  } = props;

  return columns.map(column => {
    const _column = { ...column };
    const {
      sorter,
      // defaultSortOrder,
      sortDirections
    } = _column;

    if (_column.sortable) {
      _column.sorter = sorter ?? Sorter.NESTED(_column.dataIndex);
      _column.sortDirections = sortDirections ?? ['descend', 'ascend'];
      // _column.defaultSortOrder = defaultSortOrder ?? 'descend';

      delete _column.sortable;
    }

    return _column;
  });
};