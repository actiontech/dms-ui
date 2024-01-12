import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import {
  renderHook,
  cleanup,
  act,
} from '@testing-library/react';
import { Form } from 'antd';

import instance from '../../../../../testUtils/mockApi/instance';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';

import useTestDatabaseConnect from '../useTestDatabaseConnect';

describe('sqle/Order/Create/useTestDatabaseConnect', () => {
  let requestConnectCheck: jest.SpyInstance;

  const customRender = () => {
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<any>()
    );
    return renderHook(() =>
      useTestDatabaseConnect({
        projectName: 'project name',
        form: result.current[0]
      })
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    requestConnectCheck = instance.batchCheckInstanceIsConnectableByName();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render testDatabaseConnect', async () => {
    const { result } = customRender();

    expect(result.current.testLoading).toBeFalsy();
    expect(result.current.disabledTestConnect).toBeFalsy();
    await act(async () => {
      result.current.testDatabaseConnect();
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(result.current.testLoading).toBeTruthy();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.testLoading).toBeFalsy();
    expect(requestConnectCheck).toBeCalled();

    await act(async () => {
      const DatabasesConnectInfo = result.current.renderTestDatabasesConnectInfo('mysql-1');
      expect(DatabasesConnectInfo).toMatchSnapshot();
    });
  });

  it('render Reset_Create_Order_Form', async () => {
    const { result } = customRender();

    await act(async () => {
      EventEmitter.emit(EmitterKey.Reset_Create_Order_Form);
      await act(async () => jest.advanceTimersByTime(300));
      const DatabasesConnectInfo =
        result.current.renderTestDatabasesConnectInfo('mysql-1');
      expect(DatabasesConnectInfo).toBeNull();
    });
  });
});
