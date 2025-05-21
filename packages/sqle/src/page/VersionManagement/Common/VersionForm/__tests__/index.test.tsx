import {
  cleanup,
  act,
  fireEvent,
  screen,
  renderHook
} from '@testing-library/react';
import VersionForm from '..';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import useVersionFormState from '../hooks/useVersionFormState';
import { Form } from 'antd';

describe('sqle/VersionManagement/VersionForm', () => {
  let getInstanceTipListSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    getInstanceTipListSpy = instance.getInstanceTipList();
    mockUseCurrentProject();
    mockUseDbServiceDriver();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (isUpdate = false, allowEditStages = false) => {
    const { result } = renderHook(() => useVersionFormState());
    return sqleSuperRender(
      <Form form={result.current.form}>
        <VersionForm isUpdate={isUpdate} allowEditStages={allowEditStages} />
      </Form>
    );
  };

  it('render init snap shot', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('创建版本')).toBeInTheDocument();
    expect(getBySelector('#stages_0_name')).toHaveValue('开发');
    expect(getBySelector('#stages_0_name')).toBeDisabled();
    expect(getBySelector('#stages_1_name')).toHaveValue('测试');
    expect(getBySelector('#stages_1_name')).toBeDisabled();
    expect(getBySelector('#stages_2_name')).toHaveValue('生产');
    expect(getBySelector('#stages_2_name')).toBeDisabled();
    expect(getBySelector('#version')).not.toBeDisabled();
    expect(getBySelector('#desc')).not.toBeDisabled();
    expect(getInstanceTipListSpy).toHaveBeenCalledTimes(1);
  });

  it('render form when isUpdate is true and allowEditStages is false', () => {
    customRender(true, false);
    expect(screen.getByText('更新版本')).toBeInTheDocument();
    expect(getBySelector('#stages_0_name')).toBeDisabled();
    expect(getBySelector('#stages_1_name')).toBeDisabled();
    expect(getBySelector('#stages_2_name')).toBeDisabled();
    expect(getBySelector('#version')).not.toBeDisabled();
    expect(getBySelector('#desc')).not.toBeDisabled();
  });

  it('render form when isUpdate is true and allowEditStages is true', () => {
    customRender(true, true);
    expect(screen.getByText('更新版本')).toBeInTheDocument();
    expect(getBySelector('#stages_0_name')).not.toBeDisabled();
    expect(getBySelector('#stages_1_name')).not.toBeDisabled();
    expect(getBySelector('#stages_2_name')).not.toBeDisabled();
    expect(getBySelector('#version')).not.toBeDisabled();
    expect(getBySelector('#desc')).not.toBeDisabled();
  });

  it('render stage action', async () => {
    customRender(true, true);
    await act(async () => jest.advanceTimersByTime(3000));

    // 添加阶段数据源
    fireEvent.click(getBySelector('.add-instance-btn'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('.add-instance-btn'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getAllBySelector('.remove-instance-btn').length).toBe(3);

    // 添加部署阶段
    fireEvent.click(screen.getByText('添加部署阶段'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getAllBySelector('.delete-stage-btn').length).toBe(4);

    // 删除部署阶段
    fireEvent.click(getAllBySelector('.delete-stage-btn')[3]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(getAllBySelector('.delete-stage-btn').length).toBe(3);

    // 删除阶段数据源
    fireEvent.click(getAllBySelector('.remove-instance-btn')[2]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(getAllBySelector('.remove-instance-btn').length).toBe(2);
  });
});
