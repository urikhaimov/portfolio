import React from 'react';

import { stub } from '@/utils/function';

import styles from '../calendar.module.less';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export const EventToolbar = props => {
  const {
    onAdd = stub
  } = props;

  return (
      <div className={styles.toolbar}>
        <Button type={'primary'}
                icon={<PlusOutlined/>}
                onClick={onAdd}>Add Event</Button>
      </div>
  );
};