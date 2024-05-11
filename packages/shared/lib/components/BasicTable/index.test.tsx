import BasicTable, { IBasicTable } from '.';
import { renderWithTheme } from '../../testUtil/customRender';

describe('lib/BasicTable', () => {
  const customRender = (params: IBasicTable) => {
    return renderWithTheme(<BasicTable {...params} />);
  };

  it('render error for table', () => {
    const { container } = customRender({
      loading: false,
      errorMessage: '表格错误信息'
    });
    expect(container).toMatchSnapshot();
  });

  it('render no pagination for table', () => {
    const { container } = customRender({
      pagination: false
    });
    expect(container).toMatchSnapshot();
  });

  it('render custom pagination for table', () => {
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
      }
    });
    expect(container).toMatchSnapshot();
  });

  it('render fixed pagination for table', () => {
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
    expect(container).toMatchSnapshot();
  });
});
