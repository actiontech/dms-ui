import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import TaskDetail, { ITaskDetail } from '.';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { statisticAuditPlanData } from '../../../../../../testUtils/mockApi/projectOverview/data';
import { PieConfig } from '@ant-design/plots';

jest.mock('@ant-design/plots', () => {
  return {
    ...jest.requireActual('@ant-design/plots'),
    Pie: jest.requireActual('@ant-design/plots').PieWithCustomRenderCalled({
      statistic: {
        title: {
          customHtml: (props: PieConfig) => {
            return [null, null, null, props.data];
          }
        }
      },
      tooltip: {
        customContent: (props: PieConfig) => {
          return [
            '',
            [
              {
                color: '#6094FC',
                name: props.data[0]?.name,
                value: props.data[0]?.value
              }
            ]
          ];
        }
      }
    })
  };
});

describe('page/ProjectOverview/TaskDetail', () => {
  const mockRefresh = jest.fn();

  const taskDetailProps = {
    apiLoading: false,
    errorInfo: '',
    dataLength: statisticAuditPlanData.length,
    refreshFuc: mockRefresh,
    dataSource: statisticAuditPlanData[0]
  };

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = (data?: ITaskDetail) => {
    return sqleSuperRender(<TaskDetail {...taskDetailProps} {...data} />);
  };

  it('render task detail', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render empty and refresh', async () => {
    const { baseElement } = customRender({
      ...taskDetailProps,
      dataLength: 0,
      dataSource: {}
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('暂无数据')).toBeInTheDocument();
    expect(screen.getByText('刷新')).toBeInTheDocument();
    fireEvent.click(screen.getByText('刷新'));
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('render error info', async () => {
    const errorInfo = 'error message';
    const { baseElement } = customRender({
      ...taskDetailProps,
      errorInfo
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText(errorInfo)).toBeInTheDocument();
    expect(screen.getByText('刷新')).toBeInTheDocument();
    fireEvent.click(screen.getByText('刷新'));
    expect(mockRefresh).toHaveBeenCalled();
  });
});
