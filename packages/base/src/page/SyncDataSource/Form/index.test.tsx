import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../testUtils/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import { Form } from 'antd';
import { IListDatabaseSourceService } from '@actiontech/shared/lib/api/base/service/common';
import SyncTaskForm, { SyncTaskFormFields } from '.';
import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import syncTaskList from '../../../testUtils/mockApi/syncTaskList';
import ruleTemplate from 'sqle/src/testUtils/mockApi/rule_template';

describe('page/SyncDataSource/SyncTaskForm', () => {
  const projectName = mockProjectInfo.projectName;

  const customRender = (params?: {
    loading?: boolean;
    defaultValue?: IListDatabaseSourceService;
  }) => {
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<SyncTaskFormFields>()
    );
    const isLoading = params?.loading ?? false;
    const defaultData = params?.defaultValue ?? undefined;
    return superRender(
      <SyncTaskForm
        form={result.current[0]}
        defaultValue={defaultData}
        loading={isLoading}
        title="这里是标题"
        projectName={projectName}
      />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
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
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render name rule', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));

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
    const requestTaskSourceList = syncTaskList.getTaskSourceListTips();
    const requestTemplateTips = ruleTemplate.getRuleTemplateTips();
    const requestTemplateProject = ruleTemplate.getProjectRuleTemplateTips();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(requestTaskSourceList).toBeCalled();
    expect(requestTemplateTips).toBeCalled();
    expect(requestTemplateProject).toBeCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('render source form item', async () => {
    const requestTaskSourceList = syncTaskList.getTaskSourceListTips();
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(300));
    const typeEle = getBySelector('#source');
    fireEvent.mouseDown(typeEle, baseElement);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestTaskSourceList).toBeCalled();
    fireEvent.click(getBySelector('div[title="source1"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
  });

  it('render dbType form item', async () => {
    const requestTaskSourceList = syncTaskList.getTaskSourceListTips();
    const requestTemplateTips = ruleTemplate.getRuleTemplateTips();
    const requestTemplateProject = ruleTemplate.getProjectRuleTemplateTips();
    const { baseElement } = customRender();

    const sourceEle = getBySelector('#source');
    fireEvent.mouseDown(sourceEle, baseElement);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestTaskSourceList).toBeCalled();
    fireEvent.click(getBySelector('div[title="source1"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));

    await act(async () => jest.advanceTimersByTime(300));
    const typeEle = getBySelector('#instanceType');
    fireEvent.mouseDown(typeEle, baseElement);
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.click(getBySelector('span[title="mysql"]', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(6300));
    expect(requestTemplateTips).toBeCalled();
    expect(requestTemplateProject).toBeCalled();

    const ruleTemplateEle = getBySelector('#ruleTemplateName');
    fireEvent.mouseDown(ruleTemplateEle, baseElement);
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
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
