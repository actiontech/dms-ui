import { SegmentedProps } from 'antd';
import BasicSegmented from '.';

import { renderWithTheme } from '../../testUtil/customRender';

describe('lib/BasicSegmented', () => {
  it('render segmented ui', () => {
    const params: SegmentedProps = {
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
