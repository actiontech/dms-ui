import { sqleSuperRender } from '../../../testUtils/superRender';
import WorkflowTemplateDetail from '.';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import workflowTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate';
import {
  workflowTemplateOutOfOrderData,
  dataExportWorkflowTemplateOutOfOrderData,
  dataExportWorkflowTemplateData
} from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { cloneDeep } from 'lodash';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('page/WorkflowTemplate/WorkflowTemplateDetail', () => {
  beforeEach(() => {
    workflowTemplate.mockAllApi();
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
    mockUsePermission(undefined, {
      mockSelector: true
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = () => {
    return sqleSuperRender(<WorkflowTemplateDetail />);
  };

  it('render workflow template detail page with SegmentedTabs', async () => {
    const getTemplateRequest = workflowTemplate.getWorkflowTemplate();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getTemplateRequest).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('审批流程模板')).toBeInTheDocument();
    expect(screen.queryByText('修改当前审批流程模板')).toBeInTheDocument();
  });

  it('render segmented tab labels correctly', async () => {
    workflowTemplate.getWorkflowTemplate();
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('上线工单')).toBeInTheDocument();
    expect(screen.getByText('数据导出')).toBeInTheDocument();
  });

  it('should sort sql review steps by number ascending when API returns steps in wrong order', async () => {
    const getTemplateRequest = workflowTemplate.getWorkflowTemplate();
    getTemplateRequest.mockImplementation((params) => {
      if (params.workflow_type === 'data_export') {
        return createSpySuccessResponse({
          data: cloneDeep(dataExportWorkflowTemplateData)
        });
      }
      return createSpySuccessResponse({
        data: cloneDeep(workflowTemplateOutOfOrderData)
      });
    });
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    // workflowTemplateOutOfOrderData has steps in order: sql_execute(3), sql_review(2, desc='step desc'), sql_review(1, approved_by_authorized)
    // After filter + sort by number: reviewSteps = [sql_review(1), sql_review(2)], execStep = sql_execute(3)
    // Rendered order: create → review#1(approved_by_authorized) → review#2(desc='step desc') → exec
    const reviewStep1Indicator =
      screen.getByText('匹配拥有数据源审核权限的成员');
    const reviewStep2Desc = screen.getByText('step desc');

    // review#1 (number:1, approved_by_authorized) must appear before review#2 (number:2, desc='step desc')
    expect(
      reviewStep1Indicator.compareDocumentPosition(reviewStep2Desc) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();

    // exec step correctly identified as sql_execute (execute_by_authorized:true)
    expect(
      screen.getByText('匹配拥有数据源上线权限的成员')
    ).toBeInTheDocument();
  });

  it('should sort export review steps by number ascending when API returns steps in wrong order', async () => {
    const getTemplateRequest = workflowTemplate.getWorkflowTemplate();
    getTemplateRequest.mockImplementation((params) => {
      if (params.workflow_type === 'data_export') {
        return createSpySuccessResponse({
          data: cloneDeep(dataExportWorkflowTemplateOutOfOrderData)
        });
      }
      return createSpySuccessResponse({
        data: cloneDeep(workflowTemplateOutOfOrderData)
      });
    });
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('数据导出'));
    await act(async () => jest.advanceTimersByTime(3000));

    // dataExportWorkflowTemplateOutOfOrderData has steps: export_execute(2) first, export_review(1) second
    // After filter + sort: reviewSteps = [export_review(1)], execStep = export_execute(2)
    // exec step is correctly export_execute (execute_by_authorized:true, isDataExport=true)
    // → shows "数据导出的执行人默认为工单创建者，不可修改。"
    expect(
      screen.getByText('数据导出的执行人默认为工单创建者，不可修改。')
    ).toBeInTheDocument();

    // review step is correctly export_review (approved_by_authorized:true)
    // → shows "匹配拥有数据源审核权限的成员"
    // exec step (执行导出) must appear after the review step
    const reviewStep = screen.getAllByText('匹配拥有数据源审核权限的成员')[0];
    const execStepUser = screen.getByText(
      '数据导出的执行人默认为工单创建者，不可修改。'
    );
    expect(
      reviewStep.compareDocumentPosition(execStepUser) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });
});
