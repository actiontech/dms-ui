import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Typography } from 'antd';
import { TokenWrapperStyleWrapper, TokenRectStyleWrapper } from './style';
import BasicToolTips from '../BasicToolTips';
import { TokenFilled } from '@actiontech/icons';

type typeTokenCom = {
  text: string;
};

const TokenCom = (props: typeTokenCom) => {
  const { t } = useTranslation();
  const { text } = props;
  const [showToken, setShowToken] = useState(false);

  const onChangeShowToken = () => {
    setShowToken(!showToken);
  };

  return (
    <TokenWrapperStyleWrapper>
      <BasicToolTips
        title={
          showToken
            ? t('auditPlan.list.tip.token.show')
            : t('auditPlan.list.tip.token.hide')
        }
      >
        <TokenRectStyleWrapper
          className="rect-border-wrapper"
          onClick={onChangeShowToken}
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
        </TokenRectStyleWrapper>
      </BasicToolTips>
      <Typography.Text copyable={{ text, tooltips: false }}></Typography.Text>
    </TokenWrapperStyleWrapper>
  );
};

export default TokenCom;
