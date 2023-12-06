import { renderWithTheme } from '../../../../testUtil/customRender';
import FormItemLabel, { IFormItemLabel } from '../FormItemLabel';

describe('lib/FormItemLabel', () => {
  const customRender = (params: IFormItemLabel) => {
    return renderWithTheme(<FormItemLabel {...params} />);
  };

  it('should render ui', () => {
    const { container } = customRender({
      children: <span>FormItemLabel children</span>
    });

    expect(container).toMatchSnapshot();
  });
});
