import { act, fireEvent, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import LoginBasicSetting from '.';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import system from '../../../../testUtils/mockApi/system';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { useLoginConnectionContext } from '../context';

jest.mock('../context', () => ({
  useLoginConnectionContext: jest.fn()
}));

describe('LoginBasicSetting', () => {
  let requestUpdateLoginConfig: jest.SpyInstance;
  let requestGetLoginTips: jest.SpyInstance;
  const mockUseLoginConnectionContext = ({
    isLDAPEnabled = false,
    isOAuthEnabled = false
  } = {}) => {
    (useLoginConnectionContext as jest.Mock).mockImplementation(() => ({
      isLDAPEnabled,
      isOAuthEnabled
    }));
  };

  beforeEach(() => {
    jest.useFakeTimers();
    requestUpdateLoginConfig = system.updateLoginConfiguration();
    requestGetLoginTips = system.getLoginTips();
    mockUseLoginConnectionContext();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('updateLoginConfig', () => {
    it('should match snapshot', async () => {
      const { baseElement } = superRender(<LoginBasicSetting />);
      await act(async () => jest.advanceTimersByTime(3000));
      expect(baseElement).toMatchSnapshot();
    });

    it('should update login button text and refresh when success', async () => {
      const { baseElement } = superRender(<LoginBasicSetting />);
      await act(async () => jest.advanceTimersByTime(3000));

      expect(requestGetLoginTips).toHaveBeenCalled();

      const editBtn = getBySelector(
        '.config-item-filed-edit-button',
        baseElement
      );
      fireEvent.click(editBtn);
      const inputEle = getBySelector('#editInput', baseElement);
      fireEvent.change(inputEle, {
        target: {
          value: 'new button text'
        }
      });
      fireEvent.keyDown(inputEle, {
        key: 'Enter',
        keyCode: 13
      });

      expect(requestUpdateLoginConfig).toHaveBeenCalledWith({
        login: {
          login_button_text: 'new button text'
        }
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestGetLoginTips).toHaveBeenCalledTimes(2);
    });

    it('should disable password login when oauth is disabled', async () => {
      mockUseLoginConnectionContext({
        isLDAPEnabled: true,
        isOAuthEnabled: false
      });
      superRender(<LoginBasicSetting />);
      await act(async () => jest.advanceTimersByTime(3000));
      const switchEle = screen.getByTestId(
        'password-disabled-login-switch-disabled-mode'
      );
      expect(switchEle).toBeDisabled();

      fireEvent.mouseOver(switchEle);

      await screen.findByText('需先启用OAuth2.0登录');
    });

    it('should update password login status and refresh when success', async () => {
      mockUseLoginConnectionContext({
        isLDAPEnabled: true,
        isOAuthEnabled: true
      });

      superRender(<LoginBasicSetting />);
      await act(async () => jest.advanceTimersByTime(3000));
      const switchEle = screen.getByTestId('password-disabled-login-switch');

      fireEvent.click(switchEle);

      await screen.findByText(
        'LDAP服务基于账密登录，会同时被禁用，是否确认开启禁用？'
      );

      fireEvent.click(screen.getByText('确 认'));

      expect(requestUpdateLoginConfig).toHaveBeenCalledWith({
        login: {
          disable_user_pwd_login: true
        }
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestGetLoginTips).toHaveBeenCalledTimes(2);
    });

    it('should not refresh when api returns error', async () => {
      requestUpdateLoginConfig.mockImplementation(() =>
        createSpyFailResponse({})
      );

      const { baseElement } = superRender(<LoginBasicSetting />);
      await act(async () => jest.advanceTimersByTime(3000));

      const editBtn = getBySelector(
        '.config-item-filed-edit-button',
        baseElement
      );
      fireEvent.click(editBtn);
      const inputEle = getBySelector('#editInput', baseElement);
      fireEvent.change(inputEle, {
        target: {
          value: 'new button text'
        }
      });
      fireEvent.keyDown(inputEle, {
        key: 'Enter',
        keyCode: 13
      });
      await act(async () => jest.advanceTimersByTime(3000));

      expect(requestGetLoginTips).toHaveBeenCalledTimes(1);
    });
  });
});
