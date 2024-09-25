import React from 'react';
import { Modal } from 'antd';

import request from '@/utils/request';

import googleConfig from '@/services/config/google.config';

import { toMapProps } from './Google/mapUtils';

import Iframe from '@/components/Iframe';

import styles from './gmap.module.less';

/**
 * @export
 * @constant showOnMap
 * @param {Object} address
 * @return {JSX.Element|null}
 */
export const showOnMap = (address) => {
  const { modalApi } = request.xhr.modal;

  if (address) {
    const mapAddress = toMapProps([
      address.addressLine1,
      address.city,
      address.country
    ]);

    Modal.destroyAll();

    modalApi.info({
      className: styles.modalApi,
      centered: true,
      icon: null,
      width: 600,
      title: `${address.country}, ${address.city} - ${address.addressLine1}`,
      content: (
          <Iframe height={400}
                  spinning={true}
                  src={
                    googleConfig.MAP_URL.
                        replace(/ADDRESS/, mapAddress.toString()).
                        replace(/MAP_KEY/, MAP_KEY)
                  }/>
      )
    });
  }
};