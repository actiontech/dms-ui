import { renderWithTheme } from '../../../../../../testUtils/customRender';

import ChartContTitle, { IChartTitle } from '.';

const partsOfParams = {
  mainText: '主标题',
  noteText: '提示信息'
};

describe('ReportStatistics/ChartContTitle', () => {
  const customRender = (params?: IChartTitle) => {
    return renderWithTheme(<ChartContTitle {...partsOfParams} {...params} />);
  };

  it('render snap when has fixed params', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when set style params', () => {
    const { baseElement } = customRender({
      ...partsOfParams,
      style: {
        background: '#fff'
      }
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when set clearMainTextMargin params', () => {
    const { baseElement } = customRender({
      ...partsOfParams,
      clearMainTextMargin: true
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when set other params', () => {
    const { baseElement } = customRender({
      ...partsOfParams,
      color: 'blue',
      mainSubText: 'mainSubText',
      mainSubStyleAttr: { color: 'red' },
      noteSubText: 'noteSubText',
      noteSubStyleAttr: { color: '#000' },
    });
    expect(baseElement).toMatchSnapshot();
  });
});
