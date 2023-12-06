import { renderWithTheme } from '../../../../testUtil/customRender';
import { TableToolbarProps } from '../../index.type';
import ToolBar from '../Toolbar';

describe('lib/ActiontechTable-ToolBar', () => {
  const customRender = (params: TableToolbarProps) => {
    return renderWithTheme(<ToolBar {...params} />);
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
});
