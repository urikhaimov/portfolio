import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';

import { handleResize } from './resizable.cell';
import { numberRow } from './number.row';
import { sortableHandler } from './sortable.row';
import { setFieldError } from './field.cell';

import styles from '../table.module.less';

/**
 * @description Add keys to dataSource
 * @param {array} [data]
 * @param {string} [type]
 */
export const dataSourceTransform = (data = [], type = 'key') => {
  return data.map((entity, idx) => {
    if (typeof entity[type] === 'undefined') return { ...entity, ...{ [type]: idx } };
    return entity;
  });
};

/**
 * @export
 * @param props
 * @param dataSource
 * @return {*}
 */
export const gridConfig = ({ props, dataSource = [] }) => {
  const _props = { ...props };

  _props.dataSource = dataSource;

  delete _props.t;
  delete _props.data;
  delete _props.columns;

  return _props;
};

/**
 * @export
 * @param record
 * @param keyType
 * @param editingKey
 * @return {boolean}
 */
export const isRowEditing = ({ record, keyType = 'key', editingKey }) => record[keyType] === editingKey;

/**
 * @export
 * @param args
 * @return {{validator(*, *): (Promise<void>)}|Promise<never>|Promise<void>}
 */
export const dynamicValidator = (args) => {
  const {
    props,
    formRef,
    setErrorField = stub,
    validatorFn = () => Promise.resolve()
  } = args;

  const { required, unique } = props;

  return ({
    validator(_, value) {
      let _validator = true;

      if (required) {
        if (typeof value === 'number') {
          if (unique) {
            // TODO (teamco): Do something.
          }
        } else {

          // String
          if (value?.length) {
            if (unique) {
              // TODO (teamco): Do something.
            }
          } else {
            _validator = false;
            setErrorField(true);
          }
        }
      }

      if (unique) {
        // TODO (teamco): Do something.
      }

      return _validator ? validatorFn() : Promise.reject();
    }
  });
};

/**
 * @async
 * @param formRef
 * @param dataIndex
 * @param component
 * @return {Promise<void>}
 * @private
 */
const _handleValidator = async ({ formRef, dataIndex, component }) => {
  if (typeof component === 'function') {
    const value = formRef.getFieldValue(dataIndex);
    const _validator = component(value)?.validator;

    if (typeof _validator === 'function') {
      const error = await _validator({ field: dataIndex, formRef });
      if (!!error) {
        setFieldError({ formRef, name: dataIndex, reasons: [error] });
        // const formErrors = await formRef.validateFields().catch(error => console.warn(error));
        console.log(error, formRef.getFieldError(dataIndex));
        return Promise.reject(error);
      }

      return Promise.resolve();
    }

    return Promise.resolve();
  }
};

/**
 * @export
 * @async
 * @param fieldType
 * @param formRef
 * @param dataIndex
 * @return {*}
 */
export const customValidatorFn = ({ fieldType, formRef, dataIndex }) => async () => {
  const { component } = fieldType;

  // if (validator && !validator.isValid) {
  //   return Promise.reject(validator.reason);
  // }

  if (component) {
    return await _handleValidator({ formRef, dataIndex, component });
  }

  return Promise.resolve();
};

/**
 * @constant
 * @param props
 * @return {array|boolean}
 */
export const notValidFields = (props = {}) => {
  const {
    keyType = 'key',
    editingKey,
    formRef,
    columns = [],
    dataSource = []
  } = props;

  if (!columns.length || !formRef) return false;

  const values = formRef.getFieldsValue();
  const mandatory = columns.filter(c => c.required);
  let validate = [];

  /**
   * @param field
   * @param reason
   * @param value
   * @param {boolean} [setter]
   * @private
   */
  const _handleReason = (field, reason, value, setter = false) => {
    setter && setFieldError({ formRef, name: field.dataIndex, value, reasons: [reason] });
    validate.push({ name: field.dataIndex, reason });
  };

  for (const field of mandatory) {
    const validated = values[field.dataIndex];

    if (field?.unique) {
      const isExists = dataSource.find(d => d[field.dataIndex] === validated);
      if (isExists && editingKey !== isExists[keyType]) {
        _handleReason(field, 'Duplicate', validated, true);
      }
    }

    if (field.fieldType === 'number') {
      if (typeof validated === 'undefined') {
        _handleReason(field, 'Empty', validated);
      }
    } else {

      // TODO (teamco): Add additional field types.
      if (typeof validated === 'undefined' || !validated?.length) {
        _handleReason(field, 'Empty', validated);
      }
    }
  }

  return validate;
};

