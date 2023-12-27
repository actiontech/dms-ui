import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router-dom';
import { superRender } from '../../../../testUtils/customRender';
import { getAllBySelector, getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import dms from '../../../../testUtils/mockApi/global';
import { DBServicesList } from '../../../../testUtils/mockApi/global/data';
import {  mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { SupportTheme, SystemRole } from '@actiontech/shared/lib/enum';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

import DataSourceList from '.';

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
    expect(baseElement).toMatchSnapshot();
  });

  it('render list no permission', async () => {
    const { baseElement } = customRender({ role: '' });

    expect(screen.getByText('数据源列表')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render table for api return no data', async () => {
    const requestTableList = dms.getListDBServices();
    requestTableList.mockImplementationOnce(() =>
      createSpySuccessResponse({ total_nums: 0, data: [] })
    );
    const requestListDBServiceDriver = dms.getListDBServiceDriverOption();
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestListDBServiceDriver).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestTableList).toBeCalledTimes(2);
    expect(requestTableList).nthCalledWith(1, {
      fuzzy_keyword: '',
      page_index: 1,
      page_size: 20,
      project_uid: projectID
    });
    expect(baseElement).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestTableList).nthCalledWith(2, {
      page_size: 9999,
      project_uid: projectID
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render table for api has data', async () => {
    const requestTableList = dms.getListDBServices();

    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(requestTableList).nthCalledWith(1, {
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
    expect(requestTableList).toBeCalled();
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
    expect(requestTableList).toBeCalledWith({
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
    expect(filterItems.length).toBe(2);
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
                maintenance_start_time: {
                },
                maintenance_stop_time: {
                }
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
      expect(navigateSpy).toBeCalled();
      expect(navigateSpy).toBeCalledWith(
        `/project/${projectID}/db-services/update/${DBServicesList[0].uid}`
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
      await act(async () => jest.advanceTimersByTime(9300));

      const actionBtn = getAllBySelector(
        '.actiontech-table-actions-button',
        baseElement
      );
      fireEvent.click(actionBtn[1]);
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText(`确认删除数据源 "${DBServicesList[0].name}"?`));
      fireEvent.click(screen.getByText('确 认'));
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestDelDBService).toBeCalled();
      expect(requestDelDBService).toBeCalledWith({
        db_service_uid: DBServicesList[0].uid,
        project_uid: projectID
      });
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestTableList).toBeCalled();
    });
    
    it('render table for test connect action success', async () => {
      const requestTestConnect = dms.CheckDBServiceIsConnectable();
      requestTestConnect.mockImplementationOnce(() =>
        createSpySuccessResponse({
          connections: [{ is_connectable: true }]
        })
      );
      const requestTableList = dms.getListDBServices();
      requestTableList.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [DBServicesList[0]]
        })
      );

      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(9300));

      fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('测试数据库连通性')).toBeInTheDocument();
      fireEvent.click(screen.getByText('测试数据库连通性'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('正在尝试进行连接...')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestTestConnect).toBeCalled();
      expect(screen.getByText('数据库连通性测试成功')).toBeInTheDocument();
    });
    
    it('render table for test connect action error', async () => {
      const requestTestConnect = dms.CheckDBServiceIsConnectable();
      requestTestConnect.mockImplementationOnce(() =>
        createSpySuccessResponse({
          connections: [{ is_connectable: false, connect_error_message: 'error' }]
        })
      );
      const requestTableList = dms.getListDBServices();
      requestTableList.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [DBServicesList[0]]
        })
      );

      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(9300));

      fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('测试数据库连通性')).toBeInTheDocument();
      fireEvent.click(screen.getByText('测试数据库连通性'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('正在尝试进行连接...')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestTestConnect).toBeCalled();
      expect(baseElement).toMatchSnapshot();
    });
    
    it('render table for test connect action error no msg', async () => {
      const requestTestConnect = dms.CheckDBServiceIsConnectable();
      requestTestConnect.mockImplementationOnce(() =>
        createSpySuccessResponse({
          connections: [{ is_connectable: false }]
        })
      );
      const requestTableList = dms.getListDBServices();
      requestTableList.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [DBServicesList[0]]
        })
      );

      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(9300));

      fireEvent.click(getBySelector('.actiontech-table-actions-more-button'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('测试数据库连通性')).toBeInTheDocument();
      fireEvent.click(screen.getByText('测试数据库连通性'));
      await act(async () => jest.advanceTimersByTime(300));
      expect(screen.getByText('正在尝试进行连接...')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestTestConnect).toBeCalled();
      expect(baseElement).toMatchSnapshot();
    });
  });
});
