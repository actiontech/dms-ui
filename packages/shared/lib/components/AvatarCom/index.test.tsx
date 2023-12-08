import { renderWithTheme } from '../../testUtil/customRender';

import AvatarCom, { IAvatarCom } from '.';

describe('lib/AvatarCom', () => {
  const customRender = (params: IAvatarCom) => {
    return renderWithTheme(<AvatarCom {...params} />);
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
