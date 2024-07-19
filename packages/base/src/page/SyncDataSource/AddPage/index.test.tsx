import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../testUtils/customRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import syncTaskList from '../../../testUtils/mockApi/syncTaskList';
import ruleTemplate from 'sqle/src/testUtils/mockApi/rule_template';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';

import AddSyncTask from '.';

describe('page/SyncDataSource/AddPage', () => {
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
    await act(async () => jest.advanceTimersByTime(3000));

    expect(baseElement).toMatchSnapshot();
  });

  it('render reset form cont', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    await act(async () => {
      fireEvent.click(screen.getByText('重 置'));
      await act(async () => jest.advanceTimersByTime(0));
    });
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_SYNC_TASK_RESET_FORM
    );
  });

  it('render form item for prepare api', async () => {
    const requestRuleGlobal = ruleTemplate.getRuleTemplateTips();
    const requestTaskSourceListTips = syncTaskList.getTaskSourceListTips();
    const { baseElement } = customRender();

    expect(requestTaskSourceListTips).toHaveBeenCalledTimes(1);
    expect(requestRuleGlobal).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));

    // source
    fireEvent.mouseDown(getBySelector('#source', baseElement));
    fireEvent.click(getBySelector('div[title="source1"]', baseElement));

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('动态字段1')).toBeInTheDocument();

    // instanceType
    fireEvent.mouseDown(getBySelector('#instanceType', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));
    await act(async () => jest.advanceTimersByTime(6300));
    expect(requestRuleGlobal).toHaveBeenCalledTimes(2);

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
    await act(async () => jest.advanceTimersByTime(3000));

    // name
    fireEvent.change(getBySelector('#name', baseElement), {
      target: {
        value: 'name-sync-source'
      }
    });

    // source
    fireEvent.mouseDown(getBySelector('#source', baseElement));

    fireEvent.click(getBySelector('div[title="source1"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.change(getBySelector('#params_key1', baseElement), {
      target: { value: 'param1' }
    });
    fireEvent.change(getBySelector('#params_key2', baseElement), {
      target: { value: 111 }
    });

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
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('#ruleTemplateName', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(
      getBySelector('div[title="custom_template_b"]', baseElement)
    );

    // sql query config
    fireEvent.click(getBySelector('#needAuditForSqlQuery', baseElement));

    fireEvent.mouseDown(
      getBySelector('#allowQueryWhenLessThanAuditLevel', baseElement)
    );
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(getBySelector('div[title="notice"]', baseElement));

    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('重 置').parentNode).toHaveAttribute('disabled');
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestSubmit).toHaveBeenCalled();
    expect(requestSubmit).toHaveBeenCalledWith({
      db_service_sync_task: {
        name: 'name-sync-source',
        db_type: 'mysql',
        source: 'source1',
        sqle_config: {
          rule_template_id: '2',
          rule_template_name: 'custom_template_b',
          sql_query_config: {
            audit_enabled: true,
            allow_query_when_less_than_audit_level: 'notice'
          }
        },
        cron_express: '0 0 * * *',
        url: 'http://192.168.1.1:27601',
        additional_params: [
          { key: 'key1', value: 'param1' },
          { key: 'key2', value: '111' }
        ]
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('添加同步任务成功')).toBeInTheDocument();
    expect(
      screen.getByText('到同步任务列表查看添加的同步任务')
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(300));
  });
});
