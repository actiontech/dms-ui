import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import SQLEEIndex from '.';
import { superRender } from '../../../../testUtils/customRender';
import sqlManage from '../../../../testUtils/mockApi/sqlManage';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseProjectBusinessTips } from '@actiontech/shared/lib/testUtil/mockHook/mockUseProjectBusinessTips';
import { useDispatch, useSelector } from 'react-redux';
import { driverMeta } from '../../../../hooks/useDatabaseType/index.test.data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { sqlManageListData } from '../../../../testUtils/mockApi/sqlManage/data';
import {
  getAllBySelector,
  getBySelector
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

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
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
        }
      });
    });
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
      filter_assignee: mockCurrentUserReturn.uid
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
      filter_priority: GetSqlManageListV2FilterPriorityEnum.hight
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
        filter_assignee: mockCurrentUserReturn.uid,
        filter_priority: exportSqlManageV1FilterPriorityEnum.hight
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
    expect(mockDispatch).toHaveBeenCalledTimes(3);
    expect(mockDispatch).toHaveBeenNthCalledWith(2, {
      type: 'sqlManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Assignment_Member_Batch,
        status: true
      }
    });
    expect(mockDispatch).toHaveBeenNthCalledWith(3, {
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
    expect(mockDispatch).toHaveBeenCalledTimes(1);
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
    expect(screen.getAllByText('分 析').length).toBe(1);
    fireEvent.click(screen.getAllByText('分 析')[0]);
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

  it('render table for not admin', async () => {
    mockUseCurrentUser({ isAdmin: false });
    const request = sqlManage.getSqlManageList();
    const { baseElement } = superRender(<SQLEEIndex />);
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
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
});
