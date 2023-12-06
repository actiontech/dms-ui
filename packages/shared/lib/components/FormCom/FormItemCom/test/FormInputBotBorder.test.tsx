import { renderWithTheme } from '../../../../testUtil/customRender';
import FormInputBotBorder, { IFormInputBotBorder } from '../FormInputBotBorder';

describe('lib/FormInputBotBorder', () => {
  const customRender = (params: IFormInputBotBorder) => {
    return renderWithTheme(<FormInputBotBorder {...params} />);
  };

  it('should render ui', () => {
    const { container } = customRender({
      title: '这是一个标题',
      children: <span>FormInputBotBorder children</span>
    });

    expect(container).toMatchSnapshot();
  });
});
