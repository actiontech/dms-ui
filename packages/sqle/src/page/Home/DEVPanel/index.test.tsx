import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import DEVPanel from '.';
import {
  dashboardMockData,
  workflowMockData
} from '../../../testUtils/mockApi/home/data';
import home from '../../../testUtils/mockApi/home';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { DASHBOARD_COMMON_GET_ORDER_NUMBER } from '../CommonTable';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { getWorkflowsV1FilterStatusEnum } from '@actiontech/shared/lib/api/sqle/service/workflow/index.enum';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

describe('page/Home/DEVPanel', () => {
  const uid = mockCurrentUserReturn.uid;
  const mockRequest = jest.fn();
  const customRender = (data = dashboardMockData.workflow_statistics) => {
    return superRender(
      <DEVPanel
        projectName={mockProjectInfo.projectName}
        workflowStatistics={data}
        getWorkflowStatistics={mockRequest}
      />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    home.mockAllApi();
    mockUseCurrentProject();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render normal table', async () => {
    const request = home.getWorkflows();
    const { baseElement } = customRender();
    expect(request).toBeCalled();
    expect(request).toBeCalledWith({
      page_index: 1,
      page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
      filter_status: getWorkflowsV1FilterStatusEnum.wait_for_audit,
      project_name: mockProjectInfo.projectName,
      filter_create_user_id: uid
    });
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('mysql-1_20231227103222')).toBeInTheDocument();
    expect(screen.getByText('mysql-1_20231227103222')).toHaveAttribute(
      'href',
      `/sqle/project/${workflowMockData[0].project_name}/order/${workflowMockData[0].workflow_id}`
    );

    expect(screen.getAllByText('-').length).toBe(2);

    fireEvent.click(getBySelector('.ant-btn'));
    expect(request).toBeCalled();
    expect(mockRequest).toBeCalled();
  });

  it('send request when click diff filter status', async () => {
    const request = home.getWorkflows();
    const { baseElement } = customRender();
    expect(request).toBeCalled();
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('待上线')).toBeInTheDocument();
    fireEvent.click(screen.getByText('待上线'));
    expect(request).toBeCalled();
    expect(request).toBeCalledWith({
      page_index: 1,
      page_size: DASHBOARD_COMMON_GET_ORDER_NUMBER,
      filter_status: getWorkflowsV1FilterStatusEnum.wait_for_execution,
      filter_create_user_id: uid,
      project_name: mockProjectInfo.projectName
    });
  });

  it('render filter status with statics number id not 0', async () => {
    const request = home.getWorkflows();
    const { baseElement } = customRender({
      ...dashboardMockData.workflow_statistics,
      my_need_review_workflow_number: 1,
      my_need_execute_workflow_number: 1,
      my_rejected_workflow_number: 1
    });
    expect(request).toBeCalled();
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('待上线')).toBeInTheDocument();
    expect(screen.getAllByText('1')?.[0]).toBeInTheDocument();
    expect(screen.getAllByText('1').length).toBe(3);
  });

  it('render table with return error', async () => {
    const request = home.getWorkflows();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        code: 500,
        message: 'error'
      })
    );
    const { baseElement } = customRender();
    expect(request).toBeCalled();
    expect(baseElement).toMatchSnapshot();
  });
});