/**
 * @export
 * @param {array} [columns]
 * @return {{}}
 */
export const handleEditableFields = (columns = []) => {
  let fields = {};
  columns.filter(c => c.editable).forEach(c => {
    fields[c.dataIndex] = undefined;
  });

  return fields;
};

/**
 * @export
 * @param {array} [columns]
 * @return {array}
 */
export const handleUniqueFields = (columns = []) => columns.filter(c => c.unique);

/**
 * @export
 * @param {array} [columns]
 * @return {array}
 */
export const handleRequiredFields = (columns = []) => {
  return columns.map(c => {
    if (c.required) {
      c.className = styles.required;
    }

    return c;
  });
};

/**
 * @export
 * @param props
 * @return {{pagination}}
 */
export const handlePagination = (props) => {
  const {
    tablePageSize,
    pagination,
    dataSource = [],
    onChange = stub,
    defaults: {
      DEFAULT_SIZE_CHANGER,
      DEFAULT_CURRENT_PAGE
    }
  } = props;

  const {
    sizeChanger = DEFAULT_SIZE_CHANGER,
    defaultCurrent = DEFAULT_CURRENT_PAGE
  } = pagination || {};

  return {
    pagination: pagination ? {
      onChange,
      hideOnSinglePage: true,
      showSizeChanger: dataSource.length > sizeChanger,
      showQuickJumper: dataSource.length > tablePageSize,
      position: [dataSource.length ? 'bottomRight' : 'none'],
      total: dataSource.length,
      pageSize: tablePageSize,
      defaultCurrent,
      ...pagination
    } : false
  };
};

/**
 * @export
 * @param props
 * @return {array}
 */
export const mergeColumns = (props = {}) => {
  const {
    intl,
    editingKey,
    abilities,
    formRef,
    cancelable,
    columns = [],
    dataSource = [],
    setCancelable = stub,
    setColumns = stub
  } = props;

  return columns.map((col, index) => {
    let _col = { ...col };

    if (abilities.editable) {
      _col.onCell = (record) => {
        const editing = isRowEditing({
          record,
          editingKey,
          keyType: col.keyType
        });

        return {
          intl,
          record,
          dataSource,
          editingKey,
          formRef,
          cancelable,
          setCancelable,
          fieldType: col.fieldType ?? 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editable: col.editable,
          onChange: col.onChange ?? stub,
          unique: !!col.unique,
          required: !!col.required,
          editing
        };
      };
    }

    if (abilities.resizable) {
      _col.onHeaderCell = (column) => ({
        width: column.width,
        resizable: !!col.resizable,
        onResize: handleResize({
          index,
          columns,
          setColumns
        })
      });
    }

    return {
      ..._col,
      shouldCellUpdate: (record, prevRecord) => !_.isEqual(record, prevRecord)
    };
  });
};

/**
 * @export
 * @param columns
 * @param abilities
 * @param currentPage
 */
export const handleColumnAbilities = (columns = [], abilities = {}, currentPage) => {
  const {
    indexable = false,
    sortable = false
  } = abilities;

  if (indexable) {
    columns.unshift(numberRow(currentPage));
  }

  if (sortable) {
    columns.unshift(sortableHandler());
  }
};

/**
 * @export
 * @param intl
 * @param footer
 * @param total
 * @return {*}
 */
export const tFooter = ({ intl, footer, total }) =>
    typeof footer === 'undefined' ?
        // Render default footer.
        `${t(intl, 'table.total')}: ${total}` :
        footer;

/**
 * @export
 * @param {HTMLElement} container - Scrollable container.
 * @param {HTMLElement} to - Anchor.
 * @param {number} [duration]
 */
export const scrollToRow = (container, to, duration = 600) => {
  const start = container?.scrollTop,
      change = to?.offsetTop - start,
      increment = 20;

  let currentTime = 0;

  //t = current time
  //b = start value
  //c = change in value
  //d = duration
  const easeInOutQuad = function(t, b, c, d) {
    const t1 = t / (d / 2);
    if (t1 < 1) return c / 2 * t1 * t1 + b;
    const t2 = t1 - 1;
    return -c / 2 * (t2 * (t2 - 2) - 1) + b;
  };

  const animateScroll = function() {
    currentTime += increment;
    container.scrollTop = easeInOutQuad(currentTime, start, change, duration);
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };

  animateScroll();
};