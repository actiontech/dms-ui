import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import project from '@actiontech/shared/lib/testUtil/mockApi/base/project';
import EventEmitter from '../../../../utils/EventEmitter';
import { baseSuperRender } from '../../../../testUtils/superRender';
import AddProject from '../AddProject';
import { act, fireEvent, screen } from '@testing-library/react';
import EmitterKey from '../../../../data/EmitterKey';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { SupportLanguage } from '@actiontech/shared/lib/enum';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

jest.mock('../../../../locale', () => {
  return {
    ...jest.requireActual('../../../../locale'),
    getPreferredLanguages: jest.fn()
  };
});

describe('test base/page/project/drawer/add', () => {
  const dispatchSpy = jest.fn();
  let addProjectSpy: jest.SpyInstance;
  let emitSpy: jest.SpyInstance;
  let listBusinessTagsSpy: jest.SpyInstance;

  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        project: { modalStatus: { [ModalName.DMS_Add_Project]: true } }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    addProjectSpy = project.addProject();
    listBusinessTagsSpy = project.listBusinessTags();
    emitSpy = jest.spyOn(EventEmitter, 'emit');
    mockUseCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot', () => {
    const { baseElement } = baseSuperRender(<AddProject />);
    expect(baseElement).toMatchSnapshot();
    expect(listBusinessTagsSpy).toHaveBeenCalledTimes(1);
  });

  it('should send create project request', async () => {
    baseSuperRender(<AddProject />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.input(screen.getByLabelText('项目名称'), {
      target: { value: 'name' }
    });
    fireEvent.input(screen.getByLabelText('项目描述'), {
      target: { value: 'desc' }
    });

    fireEvent.mouseDown(getBySelector('#priority'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getBySelector('div[title="高"]'));
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(getBySelector('.editable-select-trigger'));
    await act(async () => jest.advanceTimersByTime(0));
    const firstOption = getAllBySelector('.ant-dropdown-menu-item')[0];
    fireEvent.click(firstOption);
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByText('提 交').parentNode).toHaveClass('ant-btn-loading');
    expect(screen.getByText('关 闭').parentNode).toHaveAttribute('disabled');

    expect(addProjectSpy).toHaveBeenCalledTimes(1);
    expect(addProjectSpy).toHaveBeenCalledWith({
      project: {
        name: 'name',
        desc: 'desc',
        business_tag: {
          uid: '1'
        },
        project_priority: 'high'
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

  it('should match snapshot when getPreferredLanguages return "en-us"', async () => {
    mockUseCurrentUser({ language: SupportLanguage.enUS });
    const { baseElement } = baseSuperRender(<AddProject />);

    expect(baseElement).toMatchSnapshot();
  });
});
