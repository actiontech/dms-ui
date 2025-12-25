import { baseSuperRender } from '../../../testUtils/superRender';
import OAuth2LoginForm from './OAuth2LoginForm';
import { screen } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { DMS_REDIRECT_KEY_PARAMS_NAME } from '@actiontech/dms-kit';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useSearchParams: jest.fn()
  };
});

describe('page/Login/OAuth2LoginForm', () => {
  const useSearchParamsSpy: jest.Mock = useSearchParams as jest.Mock;

  beforeEach(() => {
    useSearchParamsSpy.mockReturnValue([new URLSearchParams()]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render OAuth2 login form with default login tip', () => {
    const { baseElement } = baseSuperRender(<OAuth2LoginForm />);

    expect(
      screen.getByText('点击下方按钮跳转到授权页面进行登录：')
    ).toBeInTheDocument();
    expect(screen.getByText('使用第三方账户登录')).toBeInTheDocument();

    const loginBtn = getBySelector('.oauth2-login-btn', baseElement);
    expect(loginBtn).toHaveAttribute('href', '/v1/dms/oauth2/link');
    expect(baseElement).toMatchSnapshot();
  });

  it('should render OAuth2 login form with custom login tip', () => {
    const customLoginTip = 'Login with OAuth2';
    const { baseElement } = baseSuperRender(
      <OAuth2LoginForm loginTip={customLoginTip} />
    );

    expect(
      screen.getByText('点击下方按钮跳转到授权页面进行登录：')
    ).toBeInTheDocument();
    expect(screen.getByText(customLoginTip)).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should generate correct OAuth2 login URL with target parameter', () => {
    useSearchParamsSpy.mockReturnValue([
      new URLSearchParams({
        target: '/some/path'
      })
    ]);

    const { baseElement } = baseSuperRender(<OAuth2LoginForm />);

    const loginBtn = getBySelector('.oauth2-login-btn', baseElement);
    expect(loginBtn).toHaveAttribute(
      'href',
      `/v1/dms/oauth2/link?${DMS_REDIRECT_KEY_PARAMS_NAME}=${encodeURIComponent(
        '/some/path'
      )}`
    );
  });
});
