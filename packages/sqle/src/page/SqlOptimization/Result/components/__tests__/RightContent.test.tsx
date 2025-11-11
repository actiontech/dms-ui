import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import RightContent from '../RightContent';
import {
  mockUseCurrentProject,
  mockUseCurrentUser
} from '@actiontech/shared/lib/testUtil';
import { OptimizationSQLDetailStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { screen } from '@testing-library/react';

describe('RightContent', () => {
  const mockProps = {
    totalAnalysis: {
      detail: [
        {
          category: 'performance',
          optimized_score: 85,
          original_score: 50
        }
      ]
    },
    optimizationStatus: OptimizationSQLDetailStatusEnum.finish,
    optimizeSteps: [
      {
        chat_id: 'chat_1',
        optimized_sql: 'SELECT * FROM users WHERE id = 1',
        rule_desc: 'Add index for better performance',
        rule_id: 'rule_1',
        rule_name: 'Index Optimization'
      }
    ],
    errorMessage: undefined,
    onOptimizationRuleClick: jest.fn()
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

  it('should render with horizontal layout by default', () => {
    const { baseElement } = superRender(<RightContent {...mockProps} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with vertical layout when isVerticalLayout is true', () => {
    const { baseElement } = superRender(
      <RightContent {...mockProps} isVerticalLayout={true} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with horizontal layout when isVerticalLayout is false', () => {
    const { baseElement } = superRender(
      <RightContent {...mockProps} isVerticalLayout={false} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with empty content', () => {
    const emptyProps = {
      ...mockProps,
      totalAnalysis: undefined,
      optimizeSteps: []
    };
    const { baseElement } = superRender(<RightContent {...emptyProps} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with error message', () => {
    const errorProps = {
      ...mockProps,
      errorMessage: 'Analysis failed'
    };
    const { baseElement } = superRender(<RightContent {...errorProps} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with optimizeSteps is empty', () => {
    const { baseElement } = superRender(
      <RightContent {...mockProps} optimizeSteps={[]} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should render with totalAnalysis detail is empty', () => {
    const { baseElement } = superRender(
      <RightContent
        {...mockProps}
        totalAnalysis={{ ...mockProps.totalAnalysis, detail: [] }}
      />
    );
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.getByText('恭喜！ 您的SQL查询配置已经非常优秀，无需进一步优化。')
    ).toBeInTheDocument();
  });
});
