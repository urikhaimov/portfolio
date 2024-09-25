import React, { useLayoutEffect, useRef, useState } from 'react';
import { Resizable } from 'react-resizable';

import { stub } from '@/utils/function';

import styles from '../table.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const ResizableTitle = (props) => {
  const ref = useRef(null);

  const {
    width,
    resizable,
    onResize = stub,
    ...restProps
  } = props;

  const [_width, setWidth] = useState(0);

  useLayoutEffect(() => {
    !!resizable && setWidth(ref.current.offsetWidth);
  }, [resizable]);

  if (!resizable) {
    return <th {...restProps} />;
  }

  return (
      <Resizable width={width ?? _width}
                 height={0}
                 handle={
                   <span className={styles.resizableHandler}
                         onClick={(e) => {
                           e.stopPropagation();
                         }}/>
                 }
                 onResize={onResize}
                 draggableOpts={{
                   enableUserSelectHack: false
                 }}>
        <th ref={ref} {...restProps} />
      </Resizable>
  );
};

/**
 * @export
 * @param props
 * @return {function|*}
 */
export const handleResize = (props = {}) => {
  const {
    index,
    columns = [],
    setColumns = stub
  } = props;

  return (_, { size }) => {
    const newColumns = [...columns];
    newColumns[index] = {
      ...newColumns[index],
      width: size.width
    };

    setColumns(newColumns);
  };
};