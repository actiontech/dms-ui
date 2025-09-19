import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import {
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import { screen } from '@testing-library/react';
import AnalysisChart from '../AnalysisChart';
import { ITotalAnalysis } from '@actiontech/shared/lib/api/sqle/service/common';
import { OptimizationSQLDetailStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

describe('sqle/SqlOptimization/Result/components/AnalysisChart', () => {
  const mockAnalysisData: ITotalAnalysis = {
    state: 'done',
    improvement_rate: 0.8461538461538461,
    improvement_desc:
      '与原始 SQL 相比，改写后的 SQL 移除了对 student_classes 表的不必要的 LEFT JOIN',
    detail: [
      {
        category: '执行计划',
        optimized_score: 4,
        original_score: 1
      },
      {
        category: '扫描预估',
        optimized_score: 1,
        original_score: 1
      },
      {
        category: '索引使用',
        optimized_score: 1,
        original_score: 1
      },
      {
        category: 'SQL复杂度',
        optimized_score: 7,
        original_score: 1
      },
      {
        category: '网络传输',
        optimized_score: 4,
        original_score: 4
      },
      {
        category: '其他',
        optimized_score: 6,
        original_score: 4
      }
    ],
    total_score: 31.0
  };

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should render correctly with valid data', () => {
    const { baseElement } = superRender(
      <AnalysisChart data={mockAnalysisData} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should handle error state correctly', () => {
    const errorMessage = '数据加载失败';
    superRender(
      <AnalysisChart data={mockAnalysisData} errorMessage={errorMessage} />
    );

    expect(screen.getByText('数据加载失败')).toBeInTheDocument();
  });

  it('should handle optimizing state correctly', () => {
    superRender(
      <AnalysisChart
        data={{}}
        optimizationStatus={OptimizationSQLDetailStatusEnum.optimizing}
      />
    );

    expect(screen.getByText('优化进行中')).toBeInTheDocument();
  });

  it('should handle null data gracefully', () => {
    superRender(<AnalysisChart data={undefined} />);

    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });

  it('should handle empty detail array', () => {
    const emptyData: ITotalAnalysis = {
      ...mockAnalysisData,
      detail: []
    };

    superRender(<AnalysisChart data={emptyData} />);

    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });
});
