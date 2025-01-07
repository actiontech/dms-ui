import { renderWithTheme } from '../../testUtil/customRender';
import BasicSegmented from './BasicSegmented';
import { BasicSegmentedProps } from './BasicSegmented.types';

describe('lib/BasicSegmented', () => {
  it('render segmented ui', () => {
    const params: BasicSegmentedProps = {
      className: 'custom-segmented-class',
      options: [
        {
          label: '选项一',
          value: 'val1'
        },
        {
          label: '选项二',
          value: 'val2'
        }
      ]
    };
    const { container } = renderWithTheme(<BasicSegmented {...params} />);
    expect(container).toMatchSnapshot();
  });
});
