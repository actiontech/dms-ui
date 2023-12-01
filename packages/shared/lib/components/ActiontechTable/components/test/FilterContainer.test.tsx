import { renderWithTheme } from '../../../../testUtil/customRender';
import { TypeFilterElement } from '../../index.type';
import FilterContainer from '../FilterContainer';

describe('lib/ActiontechTable-FilterContainer', () => {
  it('render wrapper style for all custom type', () => {
    const params = {
      className: 'custom-wrapper-class',
      style: { color: 'red' },
      updateTableFilterInfo: jest.fn(),
      filterContainerMeta: [
        {
          dataIndex: 'demo1',
          filterCustomType: 'select' as TypeFilterElement,
          filterKey: 'demo1',
          filterLabel: '下拉'
        },
        {
          dataIndex: 'demo2',
          filterCustomType: 'date-range' as TypeFilterElement,
          filterKey: ['demo2-1', 'demo2-2'],
          filterLabel: '日期选择'
        },
        {
          dataIndex: 'demo3',
          filterCustomType: 'input' as TypeFilterElement,
          filterKey: 'demo3',
          filterLabel: '输入框'
        },
        {
          dataIndex: 'demo4',
          filterCustomType: 'search-input' as TypeFilterElement,
          filterKey: 'demo4',
          filterLabel: '搜索输入框'
        }
      ]
    };
    const { baseElement } = renderWithTheme(<FilterContainer {...params} />);
    expect(baseElement).toMatchSnapshot();
  });
});
