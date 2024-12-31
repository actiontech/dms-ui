import dbAccountService from '../../../testUtil/mockApi/dbAccountService';
import passwordSecurityPolicy from '../../../testUtil/mockApi/passwordSecurityPolicy';
import auth from '../../../testUtil/mockApi/auth';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import DatabaseAccountModal from '.';
import { cleanup, screen } from '@testing-library/react';
import { DatabaseAccountModalStatus } from '../../../store/databaseAccount';
import { ModalName } from '../../../data/enum';
import user from '../../../testUtil/mockApi/user';

describe.skip('provision/DatabaseAccount/DatabaseAccountModal', () => {
  beforeEach(() => {
    dbAccountService.mockAllApi();
    passwordSecurityPolicy.mockAllApi();
    auth.mockAllApi();
    user.mockAllApi();
    mockUseCurrentProject();
    mockUseDbServiceDriver();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (modalName: ModalName) => {
    return superRender(<DatabaseAccountModal />, undefined, {
      recoilRootProps: {
        initializeState({ set }) {
          set(DatabaseAccountModalStatus, {
            [modalName]: true
          });
        }
      }
    });
  };

  it('render account discovery modal', async () => {
    const { baseElement } = customRender(
      ModalName.DatabaseAccountDiscoveryModal
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('账号发现')).toBeInTheDocument();
  });

  it('render authorize modal', async () => {
    const { baseElement } = customRender(
      ModalName.DatabaseAccountAuthorizeModal
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('账号授权')).toBeInTheDocument();
  });

  it('render batch modify password modal', async () => {
    const { baseElement } = customRender(
      ModalName.DatabaseAccountBatchModifyPasswordModal
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('批量修改密码')).toBeInTheDocument();
  });

  it('render account detail modal', async () => {
    const { baseElement } = customRender(ModalName.DatabaseAccountDetailModal);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('账号详情')).toBeInTheDocument();
  });

  it('render manage password modal', async () => {
    const { baseElement } = customRender(
      ModalName.DatabaseAccountManagePasswordModal
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('托管密码')).toBeInTheDocument();
  });

  it('render modify password modal', async () => {
    const { baseElement } = customRender(
      ModalName.DatabaseAccountModifyPasswordModal
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('修改密码')).toBeInTheDocument();
  });

  it('render renewal password modal', async () => {
    const { baseElement } = customRender(
      ModalName.DatabaseAccountRenewalPasswordModal
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('续用当前密码')).toBeInTheDocument();
  });
});
