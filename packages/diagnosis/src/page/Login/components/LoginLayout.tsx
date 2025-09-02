import {
  LoginPageStyleWrapper,
  LoginPageLeftStyleWrapper,
  LoginPageRightStyleWrapper
} from '../style';
import leftBg from '../../../assets/img/login-left-bg.png';

const LoginLayout: React.FC<{
  leftBackgroundImg?: string;
  children?: React.ReactNode;
}> = ({ leftBackgroundImg = leftBg, children }) => {
  return (
    <LoginPageStyleWrapper>
      <LoginPageLeftStyleWrapper>
        <div className="banner">
          <img
            src={leftBackgroundImg}
            className="login-background-img"
            alt="left_bg"
          />
        </div>
      </LoginPageLeftStyleWrapper>
      <LoginPageRightStyleWrapper>
        <div className="login-page-right-content">
          <div className="content-header">
            <div className="logo">
              <img src="/logo.png" alt="logo_img" />
            </div>
            <div className="title">
              <span className="label label-primary">Action</span>
              <span className="label label-base">Diagnosis</span>
            </div>
          </div>
          {children}
        </div>
      </LoginPageRightStyleWrapper>
    </LoginPageStyleWrapper>
  );
};

export default LoginLayout;
