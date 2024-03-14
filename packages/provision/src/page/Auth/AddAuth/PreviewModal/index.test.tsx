import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { IAddAuthorization } from '@actiontech/shared/lib/api/provision/service/common';
import auth from '../../../../testUtil/mockApi/auth';

import PreviewModal from '.';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';

describe('page/Auth/AddAuth/PreviewModal', () => {
  const onSuccessFn = jest.fn();
  const setParamsFn = jest.fn();
  const params_db_account = {
    hostname: '1.1.1.1',
    username: 'test',
    password: 'test'
  };
  const paramsData = {
    data_permission_template_uid: 'test-uid',
    db_account: params_db_account,
    used_by_sql_workbench: false
  };

  const customRender = (params?: any) => {
    return superRender(
      <PreviewModal
        params={(params ? params : paramsData) as IAddAuthorization}
        onSuccess={onSuccessFn}
        setParams={setParamsFn}
      />,
      undefined,
      {}
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    auth.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render when params is undefined', () => {
    const { baseElement } = customRender({});
    expect(baseElement).toMatchSnapshot();
  });

  it('render when has params and ready format sql', async () => {
    const requestGetStatements = auth.getStatementsByDataPermissionTemplate();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetStatements).toHaveBeenCalled();
    expect(requestGetStatements).toHaveBeenCalledWith({
      data_permission_template_uid: paramsData.data_permission_template_uid,
      db_account_hostname: params_db_account.hostname,
      db_account_password: params_db_account.password,
      db_account_username: params_db_account.username
    });

    expect(baseElement).toMatchSnapshot();
  });

  it('render closed btn', async () => {
    customRender({});

    fireEvent.click(screen.getByText('关 闭'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(setParamsFn).toHaveBeenCalled();
    expect(setParamsFn).toHaveBeenCalledWith();
  });

  it('render submit data for api return success', async () => {
    const requestGetStatements = auth.getStatementsByDataPermissionTemplate();
    const requestSubmitFn = auth.addAuthorization();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetStatements).toHaveBeenCalled();

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestSubmitFn).toHaveBeenCalled();
    expect(requestSubmitFn).toHaveBeenCalledWith({ authorization: paramsData });

    expect(onSuccessFn).toHaveBeenCalled();
  });

  it('render submit data for api return error', async () => {
    const requestGetStatements = auth.getStatementsByDataPermissionTemplate();
    const requestSubmitFn = auth.addAuthorization();
    requestSubmitFn.mockImplementation(() => createSpyFailResponse({}));
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetStatements).toHaveBeenCalled();

    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3300));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestSubmitFn).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });
});
