import React, { memo, useRef, useState } from 'react';
import { useIntl } from '@umijs/max';
import { Form, Table } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import classnames from 'classnames';

import { stub } from '@/utils/function';
import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';

import { filterColumns } from './utils/filter.cell';
import { sortColumns } from './utils/sort.cell';
import { AddRowButton } from './utils/add.row';
import { ResizableTitle } from './utils/resizable.cell';
import { EditableCell, editOperations } from './utils/edit.cell';
import {
  SortableGrid,
  SortableRow
} from './utils/sortable.row';
import {
  dataSourceTransform,
  gridConfig,
  handlePagination,
  handleColumnAbilities,
  handleRequiredFields,
  handleEditableFields,
  mergeColumns,
  tFooter
} from './utils/table.utils';

import styles from './table.module.less';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_CURRENT_PAGE = 1;
const DEFAULT_SIZE_CHANGER = 50;

/**
 * @function
 * @constructor
 * @param props
 * @return {JSX.Element}
 * @example
 *    <MainTable data={dataSource}
 *               rowAbility={{
 *                  addable: boolean,
 *                  addTitle: string,
 *                  addDisabled: boolean,
 *                  sortable: boolean,
 *                  addHelper: string,
 *                  onEditHelper: string,
 *                  onAdd: function,
 *                  onSave: function,
 *                  onDelete: function,
 *               }}
 *               helper={string}
 *               resizable={boolean}
 *               {...metadata({
 *                 fields: {
 *                   name: { onChange },
 *                   someComponent: {
 *                     component: (<Component/>),
 *                     validator: validateFn
 *                   }
 *                 }
 *               })} />
 * @return {JSX.Element}
 */
