import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { PasswordProps } from 'antd/lib/input';
import { BasicToolTips, BasicButton, Copy } from '@actiontech/shared';
import { IconCommonSelected } from '@actiontech/shared/lib/Icon';
import { Space } from 'antd5';
import { PasswordWidthGenerateStyleWrapper } from './style';

interface IInputPassword extends PasswordProps {
  clickGeneratePassword: () => string;
}

const InputPassword: FC<IInputPassword> = ({
  clickGeneratePassword,
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
          <BasicToolTips
            open={tipVisible}
            placement="topRight"
            title={
              <Space>
                <IconCommonSelected />
                {t('common.generatePasswordSuccess')}
              </Space>
            }
          >
            <BasicButton
              type="primary"
              size="small"
              onClick={handleGenerateClick}
              onMouseLeave={() => setTipVisible(false)}
            >
              {t('common.generate')}
            </BasicButton>
          </BasicToolTips>
        </>
      )}
    />
  );
};
export default InputPassword;
