import MainTable from '../table';

import { cleanup, fireEvent, screen } from '@testing-library/react';

import { expectations, mocksWorkaround } from '__tests__/helper';
import { tMock } from '__tests__/mock';

const testId = 'mainTable-testId';

const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: 'Name', dataIndex: 'name' },
  { title: 'Age', dataIndex: 'age' }
];

const data = [
  { id: 1, name: 'John', age: 25 },
  { id: 2, name: 'Jane', age: 30 },
  { id: 3, name: 'Bob', age: 35 }
];

const props = { testId, columns, data };

describe('MainTable component Suite', () => {
  beforeAll(mocksWorkaround);
  beforeEach(tMock);

  // Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
  // unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('Render with default props', async () => {
    const { component } = await expectations(
      MainTable,
      testId,
      { testId, loading: false },
      true
    );

    const table = component.querySelector('table');
    expect(table).toBeDefined();

    expect(component).toHaveTextContent('No data');
  });

  it('Render with the given data and columns', async () => {
    const { component } = await expectations(
      MainTable,
      testId,
      { ...props, loading: false },
      true
    );

    const tableRows = component.querySelectorAll('.ant-table-body tr');
    // +1 for the header row
    expect(tableRows.length).toBe(data.length + 1);

    const headerCells = component.querySelectorAll('.ant-table-header th');
    // +1 for the field-number
    expect(headerCells.length).toBe(columns.length + 1);

    const fNumber = headerCells[0].querySelector('[aria-label="field-number"]');
    expect(fNumber).not.toBeNull();

    columns.forEach((column, index) => {
      const headerCell = headerCells[index + 1];
      expect(headerCell).toHaveTextContent(column.title);
    });

    data.forEach((row, rowIndex) => {
      // +1 to skip the header row
      const tableRow = tableRows[rowIndex + 1];
      const cells = tableRow.querySelectorAll('.ant-table-cell');
      // +1 for the field-number
      expect(cells.length).toBe(columns.length + 1);

      columns.forEach((column, columnIndex) => {
        const cell = cells[columnIndex + 1];
        expect(cell).toHaveTextContent(row[column.dataIndex]);
      });
    });

    expect(component).not.toHaveTextContent('No data');
  });

  it('Render with the given data and columns with no index', async () => {
    const { component } = await expectations(
      MainTable,
      testId,
      {
        ...props,
        indexable: false,
        loading: false
      },
      true
    );

    const tableRows = component.querySelectorAll('.ant-table-body tr');
    // +1 for the header row
    expect(tableRows.length).toBe(data.length + 1);

    const headerCells = component.querySelectorAll('.ant-table-header th');
    expect(headerCells.length).toBe(columns.length);

    const fNumber = headerCells[0].querySelector('[aria-label="field-number"]');
    expect(fNumber).toBeNull();

    columns.forEach((column, index) => {
      const headerCell = headerCells[index];
      expect(headerCell).toHaveTextContent(column.title);
    });

    data.forEach((row, rowIndex) => {
      // +1 to skip the header row
      const tableRow = tableRows[rowIndex + 1];
      const cells = tableRow.querySelectorAll('.ant-table-cell');
      expect(cells.length).toBe(columns.length);

      columns.forEach((column, columnIndex) => {
        const cell = cells[columnIndex];
        expect(cell).toHaveTextContent(row[column.dataIndex]);
      });
    });
  });

  it('Should handle pagination correctly', async () => {
    const pageSize = 5;
    const onChange = jest.fn();

    const data = [
      { id: 1, name: 'John', age: 25 },
      { id: 2, name: 'Jane', age: 30 },
      { id: 3, name: 'Bob', age: 35 },
      { id: 4, name: 'Alice', age: 28 },
      { id: 5, name: 'Eve', age: 32 },
      { id: 6, name: 'Mike', age: 40 },
      { id: 7, name: 'Sarah', age: 27 },
      { id: 8, name: 'Tom', age: 33 },
      { id: 9, name: 'Emily', age: 29 },
      { id: 10, name: 'David', age: 36 },
      { id: 11, name: 'Tomas', age: 32 },
      { id: 12, name: 'Andy', age: 16 }
    ]

    const { component, render } = await expectations(
      MainTable,
      testId,
      {
        ...props,
        data,
        indexable: false,
        loading: false,
        pagination: { pageSize },
        onChange
      },
      true
    );

    const tableRows = component.querySelectorAll('.ant-table-body tr');
    // 1 header row + 5 rows in the first page
    expect(tableRows.length).toBe(pageSize + 1);

    const pagination = component.querySelector('.ant-pagination');
    expect(pagination).toBeInTheDocument();

    const items = component.querySelectorAll('.ant-pagination-item');
    expect(items.length).toBe(3);

    const nextButton = component.querySelector('.ant-pagination-next');
    fireEvent.click(nextButton);
    expect(onChange).toBeCalled();

    const step2 = screen.getAllByRole('row');
    expect(step2.length).toBe(pageSize);

    // expect(render.asFragment()).toMatchSnapshot();

    fireEvent.click(nextButton);
    expect(onChange).toBeCalled();

    const step3 = screen.getAllByRole('row');
    expect(step3.length).toBe(2);
  });
});
