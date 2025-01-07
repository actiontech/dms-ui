import { renderWithTheme } from '../../../../testUtil/customRender';
import FormItemBigTitle from '../FormItemBigTitle';
import { FormItemBigTitleProps } from '../FormItemTitle.types';

describe('lib/FormItemBigTitle', () => {
  const customRender = (params: FormItemBigTitleProps) => {
    return renderWithTheme(<FormItemBigTitle {...params} />);
  };

  it('should render FormItemBigTitle', () => {
    const { container } = customRender({
      children: <>这是一个表单的大标题</>
    });

    expect(container).toMatchSnapshot();
  });
});
