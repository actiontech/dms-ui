import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import {
  mockCurrentUserReturn,
  mockProjectInfo
} from '@actiontech/shared/lib/testUtil/mockHook/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import GlobalDataSourceList from '../';
import dms from '../../../../testUtils/mockApi/global';
import dbServices from '../../../../testUtils/mockApi/dbServices';
import { globalDataSourceMockData } from '../../../../testUtils/mockApi/dbServices/data';
import project from '../../../../testUtils/mockApi/project';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { SystemRole } from '@actiontech/shared/lib/enum';
import eventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn()
  };
});

describe('page/GlobalDataSource/List', () => {
  const projectID = mockProjectInfo.projectID;
  const navigateSpy = jest.fn();
  let listGlobalDBServicesSpy: jest.SpyInstance;
  let getProjectListSpy: jest.SpyInstance;
  let listGlobalDBServicesTipsSpy: jest.SpyInstance;
  let CheckGlobalDBServicesConnectionsSpy: jest.SpyInstance;

  const customRender = () => {
    return superRender(<GlobalDataSourceList />);
  };

  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    listGlobalDBServicesSpy = dbServices.listGlobalDBServices();
    listGlobalDBServicesTipsSpy = dbServices.listGlobalDBServicesTips();
    getProjectListSpy = project.getProjectList();
    CheckGlobalDBServicesConnectionsSpy =
      project.CheckGlobalDBServicesConnections();

    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
    dms.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render list snap', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listGlobalDBServicesSpy).toHaveBeenCalledTimes(1);
    expect(listGlobalDBServicesTipsSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();

    expect(
      screen.getByText(`共 ${globalDataSourceMockData.length} 条数据`)
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render table for api return no data', async () => {
    listGlobalDBServicesSpy.mockImplementationOnce(() =>
      createSpySuccessResponse({ total_nums: 0, data: [] })
    );
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(listGlobalDBServicesSpy).toHaveBeenCalledTimes(1);
    expect(listGlobalDBServicesSpy).toHaveBeenNthCalledWith(1, {
      fuzzy_keyword: '',
      page_index: 1,
      page_size: 20
    });
    expect(getProjectListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });

  it('render table for filter input', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    const searchInputEle = getBySelector(
      '#actiontech-table-search-input',
      baseElement
    );
    fireEvent.change(searchInputEle, {
      target: {
        value: 'fuzzy_keyword_text'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(searchInputEle).toHaveValue('fuzzy_keyword_text');

    fireEvent.click(getBySelector('.custom-icon-search'));
    await act(async () => jest.advanceTimersByTime(3200));
    expect(listGlobalDBServicesSpy).toHaveBeenCalledWith({
      fuzzy_keyword: 'fuzzy_keyword_text',
      page_index: 1,
      page_size: 20
    });
  });

  it('render table filter option val', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(6300));

    expect(screen.getByText(`筛选`)).toBeInTheDocument();

    fireEvent.click(screen.getByText('筛选'));
    await act(async () => jest.advanceTimersByTime(300));
    const filterItems = getAllBySelector(
      '.actiontech-table-filter-container-namespace .ant-space-item',
      baseElement
    );
    expect(filterItems.length).toBe(3);
    expect(baseElement).toMatchSnapshot();
  });

  it('should display an error message and return if dataSourceList is empty or undefined', async () => {
    listGlobalDBServicesSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [] })
    );
    customRender();

    await act(async () => jest.advanceTimersByTime(3000));

    act(() => {
      eventEmitter.emit(EmitterKey.DMS_Batch_Test_Data_Source_Connection);
    });

    expect(CheckGlobalDBServicesConnectionsSpy).toHaveBeenCalledTimes(0);

    await screen.findByText('当前列表无数据！');
  });

  it('should initiate the connection test and call DBService.CheckProjectDBServicesConnections when dataSourceList has valid data sources', async () => {
    customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    act(() => {
      eventEmitter.emit(EmitterKey.DMS_Batch_Test_Data_Source_Connection);
    });

    expect(CheckGlobalDBServicesConnectionsSpy).toHaveBeenCalledTimes(1);
    expect(CheckGlobalDBServicesConnectionsSpy).toHaveBeenCalledWith({
      db_services: globalDataSourceMockData.map((v) => ({
        db_service_uid: v.uid!
      }))
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(listGlobalDBServicesSpy).toHaveBeenCalledTimes(2);
    await screen.findByText('执行批量测试数据源连通性成功！');
  });

  describe('render table for action btn', () => {
    it('render table for edit action', async () => {
      listGlobalDBServicesSpy.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [globalDataSourceMockData[0]]
        })
      );

      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(9300));

      const actionBtn = getAllBySelector(
        '.actiontech-table-actions-button',
        baseElement
      );
      expect(actionBtn.length).toBe(3);
      // edit
      fireEvent.click(actionBtn[0]);
      await act(async () => jest.advanceTimersByTime(300));
      expect(navigateSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalledWith(
        `/project/${projectID}/db-services/update/${globalDataSourceMockData[0].uid}`
      );
    });

    it('render table for del action', async () => {
      const requestDelDBServiceSpy = dms.DelDBService();
      listGlobalDBServicesSpy.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [globalDataSourceMockData[0]]
        })
      );

      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(9300));

      const actionBtn = getAllBySelector(
        '.actiontech-table-actions-button',
        baseElement
      );
      fireEvent.click(actionBtn[1]);
      await act(async () => jest.advanceTimersByTime(300));
      expect(
        screen.getByText(
          `确认删除数据源 "${globalDataSourceMockData[0].name}"?`
        )
      );
      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestDelDBServiceSpy).toHaveBeenCalled();
      expect(requestDelDBServiceSpy).toHaveBeenCalledWith({
        db_service_uid: globalDataSourceMockData[0].uid,
        project_uid: globalDataSourceMockData[0].project_uid
      });
      await act(async () => jest.advanceTimersByTime(3300));
      expect(listGlobalDBServicesSpy).toHaveBeenCalled();
    });

    it('render table for test connect action success', async () => {
      const requestTestConnectSpy = dms.CheckDBServiceIsConnectable();
      requestTestConnectSpy.mockImplementationOnce(() =>
        createSpySuccessResponse({
          data: [{ is_connectable: true }]
        })
      );
      listGlobalDBServicesSpy.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [globalDataSourceMockData[0]]
        })
      );

      customRender();
      await act(async () => jest.advanceTimersByTime(9300));

      fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('测试数据源连通性')).toBeInTheDocument();
      fireEvent.click(screen.getByText('测试数据源连通性'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('正在尝试进行连接...')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestTestConnectSpy).toHaveBeenCalled();
      expect(screen.getByText('数据源连通性测试成功')).toBeInTheDocument();
    });

    it('render table for test connect action error', async () => {
      const requestTestConnectSpy = dms.CheckDBServiceIsConnectable();
      requestTestConnectSpy.mockImplementationOnce(() =>
        createSpySuccessResponse({
          data: [{ is_connectable: false, connect_error_message: 'error' }]
        })
      );
      listGlobalDBServicesSpy.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [globalDataSourceMockData[0]]
        })
      );

      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(9300));

      fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('测试数据源连通性')).toBeInTheDocument();
      fireEvent.click(screen.getByText('测试数据源连通性'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('正在尝试进行连接...')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestTestConnectSpy).toHaveBeenCalled();
      expect(baseElement).toMatchSnapshot();
    });

    it('render table for test connect action error no msg', async () => {
      const requestTestConnectSpy = dms.CheckDBServiceIsConnectable();
      requestTestConnectSpy.mockImplementationOnce(() =>
        createSpySuccessResponse({
          data: [{ is_connectable: false }]
        })
      );
      listGlobalDBServicesSpy.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [globalDataSourceMockData[0]]
        })
      );

      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(9300));

      fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('测试数据源连通性')).toBeInTheDocument();
      fireEvent.click(screen.getByText('测试数据源连通性'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('正在尝试进行连接...')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestTestConnectSpy).toHaveBeenCalled();
      expect(baseElement).toMatchSnapshot();
    });

    it('should not render action when user is not admin and not project manager', async () => {
      mockUseCurrentUser({
        userRoles: {
          ...mockCurrentUserReturn.userRoles,
          [SystemRole.admin]: false,
          [SystemRole.globalManager]: false,
          [SystemRole.certainProjectManager]: false
        }
      });
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(9300));

      expect(baseElement).toMatchSnapshot();
      expect(screen.queryAllByText('编 辑')).toHaveLength(0);
      expect(screen.queryAllByText('删 除')).toHaveLength(0);
    });
  });
});
