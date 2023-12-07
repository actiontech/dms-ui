import { renderWithTheme } from '../../../../testUtil/customRender';
import CustomLabelContent, {
  CustomLabelContentProps
} from '../CustomLabelContent';

describe('lib/CustomLabelContent', () => {
  const customRender = (params: CustomLabelContentProps) => {
    return renderWithTheme(<CustomLabelContent {...params} />);
  };

  it('should render label has tip', () => {
    const { container } = customRender({
      title: '这是一个标题',
      tips: '这是需要提示的信息'
    });

    expect(container).toMatchSnapshot();
  });
});
