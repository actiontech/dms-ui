import { renderWithTheme } from '../../testUtil/customRender';
import CustomDraggerUpload from './CustomDraggerUpload';

describe('lib/CustomDraggerUpload', () => {
  it('should render ui snap by default params', () => {
    const { container } = renderWithTheme(
      <CustomDraggerUpload title="自定义的标题" icon={<>自定义图标</>} />
    );
    expect(container).toMatchSnapshot();
  });

  it('should render ui when fileList length is empty', () => {
    const { container } = renderWithTheme(
      <CustomDraggerUpload
        title="自定义的标题"
        icon={<>自定义图标</>}
        fileList={[]}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
