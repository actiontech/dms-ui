import { renderWithTheme } from '../../../../testUtil/customRender';
import { FormItemNoLabelProps } from '../FormItem.types';
import FormItemNoLabel from '../FormItemNoLabel';

describe('lib/IFormItemNoLabel', () => {
  const customRender = (params: FormItemNoLabelProps) => {
    return renderWithTheme(<FormItemNoLabel {...params} />);
  };

  it('should render ui', () => {
    const { container } = customRender({
      children: <span>IFormItemNoLabel children</span>
    });

    expect(container).toMatchSnapshot();
  });
});
