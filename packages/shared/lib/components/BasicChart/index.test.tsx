import { renderWithTheme } from '../../testUtil/customRender';
import BasicChart, { BasicChartProps, ChartTypeEnum } from '.';

describe('lib/BasicChart', () => {
  const customRender = (params: BasicChartProps) => {
    return renderWithTheme(<BasicChart {...params} />);
  };

  it('render type is line', () => {
    const { container: lineLoading } = customRender({
      type: ChartTypeEnum.line,
      loading: true
    });
    expect(lineLoading).toMatchSnapshot();

    const { container: lineNoData } = customRender({
      type: ChartTypeEnum.line,
      config: {
        data: []
      }
    });
    expect(lineNoData).toMatchSnapshot();

    const { container: lineErrorInfo } = customRender({
      type: ChartTypeEnum.line,
      loading: false,
      errorTitle: '这是错误信息的标题',
      errorInfo: '这是一个错误信息'
    });
    expect(lineErrorInfo).toMatchSnapshot();

    const { container: normalData } = customRender({
      type: ChartTypeEnum.line,
      theme: 'dark',
      config: {
        data: [
          {
            x: 1
          }
        ]
      }
    });
    expect(normalData).toMatchSnapshot();
  });

  it('render type is column', () => {
    const { container } = customRender({
      type: ChartTypeEnum.column,
      theme: 'dark',
      language: 'zh-cn',
      config: {
        data: [
          {
            x: 1
          }
        ]
      }
    });
    expect(container).toMatchSnapshot();
  });
});
