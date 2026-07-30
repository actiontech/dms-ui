import { EmptyBox, ReminderInformation } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import PrivilegeCheckResult from '../../../DataSource/components/Form/PrivilegeCheckResult';
import {
  BatchImportConnectResultItem,
  BatchImportPrivilegeResultItem
} from '../hooks/useBatchCheckConnectable';
import { BatchImportCheckResultStyleWrapper } from '../style';

type BatchImportCheckResultProps = {
  visible: boolean;
  connectResultList?: BatchImportConnectResultItem[];
  privilegeResultList?: BatchImportPrivilegeResultItem[];
};

const BatchImportCheckResult: React.FC<BatchImportCheckResultProps> = ({
  visible,
  connectResultList,
  privilegeResultList
}) => {
  const { t } = useTranslation();

  if (!visible) {
    return null;
  }

  const hasConnect = (connectResultList?.length ?? 0) > 0;
  const hasPrivilege = (privilegeResultList?.length ?? 0) > 0;

  if (!hasConnect && !hasPrivilege) {
    return null;
  }

  return (
    <BatchImportCheckResultStyleWrapper>
      <Typography.Text strong>
        {t('dmsProject.batchImportDataSource.checkResultTitle')}
      </Typography.Text>

      <EmptyBox if={hasConnect}>
        <div className="batch-import-check-column connectivity-column">
          <Typography.Text className="column-title">
            {t('dmsProject.batchImportDataSource.connectivityColumn')}
          </Typography.Text>
          {connectResultList?.map((item) => (
            <div key={`connect-${item.name}`} className="column-row">
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Typography.Text>{item.name}</Typography.Text>
                <ReminderInformation
                  status={item.is_connectable ? 'success' : 'error'}
                  message={
                    item.is_connectable
                      ? t(
                          'dmsProject.batchImportDataSource.connectivitySuccess'
                        )
                      : item.connect_error_message ||
                        t('dmsProject.batchImportDataSource.connectivityFailed')
                  }
                />
              </Space>
            </div>
          ))}
        </div>
      </EmptyBox>

      <EmptyBox if={hasPrivilege}>
        <div className="batch-import-check-column privilege-column">
          <Typography.Text className="column-title">
            {t('dmsProject.batchImportDataSource.privilegeColumn')}
          </Typography.Text>
          {privilegeResultList?.map((item) => (
            <div key={`priv-${item.name}`} className="column-row">
              <Typography.Text>{item.name}</Typography.Text>
              <PrivilegeCheckResult result={item} visible />
            </div>
          ))}
        </div>
      </EmptyBox>
    </BatchImportCheckResultStyleWrapper>
  );
};

export default BatchImportCheckResult;
