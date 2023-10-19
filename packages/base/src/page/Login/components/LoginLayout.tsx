import {
  LoginPageStyleWrapper,
  LoginPageLeftStyleWrapper,
  LoginPageRightStyleWrapper
} from '../style';
import leftBg from '../../../assets/img/login-left-bg.png';
import useSystemConfig from '../../../hooks/useSystemConfig.tsx';

const LoginLayout: React.FC<{
  leftBackgroundImg?: string;
  children?: React.ReactNode;
}> = ({ leftBackgroundImg = leftBg, children }) => {
  const { logoSrc, renderWebTitle } = useSystemConfig();

  return (
    <LoginPageStyleWrapper>
      <LoginPageLeftStyleWrapper>
        <img
          src={leftBackgroundImg}
          className="login-background-img"
          alt="left_bg"
        />
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
