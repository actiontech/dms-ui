import { useMemo } from 'react';
import { Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { BasicTag, EmptyBox, ReminderInformation } from '@actiontech/dms-kit';
import { BasicTagColor } from '@actiontech/dms-kit/es/theme/theme.type';
import {
  ICheckDBServicePrivilegeModule,
  ICheckDBServicesPrivilegesItem
} from '@actiontech/shared/lib/api/base/service/common';
import { PrivilegeCheckResultStyleWrapper } from './style';

type PrivilegeCheckResultProps = {
  result: ICheckDBServicesPrivilegesItem | null;
  visible: boolean;
};

const STATUS_TAG: Record<string, { color: BasicTagColor; i18nKey: string }> = {
  available: {
    color: 'green',
    i18nKey: 'dmsDataSource.dataSourceForm.privilegeStatusAvailable'
  },
  partially_available: {
    color: 'orange',
    i18nKey: 'dmsDataSource.dataSourceForm.privilegeStatusPartial'
  },
  unavailable: {
    color: 'red',
    i18nKey: 'dmsDataSource.dataSourceForm.privilegeStatusUnavailable'
  },
  unsupported_auto_check: {
    color: 'default',
    i18nKey: 'dmsDataSource.dataSourceForm.privilegeStatusUnsupported'
  }
};

const ModuleRow: React.FC<{ module: ICheckDBServicePrivilegeModule }> = ({
  module
}) => {
  const { t } = useTranslation();
  const statusMeta =
    STATUS_TAG[module.status ?? ''] ?? STATUS_TAG.unsupported_auto_check;
  const missing = module.missing_privileges ?? [];

  return (
    <div className="privilege-module-row">
      <Space wrap size={[8, 4]}>
        <Typography.Text>{module.module_name || module.module}</Typography.Text>
        <BasicTag color={statusMeta.color} size="small">
          {t(statusMeta.i18nKey)}
        </BasicTag>
      </Space>
      <EmptyBox
        if={
          (module.status === 'unavailable' ||
            module.status === 'partially_available') &&
          missing.length > 0
        }
      >
        <Typography.Text type="secondary" className="privilege-missing">
          {missing
            .map((item) =>
              item.object_scope
                ? `${item.privilege} (${item.object_scope})`
                : item.privilege
            )
            .filter(Boolean)
            .join('、')}
        </Typography.Text>
      </EmptyBox>
      <EmptyBox if={!!module.message}>
        <Typography.Text type="secondary" className="privilege-module-msg">
          {module.message}
        </Typography.Text>
      </EmptyBox>
    </div>
  );
};

const PrivilegeCheckResult: React.FC<PrivilegeCheckResultProps> = ({
  result,
  visible
}) => {
  const { t } = useTranslation();

  const isUnsupported = result?.check_support === 'unsupported_auto_check';
  const precheckFailed = result?.connectivity_precheck?.ok === false;
  const modules = useMemo(() => result?.modules ?? [], [result?.modules]);

  if (!visible || !result) {
    return null;
  }

  return (
    <PrivilegeCheckResultStyleWrapper>
      <Typography.Text strong>
        {t('dmsDataSource.dataSourceForm.privilegeResultTitle')}
      </Typography.Text>

      <EmptyBox if={precheckFailed}>
        <ReminderInformation
          status="error"
          message={
            result.connectivity_precheck?.error_message ||
            t('dmsDataSource.dataSourceForm.privilegePrecheckFailed')
          }
        />
        <Typography.Text type="secondary">
          {t('dmsDataSource.dataSourceForm.privilegePrecheckHint')}
        </Typography.Text>
      </EmptyBox>

      <EmptyBox if={isUnsupported && !precheckFailed}>
        <Typography.Text type="secondary">
          {t('dmsDataSource.dataSourceForm.privilegeUnsupportedAutoCheck')}
        </Typography.Text>
      </EmptyBox>

      <EmptyBox if={!precheckFailed}>
        <div className="privilege-module-list">
          {modules.map((module) => (
            <ModuleRow
              key={module.module || module.module_name}
              module={module}
            />
          ))}
        </div>
      </EmptyBox>

      <Typography.Text type="secondary" className="privilege-summary">
        {result.summary_message ||
          t('dmsDataSource.dataSourceForm.privilegeNotBlockSave')}
      </Typography.Text>
    </PrivilegeCheckResultStyleWrapper>
  );
};

export default PrivilegeCheckResult;
