import { act, cleanup, fireEvent } from '@testing-library/react';
import { superRender } from '../../../testUtils/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { Form } from 'antd';
import { IListDatabaseSourceService } from '@actiontech/shared/lib/api/base/service/common';
import SyncTaskForm from '.';
import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import syncTaskList from '../../../testUtils/mockApi/syncTaskList';
import ruleTemplate from 'sqle/src/testUtils/mockApi/rule_template';
import useTaskSource from '../../../hooks/useTaskSource';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { SyncTaskFormFields } from './index.type';

describe('page/SyncDataSource/SyncTaskForm', () => {
  const customRender = (params?: {
    loading?: boolean;
    defaultValue?: IListDatabaseSourceService;
  }) => {
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<SyncTaskFormFields>()
    );
    const { result: taskSourceTips } = renderHooksWithTheme(() =>
      useTaskSource()
    );
    const isLoading = params?.loading ?? false;
    const defaultData = params?.defaultValue ?? undefined;

    return superRender(
      <SyncTaskForm
        form={result.current[0]}
        defaultValue={defaultData}
        loading={isLoading}
        title="这里是标题"
        taskSourceTips={taskSourceTips.current}
      />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseDbServiceDriver();
    syncTaskList.mockAllApi();
    ruleTemplate.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render for loading form', async () => {
    const { baseElement } = customRender({ loading: true });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render name rule', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    const nameEle = getBySelector('#name', baseElement);
    await act(async () => {
      fireEvent.change(nameEle, {
        target: { value: '*' }
      });
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();

    await act(async () => {
      fireEvent.change(nameEle, {
        target: {
          value:
            'test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-test-name-'
        }
      });
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render for prepare api request', async () => {
    const requestTemplateTips = ruleTemplate.getRuleTemplateTips();
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestTemplateTips).toHaveBeenCalled();
  });

  it('render syncInterval for form item', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(1000));

    const syncIntervalEle = getBySelector(
      'input.ant-input[placeholder="请输入审核时间"]',
      baseElement
    );
    fireEvent.change(syncIntervalEle, {
      target: {
        value: '0 0 * *'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();

    fireEvent.change(syncIntervalEle, {
      target: {
        value: '0 0 * * *'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });
});
