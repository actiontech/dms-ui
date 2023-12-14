import { renderWithReduxAndTheme } from '../../testUtil/customRender';
import BasicSegmentedPage from './BasicSegmentedPage';

describe('lib/BasicSegmentedPage', () => {
  it('should match snapshot', () => {
    const mockChange = jest.fn;
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
      />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
