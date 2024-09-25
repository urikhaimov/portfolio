export const calendarMock2 = [
  {
    id: 'event-1',
    title: 'Meeting with John',
    start: '2024-08-14T14:00:00.000Z',
    end: '2024-08-14T15:30:00.000Z',
    color: '#FF69B4',
    allDay: false,
    editable: true,
    resourceIds: [1],
    extendedProps: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '+1 555 1234567',
      category: 'Meeting',
      businessId: 'business-1',
      status: 'pending'
    }
  },
  {
    id: 'event-2',
    title: 'Lunch with colleagues',
    start: '2024-08-13T12:00:00.000Z',
    end: '2024-08-13T13:30:00.000Z',
    allDay: false,
    editable: true,
    color: '#008000',
    resourceIds: [1],
    extendedProps: {
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      phone: '+1 555 9012345',
      category: 'Social',
      businessId: 'business-2',
      status: 'accepted'
    }
  },
  {
    id: 'event-3',
    title: 'Project deadline',
    start: '2024-08-16T12:00:00.000Z',
    end: '2024-08-16T17:00:00.000Z',
    color: '#FF9900',
    allDay: false,
    editable: true,
    resourceIds: [2],
    extendedProps: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '+1 555 1234567',
      category: 'Work',
      businessId: 'business-3',
      status: 'declined'
    }
  },
  {
    id: 'event-4',
    title: 'Birthday party',
    start: '2024-08-15T18:00:00.000Z',
    end: '2024-08-15T21:00:00.000Z',
    color: '#008080',
    allDay: false,
    editable: true,
    resourceIds: [3],
    extendedProps: {
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      phone: '+1 555 9012345',
      category: 'Personal',
      businessId: 'business-4',
      status: 'canceled'
    }
  }
];