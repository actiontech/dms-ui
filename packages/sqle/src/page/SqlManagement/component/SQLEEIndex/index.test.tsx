import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import SQLEEIndex from '.';
import { superRender } from '../../../../testUtils/customRender';
import sqlManage from '../../../../testUtils/mockApi/sqlManage';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
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
  mockProjectInfo,
  mockUserInfo
} from '@actiontech/shared/lib/testUtil/mockHook/data';
import instance from '../../../../testUtils/mockApi/instance';
import { ModalName } from '../../../../data/ModalName';

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
    jest.useFakeTimers();
    instance.mockAllApi();
    sqlManage.mockAllApi();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        database: { driverMeta: driverMeta },
        sqleManagement: {
          modalStatus: {}
        }
      });
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  // it('render table data', async () => {
  //   const request = sqlManage.getSqlManageList();
  //   const { baseElement } = superRender(<SQLEEIndex />);
  //   expect(request).toBeCalled();
  //   expect(baseElement).toMatchSnapshot();
  // });

  // it('render sql statics data', async () => {
  //   const request = sqlManage.getSqlManageList();
  //   request.mockImplementation(() =>
  //     createSpySuccessResponse({
  //       ...sqlManageListData,
  //       sql_manage_bad_num: undefined,
  //       sql_manage_optimized_num: undefined,
  //       sql_manage_total_num: undefined
  //     })
  //   );
  //   const { baseElement } = superRender(<SQLEEIndex />);
  //   expect(request).toBeCalled();
  //   expect(baseElement).toMatchSnapshot();
  //   expect(screen.getAllByText('0').length).toBe(3);
  //   expect(screen.getAllByText('0')?.[0]).toHaveClass('total');
  // });

  // it('filter data with rule name and about myself', async () => {
  //   const request = sqlManage.getSqlManageList();
  //   const ruleTipsRequest = sqlManage.getSqlManageRuleTips();
  //   const instanceTipsRequest = instance.getInstanceTipList();
  //   const { baseElement } = superRender(<SQLEEIndex />);
  //   expect(request).toBeCalled();
  //   expect(ruleTipsRequest).toBeCalled();
  //   expect(instanceTipsRequest).toBeCalled();
  //   expect(baseElement).toMatchSnapshot();
  //   expect(screen.getByText('筛选')).toBeInTheDocument();
  //   fireEvent.click(screen.getByText('筛选'));
  //   expect(screen.getByText('审核规则')).toBeInTheDocument();
  //   const searchInput = getAllBySelector('.ant-select-selection-search-input');
  //   fireEvent.mouseDown(searchInput[searchInput.length - 1]);
  //   await act(async () => jest.advanceTimersByTime(3000));
  //   expect(baseElement).toMatchSnapshot();
  //   const options = getAllBySelector('.ant-select-item-option');
  //   expect(options.length).toBe(2);
  //   await act(async () => {
  //     fireEvent.click(options[0]);
  //     await act(async () => jest.advanceTimersByTime(3000));
  //   });
  //   await act(async () => jest.advanceTimersByTime(3000));
  //   await act(async () => jest.advanceTimersByTime(3000));
  //   await act(async () => jest.advanceTimersByTime(3000));
  //   expect(request).toBeCalledWith({
  //     ...requestParams,
  //     filter_db_type: 'MySQL',
  //     filter_rule_name: 'test'
  //   });
  //   expect(screen.getByText('与我相关')).toBeInTheDocument();
  //   fireEvent.click(screen.getByText('与我相关'));
  //   expect(request).toBeCalledWith({
  //     ...requestParams,
  //     filter_db_type: 'MySQL',
  //     filter_rule_name: 'test',
  //     filter_assignee: mockCurrentUserReturn.uid
  //   });
  // });

  // it('filter data with status, sort and export data', async () => {
  //   const request = sqlManage.getSqlManageList();
  //   const ruleTipsRequest = sqlManage.getSqlManageRuleTips();
  //   const instanceTipsRequest = instance.getInstanceTipList();
  //   const exportRequest = sqlManage.exportSqlManage();
  //   const { baseElement } = superRender(<SQLEEIndex />);
  //   expect(request).toBeCalled();
  //   expect(ruleTipsRequest).toBeCalled();
  //   expect(instanceTipsRequest).toBeCalled();
  //   expect(baseElement).toMatchSnapshot();
  //   expect(screen.getByText('已解决')).toBeInTheDocument();
  //   fireEvent.click(screen.getByText('已解决'));
  //   await act(async () => jest.advanceTimersByTime(3000));
  //   expect(request).toBeCalledWith({
  //     ...requestParams,
  //     filter_status: 'solved'
  //   });

  //   const sortButtons = getAllBySelector('.ant-table-column-sorter');
  //   expect(sortButtons.length).toBe(3);
  //   fireEvent.click(sortButtons[sortButtons.length - 1]);
  //   expect(request).toBeCalledWith({
  //     ...requestParams,
  //     filter_status: 'solved',
  //     sort_field: 'fp_count',
  //     sort_order: 'desc'
  //   });

  //   expect(screen.getByText('导出')).toBeInTheDocument();
  //   fireEvent.click(screen.getByText('导出'));
  //   expect(exportRequest).toBeCalledWith(
  //     {
  //       ...exportParams,
  //       filter_status: 'solved'
  //     },
  //     {
  //       responseType: 'blob'
  //     }
  //   );
  // });

  it('batch operation for sql', async () => {
    const request = sqlManage.getSqlManageList();
    const ruleTipsRequest = sqlManage.getSqlManageRuleTips();
    const instanceTipsRequest = instance.getInstanceTipList();
    const batchRequest = sqlManage.batchUpdateSqlManage();
    const { baseElement } = superRender(<SQLEEIndex />);
    expect(request).toBeCalled();
    expect(ruleTipsRequest).toBeCalled();
    expect(instanceTipsRequest).toBeCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    const batchCheckbox = getBySelector('.ant-table-thead .ant-checkbox-input');
    expect(batchCheckbox).toBeInTheDocument();
    fireEvent.click(batchCheckbox);
    await act(async () => jest.advanceTimersByTime(3000));
    const actionButtons = getAllBySelector('.actiontech-table-actions-button');
    fireEvent.click(actionButtons[1]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(mockDispatch).toBeCalledWith({
      type: 'sqleManagement/updateModalStatus',
      payload: {
        modalName: ModalName.Assignment_Member_Batch,
        status: true
      }
    });
    // await act(async () => jest.advanceTimersByTime(3000));
    expect(mockDispatch).toBeCalledWith({
      type: 'sqleManagement/updateSqlIdList',
      payload: sqlManageListData.data
    });

    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('取 消'));
    fireEvent.click(actionButtons[2]);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText('是否确认将所选SQL设为已解决?')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(3000));
    const idData = sqlManageListData.data.map((item) => item.id);
    expect(batchRequest).toBeCalledWith({
      project_name: mockProjectInfo.projectName,
      status: 'solved',
      sql_manage_id_list: idData
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toBeCalled();
  });
});
