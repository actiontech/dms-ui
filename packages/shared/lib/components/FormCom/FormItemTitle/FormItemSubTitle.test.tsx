import { renderWithTheme } from '../../../testUtil/customRender';
import FormItemSubTitle, { IFormItemSubTitle } from './FormItemSubTitle';

describe('lib/FormItemSubTitle', () => {
  const customRender = (params: IFormItemSubTitle) => {
    return renderWithTheme(<FormItemSubTitle {...params} />);
  };

  it('should render FormItemBigTitle', () => {
    const { container } = customRender({
      children: <>这是一个表单的二级标题</>
    });

    expect(container).toMatchSnapshot();
  });
});
