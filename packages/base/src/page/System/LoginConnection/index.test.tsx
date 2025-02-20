import system from '../../../testUtils/mockApi/system';
import { cleanup, act, screen, fireEvent } from '@testing-library/react';
import LoginConnection from '.';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import {
  LDAPConfig,
  oauthConfig
} from '../../../testUtils/mockApi/system/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

describe('base/System/LoginConnection', () => {
  const customRender = () => {
    return superRender(<LoginConnection />);
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    system.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(baseElement).toMatchSnapshot();
  });

  it('should disabled password login when OAuth2 is disabled', async () => {
    system.getOauth2Config().mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          ...oauthConfig,
          enable_oauth2: false
        }
      })
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    const switchEle = screen.getByTestId(
      'password-disabled-login-switch-disabled-mode'
    );
    fireEvent.mouseOver(switchEle);
    expect(switchEle).toBeDisabled();
    await screen.findByText('需先启用OAuth2.0登录');
  });

  it('should update context value when OAuth is enabled', async () => {
    system.getOauth2Config().mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          ...oauthConfig,
          enable_oauth2: true
        }
      })
    );
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    const switchEle = screen.getByTestId('password-disabled-login-switch');
    expect(switchEle).not.toBeDisabled();
  });

  it('should update context value when LDAP is enabled', async () => {
    system.getOauth2Config().mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          ...oauthConfig,
          enable_oauth2: true
        }
      })
    );
    system.getLDAPConfig().mockImplementation(() => {
      return createSpySuccessResponse({
        data: {
          ...LDAPConfig,
          enable_ldap: true
        }
      });
    });
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    const switchEle = screen.getByTestId('password-disabled-login-switch');
    fireEvent.click(switchEle);

    await screen.findByText(
      'LDAP服务基于账密登录，会同时被禁用，是否确认开启禁用？'
    );
  });
});
