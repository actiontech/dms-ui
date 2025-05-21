import { superRender } from '../../../../testUtil/superRender';
import FormItemBigTitle from '../FormItemBigTitle';
import { FormItemBigTitleProps } from '../FormItemTitle.types';

describe('lib/FormItemBigTitle', () => {
  const customRender = (params: FormItemBigTitleProps) => {
    return superRender(<FormItemBigTitle {...params} />);
  };

  it('should render FormItemBigTitle', () => {
    const { container } = customRender({
      children: <>这是一个表单的大标题</>
    });

    expect(container).toMatchSnapshot();
  });
});
