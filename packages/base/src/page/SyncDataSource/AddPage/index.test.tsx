import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../testUtils/customRender';
import { getAllBySelector, getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import syncTaskList from '../../../testUtils/mockApi/syncTaskList';
import ruleTemplate from 'sqle/src/testUtils/mockApi/rule_template';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';

import AddSyncTask from '.';

describe('page/SyncDataSource/AddPage', () => {

  const projectID = mockProjectInfo.projectID;

  const customRender = () => {
    return superRender(<AddSyncTask />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    ruleTemplate.mockAllApi();
    syncTaskList.mockAllApi();
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render add sync task snap', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(1000));

    expect(screen.getByText('返回同步任务列表')).toBeInTheDocument();
    expect(screen.getByText('重 置')).toBeInTheDocument();
    expect(screen.getByText('提 交')).toBeInTheDocument();

    expect(screen.getByText('添加同步任务')).toBeInTheDocument();
    expect(screen.getByText('基础配置')).toBeInTheDocument();
    expect(screen.getByText('SQL审核配置')).toBeInTheDocument();
    expect(screen.getByText('自定义任务同步周期')).toBeInTheDocument();

    expect(baseElement).toMatchSnapshot();
  });

  it('render click list a link', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(1000));

    const aLink = getBySelector(
      '.actiontech-page-header-namespace a',
      baseElement
    );
    expect(aLink).toHaveAttribute(
      'href',
      `/project/${projectID}/syncDataSource`
    );
  });

  it('render reset form cont', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(1000));

    // version
    await act(async () => {
      fireEvent.change(getBySelector('#version', baseElement), {
        target: {
          value: '5.23.04.0'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
    })
    expect(getBySelector('#version', baseElement)).toHaveAttribute(
      'value',
      '5.23.04.0'
    );

    await act(async () => {
      fireEvent.click(screen.getByText('重 置'));
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(eventEmitSpy).toBeCalledWith(EmitterKey.DMS_SYNC_TASK_RESET_FORM);
    await act(async () => jest.advanceTimersByTime(300));
  });

  it('render form item for prepare api', async () => {
    const requestRuleGlobal = ruleTemplate.getRuleTemplateTips();
    const requestRuleProject = ruleTemplate.getProjectRuleTemplateTips();
    const requestTaskSourceListTips = syncTaskList.getTaskSourceListTips();
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestTaskSourceListTips).toBeCalled();

    // source
    fireEvent.mouseDown(getBySelector('#source', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('div[title="source1"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    expect(requestTaskSourceListTips).toBeCalledWith({
      project_uid: projectID
    });

    // instanceType
    fireEvent.mouseDown(getBySelector('#instanceType', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));
    await act(async () => jest.advanceTimersByTime(6300));
    expect(requestRuleGlobal).toBeCalled();
    expect(requestRuleProject).toBeCalled();

    // ant-select-clear
    const clearIcon = getAllBySelector('.ant-select-clear', baseElement);
    expect(clearIcon.length).toBe(2);
    fireEvent.click(clearIcon[0]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });

  it('render add submit for success', async () => {
    const requestSubmit = syncTaskList.addTaskSource();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));

    // name
    fireEvent.change(getBySelector('#name', baseElement), {
      target: {
        value: 'name-sync-source'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));

    // source
    fireEvent.mouseDown(getBySelector('#source', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('div[title="source1"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));

    // version
    fireEvent.change(getBySelector('#version', baseElement), {
      target: {
        value: '5.23.04.0'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));

    // url
    fireEvent.change(getBySelector('#url', baseElement), {
      target: {
        value: 'http://192.168.1.1:27601'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));

    // instanceType
    fireEvent.mouseDown(getBySelector('#instanceType', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));

    // ruleTemplateName
    await act(async () => jest.advanceTimersByTime(6300));
    fireEvent.mouseDown(getBySelector('#ruleTemplateName', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(
      getBySelector('div[title="custom_template_b"]', baseElement)
    );
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('重 置').parentNode).toHaveAttribute('disabled');
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestSubmit).toBeCalled();
    expect(requestSubmit).toBeCalledWith({
      database_source_service: {
        name: 'name-sync-source',
        db_type: 'mysql',
        source: 'source1',
        sqle_config: {
          rule_template_id: '2',
          rule_template_name: 'custom_template_b'
        },
        cron_express: '0 0 * * *',
        url: 'http://192.168.1.1:27601',
        version: '5.23.04.0'
      },
      project_uid: projectID
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('添加同步任务成功')).toBeInTheDocument();
    expect(
      screen.getByText('到同步任务列表查看看看添加的同步任务')
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(300));
  })
});
