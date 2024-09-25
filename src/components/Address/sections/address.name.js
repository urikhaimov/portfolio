import React from 'react';
import { Col } from 'antd';
import { useIntl } from '@umijs/max';

import { layout } from '@/utils/layout';
import { t } from '@/utils/i18n';
import { fieldName, FormInput } from '@/utils/form';

import styles from '../addresses.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element|null}
 * @constructor
 */
export const AddressName = props => {
  const intl = useIntl();

  const { testId, ns, disabled, rules = {}, addressNameDisabled = false } = props;

  const isName = rules?.mandatory?.includes('name');
  const isCompanyName = rules?.mandatory?.includes('companyName');

  return (isName || isCompanyName) ? (
      <div data-testid={testId} className={styles.addressName}>
        {isName ? (
            <Col {...layout.halfColumn} style={{ maxWidth: '100%' }}>
              <FormInput name={fieldName(ns, 'name')}
                         label={t(intl, 'form.fullName')}
                         intl={intl}
                         style={{ width: '100%' }}
                         required={true}
                         disabled={disabled || addressNameDisabled}/>
            </Col>
        ) : null}
        {isCompanyName ? (
            <Col {...layout.halfColumn} style={{ maxWidth: '100%' }}>
              <FormInput name={fieldName(ns, 'companyName')}
                         label={t(intl, 'address.companyName')}
                         intl={intl}
                         required={true}
                         disabled={disabled || addressNameDisabled}/>
            </Col>
        ) : null}
      </div>
  ) : null;
};