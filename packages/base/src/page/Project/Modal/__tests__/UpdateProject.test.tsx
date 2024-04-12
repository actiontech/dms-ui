import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import project from '../../../../testUtils/mockApi/project';
import EventEmitter from '../../../../utils/EventEmitter';
import { superRender } from '../../../../testUtils/customRender';
import UpdateProject from '../UpdateProject';
import { act, fireEvent, screen } from '@testing-library/react';
import EmitterKey from '../../../../data/EmitterKey';
import { mockProjectList } from '../../../../testUtils/mockApi/project/data';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

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

  const mockProjectData = {
    business: [
      {
        id: 'business1',
        name: 'business1',
        is_used: true
      },
      {
        id: 'business2',
        name: 'business2',
        is_used: false
      },
      {
        id: 'business3',
        name: 'business3',
        is_used: true
      }
    ],
    is_fixed_business: true
  };

  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        project: {
          modalStatus: { [ModalName.DMS_Update_Project]: true },
          selectProject: {
            ...mockProjectList[1],
            ...mockProjectData
          }
        }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    updateProjectSpy = project.updateProject();
    emitSpy = jest.spyOn(EventEmitter, 'emit');
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  it('should set form fields value when opened modal', () => {
    superRender(<UpdateProject />);

    expect(screen.getByLabelText('项目名称')).toHaveValue(
      mockProjectList[1].name
    );
    expect(screen.getByLabelText('项目名称')).toBeDisabled();
    expect(screen.getByLabelText('项目描述')).toHaveValue(
      mockProjectList[1].desc
    );
  });

  it('should send update project request when user click submit button', async () => {
    superRender(<UpdateProject />);

    expect(updateProjectSpy).toHaveBeenCalledTimes(0);

    fireEvent.input(screen.getByLabelText('项目描述'), {
      target: { value: 'update_desc' }
    });

    const businessDeleteButton = getAllBySelector('.delete-button-disabled');
    expect(businessDeleteButton).toHaveLength(2);
    await act(async () => {
      fireEvent.mouseEnter(businessDeleteButton[0]);
      await jest.advanceTimersByTime(100);
    });
    expect(
      screen.getByText('当前业务已有关联资源，无法删除')
    ).toBeInTheDocument();

    expect(getAllBySelector('.delete-button')).toHaveLength(1);
    fireEvent.click(getAllBySelector('.delete-button')[0]);
    await act(async () => jest.advanceTimersByTime(100));
    expect(getAllBySelector('.edit-button')).toHaveLength(2);
    fireEvent.click(getAllBySelector('.edit-button')[0]);
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.input(getAllBySelector('#editInput')[0], {
      target: { value: 'test' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(getAllBySelector('.custom-icon-selected')[0]);
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
        is_fixed_business: true,
        business: [
          {
            id: 'business1',
            is_used: true,
            name: 'test'
          },
          {
            id: 'business3',
            is_used: true,
            name: 'business3'
          }
        ]
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
