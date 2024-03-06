import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { EventEmitterKey, ModalName } from '../../../../../../data/enum';
import {
  AuthListModalStatus,
  AuthListSelectData
} from '../../../../../../store/auth/list';
import { authorizationList } from '../../../../../../testUtil/mockApi/auth/data';
import UpdateSQLWorkbenchQueryStatus from '../UpdateSQLWorkbenchQueryStatus';
import auth from '../../../../../../testUtil/mockApi/auth';
import { getBySelector } from '../../../../../../testUtil/customQuery';
import eventEmitter from '../../../../../../utils/EventEmitter';

describe('page/Auth/AuthList/UpdateSQLWorkbenchQueryStatus', () => {
  const customRender = (
    defaultVisible = true,
    selectData = authorizationList[0]
  ) => {
    return superRender(<UpdateSQLWorkbenchQueryStatus />, undefined, {
      recoilRootProps: {
        initializeState({ set }) {
          set(AuthListModalStatus, {
            [ModalName.UpdateSQLWorkbenchQueryStatus]: defaultVisible
          });
          set(AuthListSelectData, selectData);
        }
      }
    });
  };

  beforeEach(() => {
    jest.useFakeTimers();
    auth.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snapshot', () => {
    const { baseElement } = customRender(true);

    expect(baseElement).toMatchSnapshot();
  });

  it('render init snapshot when "used_by_sql_workbench" is equal true', () => {
    const { baseElement } = customRender(true, authorizationList[2]);

    expect(baseElement).toMatchSnapshot();
  });

  it('render close icon btn', async () => {
    const { baseElement } = customRender();

    const closeIcon = getBySelector('.anticon-close', baseElement);
    fireEvent.click(closeIcon);
    await act(async () => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();
  });

  it('render close text btn', async () => {
    const { baseElement } = customRender();
    fireEvent.click(screen.getByText('关 闭'));
    await act(() => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();
  });

  it('render submit', async () => {
    const emitSpy = jest.spyOn(eventEmitter, 'emit');
    const request = auth.updateAuthorization();

    const { baseElement } = customRender(true);

    fireEvent.click(getBySelector('#used_by_sql_workbench'));

    fireEvent.click(screen.getByText('提 交'));
    await act(() => jest.advanceTimersByTime(0));

    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith({
      authorization_uid: authorizationList[0]?.uid ?? '',
      authorization: {
        used_by_sql_workbench: true
      }
    });
    await act(async () => {
      jest.advanceTimersByTime(3000);
      await act(() => jest.advanceTimersByTime(300));
    });

    expect(screen.getByText('更新成功')).toBeInTheDocument();
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith(
      EventEmitterKey.Refresh_Auth_List_Table
    );
    await act(() => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();
  });
});
