import { renderWithReduxAndTheme } from '../../testUtil/customRender';
import BasicSegmentedPage from './BasicSegmentedPage';
import { screen } from '@testing-library/react';

describe('lib/BasicSegmentedPage', () => {
  const customRender = () => {
    const mockChange = jest.fn;
    const filterButtonMeta = new Map();
    filterButtonMeta.set('testIndex', {
      checked: false,
      filterLabel: 'testTitle',
      filterCustomType: 'input'
    });
    const { baseElement } = renderWithReduxAndTheme(
      <BasicSegmentedPage
        value="test"
        onChange={mockChange}
        options={[
          {
            label: 'test1',
            value: 'test1'
          },
          {
            label: 'test2',
            value: 'test2'
          }
        ]}
        renderContent={() => 'test content'}
        searchInput={{
          onChange: jest.fn()
        }}
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem: jest.fn()
        }}
        refreshButton={{
          refresh: jest.fn()
        }}
      />
    );
    return baseElement;
  };

  it('should match snapshot', () => {
    const baseElement = customRender();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('筛选')).toBeInTheDocument();
  });
});
