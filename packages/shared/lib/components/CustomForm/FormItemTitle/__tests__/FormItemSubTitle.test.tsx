import { renderWithTheme } from '../../../../testUtil/customRender';
import FormItemSubTitle from '../FormItemSubTitle';
import { FormItemSubTitleProps } from '../FormItemTitle.types';

describe('lib/FormItemSubTitle', () => {
  const customRender = (params: FormItemSubTitleProps) => {
    return renderWithTheme(<FormItemSubTitle {...params} />);
  };

  it('should render FormItemBigTitle', () => {
    const { container } = customRender({
      children: <>这是一个表单的二级标题</>
    });

    expect(container).toMatchSnapshot();
  });
});