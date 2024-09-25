import React from 'react';
import { FieldNumberOutlined } from '@ant-design/icons';

/**
 * @export
 * @param current
 * @param pageSize
 * @return {{rowScope: string, width: number, title: JSX.Element, align: string, render: (function(*, *, *): *)}}
 */
export const numberRow = ({ current, pageSize }) => {
  return {
    title: <FieldNumberOutlined/>,
    rowScope: 'row',
    align: 'center',
    width: 50,
    render: (_, record, idx) => {
      const pageDelta = current === 1 ? idx : (current - 1) * pageSize + idx;

      return (<span>{pageDelta + 1}</span>);
    }
  };
};