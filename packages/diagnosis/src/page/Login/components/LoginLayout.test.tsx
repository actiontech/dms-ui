import { diagnosisSuperRender } from '../../../testUtils/superRender';
import LoginLayout from './LoginLayout';
import leftBg from '../../../assets/img/login-left-bg.png';
import i18n from '../../../locale';
import { screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('diagnosis/LoginLayout', () => {
  it('render login layout without props', () => {
    const { baseElement } = diagnosisSuperRender(<LoginLayout />);
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.banner img')).toHaveAttribute(
      'src',
      'login-left-bg.png'
    );
    expect(getBySelector('.logo img')).toHaveAttribute('src', '/logo.png');
    expect(screen.queryByText('Action')).toBeInTheDocument();
    expect(screen.queryByText('Diagnosis')).toBeInTheDocument();
  });

  it('render login layout with props', () => {
    const { baseElement } = diagnosisSuperRender(
      <LoginLayout leftBackgroundImg={leftBg}>
        <>{i18n.t('login.login')}</>
      </LoginLayout>
    );
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.banner img')).toHaveAttribute(
      'src',
      'login-left-bg.png'
    );
    expect(screen.queryByText('登录')).toBeInTheDocument();
  });
});
