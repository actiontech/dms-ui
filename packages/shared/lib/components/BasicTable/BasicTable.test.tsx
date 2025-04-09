import { screen } from '@testing-library/react';
import { superRender } from '../../testUtil/customRender';
import BasicTable from './BasicTable';
import { BasicTableProps } from './BasicTable.types';

describe('lib/BasicTable', () => {
  const customRender = (params: BasicTableProps) => {
    return superRender(<BasicTable {...params} />);
  };

  it('should render error message when errorMessage is provided', () => {
    const { container } = customRender({
      loading: false,
      errorMessage: '表格错误信息'
    });
    expect(container).toMatchSnapshot();
  });

  it('should render table without pagination', () => {
    const { container } = customRender({
      pagination: false
    });
    expect(container.querySelector('.ant-pagination')).not.toBeInTheDocument();
  });

  it('should render table with custom pagination', () => {
    const { container } = customRender({
      rowKey: 'demo',
      columns: [
        {
          dataIndex: 'demo'
        }
      ],
      dataSource: [
        {
          demo: 1
        }
      ],
      pagination: {
        total: 100,
        current: 1,
        pageSize: 20
      }
    });
    expect(screen.getByText('共 100 条数据')).toBeInTheDocument();
    expect(
      container.querySelector('.actiontech-table-pagination')
    ).toBeInTheDocument();
  });

  it('should render table with fixed pagination', () => {
    const { container } = customRender({
      rowKey: 'demo',
      columns: [
        {
          dataIndex: 'demo'
        }
      ],
      dataSource: [
        {
          demo: 1
        }
      ],
      pagination: {
        total: 1
      },
      isPaginationFixed: true
    });
    expect(
      container.querySelector('.actiontech-table-pagination-fixed')
    ).toBeInTheDocument();
  });

  it('should render table with custom className', () => {
    const { container } = customRender({
      className: 'custom-table-class'
    });
    expect(container.querySelector('.custom-table-class')).toBeInTheDocument();
  });
});
