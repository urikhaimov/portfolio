import React from 'react';
import { Col, Form, Row, Select } from 'antd';
import { useIntl } from '@umijs/max';

import { layout } from '@/utils/layout';
import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';
import { isSpinning } from '@/utils/state';
import { fieldName, placeholderField, requiredField, resetNestedFields } from '@/utils/form';

import styles from '../addresses.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element|null}
 * @constructor
 */
export const AddressCountry = props => {
  const intl = useIntl();

  const {
    ns,
    loading,
    formRef,
    disabled,
    rules = {},
    countries = [],
    countryStates = [],
    stateCities = [],
    helper = false,
    selectCountry = stub,
    selectState = stub,
    selectCity = stub
  } = props;

  const countryLabel = t(intl, 'address.country');
  const stateLabel = t(intl, 'address.stateProvince');
  const cityLabel = t(intl, 'address.city');

  const isCountry = rules?.mandatory?.includes('country');
  const isState = rules?.mandatory?.includes('state');
  const isCity = rules?.mandatory?.includes('city');

  return isCountry ? (
      <Col {...layout.fullColumn} className={styles.country}>
        <div>
          <Row gutter={[24, 24]}>
            {isCountry ? (
                <Col {...layout.halfColumn}>
                  <Form.Item label={countryLabel}
                             tooltip={helper && requiredField(intl, countryLabel).message}
                             rules={[requiredField(intl, countryLabel, true)]}
                             name={fieldName(ns, 'country')}>
                    <Select showSearch
                            popupClassName={styles.largeFormItems}
                            autoComplete={'off'}
                            disabled={disabled}
                            onSelect={value => {
                              selectCountry(countries.find(country => country?.name === value));
                            }}
                            placeholder={placeholderField(intl, countryLabel)}>
                      {[...countries].map((country, idx) => (
                          <Select.Option key={idx}
                                         value={country?.name}>
                            {country?.name}
                          </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
            ) : null}
            {isState ? (
                <Col {...layout.halfColumn}>
                  <Form.Item label={stateLabel}
                             tooltip={helper && requiredField(intl, stateLabel).message}
                             rules={[requiredField(intl, stateLabel, true)]}
                             name={fieldName(ns, 'state')}>
                    <Select showSearch
                            loading={isSpinning(loading, [
                              'addressModel/getAllCountries',
                              'addressModel/getCountryStates'
                            ])}
                            popupClassName={styles.largeFormItems}
                            autoComplete={'off'}
                            disabled={disabled || !countryStates.length}
                            onSelect={value => {
                              selectState(countryStates.find(state => state?.name === value));
                              resetNestedFields(formRef, ['city']);
                            }}
                            placeholder={placeholderField(intl, stateLabel)}>
                      {[...countryStates].map((state, idx) => (
                          <Select.Option key={idx}
                                         value={state?.name}>
                            {state?.name}
                          </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
            ) : null}
          </Row>
          {isCity ? (
              <Row gutter={[24, 24]}>
                <Col {...layout.halfColumn}>
                  <Form.Item label={cityLabel}
                             tooltip={helper && requiredField(intl, cityLabel).message}
                             rules={[requiredField(intl, cityLabel, true)]}
                             name={fieldName(ns, 'city')}>
                    <Select showSearch
                            popupClassName={styles.largeFormItems}
                            autoComplete={'off'}
                            loading={isSpinning(loading, [
                              'addressModel/getAllCountries',
                              'addressModel/getCountryStates',
                              'addressModel/getStateCities'
                            ])}
                            disabled={disabled || !stateCities.length}
                            onSelect={value => selectCity(stateCities.find(city => city?.name === value))}
                            placeholder={placeholderField(intl, cityLabel)}>
                      {[...stateCities].map((city, idx) => (
                          <Select.Option key={idx}
                                         value={city?.name}>
                            {city?.name}
                          </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
          ) : null}
        </div>
      </Col>
  ) : null;
};