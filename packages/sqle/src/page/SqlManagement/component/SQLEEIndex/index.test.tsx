import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import SQLEEIndex from '.';
import { superRender } from '../../../../testUtils/customRender';
import sqlManage from '../../../../testUtils/mockApi/sqlManage';
import { mockAbnormalInstanceAuditPlansData } from '../../../../testUtils/mockApi/sqlManage/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseProjectBusinessTips } from '@actiontech/shared/lib/testUtil/mockHook/mockUseProjectBusinessTips';
import { useDispatch, useSelector } from 'react-redux';
import { driverMeta } from '../../../../hooks/useDatabaseType/index.test.data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { sqlManageListData } from '../../../../testUtils/mockApi/sqlManage/data';
import {
  getAllBySelector,
  getBySelector,
  queryBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import {
  mockCurrentUserReturn,
  mockProjectInfo
} from '@actiontech/shared/lib/testUtil/mockHook/data';
import instance from '../../../../testUtils/mockApi/instance';
import { ModalName } from '../../../../data/ModalName';
import { mockUseAuditPlanTypes } from '../../../../testUtils/mockRequest';
import {
  GetSqlManageListV2FilterPriorityEnum,
  exportSqlManageV1FilterPriorityEnum
} from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.enum';
import { SupportLanguage } from '@actiontech/shared/lib/enum';
import { SystemRole } from '@actiontech/shared/lib/enum';
import { useSearchParams } from 'react-router-dom';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useSearchParams: jest.fn()
  };
});

const exportParams = {
  filter_assignee: undefined,
  filter_db_type: undefined,
  filter_rule_name: undefined,
  project_name: mockProjectInfo.projectName,
  filter_business: undefined,
  filter_priority: undefined,
  fuzzy_search_sql_fingerprint: '',
  filter_status: 'unhandled'
};

const requestParams = {
  ...exportParams,
  sort_field: undefined,
  sort_order: undefined,
  page_index: 1,
  page_size: 20
};

