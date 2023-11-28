import { renderWithTheme } from '../../../../testUtil/customRender';
import FormItemNoLabel, { IFormItemNoLabel } from '../FormItemNoLabel';

describe('lib/IFormItemNoLabel', () => {
  const customRender = (params: IFormItemNoLabel) => {
    return renderWithTheme(<FormItemNoLabel {...params} />);
  };

  it('should render ui', () => {
    const { container } = customRender({
      children: <span>IFormItemNoLabel children</span>
    });

    expect(container).toMatchSnapshot();
  });
});
