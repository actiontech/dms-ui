import { superRender } from '../../testUtil/superRender';
import CustomDraggerUpload from './CustomDraggerUpload';

describe('lib/CustomDraggerUpload', () => {
  it('should render ui snap by default params', () => {
    const { container } = superRender(
      <CustomDraggerUpload title="自定义的标题" icon={<>自定义图标</>} />
    );
    expect(container).toMatchSnapshot();
  });
});
