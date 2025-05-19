import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import project from '@actiontech/shared/lib/testUtil/mockApi/base/project';
import EventEmitter from '../../../../utils/EventEmitter';
import { baseSuperRender } from '../../../../testUtils/superRender';
import UpdateProject from '../UpdateProject';
import { act, fireEvent, screen } from '@testing-library/react';
import EmitterKey from '../../../../data/EmitterKey';
import { mockProjectList } from '@actiontech/shared/lib/testUtil/mockApi/base/project/data';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('test base/page/project/modal/update', () => {
  const dispatchSpy = jest.fn();

  let updateProjectSpy: jest.SpyInstance;
  let emitSpy: jest.SpyInstance;
  let listBusinessTagsSpy: jest.SpyInstance;

  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        project: {
          modalStatus: { [ModalName.DMS_Update_Project]: true },
          selectProject: {
            ...mockProjectList[1]
          }
        }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    updateProjectSpy = project.updateProject();
    listBusinessTagsSpy = project.listBusinessTags();
    emitSpy = jest.spyOn(EventEmitter, 'emit');
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  it('should set form fields value when opened modal', () => {
    baseSuperRender(<UpdateProject />);

    expect(screen.getByLabelText('项目名称')).toHaveValue(
      mockProjectList[1].name
    );
    expect(screen.getByLabelText('项目名称')).toBeDisabled();
    expect(screen.getByLabelText('项目描述')).toHaveValue(
      mockProjectList[1].desc
    );

    expect(listBusinessTagsSpy).toHaveBeenCalledTimes(1);
  });

  it('should send update project request when user click submit button', async () => {
    baseSuperRender(<UpdateProject />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(updateProjectSpy).toHaveBeenCalledTimes(0);

    fireEvent.input(screen.getByLabelText('项目描述'), {
      target: { value: 'update_desc' }
    });
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.mouseDown(getBySelector('#priority'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('div[title="高"]'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));
    const firstOption = getAllBySelector('.ant-dropdown-menu-item')[1];
    fireEvent.click(firstOption);
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByText('提 交').closest('button')).toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('关 闭').closest('button')).toBeDisabled();

    expect(updateProjectSpy).toHaveBeenCalledTimes(1);
    expect(updateProjectSpy).toHaveBeenCalledWith({
      project_uid: mockProjectList[1].uid,
      project: {
        desc: 'update_desc',
        project_priority: 'high',
        business_tag: {
          uid: '2'
        }
      }
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      screen.getByText(`更新项目${mockProjectList[1].name}成功`)
    ).toBeInTheDocument();

    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(EmitterKey.DMS_Refresh_Project_List);
    await act(async () => jest.advanceTimersByTime(100));

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      payload: {
        modalName: ModalName.DMS_Update_Project,
        status: false
      },
      type: 'project/updateModalStatus'
    });

    expect(screen.getByText('提 交').closest('button')).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('关 闭').closest('button')).not.toBeDisabled();
  });
});
