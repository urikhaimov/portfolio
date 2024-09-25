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
export const AddressBox = props => {
  const intl = useIntl();

  const { ns, disabled, rules = {}, helper } = props;

  const isPoBox = rules?.mandatory?.includes('poBox');
  const isBoxNumber = rules?.mandatory?.includes('boxNumber');

  return isPoBox || isBoxNumber ? (
      <>
        {isPoBox ? (
            <Col {...layout.halfColumn}>
              <FormInput name={fieldName(ns, 'poBox')}
                         label={t(intl, 'address.poBox')}
                         intl={intl}
                         required={false}
                         disabled={disabled}/>
            </Col>
        ) : null}
        {isBoxNumber ? (
            <Col {...layout.halfColumn}>
              <FormInput name={fieldName(ns, 'boxNumber')}
                         label={t(intl, 'address.boxNumber')}
                         intl={intl}
                         required={false}
                         disabled={disabled}/>
            </Col>
        ) : null}
      </>
  ) : null;
};