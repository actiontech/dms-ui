import { useTranslation } from 'react-i18next';
import { Alert, Card, Space, Spin, Typography, message } from 'antd';
import { BasicButton, BasicToolTip } from '@actiontech/dms-kit';
import { Copy } from '@actiontech/dms-kit';
import SystemBasicTitle from '../components/BasicTitle';
import { useRequest } from 'ahooks';
import { SqleApi } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/dms-kit';
import { GitSSHConfigStyleWrapper } from './style';
const { Text, Paragraph } = Typography;
const GitSSHConfig: React.FC = () => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const {
    loading: getLoading,
    run: getPublicKey,
    data: publicKey
  } = useRequest(() => {
    return SqleApi.ConfigurationService.getSSHPublicKey().then(
      (res) => res.data.data?.public_key
    );
  });
  const { loading: generateLoading, run: generateSSHKey } = useRequest(
    () => {
      return SqleApi.ConfigurationService.genSSHPublicKey();
    },
    {
      manual: true,
      onSuccess: (res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          getPublicKey();
        }
      }
    }
  );
  const onCopy = () => {
    if (publicKey) {
      Copy.copyTextByTextarea(publicKey);
      messageApi.success(t('common.copied'));
    }
  };
  return (
    <SystemBasicTitle title={t('dmsSystem.tabPaneTitle.gitSSH')}>
      {messageContextHolder}
      <Spin spinning={getLoading || generateLoading}>
        <GitSSHConfigStyleWrapper>
          <Space direction="vertical" size={16} className="full-width-element">
            <BasicToolTip suffixIcon title={t('dmsSystem.gitSSH.description')}>
              <Typography.Text>{t('dmsSystem.gitSSH.title')}</Typography.Text>
            </BasicToolTip>
            {publicKey ? (
              <Space
                direction="vertical"
                size={16}
                className="full-width-element"
              >
                <div className="key-header">
                  <Text strong>{t('dmsSystem.gitSSH.publicKeyTitle')}</Text>
                  <BasicButton onClick={onCopy}>{t('common.copy')}</BasicButton>
                </div>
                <Card>
                  <Paragraph>{publicKey}</Paragraph>
                </Card>
              </Space>
            ) : (
              <BasicButton
                type="primary"
                onClick={generateSSHKey}
                loading={generateLoading}
              >
                {t('dmsSystem.gitSSH.generate')}
              </BasicButton>
            )}
          </Space>

          <Alert
            type="success"
            message={
              <Space direction="vertical">
                <Text strong>{t('dmsSystem.gitSSH.instructions')}</Text>
                <Text>{t('dmsSystem.gitSSH.step1')}</Text>
                <Text>{t('dmsSystem.gitSSH.step2')}</Text>
                <Text>{t('dmsSystem.gitSSH.step3')}</Text>
              </Space>
            }
          />
        </GitSSHConfigStyleWrapper>
      </Spin>
    </SystemBasicTitle>
  );
};
export default GitSSHConfig;
