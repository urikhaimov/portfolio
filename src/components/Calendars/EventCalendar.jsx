import React, { useRef, useState } from 'react';
import classnames from 'classnames';

import TimeGrid from '@event-calendar/time-grid';
import DayGrid from '@event-calendar/day-grid';
import ResourceTimeGrid from '@event-calendar/resource-time-grid';
import ResourceTimeline from '@event-calendar/resource-timeline';
import ListGrid from '@event-calendar/list';
import Interaction from '@event-calendar/interaction';

import '@event-calendar/core/index.css';

import { effectHook } from '@/utils/hooks';

import { EventForm } from './sections/event.form';
import { EventToolbar } from './sections/event.toolbar';
import { initCalendar } from './utils/initCalendar';

import styles from './calendar.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const EventCalendar = props => {
  const {
    testId,
    loading,
    className,
    initialValues = {},
    countryCodes = [],
    view = 'timeGridWeek',
    scrollTime = '09:00:00',
    dayMaxEvents = true,
    nowIndicator = true,
    selectable = true,
    plugins = [
      TimeGrid,
      ListGrid,
      DayGrid,
      ResourceTimeline,
      ResourceTimeGrid,
      Interaction
    ]
  } = props;

  const ecRef = useRef(null);

  const [ec, setEc] = useState(null);
  const [isOpen, setOpen] = useState(null);
  const [modalForm, setForm] = useState(null);
  const [status, setStatus] = useState(null);

  effectHook(() => {
    if (ecRef?.current) {
      ecRef.current.innerHTML = '';
      setEc(initCalendar({
        ecRef,
        plugins,
        options: {
          view,
          scrollTime,
          dayMaxEvents,
          nowIndicator,
          selectable
        },
        setOpen,
        setForm
      }));
    }
  }, [ecRef?.current]);

  const formProps = {
    loading,
    calendar: ec,
    modalForm,
    isOpen,
    setOpen,
    status,
    setStatus,
    countryCodes,
    initialValues
  };

  return (
      <div className={classnames(styles.eventWrapper, className)}
           data-testid={testId}>
        <div ref={ecRef}/>
        <EventForm {...formProps}/>
        <EventToolbar onAdd={() => {
          setForm({ info: null, type: 'free' });
          setOpen(true);
        }}/>
      </div>
  );
};