import Calendar from '@event-calendar/core';

import { calendarMock2 } from '../__tests__/calendar.mock2';

import { stub } from '@/utils/function';

import { generateEventHtml } from './extendedProps';

/**
 * @export
 * @param props
 * @return {({allDay: boolean, extendedProps: {phone: string, name: string, businessId: string, category: string, email: string, status: string}, color: string, editable: boolean, start: string, end: string, id: string, title: string}|{allDay: boolean, extendedProps: {phone: string, name: string, businessId: string, category: string, email: string, status: string}, color: string, editable: boolean, start: string, end: string, id: string, title: string}|{allDay: boolean, extendedProps: {phone: string, name: string, businessId: string, category: string, email: string, status: string}, color: string, editable: boolean, start: string, end: string, id: string, title: string}|{allDay: boolean, extendedProps: {phone: string, name: string, businessId: string, category: string, email: string, status: string}, color: string, editable: boolean, start: string, end: string, id: string, title: string})[]|Calendar}
 */
export const initCalendar = (props = {}) => {
  const {
    ecRef,
    plugins = [],
    options = {},
    setOpen = stub,
    setForm = stub
  } = props;

  const ec = new Calendar({
    target: ecRef?.current,
    props: {
      plugins,
      options: {
        ...options,
        customButtons: {
          refresh: {
            text: 'Refresh',
            click(e) {
              e.preventDefault();
              ec?.refetchEvents();
            }
          }
        },
        headerToolbar: {
          start: 'prev,next today',
          center: 'title',
          end: 'refresh dayGridMonth,timeGridWeek,timeGridDay,listWeek, resourceTimeGridDay'
        },
        resources: [
          { id: 1, title: 'Room 1' }, { id: 2, title: 'Room 2' }, { id: 3, title: 'Room 3'}
        ],
        eventSources: [
          {
            events() {
              console.log('fetching...');
              return [...calendarMock2];
            }
          }
        ],
        views: {
          // timeGridWeek: { pointer: true },
          resourceTimeGridDay: { pointer: true },
        },
        eventDidMount(info) {
          generateEventHtml(info, ec);
        },
        select(info) {
          console.log('select', info);
          setOpen(true);
          setForm({ info, type: 'edit' });
        },
        eventClick(info) {
          console.log('eventClick', info);
          setOpen(true);
          setForm({ info, type: 'edit' });
        },
        dateClick(info) {
          console.log('dateClick', info);
          setOpen(true);
          setForm({ info, type: 'new' });
        }
      }
    }
  });

  return ec;
};