import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import SystemBasicTitle, { SystemBasicTitleProps } from '.';


describe('base/System/components/BasicTitle', () => {
  const customRender = (params: SystemBasicTitleProps) => {
    return renderWithTheme(<SystemBasicTitle {...params} />);
  };

  it('render title', () => {
    const { baseElement } = customRender({
      title: 'title cont',
      children: <span>child node</span>
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render title when title other params', () => {
    const { baseElement } = customRender({
      title: 'title cont',
      children: 'children string',
      titleTip: 'this is title tip',
      titleExtra: <span>titleExtra</span>
    });
    expect(baseElement).toMatchSnapshot();
  });
});
