import passwordSecurityPolicy from '../../../testUtil/mockApi/passwordSecurityPolicy';
import auth from '../../../testUtil/mockApi/auth';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import PasswordSecurityPolicyModal from '.';
import { cleanup, screen } from '@testing-library/react';
import { PasswordSecurityPolicyModalStatus } from '../../../store/databaseAccountPassword';
import { ModalName } from '../../../data/enum';

describe('provision/DatabaseAccountPassword/Modal', () => {
  beforeEach(() => {
    passwordSecurityPolicy.mockAllApi();
    auth.mockAllApi();
    mockUseCurrentProject();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (modalName: ModalName) => {
    return superRender(<PasswordSecurityPolicyModal />, undefined, {
      recoilRootProps: {
        initializeState({ set }) {
          set(PasswordSecurityPolicyModalStatus, {
            [modalName]: true
          });
        }
      }
    });
  };

  it('render add policy modal', async () => {
    const { baseElement } = customRender(
      ModalName.CreatePasswordSecurityPolicyModal
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('创建密码安全策略')).toBeInTheDocument();
  });

  it('render edit policy modal', async () => {
    const { baseElement } = customRender(
      ModalName.UpdatePasswordSecurityPolicyModal
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('编辑密码安全策略')).toBeInTheDocument();
  });
});
