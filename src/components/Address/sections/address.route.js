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
export const AddressRoute = props => {
  const intl = useIntl();

  const { ns, disabled, rules = {} } = props;

  const isRuralRoute = rules?.mandatory?.includes('ruralRoute');
  const isHighwayContractRoute = rules?.mandatory?.includes('highwayContractRoute');
  const isGeneralDelivery = rules?.mandatory?.includes('generalDelivery');

  return isRuralRoute || isHighwayContractRoute || isGeneralDelivery ? (
      <>
        {isRuralRoute ? (
            <Col {...layout.fullColumn}>
              <FormInput name={fieldName(ns, 'ruralRoute')}
                         label={t(intl, 'address.ruralRoute')}
                         intl={intl}
                         required={true}
                         disabled={disabled}/>
            </Col>
        ) : null}
        {isHighwayContractRoute ? (
            <Col {...layout.fullColumn}>
              <FormInput name={fieldName(ns, 'highwayContractRoute')}
                         label={t(intl, 'address.highwayContractRoute')}
                         intl={intl}
                         required={true}
                         disabled={disabled}/>
            </Col>
        ) : null}
        {isGeneralDelivery ? (
            <Col {...layout.fullColumn}>
              <FormInput name={fieldName(ns, 'generalDelivery')}
                         label={t(intl, 'address.generalDelivery')}
                         intl={intl}
                         required={true}
                         disabled={disabled}/>
            </Col>
        ) : null}
      </>
  ) : null;
};