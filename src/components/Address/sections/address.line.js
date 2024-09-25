import React from 'react';
import { Col } from 'antd';
import { useIntl } from '@umijs/max';

import { layout } from '@/utils/layout';
import { t } from '@/utils/i18n';
import { fieldName, FormInput } from '@/utils/form';

/**
 * @export
 * @param props
 * @return {JSX.Element|null}
 * @constructor
 */
export const AddressLine = props => {
  const intl = useIntl();

  const { ns, disabled, rules = {} } = props;

  const isAddressLine1 = rules?.mandatory?.includes('addressLine1');
  const isAddressLine2 = rules?.mandatory?.includes('addressLine2');
  const isZipCode = rules?.mandatory?.includes('zipCode');

  return isAddressLine1 || isAddressLine2 || isZipCode ? (
      <>
        {isAddressLine1 ? (
            <Col {...layout.fullColumn}>
              <FormInput name={fieldName(ns, 'addressLine1')}
                         label={t(intl, 'address.addressLine', { type: 1 })}
                         intl={intl}
                         required={true}
                         disabled={disabled}/>
            </Col>
        ) : null}
        {isAddressLine2 ? (
            <Col {...layout.fullColumn}>
              <FormInput name={fieldName(ns, 'addressLine2')}
                         label={t(intl, 'address.addressLine', { type: 2 })}
                         intl={intl}
                         required={false}
                         disabled={disabled}/>
            </Col>
        ) : null}
        {isZipCode ? (
            <Col {...layout.halfColumn}>
              <FormInput name={fieldName(ns, 'zipCode')}
                         label={t(intl, 'address.zip')}
                         intl={intl}
                         required={true}
                         disabled={disabled}/>
            </Col>
        ) : null}
      </>
  ) : null;
};