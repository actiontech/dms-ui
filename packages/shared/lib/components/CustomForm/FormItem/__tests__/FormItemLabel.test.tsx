import { renderWithTheme } from '../../../../testUtil/customRender';
import { FormItemLabelProps } from '../FormItem.types';
import FormItemLabel from '../FormItemLabel';

describe('lib/FormItemLabel', () => {
  const customRender = (params: FormItemLabelProps) => {
    return renderWithTheme(<FormItemLabel {...params} />);
  };

  it('should render ui', () => {
    const { container } = customRender({
      children: <span>FormItemLabel children</span>
    });

    expect(container).toMatchSnapshot();
  });
});
