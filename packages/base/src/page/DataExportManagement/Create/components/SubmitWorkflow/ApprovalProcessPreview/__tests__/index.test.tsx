import { act, screen } from '@testing-library/react';
import { baseSuperRender } from '../../../../../../../testUtils/superRender';
import ApprovalProcessPreview from '..';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import {
  createSpySuccessResponse,
  createSpyErrorResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { dataExportWorkflowTemplateData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate/data';
import { cloneDeep } from 'lodash';
import MockWorkflowTemplateApi from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate';

describe('base/DataExport/Create/ApprovalProcessPreview', () => {
  let mockGetWorkflowTemplateApi: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    mockGetWorkflowTemplateApi = MockWorkflowTemplateApi.getWorkflowTemplate();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const customRender = (projectName = 'test-project') => {
    return baseSuperRender(
      <ApprovalProcessPreview projectName={projectName} />
    );
  };

  it('should render loading state', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('should render step list when data loaded successfully', async () => {
    mockGetWorkflowTemplateApi.mockImplementation(() =>
      createSpySuccessResponse({
        data: cloneDeep(dataExportWorkflowTemplateData)
      })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(mockGetWorkflowTemplateApi).toHaveBeenCalledWith({
      project_name: 'test-project',
      workflow_type: 'data_export'
    });
    expect(screen.getByText('审批流程')).toBeInTheDocument();
    expect(screen.getByText('导出审批')).toBeInTheDocument();
    expect(screen.getAllByText('按权限匹配').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/审批流程可在.*中修改/)).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should render fallback error state when request fails', async () => {
    mockGetWorkflowTemplateApi.mockImplementation(() =>
      createSpyErrorResponse({})
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('加载审批流程失败')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should render correct step type names for export_review and export_execute', async () => {
    const multiStepData = cloneDeep(dataExportWorkflowTemplateData);
    multiStepData.workflow_step_template_list = [
      {
        approved_by_authorized: true,
        assignee_user_id_list: [],
        execute_by_authorized: false,
        number: 1,
        type: 'export_review'
      },
      {
        approved_by_authorized: false,
        assignee_user_id_list: [],
        execute_by_authorized: true,
        number: 2,
        type: 'export_execute'
      }
    ];
    mockGetWorkflowTemplateApi.mockImplementation(() =>
      createSpySuccessResponse({
        data: cloneDeep(multiStepData)
      })
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('导出审批')).toBeInTheDocument();
    expect(screen.getByText('导出执行确认')).toBeInTheDocument();
  });

  it('should render assignee user list when not matched by permission', async () => {
    const customData = cloneDeep(dataExportWorkflowTemplateData);
    customData.workflow_step_template_list = [
      {
        approved_by_authorized: false,
        assignee_user_id_list: ['user1', 'user2'],
        execute_by_authorized: false,
        number: 1,
        type: 'export_review'
      }
    ];
    mockGetWorkflowTemplateApi.mockImplementation(() =>
      createSpySuccessResponse({
        data: cloneDeep(customData)
      })
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('user1, user2')).toBeInTheDocument();
  });

  it('should not make API call when projectName is empty', () => {
    mockGetWorkflowTemplateApi.mockImplementation(() =>
      createSpySuccessResponse({ data: {} })
    );
    customRender('');
    expect(mockGetWorkflowTemplateApi).not.toHaveBeenCalled();
  });
});
