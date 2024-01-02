import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { superRender } from '../../../testUtils/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import syncTaskList from '../../../testUtils/mockApi/syncTaskList';
import ruleTemplate from 'sqle/src/testUtils/mockApi/rule_template';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import EmitterKey from '../../../data/EmitterKey';
import EventEmitter from '../../../utils/EventEmitter';

import AddSyncTask from '.';
import { resolveThreeSecond } from 'sqle/src/testUtils/mockRequest';

const mockMysqlRuleTemplate = [
  {
    rule_template_id: '01',
    rule_template_name: 'rule_template_name1',
    db_type: 'mysql'
  }
];

describe('page/SyncDataSource/AddPage', () => {

  // let requestMysqlRuleTemplateSpy: jest.SpyInstance;
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

    expect(screen.getByText('返回同步任务列表')).toBeInTheDocument();
    expect(screen.getByText('重 置')).toBeInTheDocument();
    expect(screen.getByText('提 交')).toBeInTheDocument();

    expect(screen.getByText('添加同步任务')).toBeInTheDocument();
    expect(screen.getByText('基础配置')).toBeInTheDocument();
    expect(screen.getByText('SQL审核配置')).toBeInTheDocument();
    expect(screen.getByText('自定义任务同步周期')).toBeInTheDocument();

    expect(baseElement).toMatchSnapshot();
  });

  it('render reset form cont', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));

    // version
    fireEvent.change(getBySelector('#version', baseElement), {
      target: {
        value: '5.23.04.0'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
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
  })
});
