import SqlManagementConfList from '../';
import { cleanup, act, screen, fireEvent } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import instanceAuditPlan from '@actiontech/shared/lib/testUtil/mockApi/sqle/instanceAuditPlan';
import { mockInstanceAuditPlanListData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/instanceAuditPlan/data';
import { sqleSuperRender } from '../../../../testUtils/superRender';
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
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import { InstanceAuditPlanStatusEnum } from '../index.enum';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import usePermission from '@actiontech/shared/lib/features/usePermission/usePermission';
import {
  AuditPlanTypeResBaseActiveStatusEnum,
  AuditPlanTypeResBaseLastCollectionStatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import project from '@actiontech/shared/lib/testUtil/mockApi/base/project';
import { PERMISSIONS } from '@actiontech/shared/lib/features';
import type { ActiontechTableActionsWithPermissions } from '@actiontech/shared/lib/features';
import type { IInstanceAuditPlanResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import type { PermissionsConstantType } from '@actiontech/shared/lib/features/usePermission/permissions';
import type { CheckActionPermissionOtherValues } from '@actiontech/shared/lib/features/usePermission/index.type';
import type { ActiontechTableProps } from '@actiontech/dms-kit/es/components/ActiontechTable';

type Row = IInstanceAuditPlanResV1;

type CheckActionPermFn = (
  permission: PermissionsConstantType,
  other?: CheckActionPermissionOtherValues<Row>
) => boolean;

type CheckBwpFn = (
  permission: PermissionsConstantType,
  other?: { record?: Record<string, string> }
) => boolean;

/** 与 usePermission.parse2TableActionPermissions 对齐的简化实现，供 spy mock 注入 */
function mergeActionButtonPropsWithBWPDisabled(
  buttonProps: ((record?: Row) => Record<string, any>) | undefined,
  bwpDisabled: boolean | ((record?: Row) => boolean)
): ((record?: Row) => Record<string, any>) | undefined {
  if (typeof bwpDisabled === 'function') {
    if (typeof buttonProps === 'function') {
      return (record?: Row) => {
        const disabled = bwpDisabled(record);
        return disabled
          ? { ...buttonProps(record), disabled: true }
          : buttonProps(record);
      };
    }
    return (record?: Row) => {
      const disabled = bwpDisabled(record);
      return disabled ? { disabled: true } : {};
    };
  }
  if (!bwpDisabled) return buttonProps;
  if (typeof buttonProps === 'function') {
    return (record?: Row) => ({
      ...buttonProps(record),
      disabled: true
    });
  }
  return () => ({ disabled: true });
}

function createMockParse2TableActionPermissions(
  checkActionPermission: CheckActionPermFn,
  checkActionDisabledByBWP: CheckBwpFn = () => false
) {
  return (
    actions: ActiontechTableActionsWithPermissions<Row>
  ): ActiontechTableProps<Row>['actions'] => {
    if (Array.isArray(actions)) {
      return actions.map((item) => {
        const bwpDisabledFn = item.permissions
          ? (record?: Row) =>
              checkActionDisabledByBWP(item.permissions!, {
                record: record as unknown as Record<string, string>
              })
          : false;
        return {
          ...item,
          permissions: item.permissions
            ? (record) =>
                checkActionPermission(item.permissions!, {
                  record
                })
            : undefined,
          buttonProps: mergeActionButtonPropsWithBWPDisabled(
            item.buttonProps as (r?: Row) => Record<string, any>,
            bwpDisabledFn
          )
        };
      }) as ActiontechTableProps<Row>['actions'];
    }

    const parseActionMoreButtons = (
      moreButtons: typeof actions.moreButtons
    ) => {
      if (typeof moreButtons === 'function') {
        return (record: Row) =>
          moreButtons(record).map((item) => {
            const bwpDisabled = item.permissions
              ? checkActionDisabledByBWP(item.permissions!, {
                  record: record as unknown as Record<string, string>
                })
              : false;
            const itemDisabled = item.disabled;
            return {
              ...item,
              permissions: item.permissions
                ? (data: Row) =>
                    checkActionPermission(item.permissions!, {
                      record: data
                    })
                : undefined,
              disabled:
                typeof itemDisabled === 'function'
                  ? (data?: Row) =>
                      (item.permissions
                        ? checkActionDisabledByBWP(item.permissions!, {
                            record: data as unknown as Record<string, string>
                          })
                        : false) || !!itemDisabled(data)
                  : bwpDisabled || !!itemDisabled
            };
          });
      }
      return moreButtons?.map((item) => {
        const bwpDisabled = item.permissions
          ? checkActionDisabledByBWP(item.permissions)
          : false;
        const itemDisabled = item.disabled;
        return {
          ...item,
          permissions: item.permissions
            ? (record: Row) =>
                checkActionPermission(item.permissions!, {
                  record
                })
            : undefined,
          disabled:
            typeof itemDisabled === 'function'
              ? (data?: Row) =>
                  (item.permissions
                    ? checkActionDisabledByBWP(item.permissions!, {
                        record: data as unknown as Record<string, string>
                      })
                    : false) || !!itemDisabled(data)
              : bwpDisabled || !!itemDisabled
        };
      });
    };

    return {
      ...actions,
      buttons: actions.buttons.map((item) => {
        const bwpDisabledFn = item.permissions
          ? (record?: Row) =>
              checkActionDisabledByBWP(item.permissions!, {
                record: record as unknown as Record<string, string>
              })
          : false;
        return {
          ...item,
          permissions: item.permissions
            ? (record) =>
                checkActionPermission(item.permissions!, {
                  record
                })
            : undefined,
          buttonProps: mergeActionButtonPropsWithBWPDisabled(
            item.buttonProps as (r?: Row) => Record<string, any>,
            bwpDisabledFn
          )
        };
      }),
      moreButtons: parseActionMoreButtons(actions.moreButtons)
    } as ActiontechTableProps<Row>['actions'];
  };
}

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

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
  let listEnvironmentTagsSpy: jest.SpyInstance;
  const navigateSpy = jest.fn();

  beforeEach(() => {
    getInstanceAuditPlansSpy = instanceAuditPlan.getInstanceAuditPlans();
    deleteInstanceAuditPlan = instanceAuditPlan.deleteInstanceAuditPlan();
    getAuditPlanTypesSpy = instanceAuditPlan.getAuditPlanTypes();
    updateInstanceAuditPlanStatus =
      instanceAuditPlan.updateInstanceAuditPlanStatus();
    getInstanceTipListSpy = instance.getInstanceTipList();
    listEnvironmentTagsSpy = project.listEnvironmentTags();
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
    mockUsePermission(undefined, {
      mockSelector: true
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap shot', async () => {
    const { baseElement } = sqleSuperRender(<SqlManagementConfList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('SQL管控配置')).toBeInTheDocument();
    expect(screen.getByText('为数据源开启扫描任务')).toBeInTheDocument();
    expect(getInstanceAuditPlansSpy).toHaveBeenCalled();
    expect(getAuditPlanTypesSpy).toHaveBeenCalled();
    expect(getInstanceTipListSpy).toHaveBeenCalled();
    expect(listEnvironmentTagsSpy).toHaveBeenCalled();
  });

  it('render sql management conf list with audit plan active status', async () => {
    getInstanceAuditPlansSpy.mockClear();
    getInstanceAuditPlansSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            ...mockInstanceAuditPlanListData[0],
            audit_plan_types: [
              {
                audit_plan_id: 1,
                type: 'sql_file',
                desc: 'SQL文件',
                active_status: AuditPlanTypeResBaseActiveStatusEnum.normal,
                last_collection_status:
                  AuditPlanTypeResBaseLastCollectionStatusEnum.abnormal
              }
            ]
          }
        ]
      })
    );
    const { baseElement } = sqleSuperRender(<SqlManagementConfList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render create button when project is archived', async () => {
    mockUseCurrentUser({
      bindProjects: [
        {
          project_id: mockProjectInfo.projectID,
          project_name: mockProjectInfo.projectName,
          archived: true,
          is_manager: true
        }
      ]
    });
    const { baseElement } = sqleSuperRender(<SqlManagementConfList />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByText('为数据源开启扫描任务')).not.toBeInTheDocument();
  });

  it('render close task type filter field', async () => {
    const { baseElement } = sqleSuperRender(<SqlManagementConfList />);
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
    sqleSuperRender(<SqlManagementConfList />);
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
    sqleSuperRender(<SqlManagementConfList />);
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
    sqleSuperRender(<SqlManagementConfList />);
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
    const { baseElement } = sqleSuperRender(<SqlManagementConfList />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('筛选').closest('button')!);
    await act(async () => jest.advanceTimersByTime(100));
    expect(baseElement).toMatchSnapshot();
    const filterContainer = getBySelector(
      '.actiontech-table-filter-container-namespace'
    );
    expect(filterContainer).toBeVisible();
    expect(getAllBySelector('.ant-space-item', filterContainer)).toHaveLength(
      3
    );
    const taskStatusTarget = getAllBySelector(
      '.ant-select-selection-search-input'
    )[2];
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
    sqleSuperRender(<SqlManagementConfList />);
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
    sqleSuperRender(<SqlManagementConfList />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
    await act(async () => jest.advanceTimersByTime(100));
    const stopInMoreMenu = screen.getByText('停用', {
      selector: '.more-button-item-text'
    });
    expect(stopInMoreMenu).toBeVisible();
    fireEvent.click(stopInMoreMenu);
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
    sqleSuperRender(<SqlManagementConfList />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
    await act(async () => jest.advanceTimersByTime(100));
    const enableInMoreMenu = screen.getByText('启用', {
      selector: '.more-button-item-text'
    });
    expect(enableInMoreMenu).toBeVisible();
    fireEvent.click(enableInMoreMenu);
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
    sqleSuperRender(<SqlManagementConfList />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
    await act(async () => jest.advanceTimersByTime(100));
    const deleteInMoreMenu = screen
      .getAllByText('删除')
      .find((el) => !!el.closest('.more-button-item-text'));
    expect(deleteInMoreMenu).toBeTruthy();
    fireEvent.click(deleteInMoreMenu!);
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

  describe('permissions (mockUsePermission spy)', () => {
    let permissionSpy: jest.SpyInstance | undefined;

    afterEach(() => {
      permissionSpy?.mockRestore();
      permissionSpy = undefined;
    });

    const SqleConfPerms = PERMISSIONS.ACTIONS.SQLE.SQL_MANAGEMENT_CONF;

    const setupPermissionMock = (
      checkActionPermission: CheckActionPermFn,
      checkActionDisabledByBWP: CheckBwpFn = () => false
    ) => {
      permissionSpy = mockUsePermission(
        {
          checkActionPermission: jest.fn(checkActionPermission),
          checkActionDisabledByBWP: jest.fn(checkActionDisabledByBWP),
          checkPagePermission: jest.fn().mockReturnValue(true),
          parse2TableActionPermissions: createMockParse2TableActionPermissions(
            checkActionPermission,
            checkActionDisabledByBWP
          )
        } as Partial<ReturnType<typeof usePermission>>,
        { useSpyOnMockHooks: true }
      );
    };

    it('hides header create button when CREATE is denied', async () => {
      setupPermissionMock((perm) => perm !== SqleConfPerms.CREATE);
      getInstanceAuditPlansSpy.mockClear();
      getInstanceAuditPlansSpy.mockImplementation(() =>
        createSpySuccessResponse({
          data: [mockInstanceAuditPlanListData[0]]
        })
      );
      sqleSuperRender(<SqlManagementConfList />);
      await act(async () => jest.advanceTimersByTime(3000));
      expect(
        screen.queryByText('为数据源开启扫描任务')
      ).not.toBeInTheDocument();
      expect(screen.getByText('编 辑').closest('button')).toBeInTheDocument();
    });

    it('hides row edit button when EDIT is denied', async () => {
      setupPermissionMock((perm) => perm !== SqleConfPerms.EDIT);
      getInstanceAuditPlansSpy.mockClear();
      getInstanceAuditPlansSpy.mockImplementation(() =>
        createSpySuccessResponse({
          data: [mockInstanceAuditPlanListData[0]]
        })
      );
      sqleSuperRender(<SqlManagementConfList />);
      await act(async () => jest.advanceTimersByTime(3000));
      expect(screen.queryByText('编 辑')).not.toBeInTheDocument();
      expect(screen.getByText('为数据源开启扫描任务')).toBeInTheDocument();
    });

    it('hides stop action in more menu when STOP is denied', async () => {
      setupPermissionMock((perm) => perm !== SqleConfPerms.STOP);
      getInstanceAuditPlansSpy.mockClear();
      getInstanceAuditPlansSpy.mockImplementation(() =>
        createSpySuccessResponse({
          data: [mockInstanceAuditPlanListData[0]]
        })
      );
      sqleSuperRender(<SqlManagementConfList />);
      await act(async () => jest.advanceTimersByTime(3000));
      fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
      await act(async () => jest.advanceTimersByTime(100));
      expect(
        screen.queryByText('停用', { selector: '.more-button-item-text' })
      ).not.toBeInTheDocument();
      expect(
        screen
          .getAllByText('删除')
          .some((el) => !!el.closest('.more-button-item-text'))
      ).toBe(true);
    });

    it('hides more menu when STOP, ENABLE and DELETE are all denied', async () => {
      setupPermissionMock(
        (perm) =>
          perm !== SqleConfPerms.STOP &&
          perm !== SqleConfPerms.ENABLE &&
          perm !== SqleConfPerms.DELETE
      );
      getInstanceAuditPlansSpy.mockClear();
      getInstanceAuditPlansSpy.mockImplementation(() =>
        createSpySuccessResponse({
          data: [mockInstanceAuditPlanListData[0]]
        })
      );
      sqleSuperRender(<SqlManagementConfList />);
      await act(async () => jest.advanceTimersByTime(3000));
      expect(
        document.querySelector('.actiontech-table-actions-more-button')
      ).toBeNull();
      expect(screen.getByText('编 辑').closest('button')).toBeInTheDocument();
    });

    it('disables header create button when CREATE is allowed but blocked by BWP', async () => {
      setupPermissionMock(
        () => true,
        (perm) => perm === SqleConfPerms.CREATE
      );
      getInstanceAuditPlansSpy.mockClear();
      getInstanceAuditPlansSpy.mockImplementation(() =>
        createSpySuccessResponse({
          data: [mockInstanceAuditPlanListData[0]]
        })
      );
      sqleSuperRender(<SqlManagementConfList />);
      await act(async () => jest.advanceTimersByTime(3000));
      expect(
        screen.getByText('为数据源开启扫描任务').closest('button')
      ).toBeDisabled();
    });

    it('renders stop in more menu as disabled when STOP is blocked by BWP', async () => {
      setupPermissionMock(
        () => true,
        (perm) => perm === SqleConfPerms.STOP
      );
      getInstanceAuditPlansSpy.mockClear();
      getInstanceAuditPlansSpy.mockImplementation(() =>
        createSpySuccessResponse({
          data: [mockInstanceAuditPlanListData[0]]
        })
      );
      sqleSuperRender(<SqlManagementConfList />);
      await act(async () => jest.advanceTimersByTime(3000));
      fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
      await act(async () => jest.advanceTimersByTime(100));
      const stopLabel = screen.getByText('停用', {
        selector: '.more-button-item-text'
      });
      expect(stopLabel.closest('.more-button-item')).toHaveClass(
        'more-button-item-disabled'
      );
    });
  });
});
