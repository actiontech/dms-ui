import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { baseSuperRender } from '../../../../testUtils/superRender';
import {
  baseMockApi,
  sqleMockApi,
  createSpySuccessResponse,
  mockUseCurrentProject,
  mockProjectInfo,
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import { mockProjectList } from '@actiontech/shared/lib/testUtil/mockApi/base/project/data';
import AddDataSource from '.';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('page/DataSource/AddDataSource', () => {
  const navigateSpy = jest.fn();
  const projectID = mockProjectInfo.projectID;
  let getProjectListSpy: jest.SpyInstance;
  let requestAddDBServiceSpy: jest.SpyInstance;
  let getSystemModuleStatusSpy: jest.SpyInstance;
  let checkDbServiceIsConnectableSpy: jest.SpyInstance;

  const customRender = () => {
    return baseSuperRender(<AddDataSource />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    baseMockApi.global.mockAllApi();
    getProjectListSpy = baseMockApi.project.getProjectList();
    baseMockApi.project.listEnvironmentTags();

    requestAddDBServiceSpy = baseMockApi.global.AddDBService();
    getSystemModuleStatusSpy = sqleMockApi.system.getSystemModuleStatus();

    checkDbServiceIsConnectableSpy =
      baseMockApi.dbServices.checkDbServiceIsConnectable();
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
    sqleMockApi.rule_template.mockAllApi();
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render add database snap', async () => {
    const { baseElement } = customRender();

    expect(screen.getByText('返回数据源列表')).toBeInTheDocument();
    expect(screen.getByText('重 置')).toBeInTheDocument();
    expect(screen.getByText('提 交')).toBeInTheDocument();
    expect(screen.getByText('基础配置')).toBeInTheDocument();
    expect(screen.getByText('SQL审核配置')).toBeInTheDocument();

    expect(baseElement).toMatchSnapshot();
  });

  it('render submit when add database api success', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(getBySelector('#project')).toBeDisabled();

    // name
    fireEvent.change(getBySelector('#name', baseElement), {
      target: {
        value: 'name-database'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
    // - type
    fireEvent.mouseDown(getBySelector('#type', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    expect(getSystemModuleStatusSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(2700));
    // - ip
    await act(async () => {
      fireEvent.change(getBySelector('#ip', baseElement), {
        target: {
          value: '1.1.1.1'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
    });
    // - user
    await act(async () => {
      fireEvent.change(getBySelector('#user', baseElement), {
        target: {
          value: 'root'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
    });
    // password
    fireEvent.change(getBySelector('#password', baseElement), {
      target: {
        value: 'root'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
    // environment
    fireEvent.click(getBySelector('.editable-select-trigger', baseElement));
    await act(async () => jest.advanceTimersByTime(0));
    const firstOption = getAllBySelector('.ant-dropdown-menu-item')[0];
    fireEvent.click(firstOption);
    await act(async () => jest.advanceTimersByTime(0));

    // ruleTemplateName
    fireEvent.mouseDown(getBySelector('#ruleTemplateName', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(
      getBySelector('div[title="custom_template_b"]', baseElement)
    );
    await act(async () => jest.advanceTimersByTime(300));
    // submit
    await act(async () => {
      fireEvent.click(screen.getByText('提 交'));
    });

    expect(checkDbServiceIsConnectableSpy).toHaveBeenCalledTimes(1);
    expect(checkDbServiceIsConnectableSpy).toHaveBeenNthCalledWith(1, {
      db_service: {
        db_type: 'mysql',
        host: '1.1.1.1',
        user: 'root',
        password: 'root',
        port: '3306',
        additional_params: [
          {
            name: 'cc',
            value: ''
          }
        ]
      },
      project_uid: projectID
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestAddDBServiceSpy).toHaveBeenCalled();
    expect(requestAddDBServiceSpy).toHaveBeenCalledWith({
      db_service: {
        additional_params: [
          {
            name: 'cc',
            value: ''
          }
        ],
        environment_tag_uid: '1',
        db_type: 'mysql',
        desc: undefined,
        host: '1.1.1.1',
        is_enable_masking: false,
        maintenance_times: [],
        name: 'name-database',
        password: 'root',
        port: '3306',
        sqle_config: {
          rule_template_id: '2',
          rule_template_name: 'custom_template_b',
          sql_query_config: {
            allow_query_when_less_than_audit_level: undefined,
            audit_enabled: undefined
          }
        },
        user: 'root'
      },
      project_uid: projectID
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('添加数据源成功')).toBeInTheDocument();
    expect(screen.getByText('关闭并重置表单')).toBeInTheDocument();
    fireEvent.click(screen.getByText('关闭并重置表单'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('添加数据源')).toBeInTheDocument();
  });

  it('render conenctable modal when current service can not connect', async () => {
    checkDbServiceIsConnectableSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            component: 'sqle',
            is_connectable: false,
            connect_error_message: '链接错误'
          }
        ]
      })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(getBySelector('#project')).toBeDisabled();

    // name
    fireEvent.change(getBySelector('#name', baseElement), {
      target: {
        value: 'name-database'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
    // - type
    fireEvent.mouseDown(getBySelector('#type', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    expect(getSystemModuleStatusSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(2700));
    // - ip
    await act(async () => {
      fireEvent.change(getBySelector('#ip', baseElement), {
        target: {
          value: '1.1.1.1'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
    });
    // - user
    await act(async () => {
      fireEvent.change(getBySelector('#user', baseElement), {
        target: {
          value: 'root'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
    });
    // password
    fireEvent.change(getBySelector('#password', baseElement), {
      target: {
        value: 'root'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
    // environment
    fireEvent.click(getBySelector('.editable-select-trigger', baseElement));
    await act(async () => jest.advanceTimersByTime(0));
    const firstOption = getAllBySelector('.ant-dropdown-menu-item')[0];
    fireEvent.click(firstOption);
    await act(async () => jest.advanceTimersByTime(0));

    // ruleTemplateName
    fireEvent.mouseDown(getBySelector('#ruleTemplateName', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(
      getBySelector('div[title="custom_template_b"]', baseElement)
    );
    await act(async () => jest.advanceTimersByTime(300));
    // submit
    await act(async () => {
      fireEvent.click(screen.getByText('提 交'));
    });

    expect(checkDbServiceIsConnectableSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('sqle: 链接错误')).toBeInTheDocument();
  });

  it('render submit when projectID is undefined', async () => {
    mockUseCurrentProject({ projectID: undefined });
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');

    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(getProjectListSpy).toHaveBeenCalledTimes(1);
    const projectEle = getBySelector('#project');
    expect(projectEle).not.toBeDisabled();

    // project
    fireEvent.mouseDown(projectEle, baseElement);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('test_project_1'));
    await act(async () => jest.advanceTimersByTime(3000));
    // name
    fireEvent.change(getBySelector('#name', baseElement), {
      target: {
        value: 'name-database'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
    // - type
    fireEvent.mouseDown(getBySelector('#type', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    expect(getSystemModuleStatusSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(2700));
    // - ip
    await act(async () => {
      fireEvent.change(getBySelector('#ip', baseElement), {
        target: {
          value: '1.1.1.1'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
    });
    // - user
    await act(async () => {
      fireEvent.change(getBySelector('#user', baseElement), {
        target: {
          value: 'root'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
    });
    // password
    fireEvent.change(getBySelector('#password', baseElement), {
      target: {
        value: 'root'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
    // business
    fireEvent.click(getBySelector('.editable-select-trigger', baseElement));
    await act(async () => jest.advanceTimersByTime(0));
    const firstOption = getAllBySelector('.ant-dropdown-menu-item')[0];
    fireEvent.click(firstOption);
    await act(async () => jest.advanceTimersByTime(0));

    // ruleTemplateName
    fireEvent.mouseDown(getBySelector('#ruleTemplateName', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(
      getBySelector('div[title="custom_template_b"]', baseElement)
    );
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('#enableBackup'));
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.change(getBySelector('#backupMaxRows', baseElement), {
      target: {
        value: '2000'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));

    // submit
    expect(screen.getByText('提 交')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('提 交'));
    });
    expect(checkDbServiceIsConnectableSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(eventEmitSpy).toHaveBeenCalled();
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Submit_DataSource_Form
    );
    expect(requestAddDBServiceSpy).toHaveBeenCalled();
    expect(requestAddDBServiceSpy).toHaveBeenCalledWith({
      db_service: {
        additional_params: [
          {
            name: 'cc',
            value: ''
          }
        ],
        environment_tag_uid: '1',
        db_type: 'mysql',
        desc: undefined,
        host: '1.1.1.1',
        is_enable_masking: false,
        maintenance_times: [],
        name: 'name-database',
        password: 'root',
        port: '3306',
        sqle_config: {
          rule_template_id: '2',
          rule_template_name: 'custom_template_b',
          sql_query_config: {
            allow_query_when_less_than_audit_level: undefined,
            audit_enabled: undefined
          }
        },
        user: 'root',
        enable_backup: true,
        backup_max_rows: 2000
      },
      project_uid: mockProjectList[0].uid
    });
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('添加数据源成功')).toBeInTheDocument();
    expect(screen.getByText('关闭并重置表单')).toBeInTheDocument();
    const skipALink = getBySelector('.ant-result-subtitle a', baseElement);
    fireEvent.click(skipALink);
    await act(async () => jest.advanceTimersByTime(300));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('render prepare api req', async () => {
    const requestRuleTemplateList =
      sqleMockApi.rule_template.getRuleTemplateTips();
    const requestProjectRuleTemplateTips =
      sqleMockApi.rule_template.getProjectRuleTemplateTips();
    const requestListDBServiceDriverOption =
      baseMockApi.global.getListDBServiceDriverOption();
    customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(requestRuleTemplateList).toHaveBeenCalled();
    expect(requestProjectRuleTemplateTips).toHaveBeenCalled();
    expect(requestListDBServiceDriverOption).toHaveBeenCalled();
  });

  it('render skip to database list', async () => {
    customRender();
    expect(screen.getByText('返回数据源列表')).toBeInTheDocument();
    fireEvent.click(screen.getByText('返回数据源列表'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(-1);
  });

  it('render reset form data', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = customRender();

    expect(screen.getByText('重 置')).toBeInTheDocument();
    fireEvent.change(getBySelector('#describe', baseElement), {
      target: {
        value: 'admin'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(eventEmitSpy).toHaveBeenCalled();
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Reset_DataSource_Form
    );
  });

  it('check enable masking have href', async () => {
    customRender();
    expect(screen.getByText('查看脱敏规则')).toBeInTheDocument();
    expect(screen.getByText('查看脱敏规则')).toHaveAttribute(
      'href',
      `/project/${projectID}/data-mask-rule-overview`
    );
  });

  it('check enable masking have href when project is undefined', async () => {
    mockUseCurrentProject({ projectID: undefined });
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('查看脱敏规则')).not.toBeInTheDocument();
    const projectEle = getBySelector('#project');
    expect(projectEle).not.toBeDisabled();
    fireEvent.mouseDown(projectEle, baseElement);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(screen.getByText('test_project_1'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('查看脱敏规则')).toHaveAttribute(
      'href',
      `/project/${mockProjectList[0].uid}/data-mask-rule-overview`
    );
  });
});
