import { renderWithTheme } from '../../../../testUtil/customRender';
import FormInputBotBorder from '../FormInputBotBorder';
import { FormInputBotBorderProps } from '../FormItem.types';

describe('lib/FormInputBotBorder', () => {
  const customRender = (params: FormInputBotBorderProps) => {
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