describe('page/SqlManagement/SQLEEIndex', () => {
  const mockDispatch = jest.fn();
  const useSearchParamsSpy: jest.Mock = useSearchParams as jest.Mock;
  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseProjectBusinessTips();
    mockUseAuditPlanTypes();
    jest.useFakeTimers();
    instance.mockAllApi();
    sqlManage.mockAllApi();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        database: { driverMeta: driverMeta },
        sqlManagement: {
          modalStatus: {}
        },
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } },
        sqlManagementException: {
          modalStatus: { [ModalName.Create_Sql_Management_Exception]: false }
        },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
        }
      });
    });
    useSearchParamsSpy.mockReturnValue([
      new URLSearchParams({
        instance_id: '',
        source: ''
      })
    ]);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render table data', async () => {
    const request = sqlManage.getSqlManageList();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        ...sqlManageListData,
        data: sqlManageListData.data
      })
    );
    const { baseElement } = superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render table data when preferred language is zh_CN', async () => {
    const request = sqlManage.getSqlManageList();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        ...sqlManageListData,
        data: sqlManageListData.data
      })
    );
    const { baseElement } = superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render table data when preferred language is en_US', async () => {
    mockUseCurrentUser({ language: SupportLanguage.enUS });
    const request = sqlManage.getSqlManageList();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        ...sqlManageListData,
        data: sqlManageListData.data
      })
    );
    const { baseElement } = superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render sql statics data', async () => {
    const request = sqlManage.getSqlManageList();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        ...sqlManageListData,
        sql_manage_bad_num: undefined,
        sql_manage_optimized_num: undefined,
        sql_manage_total_num: undefined
      })
    );
    const { baseElement } = superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getAllByText('0').length).toBe(3);
    expect(screen.getAllByText('0')?.[0]).toHaveClass('total');
  });

  it('filter data with rule name', async () => {
    const request = sqlManage.getSqlManageList();
    const ruleTipsRequest = sqlManage.getSqlManageRuleTips();
    const { baseElement } = superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    expect(ruleTipsRequest).toHaveBeenCalled();
    expect(screen.getByText('筛选')).toBeInTheDocument();
    fireEvent.click(screen.getByText('筛选'));
    expect(screen.getByText('审核规则')).toBeInTheDocument();
    const searchInput = getAllBySelector('.ant-select-selection-search-input');
    fireEvent.mouseDown(searchInput[searchInput.length - 1]);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    const options = getAllBySelector('.ant-select-item-option');
    expect(options.length).toBe(2);
    await act(async () => {
      fireEvent.click(options[0]);
      await act(async () => jest.advanceTimersByTime(3000));
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      ...requestParams,
      filter_db_type: 'MySQL',
      filter_rule_name: 'test'
    });
  });

  it('filter data about myself', async () => {
    const request = sqlManage.getSqlManageList();
    superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    fireEvent.click(screen.getByText('与我相关'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      ...requestParams,
      filter_assignee: mockCurrentUserReturn.userId
    });
  });

  it('filter data with priority', async () => {
    const request = sqlManage.getSqlManageList();
    superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    fireEvent.click(screen.getByText('查看高优先级SQL'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      ...requestParams,
      filter_priority: GetSqlManageListV2FilterPriorityEnum.high
    });
  });

  it('filter data with status', async () => {
    const request = sqlManage.getSqlManageList();
    superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    expect(screen.getByText('已解决')).toBeInTheDocument();
    fireEvent.click(screen.getByText('已解决'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      ...requestParams,
      filter_status: 'solved'
    });
  });

  // it('filter data with sort', async () => {
  //   const request = sqlManage.getSqlManageList();
  //   const { baseElement } = superRender(<SQLEEIndex />);
  //   expect(request).toHaveBeenCalled();
  //   expect(baseElement).toMatchSnapshot();

  //   const sortButtons = getAllBySelector('.ant-table-column-sorter');
  //   expect(sortButtons.length).toBe(3);
  //   fireEvent.click(sortButtons[sortButtons.length - 1]);
  //   expect(request).toHaveBeenCalledWith({
  //     ...requestParams,
  //     sort_field: 'fp_count',
  //     sort_order: 'desc'
  //   });
  // });

  it('filter data with search', async () => {
    const request = sqlManage.getSqlManageList();
    superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    const searchText = 'search text';
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
    expect(request).toHaveBeenCalledWith({
      ...requestParams,
      fuzzy_search_sql_fingerprint: searchText
    });
  });

  it('export data', async () => {
    const request = sqlManage.getSqlManageList();
    const exportRequest = sqlManage.exportSqlManage();
    superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    fireEvent.click(screen.getByText('与我相关'));
    fireEvent.click(screen.getByText('查看高优先级SQL'));

    expect(screen.getByText('导出')).toBeInTheDocument();
    fireEvent.click(screen.getByText('导出'));
    expect(exportRequest).toHaveBeenCalledWith(
      {
        ...exportParams,
        filter_assignee: mockCurrentUserReturn.userId,
        filter_priority: exportSqlManageV1FilterPriorityEnum.high
      },
      {
        responseType: 'blob'
      }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('导出文件成功')).toBeInTheDocument();
  });

  it('batch assignment operation for sql', async () => {
    const request = sqlManage.getSqlManageList();
    superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('批量指派').closest('button')).toBeDisabled();
    const batchCheckbox = getBySelector('.ant-table-thead .ant-checkbox-input');
    fireEvent.click(batchCheckbox);
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('批量指派').closest('button')).not.toBeDisabled();
    fireEvent.click(screen.getByText('批量指派'));
    expect(mockDispatch).toHaveBeenCalledTimes(5);
    expect(mockDispatch).toHaveBeenNthCalledWith(4, {
      type: 'sqlManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Assignment_Member_Batch,
        status: true
      }
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(5, {
      type: 'sqlManagement/setSqlManagementBatchSelectData',
      payload: [sqlManageListData.data[0]]
    });
  });

  it('batch solve operation for sql', async () => {
    const request = sqlManage.getSqlManageList();
    const batchRequest = sqlManage.batchUpdateSqlManage();
    superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('批量解决').closest('button')).toBeDisabled();
    const batchCheckbox = getBySelector('.ant-table-thead .ant-checkbox-input');
    fireEvent.click(batchCheckbox);
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('批量解决').closest('button')).not.toBeDisabled();
    fireEvent.click(screen.getByText('批量解决'));
    await screen.findByText('是否确认将所选SQL设为已解决?');
    fireEvent.click(screen.getByText('确 认'));
    expect(mockDispatch).toHaveBeenCalledTimes(3);
    expect(batchRequest).toHaveBeenNthCalledWith(1, {
      project_name: mockProjectInfo.projectName,
      status: 'solved',
      sql_manage_id_list: [sqlManageListData.data[0].id]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledTimes(2);
  });

  it('batch ignore operation for sql', async () => {
    const request = sqlManage.getSqlManageList();
    const batchRequest = sqlManage.batchUpdateSqlManage();
    superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('批量忽略').closest('button')).toBeDisabled();
    const batchCheckbox = getBySelector('.ant-table-thead .ant-checkbox-input');
    expect(batchCheckbox).toBeInTheDocument();
    fireEvent.click(batchCheckbox);
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('批量忽略').closest('button')).not.toBeDisabled();
    fireEvent.click(screen.getByText('批量忽略'));
    await screen.findByText('是否确认将所选SQL设为已忽略?');
    fireEvent.click(screen.getByText('确 认'));

    expect(batchRequest).toHaveBeenCalledTimes(1);

    expect(batchRequest).toHaveBeenNthCalledWith(1, {
      project_name: mockProjectInfo.projectName,
      status: 'ignored',
      sql_manage_id_list: [sqlManageListData.data[0].id]
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledTimes(2);
  });

  it('update remark', async () => {
    const request = sqlManage.getSqlManageList();
    const batchRequest = sqlManage.batchUpdateSqlManage();
    const { baseElement } = superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('this is remark text')).toBeInTheDocument();
    fireEvent.click(screen.getByText('this is remark text'));
    await act(async () => jest.advanceTimersByTime(300));
    const textareaEle = getBySelector(
      '.ant-typography textarea.ant-input',
      baseElement
    );
    const remarkText = 'this is new remark text';
    await act(async () => {
      fireEvent.input(textareaEle, {
        target: { value: remarkText }
      });
      await jest.advanceTimersByTime(300);
    });
    await act(async () => {
      fireEvent.keyDown(textareaEle!, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      fireEvent.keyUp(textareaEle!, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await jest.advanceTimersByTime(300);
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(batchRequest).toHaveBeenCalledTimes(1);
    expect(batchRequest).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      sql_manage_id_list: [sqlManageListData.data[0].id],
      remark: remarkText
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(request).toHaveBeenCalled();
  });

  it('jump to analyze and open modal when click row button', async () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    const request = sqlManage.getSqlManageList();
    superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('分析'));
    expect(openSpy).toHaveBeenCalledWith(
      `/sqle/project/${mockProjectInfo.projectID}/sql-management/${sqlManageListData.data[0].id}/analyze`,
      '_blank'
    );
    openSpy.mockRestore();
    expect(screen.getAllByText('指派负责人').length).toBe(1);
    fireEvent.click(screen.getAllByText('指派负责人')[0]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Assignment_Member_Single,
        status: true
      }
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlManagement/setSqlManagementSelectData',
      payload: sqlManageListData.data[0]
    });
  });

  it('render create sql management exception', async () => {
    const request = sqlManage.getSqlManageList();
    superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('添加为管控SQL例外'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(mockDispatch).toHaveBeenCalledTimes(5);
    expect(mockDispatch).toHaveBeenNthCalledWith(4, {
      payload: {
        modalName: ModalName.Create_Sql_Management_Exception,
        status: true
      },
      type: 'sqlManagementException/updateModalStatus'
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(5, {
      payload: { selectRow: { content: undefined } },
      type: 'sqlManagementException/updateSelectSqlManagementException'
    });
  });

  it('render create whitelist', async () => {
    const request = sqlManage.getSqlManageList();
    superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('添加为审核SQL例外'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(mockDispatch).toHaveBeenCalledTimes(5);
    expect(mockDispatch).toHaveBeenNthCalledWith(4, {
      payload: { modalName: ModalName.Add_Whitelist, status: true },
      type: 'whitelist/updateModalStatus'
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(5, {
      payload: { selectRow: { value: undefined } },
      type: 'whitelist/updateSelectWhitelist'
    });
  });

  it('render table with permissions', async () => {
    // project manager
    mockUseCurrentUser({
      ...mockCurrentUserReturn,
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.globalManager]: false
      },
      bindProjects: [
        {
          is_manager: true,
          project_name: mockProjectInfo.projectName,
          project_id: mockProjectInfo.projectID,
          archived: false
        }
      ]
    });
    const request = sqlManage.getSqlManageList();
    const { baseElement } = superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('批量指派')).toBeInTheDocument();
    expect(screen.getByText('批量解决')).toBeInTheDocument();
    expect(screen.getByText('批量忽略')).toBeInTheDocument();
    expect(screen.getByText('指派负责人')).toBeInTheDocument();
    expect(screen.getByText('变更状态')).toBeInTheDocument();
    expect(
      getBySelector('.actiontech-table-actions-more-button')
    ).toBeInTheDocument();
    expect(screen.queryByText('分 析')).not.toBeInTheDocument();
    cleanup();

    // not admin or global manager or project manager
    mockUseCurrentUser({
      ...mockCurrentUserReturn,
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.globalManager]: false
      }
    });
    const { baseElement: noPermissionBaseElement } = superRender(
      <SQLEEIndex />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(noPermissionBaseElement).toMatchSnapshot();
    expect(screen.queryByText('批量指派')).not.toBeInTheDocument();
    expect(screen.queryByText('批量解决')).not.toBeInTheDocument();
    expect(screen.queryByText('批量忽略')).not.toBeInTheDocument();
    expect(screen.queryByText('指派负责人')).not.toBeInTheDocument();
    expect(screen.queryByText('变更状态')).not.toBeInTheDocument();
    expect(
      queryBySelector('.actiontech-table-actions-more-button')
    ).not.toBeInTheDocument();
    expect(screen.getByText('分 析')).toBeInTheDocument();
    cleanup();

    // project archived
    mockUseCurrentUser({
      ...mockCurrentUserReturn,
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.globalManager]: false
      },
      bindProjects: [
        {
          is_manager: true,
          project_name: mockProjectInfo.projectName,
          project_id: mockProjectInfo.projectID,
          archived: true
        }
      ]
    });
    const { baseElement: projectArchivedBaseElement } = superRender(
      <SQLEEIndex />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(projectArchivedBaseElement).toMatchSnapshot();
    expect(screen.queryByText('批量指派')).not.toBeInTheDocument();
    expect(screen.queryByText('批量解决')).not.toBeInTheDocument();
    expect(screen.queryByText('批量忽略')).not.toBeInTheDocument();
    expect(screen.queryByText('指派负责人')).not.toBeInTheDocument();
    expect(screen.queryByText('变更状态')).not.toBeInTheDocument();
    expect(
      queryBySelector('.actiontech-table-actions-more-button')
    ).not.toBeInTheDocument();
    expect(screen.getByText('分 析')).toBeInTheDocument();
  });

  it('change single status when click row button', async () => {
    const request = sqlManage.getSqlManageList();
    superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getAllByText('变更状态').length).toBe(1);
    fireEvent.click(screen.getAllByText('变更状态')[0]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Change_Status_Single,
        status: true
      }
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlManagement/setSqlManagementSelectData',
      payload: sqlManageListData.data[0]
    });
  });

  it('change single priority when click row button', async () => {
    const request = sqlManage.getSqlManageList();
    superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getAllByText('变更优先级').length).toBe(1);
    fireEvent.click(screen.getAllByText('变更优先级')[0]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Change_SQL_Priority,
        status: true
      }
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlManagement/setSqlManagementSelectData',
      payload: sqlManageListData.data[0]
    });
  });

  it('click sql fingerprint and open sql audit result', async () => {
    const selectRecord = {
      ...sqlManageListData.data[0],
      sql: 'SELECT *',
      sql_fingerprint: 'SELECT *'
    };
    const request = sqlManage.getSqlManageList();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        ...sqlManageListData,
        data: [selectRecord]
      })
    );
    superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getAllByText('SELECT').length).toBe(2);
    fireEvent.click(screen.getAllByText('SELECT')[0]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlManagement/updateModalStatus',
      payload: {
        modalName: ModalName.View_Audit_Result_Drawer,
        status: true
      }
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlManagement/setSqlManagementSelectData',
      payload: selectRecord
    });
  });

  it('click sql and open sql audit result', async () => {
    const selectRecord = {
      ...sqlManageListData.data[0],
      sql: 'SELECT *',
      sql_fingerprint: 'SELECT *'
    };
    const request = sqlManage.getSqlManageList();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        ...sqlManageListData,
        data: [selectRecord]
      })
    );
    superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getAllByText('SELECT').length).toBe(2);
    fireEvent.click(screen.getAllByText('SELECT')[1]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlManagement/updateModalStatus',
      payload: {
        modalName: ModalName.View_Audit_Result_Drawer,
        status: true
      }
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlManagement/setSqlManagementSelectData',
      payload: selectRecord
    });
  });

  it('click audit result and open sql audit result', async () => {
    const request = sqlManage.getSqlManageList();
    superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllBySelector('.audit-result-wrapper').length).toBe(1);
    fireEvent.click(getAllBySelector('.audit-result-wrapper')[0]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlManagement/updateModalStatus',
      payload: {
        modalName: ModalName.View_Audit_Result_Drawer,
        status: true
      }
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlManagement/setSqlManagementSelectData',
      payload: sqlManageListData.data[0]
    });
  });

  it('render polling request when sql audit status is auditing', async () => {
    const request = sqlManage.getSqlManageList();
    request
      .mockImplementationOnce(() =>
        createSpySuccessResponse({
          data: [
            {
              ...sqlManageListData.data[sqlManageListData.data.length - 1]
            }
          ]
        })
      )
      .mockImplementationOnce(() =>
        createSpySuccessResponse({
          data: [sqlManageListData.data[0]]
        })
      );
    superRender(<SQLEEIndex />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledTimes(2);
  });

  it('render stop polling request when sql audit status is auditing', async () => {
    const request = sqlManage.getSqlManageList();
    request.mockImplementation(() =>
      createSpySuccessResponse({
        data: [sqlManageListData.data[0]]
      })
    );
    superRender(<SQLEEIndex />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledTimes(1);
  });

  it('render init request when url has instance and source params', async () => {
    useSearchParamsSpy.mockReturnValue([
      new URLSearchParams({
        instance_id: '123456',
        source: 'mysql_slow_log'
      })
    ]);
    const request = sqlManage.getSqlManageList();
    superRender(<SQLEEIndex />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledTimes(2);
    expect(request).toHaveBeenNthCalledWith(2, {
      page_index: 1,
      page_size: 20,
      project_name: mockProjectInfo.projectName,
      filter_instance_id: '123456',
      filter_source: 'mysql_slow_log',
      sort_field: undefined,
      sort_order: undefined,
      fuzzy_search_sql_fingerprint: '',
      filter_status: 'unhandled',
      filter_priority: 'high',
      filter_rule_name: undefined,
      filter_db_type: undefined,
      filter_assignee: undefined
    });
  });

  it('batch Batch push to other platforms', async () => {
    const request = sqlManage.getSqlManageList();
    superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('推送到其他平台').closest('button')).toBeDisabled();
    const batchCheckbox = getBySelector('.ant-table-thead .ant-checkbox-input');
    fireEvent.click(batchCheckbox);
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      screen.getByText('推送到其他平台').closest('button')
    ).not.toBeDisabled();
    fireEvent.click(screen.getByText('推送到其他平台'));
    expect(mockDispatch).toHaveBeenCalledTimes(5);
    expect(mockDispatch).toHaveBeenNthCalledWith(4, {
      type: 'sqlManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Push_To_Coding,
        status: true
      }
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(5, {
      type: 'sqlManagement/setSqlManagementBatchSelectData',
      payload: [sqlManageListData.data[0]]
    });
  });

  it('change push to other platforms when click row button', async () => {
    const request = sqlManage.getSqlManageList();
    superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getAllByText('推送到其他平台').length).toBe(2);
    expect(getAllBySelector('.more-button-item').length).toBe(5);
    fireEvent.click(getAllBySelector('.more-button-item')[4]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Push_To_Coding,
        status: true
      }
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'sqlManagement/setSqlManagementBatchSelectData',
      payload: [sqlManageListData.data[0]]
    });
  });

  it('render abnormal status audit plan tips when request return data', async () => {
    const request = sqlManage.getAbnormalInstanceAuditPlans();
    request.mockImplementation(() =>
      createSpySuccessResponse({ data: mockAbnormalInstanceAuditPlansData })
    );
    superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('.ant-alert-warning')).toBeInTheDocument();
  });
});
