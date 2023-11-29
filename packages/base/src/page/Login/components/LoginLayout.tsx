import {
  LoginPageStyleWrapper,
  LoginPageLeftStyleWrapper,
  LoginPageRightStyleWrapper
} from '../style';
import useSystemConfig from '../../../hooks/useSystemConfig.tsx';

const LoginLayout: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const { logoSrc, renderWebTitle } = useSystemConfig();

  return (
    <LoginPageStyleWrapper>
      <LoginPageLeftStyleWrapper>
        <div className="banner">
          <img
            src="/static/image/login-left-bg.png"
            className="login-background-img"
            alt="left_bg"
          />
        </div>
      </LoginPageLeftStyleWrapper>
      <LoginPageRightStyleWrapper>
        <div className="login-page-right-content">
          <div className="content-header">
            <div className="logo">
              <img src={logoSrc} alt="logo_img" />
            </div>
            {renderWebTitle()}
          </div>
          {children}
        </div>
      </LoginPageRightStyleWrapper>
    </LoginPageStyleWrapper>
  );
};

export default LoginLayout;
