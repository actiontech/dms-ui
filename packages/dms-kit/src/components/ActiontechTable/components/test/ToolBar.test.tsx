import { superRender } from '../../../../testUtil/superRender';
import { TableToolbarProps } from '../../index.type';
import ToolBar from '../Toolbar';
import { ActiontechTableContextProvide } from '../../context';

describe('lib/ActiontechTable-ToolBar', () => {
  const customRender = (params: TableToolbarProps) => {
    return superRender(<ToolBar {...params} />);
  };

  it('render loading is true', () => {
    const { baseElement } = customRender({
      loading: true
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render noStyle is true', () => {
    const { baseElement } = customRender({
      loading: false,
      noStyle: true,
      style: {
        color: '#000'
      }
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render all items', () => {
    const { baseElement } = customRender({
      loading: false,
      searchInput: {},
      filterButton: { updateAllSelectedFilterItem: jest.fn() },
      actions: [],
      setting: {
        tableName: 'demo-table',
        username: 'current-test-user'
      },
      refreshButton: {
        refresh: jest.fn()
      },
      children: <>我是插入的信息</>
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render table with context', () => {
    const { getByText } = superRender(
      <ActiontechTableContextProvide
        value={{ setting: { tableName: 'test_list', username: 'admin' } }}
      >
        <ToolBar />
      </ActiontechTableContextProvide>
    );
    expect(getByText('表格设置')).toBeInTheDocument();
  });
});
