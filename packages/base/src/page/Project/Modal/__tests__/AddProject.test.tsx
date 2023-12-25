import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import project from '../../../../testUtils/mockApi/project';
import EventEmitter from '../../../../utils/EventEmitter';
import { superRender } from '../../../../testUtils/customRender';
import AddProject from '../AddProject';
import { act, fireEvent, screen } from '@testing-library/react';
import EmitterKey from '../../../../data/EmitterKey';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('test base/page/project/modal/add', () => {
  const dispatchSpy = jest.fn();

  let addProjectSpy: jest.SpyInstance;
  let emitSpy: jest.SpyInstance;
  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        project: { modalStatus: { [ModalName.DMS_Add_Project]: true } }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);

    addProjectSpy = project.addProject();
    emitSpy = jest.spyOn(EventEmitter, 'emit');
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  it('should match snapshot', () => {
    const { baseElement } = superRender(<AddProject />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should send create project request when clicking submit button', async () => {
    superRender(<AddProject />);
    expect(addProjectSpy).toBeCalledTimes(0);

    fireEvent.input(screen.getByLabelText('项目名称'), {
      target: { value: 'name' }
    });
    fireEvent.input(screen.getByLabelText('项目描述'), {
      target: { value: 'desc' }
    });

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('关 闭').parentNode).toHaveAttribute('disabled');

    expect(addProjectSpy).toBeCalledTimes(1);
    expect(addProjectSpy).toBeCalledWith({
      project: { name: 'name', desc: 'desc' }
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('创建项目name成功')).toBeInTheDocument();
    expect(emitSpy).toBeCalledTimes(1);
    expect(emitSpy).toBeCalledWith(EmitterKey.DMS_Refresh_Project_List);
    expect(screen.getByLabelText('项目名称')).toHaveValue('');
    expect(screen.getByLabelText('项目描述')).toHaveValue('');
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      payload: {
        modalName: ModalName.DMS_Add_Project,
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
