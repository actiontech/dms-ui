import { renderWithTheme } from '../../../testUtils/customRender';

import ChartTooltip, { IChartTooltip } from '.';
import { SupportTheme, ThemeData } from '../../../theme';

const themeData = ThemeData[SupportTheme.LIGHT];

describe('sqle/components/ChartCom/ChartTooltip', () => {
  const customRender = (params: IChartTooltip) => {
    return renderWithTheme(<ChartTooltip {...params} />);
  };

  it('render snap title', () => {
    const { baseElement } = customRender({
      titleData: {
        dotColor: 'red',
        text: 'this is a text'
      },
      sharedTheme: themeData.sharedTheme,
      wrapperClassName: 'wrapper-class-name-custom',
      children: <span>this is a children</span>
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has children', () => {
    const { baseElement } = customRender({
      sharedTheme: themeData.sharedTheme,
      titleData: {
        dotColor: 'red',
        text: 'this is a text'
      },
      customRender: 'this is a custom render text'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when render list', () => {
    const { baseElement } = customRender({
      sharedTheme: themeData.sharedTheme,
      titleData: {
        dotColor: 'red',
        text: 'this is a text'
      },
      listData: [
        {
          label: 'label text',
          value: 'value text',
          dotColor: 'red',
        }
      ]
    });
    expect(baseElement).toMatchSnapshot();
  })
});
