import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import Router, { useNavigate } from 'react-router-dom';
import { baseSuperRender } from '../../../../testUtils/superRender';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import {
  baseMockApi,
  sqleMockApi,
  getBySelector,
  getAllBySelector,
  createSpyFailResponse,
  createSpySuccessResponse,
  mockUseCurrentProject,
  mockProjectInfo
} from '@actiontech/shared/lib/testUtil';
import UpdateDataSource from '.';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('page/DataSource/UpdateDataSource', () => {
  const navigateSpy = jest.fn();
  const projectID = mockProjectInfo.projectID;
  const uId = '1739531854064652288';
  let listEnvironmentTagsSpy: jest.SpyInstance;
  let checkDbServiceIsConnectableSpy: jest.SpyInstance;
  let updateDBServiceSpy: jest.SpyInstance;
  let getListDBServicesSpy: jest.SpyInstance;

  const customRender = () => {
    return baseSuperRender(<UpdateDataSource />, undefined, {
      routerProps: {
        initialEntries: [`/project/${projectID}/db-services/update/${uId}`]
      }
    });
  };

  beforeEach(() => {
    jest.useFakeTimers();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.spyOn(Router, 'useParams').mockReturnValue({
      dbServiceUid: uId
    });
    baseMockApi.global.mockAllApi();
    sqleMockApi.rule_template.mockAllApi();
    mockUseCurrentProject();
    listEnvironmentTagsSpy = baseMockApi.project.listEnvironmentTags();
    baseMockApi.project.getProjectList();
    updateDBServiceSpy = baseMockApi.global.UpdateDBService();
    checkDbServiceIsConnectableSpy =
      baseMockApi.dbServices.checkDbServiceIsConnectable();
    getListDBServicesSpy = baseMockApi.global.getListDBServices();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const mockDBListData = {
    total_nums: 1,
    data: [
      {
        uid: uId,
        name: 'mysql-1',
        db_type: 'mysql',
        host: '1.1.1.1',
        is_enable_masking: true,
        port: '33061',
        user: 'root',
        password: 'Zgl4cTg5xeIq9c/pkc8Y5A==',
        environment_tag: {
          uid: '1',
          name: 'environment-1'
        },
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
          }
        ],
        desc: 'desc cont',
        source: 'SQLE',
        project_uid: '700300',
        sqle_config: {
          audit_enabled: true,
          rule_template_name: 'default_MySQL',
          rule_template_id: '1',
          data_export_rule_template_id: '3',
          data_export_rule_template_name: 'default_MySQL1',
          sql_query_config: {
            max_pre_query_rows: 0,
            query_timeout_second: 0,
            audit_enabled: true,
            rule_template_name: 'default_MySQL',
            rule_template_id: '1',
            allow_query_when_less_than_audit_level: 'warn'
          }
        },
        additional_params: [
          {
            description: 'test_params',
            name: 'params_key',
            type: 'string',
            value: 'test'
          }
        ]
      }
    ]
  };

  it('render edit database snap', async () => {
    const { baseElement } = customRender();

    expect(screen.getByText('返回数据源列表')).toBeInTheDocument();
    expect(screen.getByText('编辑数据源')).toBeInTheDocument();
    expect(screen.getByText('提 交')).toBeInTheDocument();
    expect(screen.getByText('基础配置')).toBeInTheDocument();
    expect(screen.getByText('SQL审核配置')).toBeInTheDocument();

    expect(baseElement).toMatchSnapshot();
  });

  it('render prepare api', async () => {
    const requestRuleTemplateList =
      sqleMockApi.rule_template.getRuleTemplateTips();

    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(requestRuleTemplateList).toHaveBeenCalled();
    expect(getListDBServicesSpy).toHaveBeenCalled();
    expect(listEnvironmentTagsSpy).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('render edit data when has all value', async () => {
    checkDbServiceIsConnectableSpy.mockClear();
    checkDbServiceIsConnectableSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            component: 'sqle',
            is_connectable: true
          }
        ]
      })
    );
    getListDBServicesSpy.mockImplementationOnce(() =>
      createSpySuccessResponse(mockDBListData)
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));

    const updatePasswordLabel = getBySelector('label[title="更新连接密码"]');
    expect(updatePasswordLabel).not.toHaveClass('ant-form-item-required');
    const needUpdatePassword = getBySelector('#needUpdatePassword');
    fireEvent.click(needUpdatePassword);
    await act(async () => jest.advanceTimersByTime(300));
    expect(updatePasswordLabel).toHaveClass('ant-form-item-required');
    fireEvent.change(getBySelector('#password', baseElement), {
      target: { value: '123' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    // environment
    fireEvent.click(getBySelector('.editable-select-trigger', baseElement));
    await act(async () => jest.advanceTimersByTime(0));
    const firstOption = getAllBySelector('.ant-dropdown-menu-item')[0];
    fireEvent.click(firstOption);
    await act(async () => jest.advanceTimersByTime(0));

    // close needAuditForSqlQuery
    expect(getBySelector('#needAuditForSqlQuery')).toBeChecked();
    fireEvent.click(getBySelector('#needAuditForSqlQuery', baseElement));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getBySelector('#needAuditForSqlQuery')).not.toBeChecked();

    await act(async () => {
      fireEvent.click(screen.getByText('提 交'));
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(checkDbServiceIsConnectableSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(updateDBServiceSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText(`数据源"mysql-1"更新成功`)).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(800));
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(-1);
  });

  it('render update data when needUpdatePassword is false', async () => {
    getListDBServicesSpy.mockImplementationOnce(() =>
      createSpySuccessResponse(mockDBListData)
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));

    // environment
    fireEvent.click(getBySelector('.editable-select-trigger', baseElement));
    await act(async () => jest.advanceTimersByTime(0));
    const firstOption = getAllBySelector('.ant-dropdown-menu-item')[0];
    fireEvent.click(firstOption);
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateDBServiceSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText(`数据源"mysql-1"更新成功`)).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(800));
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(-1);
  });

  it('render connectable modal when service can not connect', async () => {
    getListDBServicesSpy.mockImplementationOnce(() =>
      createSpySuccessResponse(mockDBListData)
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));

    const updatePasswordLabel = getBySelector('label[title="更新连接密码"]');
    expect(updatePasswordLabel).not.toHaveClass('ant-form-item-required');
    const needUpdatePassword = getBySelector('#needUpdatePassword');
    fireEvent.click(needUpdatePassword);
    await act(async () => jest.advanceTimersByTime(300));
    expect(updatePasswordLabel).toHaveClass('ant-form-item-required');
    fireEvent.change(getBySelector('#password', baseElement), {
      target: { value: '123' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    await act(async () => {
      fireEvent.click(screen.getByText('测试数据源连通性'));
      await act(async () => jest.advanceTimersByTime(300));
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('provision: 链接失败')).toBeInTheDocument();
    expect(checkDbServiceIsConnectableSpy).toHaveBeenCalledTimes(1);
    await act(async () => {
      EventEmitter.emit(EmitterKey.Reset_Test_Data_Source_Connect);
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(screen.queryByText('provision: 链接失败')).not.toBeInTheDocument();
    // environment
    fireEvent.click(getBySelector('.editable-select-trigger', baseElement));
    await act(async () => jest.advanceTimersByTime(0));
    const firstOption = getAllBySelector('.ant-dropdown-menu-item')[0];
    fireEvent.click(firstOption);
    await act(async () => jest.advanceTimersByTime(0));

    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    await act(async () => {
      fireEvent.click(screen.getByText('提 交'));
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(checkDbServiceIsConnectableSpy).toHaveBeenCalledTimes(2);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(eventEmitSpy).toHaveBeenCalled();
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Submit_DataSource_Form
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('provision: 链接失败')).toBeInTheDocument();
    fireEvent.click(screen.getByText('继续提交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(updateDBServiceSpy).toHaveBeenCalledTimes(1);
  });

  it('render get default val error', async () => {
    getListDBServicesSpy.mockImplementationOnce(() =>
      createSpyFailResponse({})
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));

    expect(screen.getByText('重 试')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('重 试'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getListDBServicesSpy).toHaveBeenCalled();
  });

  it('return list by click return button', async () => {
    const { baseElement } = customRender();

    expect(screen.getByText('返回数据源列表')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('返回数据源列表'));
    await act(async () => jest.advanceTimersByTime(800));
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(-1);
  });
});
