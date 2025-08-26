import { superRender } from '../../testUtil/superRender';
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
    const { container } = superRender(<BasicSegmented {...params} />);
    expect(container).toMatchSnapshot();
  });
});