function MainTable(props = {}) {
  const intl = useIntl();
  const gridRef = useRef();
  const [formRef] = Form.useForm();

  const DEFAULT_SCROLL = {
    scrollToFirstRowOnChange: true,
    y: 400
  };

  const {
    testId,
    data = [],
    columns = [],
    scroll = {},
    className,
    size = 'small',
    rowAbility = {},
    fieldsHandler = null,
    pagination = null,
    indexable = true,
    resizable = false,
    bordered = false,
    helper = null,
    header = null,
    footer = undefined,
    onChange = stub,
    ...rest
  } = props;

  const {
    addTitle = t(intl, 'actions.addNew'),
    addHelper = null,
    onEditHelper = null,
    addDisabled = false,
    addable = false,
    editable = false,
    sortable = false,
    onAdd = stub,
    onCancel = stub,
    onRowChange = stub,
    onSave = stub,
    onEdit = stub,
    onDelete = stub
  } = rowAbility;

  const [dataSource, setDataSource] = useState([]);
  const [cancelable, setCancelable] = useState(true);

  const [filterPerf, setFilterPerf] = useState({});

  const gridProps = gridConfig({ props, dataSource });

  const sColumns = sortColumns({ columns: [...columns] });
  const fColumns = filterColumns({
    columns: sColumns,
    dataSource,
    filterPerf,
    setFilterPerf
  });

  const [tablePageSize, setTablePageSize] = useState(DEFAULT_PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState({
    current: DEFAULT_CURRENT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE
  });

  const [tColumns, setColumns] = useState(fColumns);
  const [editingKey, setEditingKey] = useState('');
  const [editableFields, setEditableFields] = useState({});

  const basicProps = {
    formRef,
    gridRef,
    editingKey,
    dataSource,
    setEditingKey,
    setDataSource
  };

  effectHook(() => {
  }, [], () => {
    setDataSource([]);
    setCancelable(true);
    setTablePageSize(DEFAULT_PAGE_SIZE);
    setCurrentPage(DEFAULT_CURRENT_PAGE);
    setColumns(fColumns);
    setEditingKey('');
    setEditableFields({});
  });

  effectHook(() => {
    setTablePageSize(pagination?.pageSize ?? DEFAULT_PAGE_SIZE);
    setCurrentPage({
      current: pagination?.currentPage ?? DEFAULT_CURRENT_PAGE,
      pageSize: pagination?.pageSize ?? DEFAULT_PAGE_SIZE
    });
    setDataSource(dataSourceTransform(data));
  }, [JSON.stringify(data), pagination?.pageSize, pagination?.currentPage]);

  effectHook(() => {
    if (addable || editable) {
      const _editableFields = handleEditableFields(fColumns);
      const _columns = [
        ...handleRequiredFields(fColumns),
        editOperations({
          intl,
          columns: fColumns,
          editableFields: _editableFields,
          cancelable,
          setCancelable,
          onCancel,
          onSave,
          onEdit,
          onDelete,
          ...basicProps
        })
      ];

      handleColumnAbilities(_columns, { indexable, sortable }, currentPage);

      setColumns(_columns);
      setEditableFields(_editableFields);

    } else {

      handleColumnAbilities(fColumns, { indexable, sortable }, currentPage);
      setColumns(fColumns);
    }

  }, [columns?.length, fColumns?.length, editingKey, currentPage]);

  /**
   * @constant
   * @param pagination
   * @param filters
   * @param sorter
   * @param [extra]
   */
  const handleChange = (pagination, filters, sorter, extra = {}) => {
    onChange({ pagination, filters, sorter, extra });

    setCurrentPage(pagination);

    if (extra?.action === 'paginate') {
      // TODO (teamco): Do something.
    }

    if (extra?.action === 'sort') {
      // TODO (teamco): Do something.
    }

    if (extra?.action === 'filter') {
      // TODO (teamco): Do something.
    }
  };

  const PAGINATION = handlePagination({
    dataSource,
    tablePageSize,
    pagination,
    onChange: (current, pageSize) => {
      handleChange({ current, pageSize }, null, null, { action: 'paginate' });
    },
    defaults: {
      DEFAULT_CURRENT_PAGE,
      DEFAULT_SIZE_CHANGER
    }
  });

  const addRowProps = {
    gridRef,
    addable,
    addTitle,
    addHelper,
    onEditHelper,
    addDisabled,
    editableFields,
    setCancelable,
    onAdd,
    ...basicProps
  };

  const gridComponent = () => {
    const components = {};

    if (addable || editable) {
      components.body = components.body ?? {};
      components.body.cell = EditableCell;
    }

    if (sortable) {
      components.body = components.body ?? {};
      components.body.row = SortableRow;
    }

    if (!!resizable) {
      components.header = components.header ?? {};
      components.header.cell = ResizableTitle;
    }

    const antdProps = {
      size,
      components,
      bordered,
      className: styles.grid,
      onChange: handleChange,
      pagination: { ...PAGINATION },
      ...gridProps,
      scroll: {
        ...DEFAULT_SCROLL,
        ...scroll
      }
      // onRow: (_, index) => ({ id: index })
    };

    return (
        <Table expandable={gridProps.expandable}
               title={header ? () => (addable || helper) ? (
                   <div className={styles.gridHeader}>
                     {helper ? (
                         <div>
                           <QuestionCircleOutlined/>
                           {helper}
                         </div>
                     ) : null}
                     <AddRowButton {...addRowProps}/>
                   </div>
               ) : null : null}
               footer={() => tFooter({ intl, footer, total: dataSource.length })}
               columns={mergeColumns({
                 intl,
                 editingKey,
                 formRef,
                 cancelable,
                 setColumns,
                 setCancelable,
                 dataSource,
                 columns: tColumns,
                 abilities: {
                   editable: addable || editable,
                   resizable
                 }
               })}
               {...antdProps}
               {...rest}/>
    );
  };

  return (
      <div data-testid={testId}
           className={classnames(styles.gridWrapper, className)}
           ref={gridRef}>
        <SortableGrid sortable={sortable}
                      editingKey={editingKey}
                      formRef={formRef}
                      onRowChange={onRowChange}
                      dataSource={dataSource}
                      setDataSource={setDataSource}
                      gridComponent={gridComponent}/>
      </div>
  );
}

export default memo(MainTable);
