import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import LeftContent from '../LeftContent';
import {
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import { mockReactFlow } from '@actiontech/shared/lib/testUtil/mockModule/mockReactFlow';
import { OptimizationSQLDetailStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { screen } from '@testing-library/react';

describe('LeftContent', () => {
  const mockProps = {
    optimizedSql: 'SELECT * FROM users WHERE id = 1',
    advisedIndex: 'CREATE INDEX idx_users_id ON users(id)',
    optimizedQueryPlan: [
      {
        operator: 'Table Scan',
        summary: ['Scanning users table'],
        children: []
      }
    ],
    errorMessage: undefined,
    onViewOverallDiff: jest.fn(),
    onViewTableStructure: jest.fn(),
    onViewQueryPlanDiff: jest.fn(),
    onExpandQueryPlan: jest.fn(),
    isBestPerformance: false,
    originalSql: 'SELECT * FROM users',
    optimizationStatus: OptimizationSQLDetailStatusEnum.finish
  };

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockReactFlow();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should render with horizontal layout by default', () => {
    const { baseElement } = superRender(<LeftContent {...mockProps} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with vertical layout when isVerticalLayout is true', () => {
    const { baseElement } = superRender(
      <LeftContent {...mockProps} isVerticalLayout={true} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with horizontal layout when isVerticalLayout is false', () => {
    const { baseElement } = superRender(
      <LeftContent {...mockProps} isVerticalLayout={false} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with empty content', () => {
    const emptyProps = {
      ...mockProps,
      optimizedSql: undefined,
      advisedIndex: '',
      optimizedQueryPlan: undefined
    };
    const { baseElement } = superRender(<LeftContent {...emptyProps} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with error message', () => {
    const errorProps = {
      ...mockProps,
      errorMessage: 'Optimization failed'
    };
    const { baseElement } = superRender(<LeftContent {...errorProps} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should render when isBestPerformance is false with SqlDiffView', () => {
    const { baseElement } = superRender(
      <LeftContent {...mockProps} isBestPerformance={true} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.getByText(
        '当前 SQL 已经达到最优性能，系统未进行任何修改，以下展示原始SQL！'
      )
    ).toBeInTheDocument();
  });

  it('should render with hasAdvice and otherAdvice', () => {
    const otherAdvice = 'Cannot optimize by index';
    const { baseElement } = superRender(
      <LeftContent
        {...mockProps}
        hasAdvice={true}
        otherAdvice={otherAdvice}
        advisedIndex=""
      />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText(otherAdvice)).toBeInTheDocument();
  });

  it('should render with hasAdvice is false and advisedIndex is empty', () => {
    const { baseElement } = superRender(
      <LeftContent {...mockProps} hasAdvice={false} advisedIndex="" />
    );
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.getByText(
        '恭喜，您的上述最终优化的SQL已使用了最佳索引，暂无进一步的优化！'
      )
    ).toBeInTheDocument();
  });

  it('should render with hasAdvice is false and advisedIndex is empty and isBestPerformance is true', () => {
    const { baseElement } = superRender(
      <LeftContent
        {...mockProps}
        hasAdvice={false}
        advisedIndex=""
        isBestPerformance={true}
      />
    );
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.getByText('恭喜，您的原始SQL已使用了最佳索引，暂无进一步的优化！')
    ).toBeInTheDocument();
  });

  it('should render with optimizationStatus optimizing', () => {
    const { baseElement } = superRender(
      <LeftContent
        {...mockProps}
        optimizationStatus={OptimizationSQLDetailStatusEnum.optimizing}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with optimizationStatus failed', () => {
    const { baseElement } = superRender(
      <LeftContent
        {...mockProps}
        optimizationStatus={OptimizationSQLDetailStatusEnum.failed}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with optimizationStatus finish', () => {
    const { baseElement } = superRender(
      <LeftContent
        {...mockProps}
        optimizationStatus={OptimizationSQLDetailStatusEnum.finish}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
