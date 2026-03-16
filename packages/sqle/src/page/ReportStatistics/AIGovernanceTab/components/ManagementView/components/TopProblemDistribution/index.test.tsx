import { sqleSuperRender } from '../../../../../../../testUtils/superRender';
import { mockThemeStyleData } from '../../../../../../../testUtils/mockHooks/mockThemeStyleData';

const mockBar = jest.fn((_: any) => <div data-testid="mock-bar" />);

jest.mock('@ant-design/plots', () => {
  return {
    ...jest.requireActual('@ant-design/plots'),
    Bar: (props: unknown) => mockBar(props),
    G2: {
      getEngine: jest.fn(() => undefined)
    }
  };
});

const TopProblemDistribution = require('.').default;

describe('ReportStatistics/ManagementView/TopProblemDistribution', () => {
  beforeEach(() => {
    mockThemeStyleData();
    mockBar.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty node when data is empty', () => {
    const { baseElement } = sqleSuperRender(
      <TopProblemDistribution data={[]} />
    );
    expect(baseElement).toMatchSnapshot();
    expect(mockBar).not.toHaveBeenCalled();
  });

  it('should render bar chart with mapped data', () => {
    sqleSuperRender(
      <TopProblemDistribution
        data={[
          { problem_type: '长事务', percentage: 35 },
          { problem_type: '索引缺失', percentage: 20 }
        ]}
      />
    );

    expect(mockBar).toHaveBeenCalledTimes(1);
    const barProps = (mockBar.mock.calls[0]?.[0] || {}) as any;
    expect(barProps.data).toEqual([
      { type: '长事务', value: 35 },
      { type: '索引缺失', value: 20 }
    ]);
    expect(barProps.meta.value.max).toBe(35);
  });

  it('should truncate long label in label formatter fallback', () => {
    sqleSuperRender(
      <TopProblemDistribution
        data={[
          {
            problem_type: '这是一个很长很长的问题类型名称用于测试截断',
            percentage: 40
          }
        ]}
      />
    );

    const barProps = (mockBar.mock.calls[0]?.[0] || {}) as any;
    const labelContent = barProps.label.content(
      { type: '这是一个很长很长的问题类型名称用于测试截断', value: 40 },
      {}
    );

    expect(labelContent).toBe('这是一个很长很长的问题类型名称... 40%');
  });

  it('should handle undefined percentage as 0', () => {
    sqleSuperRender(
      <TopProblemDistribution
        data={[{ problem_type: '类型A' }, { problem_type: '类型B' }]}
      />
    );

    const barProps = (mockBar.mock.calls[0]?.[0] || {}) as any;
    expect(barProps.data).toEqual([
      { type: '类型A', value: 0 },
      { type: '类型B', value: 0 }
    ]);
    expect(barProps.meta.value.max).toBe(0);
  });

  it('should handle undefined problem_type as empty string', () => {
    sqleSuperRender(
      <TopProblemDistribution
        data={[{ problem_type: undefined, percentage: 50 }, { percentage: 30 }]}
      />
    );

    const barProps = (mockBar.mock.calls[0]?.[0] || {}) as any;
    expect(barProps.data).toEqual([
      { type: '', value: 50 },
      { type: '', value: 30 }
    ]);
  });

  it('should match snapshot when data exists', () => {
    const { baseElement } = sqleSuperRender(
      <TopProblemDistribution
        data={[
          { problem_type: '长事务', percentage: 35 },
          { problem_type: '索引缺失', percentage: 20 }
        ]}
      />
    );

    expect(baseElement).toMatchSnapshot();
  });
});
