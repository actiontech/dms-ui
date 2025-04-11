import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router-dom';
import { superRender } from '../../../../testUtils/customRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import dms from '../../../../testUtils/mockApi/global';
import { DBServicesList } from '../../../../testUtils/mockApi/global/data';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { SupportTheme, SystemRole } from '@actiontech/shared/lib/enum';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import DataSourceList from '.';
import dbServices from '../../../../testUtils/mockApi/dbServices';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn()
  };
});

describe('page/DataSource/DataSourceList', () => {
  const projectID = mockProjectInfo.projectID;
  const navigateSpy = jest.fn();
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  let CheckProjectDBServicesConnectionsSpy: jest.SpyInstance;

  const customRender = (params = {}) => {
    return superRender(<DataSourceList />, undefined, {
      initStore: {
        user: {
          username: 'admin',
          role: SystemRole.admin,
          bindProjects: [
            {
              is_manager: true,
              project_name: 'default',
              project_id: projectID,
              archived: false
            },
            {
              is_manager: false,
              project_name: 'test',
              project_id: '2',
              archived: false
            }
          ],
          managementPermissions: [],
          theme: SupportTheme.LIGHT,
          uid: '500300',
          ...params
        },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: { is_admin: true, op_permission_list: [] }
        }
      },
      routerProps: {
        initialEntries: [`/project/${projectID}/db-services`]
      }
    });
  };
  beforeEach(() => {
    jest.useFakeTimers();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    useParamsMock.mockReturnValue({ projectID });
    dms.mockAllApi();
    dbServices.ListDBServicesTips();
    CheckProjectDBServicesConnectionsSpy =
      dbServices.CheckProjectDBServicesConnections();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render list snap', async () => {
    const { baseElement } = customRender();

    expect(screen.getByText('数据源列表')).toBeInTheDocument();
    expect(screen.getByText('添加数据源')).toBeInTheDocument();
    expect(screen.getByText('批量导入数据源')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render list no permission', async () => {
    const { baseElement } = customRender({ role: '', bindProjects: [] });
    expect(screen.queryByText('添加数据源')).not.toBeInTheDocument();
    expect(screen.queryByText('批量导入数据源')).not.toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    cleanup();
    customRender({ role: '' });
    expect(screen.getByText('添加数据源')).toBeInTheDocument();
    expect(screen.getByText('批量导入数据源')).toBeInTheDocument();

    cleanup();
    customRender({ bindProjects: [] });
    expect(screen.getByText('添加数据源')).toBeInTheDocument();
    expect(screen.getByText('批量导入数据源')).toBeInTheDocument();
  });

  it('render table for api return no data', async () => {
    const requestTableList = dms.getListDBServices();
    const dbServiceTips = dbServices.ListDBServicesTips();
    requestTableList.mockImplementationOnce(() =>
      createSpySuccessResponse({ total_nums: 0, data: [] })
    );
    const requestListDBServiceDriver = dms.getListDBServiceDriverOption();
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestListDBServiceDriver).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(dbServiceTips).toHaveBeenCalledTimes(1);
    expect(dbServiceTips).toHaveBeenNthCalledWith(1, {
      project_uid: projectID
    });
    expect(requestTableList).toHaveBeenCalledTimes(1);
    expect(requestTableList).toHaveBeenNthCalledWith(1, {
      fuzzy_keyword: '',
      page_index: 1,
      page_size: 20,
      project_uid: projectID
    });
    expect(baseElement).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
  });

  it('render table for api has data', async () => {
    const requestTableList = dms.getListDBServices();

    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(requestTableList).toHaveBeenNthCalledWith(1, {
      fuzzy_keyword: '',
      page_index: 1,
      page_size: 20,
      project_uid: projectID
    });
    expect(
      screen.getByText(`共 ${DBServicesList.length} 条数据`)
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    const refreshIcon = getBySelector('.custom-icon-refresh', baseElement);
    fireEvent.click(refreshIcon);
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestTableList).toHaveBeenCalled();
  });

  it('render table for filter input', async () => {
    const requestTableList = dms.getListDBServices();

    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));

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
    expect(requestTableList).toHaveBeenCalledWith({
      fuzzy_keyword: 'fuzzy_keyword_text',
      page_index: 1,
      page_size: 20,
      project_uid: projectID
    });
  });

  it('render table filter option val', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(6300));

    expect(screen.getByText(`筛选`)).toBeInTheDocument();
    expect(
      screen.getByText(`共 ${DBServicesList.length} 条数据`)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('筛选'));
    await act(async () => jest.advanceTimersByTime(300));
    const filterItems = getAllBySelector(
      '.actiontech-table-filter-container-namespace .ant-space-item',
      baseElement
    );
    expect(filterItems.length).toBe(5);
    expect(baseElement).toMatchSnapshot();
  });

  it('render table for column val', async () => {
    const requestTableList = dms.getListDBServices();
    requestTableList.mockImplementationOnce(() =>
      createSpySuccessResponse({
        total_nums: 1,
        data: [
          {
            uid: '1739531854064652288',
            name: 'mysql-1',
            db_type: '',
            host: '',
            port: '33061',
            user: 'root',
            password: 'Zgl4cTg5xeIq9c/pkc8Y5A==',
            business: 'test',
            maintenance_times: [
              {
                maintenance_start_time: {
                  hour: '1',
                  minute: '1'
                },
                maintenance_stop_time: {
                  hour: '9',
                  minute: '9'
                }
              },
              {
                maintenance_start_time: {},
                maintenance_stop_time: {}
              }
            ],
            desc: 'desc cont',
            source: 'SQLE',
            project_uid: '700300',
            sqle_config: {
              rule_template_name: 'default_MySQL',
              rule_template_id: '1',
              sql_query_config: {
                max_pre_query_rows: 0,
                query_timeout_second: 0,
                audit_enabled: false
              }
            }
          }
        ]
      })
    );

    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(baseElement).toMatchSnapshot();
  });

  it('render table by filter enable masking', async () => {
    const requestTableList = dms.getListDBServices();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(6300));
    expect(requestTableList).toHaveBeenCalled();
    expect(screen.getByText(`筛选`)).toBeInTheDocument();
    expect(
      screen.getByText(`共 ${DBServicesList.length} 条数据`)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('筛选'));
    await act(async () => jest.advanceTimersByTime(300));
    const filterItems = getAllBySelector(
      '.actiontech-table-filter-container-namespace .ant-space-item',
      baseElement
    );
    expect(filterItems.length).toBe(5);
    expect(baseElement).toMatchSnapshot();
    const enableFilterElement = getBySelector('input', filterItems[4]);
    fireEvent.mouseDown(enableFilterElement);
    const selectOptions = getAllBySelector('.ant-select-item-option');
    await act(async () => {
      fireEvent.click(selectOptions[0]);
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(requestTableList).toHaveBeenCalledWith({
      page_index: 1,
      page_size: 20,
      project_uid: '700300',
      fuzzy_keyword: '',
      is_enable_masking: true
    });
  });

  it('should display an error message and return if dataSourceList is empty or undefined', async () => {
    const requestTableList = dms.getListDBServices();
    requestTableList.mockImplementation(() =>
      createSpySuccessResponse({ data: [] })
    );
    customRender();

    await act(async () => jest.advanceTimersByTime(6300));

    fireEvent.click(screen.getByText('批量测试数据源连通性'));
    expect(CheckProjectDBServicesConnectionsSpy).toHaveBeenCalledTimes(0);
    expect(screen.getByText('当前列表无数据！')).toBeInTheDocument();
  });

  it('should initiate the connection test and call DBService.CheckProjectDBServicesConnections when dataSourceList has valid data sources', async () => {
    const requestTableList = dms.getListDBServices();
    customRender();

    await act(async () => jest.advanceTimersByTime(6300));

    fireEvent.click(screen.getByText('批量测试数据源连通性'));
    expect(CheckProjectDBServicesConnectionsSpy).toHaveBeenCalledTimes(1);
    expect(CheckProjectDBServicesConnectionsSpy).toHaveBeenCalledWith({
      project_uid: projectID,
      db_services: DBServicesList.map((v) => ({
        db_service_uid: v.uid!
      }))
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestTableList).toHaveBeenCalledTimes(2);
    expect(
      screen.getByText('执行批量测试数据源连通性成功！')
    ).toBeInTheDocument();
  });

  describe('render table for action btn', () => {
    it('render table for edit action', async () => {
      const requestTableList = dms.getListDBServices();
      requestTableList.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [DBServicesList[0]]
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
        `/project/${projectID}/db-services/update/${DBServicesList[0].uid}`
      );
    });

    it('render table for enabled audit plan action', async () => {
      const requestTableList = dms.getListDBServices();
      requestTableList.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: DBServicesList
        })
      );

      customRender();
      await act(async () => jest.advanceTimersByTime(3000));

      fireEvent.click(
        getAllBySelector('.actiontech-table-actions-more-button')[0]
      );
      await act(async () => jest.advanceTimersByTime(0));

      fireEvent.click(screen.getAllByText('为数据源开启扫描任务')[0]);
      expect(navigateSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledWith(
        `/sqle/project/${projectID}/sql-management-conf/update/${DBServicesList[0].instance_audit_plan_id}`
      );

      fireEvent.click(
        getAllBySelector('.actiontech-table-actions-more-button')[1]
      );
      fireEvent.click(screen.getAllByText('为数据源开启扫描任务')[1]);
      expect(navigateSpy).toHaveBeenCalledTimes(2);
      expect(navigateSpy).toHaveBeenNthCalledWith(
        2,
        `/sqle/project/${projectID}/sql-management-conf/create?instance_id=${DBServicesList[1].uid}&environment_tag=${DBServicesList[1].environment_tag?.uid}`
      );
    });

    it('render table for del action', async () => {
      const requestDelDBService = dms.DelDBService();
      const requestTableList = dms.getListDBServices();
      requestTableList.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [DBServicesList[0]]
        })
      );

      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(3000));

      const actionBtn = getAllBySelector(
        '.actiontech-table-actions-button',
        baseElement
      );
      fireEvent.click(actionBtn[1]);
      await act(async () => jest.advanceTimersByTime(0));
      expect(screen.getByText(`确认删除数据源 "${DBServicesList[0].name}"?`));
      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestDelDBService).toHaveBeenCalled();
      expect(requestDelDBService).toHaveBeenCalledWith({
        db_service_uid: DBServicesList[0].uid,
        project_uid: projectID
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestTableList).toHaveBeenCalled();
    });

    it('render table for test connect action success', async () => {
      const requestTestConnect = dms.CheckDBServiceIsConnectable();
      requestTestConnect.mockImplementationOnce(() =>
        createSpySuccessResponse({
          data: [{ is_connectable: true }]
        })
      );
      const requestTableList = dms.getListDBServices();
      requestTableList.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [DBServicesList[0]]
        })
      );

      customRender();
      expect(requestTableList).toHaveBeenCalledTimes(1);
      await act(async () => jest.advanceTimersByTime(3000));

      fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
      await act(async () => jest.advanceTimersByTime(0));
      expect(screen.getByText('测试数据源连通性')).toBeInTheDocument();
      fireEvent.click(screen.getByText('测试数据源连通性'));
      await act(async () => jest.advanceTimersByTime(0));
      expect(screen.getByText('正在尝试进行连接...')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestTableList).toHaveBeenCalledTimes(2);
      expect(requestTestConnect).toHaveBeenCalled();
      expect(screen.getByText('数据源连通性测试成功')).toBeInTheDocument();
    });

    it('render table for test connect action error', async () => {
      const requestTestConnect = dms.CheckDBServiceIsConnectable();
      requestTestConnect.mockImplementationOnce(() =>
        createSpySuccessResponse({
          data: [{ is_connectable: false, connect_error_message: 'error' }]
        })
      );
      const requestTableList = dms.getListDBServices();
      requestTableList.mockImplementation(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [DBServicesList[0]]
        })
      );

      const { baseElement } = customRender();
      expect(requestTableList).toHaveBeenCalledTimes(1);
      await act(async () => jest.advanceTimersByTime(3000));

      fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('测试数据源连通性')).toBeInTheDocument();
      fireEvent.click(screen.getByText('测试数据源连通性'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('正在尝试进行连接...')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestTableList).toHaveBeenCalledTimes(2);
      await act(async () => jest.advanceTimersByTime(3000));
      expect(baseElement).toMatchSnapshot();
    });

    it('render table for test connect action error no msg', async () => {
      const requestTestConnect = dms.CheckDBServiceIsConnectable();
      requestTestConnect.mockImplementationOnce(() =>
        createSpySuccessResponse({
          data: [{ is_connectable: false }]
        })
      );
      const requestTableList = dms.getListDBServices();
      requestTableList.mockImplementation(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [DBServicesList[0]]
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
      expect(requestTestConnect).toHaveBeenCalled();
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));
      expect(baseElement).toMatchSnapshot();
    });

    it('render table for only have test connect button', async () => {
      const requestTableList = dms.getListDBServices();
      const { baseElement } = customRender({
        bindProjects: [
          {
            is_manager: true,
            project_name: 'default',
            project_id: projectID,
            archived: true
          }
        ]
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestTableList).toHaveBeenCalled();
      expect(screen.getAllByText('测试数据源连通性').length).toBe(2);
      expect(baseElement).toMatchSnapshot();
    });
  });
});
