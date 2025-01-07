import { renderWithTheme } from '../../testUtil/customRender';
import CustomAvatar from './CustomAvatar';
import { CustomAvatarProps } from './CustomAvatar.types';

describe('lib/CustomAvatar', () => {
  const customRender = (params: CustomAvatarProps) => {
    return renderWithTheme(<CustomAvatar {...params} />);
  };

  it('should render avatar for default params', () => {
    const { container } = customRender({
      size: 20,
      name: '张三'
    });
    expect(container).toMatchSnapshot();
  });

  it('should render avatar no tip', () => {
    const { container } = customRender({
      name: '李四',
      noTips: true,
      className: 'custom-self-avatar'
    });
    expect(container).toMatchSnapshot();
  });

  it('should render avatar for english name', () => {
    const { container } = customRender({
      name: 'lily'
    });
    expect(container).toMatchSnapshot();
  });
});
