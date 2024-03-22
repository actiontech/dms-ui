import { BasicButton, EmptyBox, TokenCom } from '@actiontech/shared';
import { LabelContent } from '@actiontech/shared/lib/components/ConfigItem';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { useTranslation } from 'react-i18next';
import { AccessTokenConfigStyleWrapper } from './style';
import classNames from 'classnames';
import { useBoolean } from 'ahooks';
import GenerateTokenModal from './GenerateTokenModal';
import { AccessTokenProps } from '../../index.type';

const AccessToken: React.FC<AccessTokenProps> = ({
  token,
  hasExpired,
  expiration,
  updateUserInfo
}) => {
  const { t } = useTranslation();

  const [generateTokenOpen, { setFalse: closeModal, setTrue: openModal }] =
    useBoolean();

  return (
    <>
      <AccessTokenConfigStyleWrapper
        className={classNames({ 'clear-padding-top': !!token })}
      >
        <div className="label-content">
          <LabelContent tips={t('dmsAccount.accessToken.desc')}>
            {t('dmsAccount.accessToken.label')}
          </LabelContent>
          <BasicButton onClick={openModal} type="primary">
            {t('dmsAccount.accessToken.generateToken.buttonText')}
          </BasicButton>
        </div>

        <EmptyBox if={!!token}>
          <div className="token-content">
            <div className="token-content-item">
              <span className="token-content-item-label">Token</span>
              <TokenCom text={token!} />
            </div>
            <div className="token-content-item">
              <span className="token-content-item-label">
                {t('dmsAccount.accessToken.expiration')}
              </span>
              <span className="token-content-item-value">
                {hasExpired
                  ? t('dmsAccount.accessToken.hasExpired')
                  : formatTime(expiration, '-')}
              </span>
            </div>
          </div>
        </EmptyBox>
      </AccessTokenConfigStyleWrapper>

      <GenerateTokenModal
        open={generateTokenOpen}
        onClose={closeModal}
        refresh={updateUserInfo}
      />
    </>
  );
};

export default AccessToken;
