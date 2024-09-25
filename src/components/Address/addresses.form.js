import React, { useState } from 'react';
import { Form, Input, Row } from 'antd';
import _ from 'lodash';

import { stub } from '@/utils/function';
import { effectHook } from '@/utils/hooks';
import { fieldName, resetField } from '@/utils/form';

import Loader from '@/components/Loader';

import { AddressRoute } from './sections/address.route';
import { AddressGeo } from './sections/address.geo';
import { AddressBox } from './sections/address.box';
import { AddressLine } from './sections/address.line';
import { AddressCountry } from './sections/address.country';
import { AddressName } from './sections/address.name';
import { AddressType } from './sections/address.type';

import styles from './addresses.module.less';

const MODEL_NAME = 'addressModel';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const AddressesForm = props => {
  const [localFormRef] = Form.useForm();

  const {
    testId,
    loading,
    canUpdate,
    disabled,
    className,
    formRef,
    ns = 'address',
    nestedForm = false,
    // geo = false,
    isEdit = false,
    addressTypeDisabled = false,
    addressNameDisabled = false,
    spinOn = [],
    addressModel = {},
    assignedModel = {},
    initialValues = {},
    selectedAddress = null,
    onExtra = stub,
    onEdit = stub,
    onSave = stub,
    onFieldsChange = stub,
    onGetStateCities = stub,
    onGetCountryStates = stub,
    onGetAllCountries = stub
  } = props;

  const {
    touched,
    entityForm,
    selectedAddress: selected
  } = assignedModel;

  const {
    countries = [],
    countryStates = [],
    stateCities = [],
    addressTypes = []
  } = addressModel;

  const onChangeFormProps = {
    touched,
    entityForm,
    loading,
    spinOn,
    onFieldsChange,
    onFinish(formValues) {
      if (canUpdate) {
        onSave([formValues]);
        onEdit(null);
      }
    }
  };

  const _initialValues = _.merge({}, addressModel?.initialValues, initialValues);
  const _selected = selectedAddress || selected || _initialValues.address;

  const [formReference, setFormRef] = useState(null);
  const [country, selectCountry] = useState(null);
  const [state, selectState] = useState(null);
  const [city, selectCity] = useState(null);
  const [aType, selectType] = useState(_initialValues?.address?.addressType);

  /**
   * @function
   * @param {string} fName - Field name.
   * @return {{name: array, value: *}}
   * @private
   */
  function _setter(fName) {
    return { name: fieldName(ns, fName), value: _selected?.[fName] };
  }

  effectHook(() => {
    onGetAllCountries();

    if (nestedForm) {
      setFormRef(formRef);
    } else {
      setFormRef(localFormRef);
    }
  });

  effectHook(() => {
    if (_selected?.id) {
      selectType(_selected?.addressType);
      selectCountry(countries.find(country => country?.name === _selected?.country));
      selectState(countryStates.find(state => state?.name === _selected?.state));
      selectCity(stateCities.find(city => city?.name === _selected?.city));
    }
  }, [countryStates, stateCities, _selected]);

  effectHook(() => {
    if (_selected) {
      setTimeout(() => {
        formReference?.setFields([
          _setter('country'),
          _setter('state'),
          _setter('city')
        ]);
      }, 100);
    }
  }, [city, _selected]);

  effectHook(() => {
    if (country) {
      onGetCountryStates(country);
    } else {
      cleanCountryFields('state');
    }
  }, [country]);

  effectHook(() => {
    if (state) {
      onGetStateCities(country, state);
    } else {
      cleanCountryFields('city');
    }
  }, [state]);

  const cleanCountryFields = (type) => {
    if (type === 'state') {
      selectState(null);
    }

    selectCity(null);
    resetField(type, formReference, ns);
  };

  const rules = addressTypes.find(rule => rule.type === aType);

  const sharedProps = { ns, loading, formRef: formReference, disabled, rules };

  const countryProps = {
    ...sharedProps,
    countries,
    countryStates,
    stateCities,
    country,
    state,
    selectCountry,
    selectState,
    selectCity
  };

  const typeProps = {
    ...sharedProps,
    addressTypeDisabled,
    addressTypes,
    selectType,
    aType
  };

  // const geoProps = { ...sharedProps, geo };

  const _formSections = (
      <Row gutter={[24, 12]}>
        <Form.Item name={fieldName(ns, 'id')} style={{ display: 'none' }}>
          <Input disabled={disabled} type={'hidden'}/>
        </Form.Item>
        <AddressType {...typeProps}/>
        {aType ? (<AddressName {...sharedProps} addressNameDisabled={addressNameDisabled}/>) : null}
        {aType ? (<AddressCountry {...countryProps}/>) : null}
        {aType ? (<AddressLine {...sharedProps}/>) : null}
        {aType ? (<AddressRoute {...sharedProps}/>) : null}
        {/*{aType ? (<AddressGeo {...geoProps}/>) : null}*/}
        {aType ? (<AddressBox {...sharedProps} />) : null}
      </Row>
  );

  return (
      <div data-testid={testId}>
        <Loader loading={loading} spinOn={[
          `${MODEL_NAME}/getAllCountries`,
          `${MODEL_NAME}/getCountryStates`,
          `${MODEL_NAME}/getStateCities`,
          ...spinOn
        ]}/>
        <div className={className}>
          {nestedForm ? _formSections : (
              <Form {...formProps(onChangeFormProps)}
                    form={localFormRef}
                    rootClassName={styles.form}
                    initialValues={_initialValues}>
                {_formSections}
              </Form>
          )}
        </div>
        {isEdit && onExtra()}
      </div>
  );
};