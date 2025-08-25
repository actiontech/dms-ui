import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Typography } from 'antd';
import { SensitiveDisplayWrapper, DisplayToggleWrapper } from './style';
import { TokenFilled } from '@actiontech/icons';
import { SensitiveDisplayProps } from './SensitiveDisplay.types';
import { BasicToolTip } from '../BasicToolTip';

const SensitiveDisplay: React.FC<SensitiveDisplayProps> = (props) => {
  const { t } = useTranslation();
  const { text } = props;
  const [showToken, setShowToken] = useState(false);

  const onChangeShowToken = () => {
    setShowToken(!showToken);
  };

  return (
    <SensitiveDisplayWrapper>
      <BasicToolTip
        title={
          showToken
            ? t('auditPlan.list.tip.token.show')
            : t('auditPlan.list.tip.token.hide')
        }
      >
        <DisplayToggleWrapper
          className="rect-border-wrapper"
          onClick={(e) => {
            e.stopPropagation();
            onChangeShowToken();
          }}
        >
          {showToken ? (
            <Typography.Text
              style={{
                width: 120,
                lineHeight: '20px'
              }}
              ellipsis
            >
              {text}
            </Typography.Text>
          ) : (
            <TokenFilled />
          )}
        </DisplayToggleWrapper>
      </BasicToolTip>
      <Typography.Text copyable={{ text, tooltips: false }}></Typography.Text>
    </SensitiveDisplayWrapper>
  );
};

export default SensitiveDisplay;
