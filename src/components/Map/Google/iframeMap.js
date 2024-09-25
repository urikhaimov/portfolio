import React from 'react';
import { Modal, Spin } from 'antd';

import Iframe from '@/components/Iframe';

import { stub } from '@/utils/function';

import googleConfig from '@/services/config/google.config';

import { fromMapProps } from './mapUtils';

import styles from './iframeMap.module.less';

export const IframeMap = props => {
  const {
    height = 400,
    width = 800,
    modalMap = null,
    setModalMap = stub
  } = props;

  const handleCancel = () => {
    setModalMap(null);
  };

  return (
      <Modal open={!!modalMap}
             className={styles.modalMap}
             onOk={handleCancel}
             onCancel={handleCancel}
             width={width}
             title={modalMap && fromMapProps(modalMap)}
             footer={null}>
        <div className={styles.map}>
          {modalMap ? (
              <Iframe height={height}
                      src={
                        googleConfig.MAP_URL.
                            replace(/ADDRESS/, modalMap.toString()).
                            replace(/MAP_KEY/, MAP_KEY)
                      }/>
          ) : <Spin/>}
        </div>
      </Modal>
  );
};

