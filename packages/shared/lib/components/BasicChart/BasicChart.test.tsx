import { superRender } from '../../testUtil/superRender';
import BasicChart from './BasicChart';
import { ChartTypeEnum } from './BasicChart.enum';
import { BasicChartProps } from './BasicChart.types';
import { BasicEmpty } from '@actiontech/dms-kit';
import { screen } from '@testing-library/react';

jest.mock('@actiontech/dms-kit', () => ({
  ...jest.requireActual('@actiontech/dms-kit'),
  BasicEmpty: jest.fn().mockImplementation(() => null)
}));

describe('lib/BasicChart', () => {
  const customRender = (params: BasicChartProps) => {
    return superRender(<BasicChart {...params} />);
  };

  beforeEach(() => {
    (BasicEmpty as jest.Mock).mockClear();
  });

  it('should match snapshot', () => {
    const { container } = customRender({
      type: ChartTypeEnum.line,
      config: {
        data: [{ x: 1 }]
      }
    });
    expect(container).toMatchSnapshot();
  });

  it('should render loading state correctly', () => {
    customRender({
      type: ChartTypeEnum.line,
      loading: true
    });
    expect(BasicEmpty).toHaveBeenCalledWith(
      expect.objectContaining({
        loading: true
      }),
      expect.any(Object)
    );
  });

  it('should render empty state when data is empty', () => {
    customRender({
      type: ChartTypeEnum.line,
      config: {
        data: []
      }
    });
    expect(BasicEmpty).toHaveBeenCalledWith(
      expect.objectContaining({
        dataLength: 0
      }),
      expect.any(Object)
    );
  });

  it('should render error state correctly', () => {
    const errorTitle = '这是错误信息的标题';
    const errorInfo = '这是一个错误信息';
    customRender({
      type: ChartTypeEnum.line,
      loading: false,
      errorTitle,
      errorInfo
    });
    expect(BasicEmpty).toHaveBeenCalledWith(
      expect.objectContaining({
        errorTitle,
        errorInfo
      }),
      expect.any(Object)
    );
  });

  it('should render line chart correctly', () => {
    customRender({
      type: ChartTypeEnum.line,
      theme: 'dark',
      config: {
        data: [{ x: 1 }]
      }
    });
    const lineChart = screen.getByTestId('mock-antd-plots');
    expect(lineChart).toBeInTheDocument();
    expect(lineChart.getAttribute('data-custom-params')).toEqual(
      JSON.stringify({
        data: [{ x: 1 }],
        theme: 'dark'
      })
    );
  });

  it('should render column chart correctly', () => {
    customRender({
      type: ChartTypeEnum.column,
      theme: 'dark',
      language: 'zh-cn',
      config: {
        data: [{ x: 1 }]
      }
    });
    const columnChart = screen.getByTestId('mock-antd-plots');
    expect(columnChart).toBeInTheDocument();
    expect(columnChart.getAttribute('data-custom-params')).toEqual(
      JSON.stringify({
        data: [{ x: 1 }],
        theme: 'dark',
        locale: 'zh-cn'
      })
    );
  });
});
