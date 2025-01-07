import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { PasswordProps } from 'antd/lib/input';
import { BasicToolTip, BasicButton, Copy } from '@actiontech/shared';
import { Space } from 'antd';
import { PasswordWidthGenerateStyleWrapper } from './style';

interface IInputPassword extends PasswordProps {
  clickGeneratePassword: () => string;
}

const InputPassword: FC<IInputPassword> = ({
  clickGeneratePassword,
  disabled,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const [tipVisible, setTipVisible] = useState(false);

  const handleGenerateClick = () => {
    const pass = clickGeneratePassword();
    Copy.copyText(pass);
    setTipVisible(true);
  };
  const [isEye, setIsEye] = useState(false);
  return (
    <PasswordWidthGenerateStyleWrapper
      className="action-password-input"
      {...otherProps}
      disabled={disabled}
      visibilityToggle={{ visible: isEye }}
      iconRender={(visible) => (
        <>
          {visible ? (
            <EyeOutlined
              className="suffix-icon"
              onClick={() => setIsEye(false)}
            />
          ) : (
            <EyeInvisibleOutlined
              className="suffix-icon"
              onClick={() => setIsEye(true)}
            />
          )}
          <BasicToolTip
            open={tipVisible}
            placement="topRight"
            title={
              <Space>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="selected">
                    <path
                      id="Vector"
                      d="M3.33334 8.00002L6.66668 11.3334L13.3333 4.66669"
                      stroke="#4583FF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
                {t('common.generatePasswordSuccess')}
              </Space>
            }
          >
            <BasicButton
              type="primary"
              size="small"
              onClick={handleGenerateClick}
              onMouseLeave={() => setTipVisible(false)}
              disabled={disabled}
            >
              {t('common.generate')}
            </BasicButton>
          </BasicToolTip>
        </>
      )}
    />
  );
};
export default InputPassword;
