import React from 'react';
import { FilterFilled } from '@ant-design/icons';
import { Select } from 'antd';
import _ from 'lodash';

import { Sorter } from './sorter';
import { stub } from '@/utils/function';

import styles from '../table.module.less';

/**
 * @function getValue
 * @param data
 * @param nested
 * @return {*}
 */
function getValue(data, nested) {
  if (Array.isArray(nested)) {
    let value;

    for (let item of nested) {
      value = getValue(data, item);
      if (value) break;
    }

    return value;
  }

  return _.get(data, nested);
}

/**
 * @constant
 * @param column
 * @param [dataSource]
 * @return {array}
 */
const getFilters = (column = {}, dataSource = []) => {
  const {
    dataIndex,
    filterBy = {}
  } = column;

  const _filter = dataSource?.map(data => {
    const { nested, resolver } = filterBy;
    const value = getValue(data, nested ?? dataIndex);

    const resolved = resolver ? resolver(value) : value;

    return { text: resolved, value: resolved };
  });

  const _sorted = [...(_filter.sort(Sorter.NESTED('text')))];

  return [
    ...new Map(_sorted.map(item => [item['value'], item])).values()
  ];
};

/**
 * @constant
 * @param [column]
 * @return {function(*, *): boolean}
 */
const onFilterFn = (column = {}) => (value, record) => {
  const {
    dataIndex,
    filterBy = {},
    filterSearch = false
  } = column;

  const { nested, resolver } = filterBy;
  let _record = getValue(record, nested ?? dataIndex);
  const _value = value === null ? value :
      typeof value === 'string' ? value : value.toString();

  if (resolver) {
    _record = resolver(_record);
  }

  return filterSearch ? value === null ?
          (_record === value) :
          (_record || '').startsWith(_value) :
      (_record === value);
};

/**
 * @export
 * @param {{columns}} props
 * @return {array}
 */
export const filterColumns = (props) => {
  const {
    filterPerf = {},
    columns = [],
    dataSource = [],
    setFilterPerf = stub,
    MAX_FILTERED_ITEMS = 300
  } = props;

  return columns.map(column => {
    const _column = { ...column };
    const {
      filters,
      onFilter
    } = _column;

    if (_column.filterable) {
      if (dataSource.length >= MAX_FILTERED_ITEMS) {
        // _column.filterIcon = <FilterFilled/>;
        // _column.filterSearch = false;
        //
        // if (_column.dataIndex) {
        //   let opts = [];
        //   dataSource.forEach(data => {
        //     const value = data[_column.dataIndex];
        //     if (typeof value !== 'undefined') {
        //       if (!opts.find(item => item?.value === value)) {
        //         opts.push({ value });
        //       }
        //     }
        //   });
        //
        //   _column.filterDropdown = (
        //       <div className={styles.filterPerf}>
        //         <Select value={filterPerf[_column.dataIndex]}
        //                 allowClear={true}
        //                 style={{ width: '100%' }}
        //                 onChange={value => {
        //                   setFilterPerf({
        //                     ...filterPerf,
        //                     ...{ [_column.dataIndex]: typeof value === 'undefined' ? null : value }
        //                   });
        //                   // onFilterFn(column);
        //                 }}
        //                 options={[...opts]}/>
        //       </div>
        //   );
        // }
      } else {
        _column.onFilter = onFilter ?? onFilterFn(column);
        _column.filters = filters ?? getFilters(column, dataSource);
      }

      delete _column.filterable;
    }

    return _column;
  });
};