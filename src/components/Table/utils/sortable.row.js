import React, { Children, cloneElement } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { Form } from 'antd';

import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { stub } from '@/utils/function';

/**
 * @export
 * @param children
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const SortableRow = ({ children, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: props['data-row-key']
  });

  const style = {
    ...props.style,
    transform: CSS.Transform.toString(
        transform && {
          ...transform,
          scaleY: 1
        }
    ),
    transition,
    ...(isDragging ? {
      position: 'relative',
      zIndex: 1000
    } : {})
  };

  return (
      <tr {...props} ref={setNodeRef} style={style} {...attributes}>
        {Children.map(children, (child) => {
          if (child.key === 'sort') {
            return cloneElement(child, {
              children: (
                  <MenuOutlined ref={setActivatorNodeRef}
                                style={{
                                  touchAction: 'none',
                                  cursor: 'move'
                                }}
                                {...listeners}/>
              )
            });
          }

          return child;
        })}
      </tr>
  );
};

/**
 * @param props
 */
const onDragEnd = (props = {}) => {
  const {
    over,
    active,
    setDataSource = stub,
    onRowChange = stub
  } = props;

  if (active.id !== over?.id) {
    setDataSource((previous) => {
      const activeIndex = previous.findIndex((i) => i.key === active.id);
      const overIndex = previous.findIndex((i) => i.key === over?.id);
      const _data = arrayMove(previous, activeIndex, overIndex);

      onRowChange(_data);
      return _data;
    });
  }
};

/**
 * @export
 * @return {{width: number, title: React.JSX.Element, align: string, key: string}}
 */
export const sortableHandler = () => ({
  title: <MenuOutlined/>,
  key: 'sort',
  align: 'center',
  width: 50
});

/**
 * @export
 * @param props
 * @return {React.JSX.Element|*}
 */
export const SortableGrid = (props = {}) => {
  const {
    formRef,
    editingKey,
    sortable = false,
    dataSource = [],
    onRowChange = stub,
    setDataSource = stub,
    gridComponent = stub
  } = props;

  const grid = gridComponent();

  /**
   * @constant
   * @description Set the Form rendering element.
   * @link https://ant.design/components/form
   * @type {React.JSX.Element|*}
   */
  const formedGrid = (
      <Form form={formRef}
          // Do not create a DOM node for <false>
            component={false}>
        {grid}
      </Form>
  );

  return sortable ? (
      <DndContext modifiers={[restrictToVerticalAxis]}
                  onDragEnd={({ active, over }) => {
                    onDragEnd({
                      over,
                      active,
                      setDataSource,
                      onRowChange
                    });
                  }}>
        <SortableContext items={dataSource.map((i) => i.key)}
                         strategy={verticalListSortingStrategy}>
          {formedGrid}
        </SortableContext>
      </DndContext>
  ) : formedGrid;
};