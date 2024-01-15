import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import Router, { useNavigate } from 'react-router-dom';
import { superRender } from '../../../../testUtils/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import dms from '../../../../testUtils/mockApi/global';
import ruleTemplate from 'sqle/src/testUtils/mockApi/rule_template';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

import UpdateDataSource from '.';
import {
  createSpyFailResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import rule_template from 'sqle/src/testUtils/mockApi/rule_template';

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

  const customRender = () => {
    return superRender(<UpdateDataSource />, undefined, {
      routerProps: {
        initialEntries: [`/project/${projectID}/db-services/update/${uId}`]
      }
    });
  };

  beforeEach(() => {
    jest.useFakeTimers();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    dms.mockAllApi();
    jest.spyOn(Router, 'useParams').mockReturnValue({
      dbServiceUid: uId
    });
    ruleTemplate.mockAllApi();
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

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
    const requestRuleTemplateList = rule_template.getRuleTemplateTips();
    const requestDriverOptions = dms.getListDBServices();

    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(requestRuleTemplateList).toBeCalled();
    expect(requestDriverOptions).toBeCalled();

    expect(baseElement).toMatchSnapshot();
  });

  it('render edit data when has all value', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const requestTableList = dms.getListDBServices();
    requestTableList.mockImplementationOnce(() =>
      createSpySuccessResponse({
        total_nums: 1,
        data: [
          {
            uid: uId,
            name: 'mysql-1',
            db_type: 'mysql',
            host: '1.1.1.1',
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
    fireEvent.change(getBySelector('#password', baseElement), {
      target: { value: '123' }
    });
    await act(async () => jest.advanceTimersByTime(300));
    await act(async () => {
      fireEvent.click(screen.getByText('提 交'));
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(eventEmitSpy).toBeCalled();
    expect(eventEmitSpy).toBeCalledWith(EmitterKey.DMS_Submit_DataSource_Form);
    expect(screen.getByText(`数据源"mysql-1"更新成功`)).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(800));
    expect(navigateSpy).toBeCalled();
    expect(navigateSpy).toBeCalledWith(`/project/${projectID}/db-services`, {
      replace: true
    });
  });

  it('render get default val error', async () => {
    const requestDetail = dms.getListDBServices();
    requestDetail.mockImplementationOnce(() => createSpyFailResponse({}));
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));

    expect(screen.getByText('重 试')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('重 试'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestDetail).toBeCalled();
  });
});
