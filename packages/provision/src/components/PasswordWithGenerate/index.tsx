import { FC, useState } from 'react';
import { Input, Button, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  CheckOutlined,
  EyeInvisibleOutlined,
  EyeOutlined
} from '@ant-design/icons';

import Copy from '../../utils/Copy';
import { PasswordProps } from 'antd/lib/input';
import { Box } from '@mui/system';

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
    <Input.Password
      className="action-password-input"
      {...otherProps}
      visibilityToggle={{ visible: isEye }}
      iconRender={(visible) => (
        <>
          {visible ? (
            <EyeOutlined onClick={() => setIsEye(false)} />
          ) : (
            <EyeInvisibleOutlined onClick={() => setIsEye(true)} />
          )}
          <Tooltip
            open={tipVisible}
            title={
              <>
                <Box
                  component="span"
                  sx={(theme) => ({ color: theme.color.success })}
                >
                  <CheckOutlined />
                </Box>
                {t('common.generatePasswordSuccess')}
              </>
            }
          >
            <Button
              type="primary"
              size="small"
              onClick={handleGenerateClick}
              onMouseLeave={() => setTipVisible(false)}
            >
              {t('common.generate')}
            </Button>
          </Tooltip>
        </>
      )}
    />
  );
};
export default InputPassword;
