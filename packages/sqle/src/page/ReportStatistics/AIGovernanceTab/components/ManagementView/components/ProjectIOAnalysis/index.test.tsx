import { screen } from '@testing-library/react';
import { sqleSuperRender } from '../../../../../../../testUtils/superRender';
import { mockThemeStyleData } from '../../../../../../../testUtils/mockHooks/mockThemeStyleData';
import * as useThemeStyleData from '../../../../../../../hooks/useThemeStyleData';
import ProjectIOAnalysis from '.';

describe('ReportStatistics/ManagementView/ProjectIOAnalysis', () => {
  beforeEach(() => {
    mockThemeStyleData();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot', () => {
    const { baseElement } = sqleSuperRender(
      <ProjectIOAnalysis
        data={[
          {
            project_name: '项目A',
            active_members: 10,
            invoke_count: 100,
            performance_gain: '12%',
            time_saved: 2,
            health_score: 95
          },
          {
            project_name: '项目B',
            active_members: 8,
            invoke_count: 80,
            performance_gain: '8%',
            time_saved: 1,
            health_score: 75
          }
        ]}
      />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should render rank, name and formatted time value', () => {
    sqleSuperRender(
      <ProjectIOAnalysis
        data={[
          {
            project_name: '项目A',
            active_members: 10,
            invoke_count: 100,
            performance_gain: '12%',
            time_saved: 2,
            health_score: 95
          }
        ]}
      />
    );

    expect(screen.getByText('项目A')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2 小时')).toBeInTheDocument();
    expect(screen.getByText('95')).toBeInTheDocument();
  });

  it('should render fallback "-" when value is missing', () => {
    sqleSuperRender(
      <ProjectIOAnalysis
        data={[
          {
            project_name: '项目空值',
            active_members: 0,
            invoke_count: 0,
            performance_gain: '',
            health_score: undefined
          }
        ]}
      />
    );

    expect(screen.getAllByText('-').length).toBeGreaterThan(0);
  });

  it('should not show performance_gain column when viewType is rewrite', () => {
    sqleSuperRender(
      <ProjectIOAnalysis
        viewType="rewrite"
        data={[
          {
            project_name: '项目A',
            active_members: 10,
            invoke_count: 100,
            time_saved: 2,
            health_score: 95
          }
        ]}
      />
    );

    expect(screen.getByText('项目A')).toBeInTheDocument();
    expect(screen.getByText('2 小时')).toBeInTheDocument();
    expect(screen.queryByText('性能提升幅度')).not.toBeInTheDocument();
  });

  it('should apply health score color by threshold', () => {
    jest.spyOn(useThemeStyleData, 'default').mockImplementation(
      () =>
        ({
          sqleTheme: {
            reportStatistics: {
              ProjectIOAnalysis: {
                healthScore: {
                  excellent: 'red',
                  good: 'orange',
                  normal: 'blue',
                  poor: 'black',
                  trailColor: '#ddd'
                }
              }
            }
          },
          sharedTheme: {
            uiToken: {
              colorTextBase: '#111'
            }
          }
        } as any)
    );

    const { container } = sqleSuperRender(
      <ProjectIOAnalysis
        data={[
          { project_name: 'A', health_score: 95 },
          { project_name: 'B', health_score: 85 },
          { project_name: 'C', health_score: 60 },
          { project_name: 'D', health_score: 59 }
        ]}
      />
    );

    const progressBars = container.querySelectorAll('.ant-progress-bg');
    expect(progressBars).toHaveLength(4);
    expect(progressBars[0]).toHaveStyle('background-color: red');
    expect(progressBars[1]).toHaveStyle('background-color: orange');
    expect(progressBars[2]).toHaveStyle('background-color: blue');
    expect(progressBars[3]).toHaveStyle('background-color: black');
  });
});
