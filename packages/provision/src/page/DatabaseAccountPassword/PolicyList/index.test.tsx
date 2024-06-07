import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import passwordSecurityPolicy from '../../../testUtil/mockApi/passwordSecurityPolicy';
import { passwordSecurityPolicyMockData } from '../../../testUtil/mockApi/passwordSecurityPolicy/data';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import auth from '../../../testUtil/mockApi/auth';
import PolicyList from './index';
import RecoilObservable from '../../../testUtil/RecoilObservable';
import { PasswordSecurityPolicyModalStatus } from '../../../store/databaseAccountPassword';
import { EventEmitterKey, ModalName } from '../../../data/enum';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import EventEmitter from '../../../utils/EventEmitter';

describe('provision/DatabaseAccountPassword/PolicyList', () => {
  let authListPasswordSecurityPoliciesSpy: jest.SpyInstance;
  let authDelPasswordSecurityPolicySpy: jest.SpyInstance;

  beforeEach(() => {
    authListPasswordSecurityPoliciesSpy =
      passwordSecurityPolicy.authListPasswordSecurityPolicies();
    authDelPasswordSecurityPolicySpy =
      passwordSecurityPolicy.authDelPasswordSecurityPolicy();
    auth.mockAllApi();
    mockUseCurrentProject();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  test('render init snap', async () => {
    const { baseElement } = superRender(<PolicyList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListPasswordSecurityPoliciesSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryAllByText('编 辑')).toHaveLength(4);
    expect(screen.queryAllByText('删 除')).toHaveLength(1);
  });

  test('filter data with search', async () => {
    superRender(<PolicyList />);
    expect(authListPasswordSecurityPoliciesSpy).toHaveBeenCalled();
    const searchText = 'search text';
    const inputEle = getBySelector('#actiontech-table-search-input');
    fireEvent.change(inputEle, {
      target: { value: searchText }
    });

    await act(async () => {
      fireEvent.keyDown(inputEle, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await jest.advanceTimersByTime(300);
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListPasswordSecurityPoliciesSpy).toHaveBeenCalledWith({
      page_index: 1,
      page_size: 20,
      keyword: searchText,
      project_uid: mockProjectInfo.projectID
    });
  });

  test('render emit "Refresh_Password_Management_list_Table" event', async () => {
    superRender(<PolicyList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListPasswordSecurityPoliciesSpy).toHaveBeenCalledTimes(1);
    await act(async () =>
      EventEmitter.emit(EventEmitterKey.Refresh_Password_Management_list_Table)
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListPasswordSecurityPoliciesSpy).toHaveBeenCalledTimes(2);
  });

  test('render delete policy', async () => {
    const eventEmitter = jest.spyOn(EventEmitter, 'emit');
    superRender(<PolicyList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListPasswordSecurityPoliciesSpy).toHaveBeenCalledTimes(1);
    expect(screen.queryAllByText('删 除')).toHaveLength(1);
    fireEvent.click(screen.getByText('删 除'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('确认删除密码安全策略:test1?')).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(authDelPasswordSecurityPolicySpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('删除密码安全策略成功')).toBeInTheDocument();
    expect(eventEmitter).toHaveBeenCalledTimes(1);
    expect(eventEmitter).toHaveBeenNthCalledWith(
      1,
      EventEmitterKey.Refresh_Password_Management_list_Table
    );
  });

  test('render edit policy', async () => {
    authListPasswordSecurityPoliciesSpy.mockClear();
    authListPasswordSecurityPoliciesSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [passwordSecurityPolicyMockData[0]] })
    );
    const modalStatusChangeSpy = jest.fn();
    superRender(
      <>
        <PolicyList />
        <RecoilObservable
          state={PasswordSecurityPolicyModalStatus}
          onChange={modalStatusChangeSpy}
        />
      </>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListPasswordSecurityPoliciesSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('编 辑')).toBeInTheDocument();
    fireEvent.click(screen.getByText('编 辑'));
    expect(modalStatusChangeSpy).toHaveBeenCalledTimes(1);
    expect(modalStatusChangeSpy).toHaveBeenNthCalledWith(1, {
      [ModalName.CreatePasswordSecurityPolicyModal]: false,
      [ModalName.UpdatePasswordSecurityPolicyModal]: true
    });
  });
});
