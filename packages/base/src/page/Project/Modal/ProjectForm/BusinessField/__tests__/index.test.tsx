import BusinessField from '../index';
import { superRender } from '../../../../../../testUtils/customRender';
import { mockProjectList } from '../../../../../../testUtils/mockApi/project/data';
import project from '../../../../../../testUtils/mockApi/project';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import {
  getBySelector,
  getAllBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

describe('Project/BusinessField', () => {
  let listBusinessTagsSpy: jest.SpyInstance;
  let updateBusinessTagSpy: jest.SpyInstance;
  let createBusinessTagSpy: jest.SpyInstance;
  let deleteBusinessTagSpy: jest.SpyInstance;
  let getProjectListSpy: jest.SpyInstance;

  beforeEach(() => {
    listBusinessTagsSpy = project.listBusinessTags();
    updateBusinessTagSpy = project.updateBusinessTag();
    createBusinessTagSpy = project.createBusinessTag();
    deleteBusinessTagSpy = project.deleteBusinessTag();
    getProjectListSpy = project.getProjectList();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', () => {
    const { baseElement } = superRender(<BusinessField />);
    expect(baseElement).toMatchSnapshot();
    expect(listBusinessTagsSpy).toHaveBeenCalledTimes(1);
  });

  it('render add business tag', async () => {
    superRender(<BusinessField />);
    expect(listBusinessTagsSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('添加业务'));
    await act(async () => jest.advanceTimersByTime(0));
    const input = getBySelector('.add-mode input');
    fireEvent.change(input, { target: { value: 'test' } });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('添 加'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(createBusinessTagSpy).toHaveBeenCalledWith({
      business_tag: {
        name: 'test'
      }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('添加业务成功')).toBeInTheDocument();
  });

  it('render update business tag', async () => {
    superRender(<BusinessField />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listBusinessTagsSpy).toHaveBeenCalledTimes(1);
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
    expect(updateBusinessTagSpy).toHaveBeenCalledWith({
      business_tag: {
        name: 'Updated Option'
      },
      business_tag_uid: '1'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('更新业务成功')).toBeInTheDocument();
  });

  it('render delete business tag when business tag is bound', async () => {
    superRender(<BusinessField />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listBusinessTagsSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));
    const deleteButton = getAllBySelector('.delete-button')[0];
    fireEvent.click(deleteButton);
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('确认要删除此业务么?')).toBeInTheDocument();

    const confirmButton = getBySelector('.ant-btn-primary.ant-btn-sm');
    fireEvent.click(confirmButton);
    await act(async () => jest.advanceTimersByTime(0));
    expect(getProjectListSpy).toHaveBeenCalledWith({
      filter_by_business_tag: 'business-1',
      page_size: 9999
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText(
        `当前业务已绑定：${mockProjectList
          .map((item) => item.name)
          .join(',')}，暂无法删除`
      )
    ).toBeInTheDocument();
  });

  it('render delete business tag when business tag is unbound', async () => {
    getProjectListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: []
      })
    );
    superRender(<BusinessField />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(listBusinessTagsSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));
    const deleteButton = getAllBySelector('.delete-button')[0];
    fireEvent.click(deleteButton);
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('确认要删除此业务么?')).toBeInTheDocument();

    const confirmButton = getBySelector('.ant-btn-primary.ant-btn-sm');
    fireEvent.click(confirmButton);
    await act(async () => jest.advanceTimersByTime(0));
    expect(getProjectListSpy).toHaveBeenCalledWith({
      filter_by_business_tag: 'business-1',
      page_size: 9999
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(deleteBusinessTagSpy).toHaveBeenCalledWith({
      business_tag_uid: '1'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('删除业务成功')).toBeInTheDocument();
  });
});
