import { superRender } from '../../../../testUtil/customRender';
import FormInputBotBorder from '../FormInputBotBorder';
import { FormInputBotBorderProps } from '../FormItem.types';

describe('lib/FormInputBotBorder', () => {
  const customRender = (params: FormInputBotBorderProps) => {
    return superRender(<FormInputBotBorder {...params} />);
  };

  it('should render ui', () => {
    const { container } = customRender({
      title: '这是一个标题'
    });

    expect(container).toMatchSnapshot();
  });
});
