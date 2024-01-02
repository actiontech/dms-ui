import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { superRender } from '../../../../testUtils/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import dms from '../../../../testUtils/mockApi/global';
import ruleTemplate from 'sqle/src/testUtils/mockApi/rule_template';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

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

  const customRender = () => {
    return superRender(<AddDataSource />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    dms.mockAllApi();
    ruleTemplate.mockAllApi();
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
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const requestAddDBService = dms.AddDBService();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));

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
    await act(async () => {
      fireEvent.change(getBySelector('#business', baseElement), {
        target: {
          value: 'business'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
    });
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
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(eventEmitSpy).toBeCalled();
    expect(eventEmitSpy).toBeCalledWith(EmitterKey.DMS_Submit_DataSource_Form);
    expect(requestAddDBService).toBeCalled();
    expect(requestAddDBService).toBeCalledWith({
      db_service: {
        additional_params: [
          {
            name: 'cc',
            value: ''
          }
        ],
        business: 'business',
        db_type: 'mysql',
        desc: undefined,
        host: '1.1.1.1',
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

    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('添加数据源成功')).toBeInTheDocument();
    expect(screen.getByText('关闭并重置表单')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    const skipALink = getBySelector('.ant-result-subtitle a', baseElement);
    expect(skipALink).toHaveAttribute(
      'href',
      `/project/${projectID}/db-services`
    );

    fireEvent.click(screen.getByText('关闭并重置表单'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });

  it('render prepare api req', async () => {
    const requestRuleTemplateList = ruleTemplate.getRuleTemplateTips();
    const requestProjectRuleTemplateTips =
      ruleTemplate.getProjectRuleTemplateTips();
    const requestListDBServiceDriverOption = dms.getListDBServiceDriverOption();
    customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(requestRuleTemplateList).toBeCalled();
    expect(requestProjectRuleTemplateTips).toBeCalled();
    expect(requestListDBServiceDriverOption).toBeCalled();
  });

  it('render skip to database list', async () => {
    customRender();
    expect(screen.getByText('返回数据源列表')).toBeInTheDocument();
    fireEvent.click(screen.getByText('返回数据源列表'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(navigateSpy).toBeCalled();
    expect(navigateSpy).toBeCalledWith(`/project/${projectID}/db-services`);
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
    expect(eventEmitSpy).toBeCalled();
    expect(eventEmitSpy).toBeCalledWith(EmitterKey.DMS_Reset_DataSource_Form);
  });
});
