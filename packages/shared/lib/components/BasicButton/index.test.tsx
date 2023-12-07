import { renderWithTheme } from '../../testUtil/customRender';

import BasicButton, { IBasicButton } from '.';

// ? switch style
describe('lib/BasicButton', () => {
  const customRender = (params: IBasicButton) => {
    return renderWithTheme(<BasicButton {...params} />);
  };

  it('render diff size btn', () => {
    const { container } = customRender({
      children: '默认大小主题按钮'
    });
    expect(container).toMatchSnapshot();

    const { container: container1 } = customRender({
      size: 'middle',
      children: '中型默认主题按钮'
    });
    expect(container1).toMatchSnapshot();

    const { container: container2 } = customRender({
      size: 'large',
      children: '大型默认主题按钮'
    });
    expect(container2).toMatchSnapshot();

    const { container: container3 } = customRender({
      size: 'small',
      children: '小型默认主题按钮'
    });
    expect(container3).toMatchSnapshot();
  });

  it('render diff style btn', () => {
    const { container } = customRender({
      children: '默认主题按钮'
    });
    expect(container).toMatchSnapshot();

    const { container: container1 } = customRender({
      type: 'primary',
      children: '默认主题按钮'
    });
    expect(container1).toMatchSnapshot();

    const { container: container2 } = customRender({
      type: 'dashed',
      children: '虚线默认主题按钮'
    });
    expect(container2).toMatchSnapshot();

    const { container: container3 } = customRender({
      danger: true,
      children: '危险按钮'
    });
    expect(container3).toMatchSnapshot();

    const { container: container4 } = customRender({
      noBorderIcon: true,
      icon: <>这是一个假装的图标</>
    });
    expect(container4).toMatchSnapshot();
  });
});
