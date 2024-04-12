import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import project from '../../../../testUtils/mockApi/project';
import EventEmitter from '../../../../utils/EventEmitter';
import { superRender } from '../../../../testUtils/customRender';
import AddProject from '../AddProject';
import { act, fireEvent, screen } from '@testing-library/react';
import EmitterKey from '../../../../data/EmitterKey';
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

  it('should send create project request when no business data', async () => {
    superRender(<AddProject />);
    expect(addProjectSpy).toHaveBeenCalledTimes(0);

    fireEvent.input(screen.getByLabelText('项目名称'), {
      target: { value: 'name' }
    });
    fireEvent.input(screen.getByLabelText('项目描述'), {
      target: { value: 'desc' }
    });

    fireEvent.click(getBySelector('#isFixedBusiness'));
    expect(screen.queryByText('添加业务')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('关 闭').parentNode).toHaveAttribute('disabled');

    expect(addProjectSpy).toHaveBeenCalledTimes(1);
    expect(addProjectSpy).toHaveBeenCalledWith({
      project: { name: 'name', desc: 'desc', is_fixed_business: false, business: undefined }
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('创建项目name成功')).toBeInTheDocument();
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(EmitterKey.DMS_Refresh_Project_List);
    expect(screen.getByLabelText('项目名称')).toHaveValue('');
    expect(screen.getByLabelText('项目描述')).toHaveValue('');
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
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

  it('should send create project request when clicking submit button', async () => {
    const { baseElement } = superRender(<AddProject />);
    expect(addProjectSpy).toHaveBeenCalledTimes(0);

    fireEvent.input(screen.getByLabelText('项目名称'), {
      target: { value: 'name' }
    });
    fireEvent.input(screen.getByLabelText('项目描述'), {
      target: { value: 'desc' }
    });

    expect(screen.getByText('添加业务')).toBeInTheDocument();

    fireEvent.click(screen.getByText('添加业务'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('可用业务')).toBeInTheDocument();
    expect(getAllBySelector('.edit-button')).toHaveLength(2);
    expect(getAllBySelector('.delete-button')).toHaveLength(2);
    fireEvent.click(getAllBySelector('.delete-button')[0]);
    await act(async () => jest.advanceTimersByTime(100));
    expect(getAllBySelector('.edit-button')).toHaveLength(1);
    expect(getAllBySelector('.delete-button-disabled')).toHaveLength(1);
    fireEvent.click(getAllBySelector('.edit-button')[0]);
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.input(getAllBySelector('#editInput')[0], {
      target: { value: 'test' }
    });
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(getAllBySelector('.custom-icon-selected')[0]);
    await act(async () => jest.advanceTimersByTime(100));
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('关 闭').parentNode).toHaveAttribute('disabled');

    expect(addProjectSpy).toHaveBeenCalledTimes(1);
    expect(addProjectSpy).toHaveBeenCalledWith({
      project: {
        name: 'name',
        desc: 'desc',
        is_fixed_business: true,
        business: ['test']
      }
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('创建项目name成功')).toBeInTheDocument();
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(EmitterKey.DMS_Refresh_Project_List);
    expect(screen.getByLabelText('项目名称')).toHaveValue('');
    expect(screen.getByLabelText('项目描述')).toHaveValue('');
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
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
