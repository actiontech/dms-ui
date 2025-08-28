import { getBySelector } from '../../testUtil/customQuery';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import { superRender } from '../../testUtil/superRender';

import ActiontechTable from './Table';
import { ActiontechTableProps, TypeFilterElement } from './index.type';
import { ActiontechTableContextProvide } from './context';

describe('lib/ActiontechTable', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  const customRender = (params: ActiontechTableProps) => {
    return superRender(<ActiontechTable {...params} />);
  };

  describe('-normal table', () => {
    it('render normal table is empty', () => {
      const { baseElement } = customRender({
        dataSource: [],
        pagination: false
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render normal table is loading', () => {
      const { baseElement } = customRender({
        dataSource: [],
        loading: true,
        pagination: false
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render normal table is error info', () => {
      const { baseElement } = customRender({
        dataSource: [],
        loading: false,
        errorMessage: 'this is error message'
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render table with no pagination', () => {
      const { baseElement } = customRender({
        pagination: false,
        dataSource: [
          { name: 'a', age: 11 },
          { name: 'b', age: 18 },
          { name: 'c', age: 19 }
        ],
        rowKey: 'name',
        columns: [
          {
            dataIndex: 'a',
            title: '名称'
          },
          {
            dataIndex: 'b',
            title: '年龄'
          }
        ]
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render table with pagination', async () => {
      const totalNum = 50;
      const mockData = [];
      for (let i = 0; i <= totalNum; i++) {
        mockData.push({
          name: `name${i + 1}`,
          age: i + 1
        });
      }
      const onChangeFn = jest.fn();
      const { baseElement } = customRender({
        rowKey: 'name',
        dataSource: mockData,
        pagination: { total: totalNum },
        onChange: onChangeFn
      });
      expect(baseElement).toMatchSnapshot();
      expect(screen.getByText('共 50 条数据')).toBeInTheDocument();

      const pageIndex2 = getBySelector('.ant-pagination-item-2', baseElement);
      await act(async () => {
        fireEvent.click(pageIndex2);
        await jest.advanceTimersByTime(300);
      });
      expect(onChangeFn).toHaveBeenCalledTimes(1);
      expect(baseElement).toMatchSnapshot();
    });

    it('render filter columns by show attribute', async () => {
      const { baseElement } = customRender({
        pagination: false,
        dataSource: [
          { name: 'a', age: 11 },
          { name: 'b', age: 18 },
          { name: 'c', age: 19 }
        ],
        rowKey: 'name',
        columns: [
          {
            dataIndex: 'name',
            title: '名称'
          },
          {
            dataIndex: 'age',
            title: '年龄',
            show: false
          }
        ],
        setting: {
          tableName: 'test_list',
          username: 'admin'
        }
      });
      expect(baseElement).toMatchSnapshot();
      await act(async () => {
        await jest.advanceTimersByTime(300);
      });
      expect(screen.queryByText('年龄')).not.toBeInTheDocument();
    });
  });

  describe('-composite table', () => {
    const totalNum = 50;
    const mockData: { name: string; age: number }[] = [];
    for (let i = 0; i <= totalNum; i++) {
      mockData.push({
        name: `name${i + 1}`,
        age: i + 1
      });
    }

    it('render table has tool', () => {
      const { baseElement } = customRender({
        dataSource: mockData,
        rowKey: 'name',
        setting: {
          tableName: 'test_list',
          username: 'admin'
        },
        pagination: {
          total: totalNum
        }
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render table has toolbar children', () => {
      const { baseElement } = customRender({
        dataSource: mockData,
        rowKey: 'name',
        toolbar: {
          setting: {
            tableName: 'test_list',
            username: 'admin'
          },
          children: <>tool children node</>
        },
        pagination: {
          total: totalNum
        }
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render table with filter', () => {
      const { baseElement } = customRender({
        dataSource: mockData,
        rowKey: 'name',
        pagination: {
          total: totalNum
        },
        filterContainerProps: {
          updateTableFilterInfo: jest.fn(),
          disabled: false,
          filterContainerMeta: [
            {
              dataIndex: 'demo1',
              filterCustomType: 'select' as TypeFilterElement,
              filterKey: 'a',
              filterLabel: '下拉'
            }
          ]
        }
      });
      expect(baseElement).toMatchSnapshot();
    });

    it('render table with class name', () => {
      const { baseElement } = customRender({
        className: 'custom-class-table-test'
      });
      expect(baseElement).toMatchSnapshot();
    });
  });

  it('render table with context', () => {
    const { getByText } = superRender(
      <ActiontechTableContextProvide
        value={{ setting: { tableName: 'test_list', username: 'admin' } }}
      >
        <ActiontechTable
          dataSource={[{ name: 'a', age: 11 }]}
          rowKey="name"
          columns={[{ dataIndex: 'a', title: '名称' }]}
        />
      </ActiontechTableContextProvide>
    );
    expect(getByText('名称')).toBeInTheDocument();
  });
});
