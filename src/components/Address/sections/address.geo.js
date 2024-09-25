import React from 'react';
import { Col } from 'antd';
import { useIntl } from '@umijs/max';

import { layout } from '@/utils/layout';
import { t } from '@/utils/i18n';
import { useGeolocation } from '@/utils/geolocation';
import request from '@/utils/request';
import { effectHook } from '@/utils/hooks';
import { fieldName, FormInput } from '@/utils/form';

/**
 * @export
 * @param props
 * @return {JSX.Element|null}
 * @constructor
 */
export const AddressGeo = props => {
  const intl = useIntl();
  const { messageApi } = request.xhr.message;

  const {
    geo,
    ns,
    disabled,
    rules = {}
  } = props;

  const isCoordinate = rules?.mandatory?.includes('coordinate');

  let geoLocation = useGeolocation(geo);

  // TODO (teamco): Handle current geo location.
  const { longitude = 0, latitude = 0, error } = geoLocation;

  effectHook(async () => {
    if (error) {
      messageApi.open({ type: 'warning', content: error });
    }
  }, [geoLocation]);

  return geo && isCoordinate ? (
      <>
        <Col {...layout.halfColumn}>
          <FormInput name={fieldName(ns, 'longitude')}
                     label={t(intl, 'address.longitude')}
                     extra={t(intl, 'address.longitude.helper')}
                     intl={intl}
                     required={false}
                     disabled={disabled}/>
        </Col>
        <Col {...layout.halfColumn}>
          <FormInput name={fieldName(ns, 'latitude')}
                     label={t(intl, 'address.latitude')}
                     extra={t(intl, 'address.latitude.helper')}
                     intl={intl}
                     required={false}
                     disabled={disabled}/>
        </Col>
      </>
  ) : null;
};