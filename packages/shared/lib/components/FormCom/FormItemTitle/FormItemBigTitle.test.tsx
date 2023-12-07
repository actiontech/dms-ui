import { renderWithTheme } from '../../../testUtil/customRender';

import FormItemBigTitle, { IFormItemBigTitle } from './FormItemBigTitle';

describe('lib/FormItemBigTitle', () => {
  const customRender = (params: IFormItemBigTitle) => {
    return renderWithTheme(<FormItemBigTitle {...params} />);
  };

  it('should render FormItemBigTitle', () => {
    const { container } = customRender({
      children: <>这是一个表单的大标题</>
    });

    expect(container).toMatchSnapshot();
  });
});
