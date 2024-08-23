import SqlManagementConfList from '../';
import { cleanup, act, screen, fireEvent } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import {
  mockProjectInfo,
  mockUseUserOperationPermissionData
} from '@actiontech/shared/lib/testUtil/mockHook/data';
import instanceAuditPlan from '../../../../testUtils/mockApi/instanceAuditPlan';
import { mockInstanceAuditPlanListData } from '../../../../testUtils/mockApi/instanceAuditPlan/data';
import { superRender } from '../../../../testUtils/customRender';
import {
  getBySelector,
  getAllBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { useNavigate } from 'react-router-dom';
import {
  UpdateInstanceAuditPlanStatusReqV1ActiveEnum,
  InstanceAuditPlanResV1ActiveStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import instance from '../../../../testUtils/mockApi/instance';
import { InstanceAuditPlanStatusEnum } from '../index.enum';
import { mockUseUserOperationPermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUseUserOperationPermission';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('test sqle/SqlManagementConf/List', () => {
  let getInstanceAuditPlansSpy: jest.SpyInstance;
  let deleteInstanceAuditPlan: jest.SpyInstance;
  let getAuditPlanTypesSpy: jest.SpyInstance;
  let updateInstanceAuditPlanStatus: jest.SpyInstance;
  let getInstanceTipListSpy: jest.SpyInstance;
  const navigateSpy = jest.fn();

  beforeEach(() => {
    getInstanceAuditPlansSpy = instanceAuditPlan.getInstanceAuditPlans();
    deleteInstanceAuditPlan = instanceAuditPlan.deleteInstanceAuditPlan();
    getAuditPlanTypesSpy = instanceAuditPlan.getAuditPlanTypes();
    updateInstanceAuditPlanStatus =
      instanceAuditPlan.updateInstanceAuditPlanStatus();
    getInstanceTipListSpy = instance.getInstanceTipList();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
    mockUseUserOperationPermission();
    mockUseUserOperationPermissionData.isHaveServicePermission.mockReturnValue(
      true
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap shot', async () => {
    const { baseElement } = superRender(<SqlManagementConfList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('SQL管控配置')).toBeInTheDocument();
    expect(screen.getByText('为数据源开启扫描任务')).toBeInTheDocument();
    expect(getInstanceAuditPlansSpy).toHaveBeenCalled();
    expect(getAuditPlanTypesSpy).toHaveBeenCalled();
    expect(getInstanceTipListSpy).toHaveBeenCalled();
  });

  it('render create button when project is archived', async () => {
    mockUseCurrentProject({
      projectArchive: true
    });
    const { baseElement } = superRender(<SqlManagementConfList />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByText('为数据源开启扫描任务')).not.toBeInTheDocument();
  });

  it('render close task type filter field', async () => {
    const { baseElement } = superRender(<SqlManagementConfList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('全部数据源')).toBeVisible();
    expect(screen.getByText('全部任务类型')).toBeVisible();
    fireEvent.click(screen.getByText('任务类型').closest('button')!);
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('全部数据源')).not.toBeVisible();
    expect(screen.getByText('全部任务类型')).not.toBeVisible();
    expect(baseElement).toMatchSnapshot();
  });

  it('render filter list data by database', async () => {
    superRender(<SqlManagementConfList />);
    await act(async () => jest.advanceTimersByTime(3000));
    const dbBtn = screen.getByText('Oracle').closest('button')!;
    expect(dbBtn).not.toHaveClass('checked-item');
    fireEvent.click(dbBtn);
    await act(async () => jest.advanceTimersByTime(100));
    expect(dbBtn).toHaveClass('checked-item');
    expect(getInstanceAuditPlansSpy).toHaveBeenCalledTimes(3);
    expect(getInstanceAuditPlansSpy).toHaveBeenNthCalledWith(3, {
      filter_by_active_status: undefined,
      filter_by_audit_plan_type: '',
      fuzzy_search: '',
      filter_by_db_type: 'Oracle',
      page_index: 1,
      page_size: 20,
      project_name: mockProjectInfo.projectName
    });
  });

  it('render filter list data by audit plan type', async () => {
    superRender(<SqlManagementConfList />);
    await act(async () => jest.advanceTimersByTime(3000));
    const dbBtn = screen.getByText('自定义').closest('button')!;
    expect(dbBtn).not.toHaveClass('checked-item');
    fireEvent.click(dbBtn);
    await act(async () => jest.advanceTimersByTime(100));
    expect(dbBtn).toHaveClass('checked-item');
    expect(getInstanceAuditPlansSpy).toHaveBeenCalledTimes(3);
    expect(getInstanceAuditPlansSpy).toHaveBeenNthCalledWith(3, {
      filter_by_active_status: undefined,
      filter_by_audit_plan_type: 'default',
      fuzzy_search: '',
      filter_by_db_type: '',
      page_index: 1,
      page_size: 20,
      project_name: mockProjectInfo.projectName
    });
  });

  it('render filter list data by search', async () => {
    superRender(<SqlManagementConfList />);
    await act(async () => jest.advanceTimersByTime(3000));

    const searchText = 'test search';
    const inputEle = getBySelector('#actiontech-table-search-input');
    fireEvent.change(inputEle, {
      target: { value: searchText }
    });

    await act(async () => {
      fireEvent.keyDown(inputEle, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await jest.advanceTimersByTime(300);
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(getInstanceAuditPlansSpy).toHaveBeenCalledTimes(3);
    expect(getInstanceAuditPlansSpy).toHaveBeenNthCalledWith(3, {
      filter_by_active_status: undefined,
      filter_by_audit_plan_type: '',
      fuzzy_search: searchText,
      filter_by_db_type: '',
      page_index: 1,
      page_size: 20,
      project_name: mockProjectInfo.projectName
    });
  });

  it('render filter list data by active status', async () => {
    getInstanceAuditPlansSpy.mockClear();
    getInstanceAuditPlansSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: []
      })
    );
    const { baseElement } = superRender(<SqlManagementConfList />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('筛选').closest('button')!);
    await act(async () => jest.advanceTimersByTime(100));
    expect(baseElement).toMatchSnapshot();
    const filterContainer = getBySelector(
      '.actiontech-table-filter-container-namespace'
    );
    expect(filterContainer).toBeVisible();
    expect(getAllBySelector('.ant-space-item', filterContainer)).toHaveLength(
      2
    );
    const taskStatusTarget = getAllBySelector(
      '.ant-select-selection-search-input'
    )[1];
    fireEvent.mouseDown(taskStatusTarget);
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('停用'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getInstanceAuditPlansSpy).toHaveBeenCalledTimes(3);
    expect(getInstanceAuditPlansSpy).toHaveBeenNthCalledWith(3, {
      filter_by_active_status: InstanceAuditPlanStatusEnum.disabled,
      filter_by_audit_plan_type: '',
      fuzzy_search: '',
      filter_by_db_type: '',
      page_index: 1,
      page_size: 20,
      project_name: mockProjectInfo.projectName
    });
  });

  it('render click edit action', async () => {
    getInstanceAuditPlansSpy.mockClear();
    getInstanceAuditPlansSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [mockInstanceAuditPlanListData[0]]
      })
    );
    superRender(<SqlManagementConfList />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('编 辑').closest('button')!);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenNthCalledWith(
      1,
      `/sqle/project/${mockProjectInfo.projectID}/sql-management-conf/update/${mockInstanceAuditPlanListData[0].instance_audit_plan_id}`
    );
  });

  it('render click disable action', async () => {
    getInstanceAuditPlansSpy.mockClear();
    getInstanceAuditPlansSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [mockInstanceAuditPlanListData[0]]
      })
    );
    superRender(<SqlManagementConfList />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('停用')).toBeVisible();
    fireEvent.click(screen.getByText('停用').closest('div')!);
    expect(
      screen.getByText('禁用后所有数据将不再更新，是否确认停用？')
    ).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(getBySelector('.ant-popconfirm-buttons .ant-btn-primary'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(updateInstanceAuditPlanStatus).toHaveBeenCalledTimes(1);
    expect(updateInstanceAuditPlanStatus).toHaveBeenNthCalledWith(1, {
      project_name: mockProjectInfo.projectName,
      instance_audit_plan_id: `${mockInstanceAuditPlanListData[0].instance_audit_plan_id}`,
      active: UpdateInstanceAuditPlanStatusReqV1ActiveEnum.disabled
    });
    expect(screen.getByText('停用成功')).toBeInTheDocument();
  });

  it('render click enable action', async () => {
    getInstanceAuditPlansSpy.mockClear();
    getInstanceAuditPlansSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            ...mockInstanceAuditPlanListData[0],
            active_status: InstanceAuditPlanResV1ActiveStatusEnum.disabled
          }
        ]
      })
    );
    superRender(<SqlManagementConfList />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('启用')).toBeVisible();
    fireEvent.click(screen.getByText('启用').closest('div')!);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(updateInstanceAuditPlanStatus).toHaveBeenCalledTimes(1);
    expect(updateInstanceAuditPlanStatus).toHaveBeenNthCalledWith(1, {
      project_name: mockProjectInfo.projectName,
      instance_audit_plan_id: `${mockInstanceAuditPlanListData[0].instance_audit_plan_id}`,
      active: UpdateInstanceAuditPlanStatusReqV1ActiveEnum.normal
    });
    expect(screen.getByText('启用成功')).toBeInTheDocument();
  });

  it('render click delete action', async () => {
    getInstanceAuditPlansSpy.mockClear();
    getInstanceAuditPlansSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            ...mockInstanceAuditPlanListData[0],
            active_status: InstanceAuditPlanResV1ActiveStatusEnum.disabled
          }
        ]
      })
    );
    superRender(<SqlManagementConfList />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('删除')).toBeVisible();
    fireEvent.click(screen.getByText('删除').closest('div')!);
    expect(
      screen.getByText('删除后所有数据将不再保留，是否确认删除？')
    ).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(getBySelector('.ant-popconfirm-buttons .ant-btn-primary'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(deleteInstanceAuditPlan).toHaveBeenCalledTimes(1);
    expect(deleteInstanceAuditPlan).toHaveBeenNthCalledWith(1, {
      project_name: mockProjectInfo.projectName,
      instance_audit_plan_id: `${mockInstanceAuditPlanListData[0].instance_audit_plan_id}`
    });
    expect(screen.getByText('删除成功')).toBeInTheDocument();
  });
});
