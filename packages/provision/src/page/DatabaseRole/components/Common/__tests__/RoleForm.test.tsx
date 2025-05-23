import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { act, renderHook } from '@testing-library/react';
import RoleForm from '../RoleForm';
import auth from '../../../../../testUtil/mockApi/auth';
import { mockOracleInstanceData } from '../../../../../testUtil/mockApi/auth/data';
import dbRole from '../../../../../testUtil/mockApi/dbRole';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { Form } from 'antd';
import { IDatabaseRoleFormFields } from '../index.type';

describe('provision/RoleForm', () => {
  let authListServicesSpy: jest.SpyInstance;
  let authListDBRoleTipsSpy: jest.SpyInstance;
  let authListOperationsSpy: jest.SpyInstance;
  let authListDatabasesSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    authListServicesSpy = auth.listServices();
    authListServicesSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: mockOracleInstanceData })
    );
    authListDBRoleTipsSpy = dbRole.authListDBRoleTips();
    authListOperationsSpy = auth.authListOperations();
    auth.listTables();
    authListDatabasesSpy = auth.listDataBases();
    mockUseCurrentUser();
    mockUseCurrentProject();
    mockUseDbServiceDriver();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('render init snap', async () => {
    jest.spyOn(Form, 'useWatch').mockReturnValue('test');
    const { result } = renderHook(() =>
      Form.useForm<IDatabaseRoleFormFields>()
    );
    const { container } = superRender(
      <RoleForm form={result.current[0]} mode="create" title="title" />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
    expect(authListServicesSpy).toHaveBeenCalledTimes(1);
    expect(authListDBRoleTipsSpy).toHaveBeenCalledTimes(1);
    expect(authListOperationsSpy).toHaveBeenCalledTimes(1);
    expect(authListDatabasesSpy).toHaveBeenCalledTimes(1);
  });
});
