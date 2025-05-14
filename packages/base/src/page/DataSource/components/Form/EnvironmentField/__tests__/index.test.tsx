import EnvironmentField from '../index';
import { baseSuperRender } from '../../../../../../testUtils/superRender';
import project from '../../../../../../testUtils/mockApi/project';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import {
  getBySelector,
  getAllBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import dms from '../../../../../../testUtils/mockApi/global';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { DBServicesList } from '../../../../../../testUtils/mockApi/global/data';

describe('Project/EnvironmentField', () => {
  let listEnvironmentTagsSpy: jest.SpyInstance;
  let updateEnvironmentTagSpy: jest.SpyInstance;
  let createEnvironmentTagSpy: jest.SpyInstance;
  let deleteEnvironmentTagSpy: jest.SpyInstance;
  let getListDBServicesSpy: jest.SpyInstance;

  beforeEach(() => {
    listEnvironmentTagsSpy = project.listEnvironmentTags();
    updateEnvironmentTagSpy = project.updateEnvironmentTag();
    createEnvironmentTagSpy = project.createEnvironmentTag();
    deleteEnvironmentTagSpy = project.deleteEnvironmentTag();
    getListDBServicesSpy = dms.getListDBServices();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = () => {
    return baseSuperRender(
      <EnvironmentField projectID={mockProjectInfo.projectID} />
    );
  };

  it('render init snap', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
    expect(listEnvironmentTagsSpy).toHaveBeenCalledTimes(1);
  });

  it('render add environment tag', async () => {
    customRender();
    expect(listEnvironmentTagsSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('添加环境属性'));
    await act(async () => jest.advanceTimersByTime(0));
    const input = getBySelector('.add-mode input');
    fireEvent.change(input, { target: { value: 'test' } });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('添 加'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(createEnvironmentTagSpy).toHaveBeenCalledWith({
      environment_name: 'test',
      project_uid: mockProjectInfo.projectID
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('环境属性添加成功')).toBeInTheDocument();
  });

  it('render update environment tag', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listEnvironmentTagsSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));
    const editButton = getAllBySelector('.edit-button')[0];
    fireEvent.click(editButton);
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.change(getBySelector('.edit-mode input'), {
      target: { value: 'Updated Option' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('保 存'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(updateEnvironmentTagSpy).toHaveBeenCalledWith({
      environment_tag_uid: '1',
      environment_name: 'Updated Option',
      project_uid: mockProjectInfo.projectID
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('环境属性更新成功')).toBeInTheDocument();
  });

  it('render delete environment tag when environment tag is bound', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listEnvironmentTagsSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));
    const deleteButton = getAllBySelector('.delete-button')[0];
    fireEvent.click(deleteButton);
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('确认要删除此环境属性吗?')).toBeInTheDocument();

    const confirmButton = getBySelector('.ant-btn-primary.ant-btn-sm');
    fireEvent.click(confirmButton);
    await act(async () => jest.advanceTimersByTime(0));
    expect(getListDBServicesSpy).toHaveBeenCalledWith({
      filter_by_environment_tag_uid: '1',
      page_size: 9999,
      project_uid: mockProjectInfo.projectID
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText(
        `当前环境已绑定：${DBServicesList.map((item) => item.name).join(
          ','
        )}，暂无法删除`
      )
    ).toBeInTheDocument();
  });

  it('render delete environment tag when environment tag is unbound', async () => {
    getListDBServicesSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: []
      })
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listEnvironmentTagsSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));
    const deleteButton = getAllBySelector('.delete-button')[0];
    fireEvent.click(deleteButton);
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('确认要删除此环境属性吗?')).toBeInTheDocument();

    const confirmButton = getBySelector('.ant-btn-primary.ant-btn-sm');
    fireEvent.click(confirmButton);
    await act(async () => jest.advanceTimersByTime(0));
    expect(getListDBServicesSpy).toHaveBeenCalledWith({
      filter_by_environment_tag_uid: '1',
      page_size: 9999,
      project_uid: mockProjectInfo.projectID
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(deleteEnvironmentTagSpy).toHaveBeenCalledWith({
      environment_tag_uid: '1',
      project_uid: mockProjectInfo.projectID
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('环境属性删除成功')).toBeInTheDocument();
  });
});
