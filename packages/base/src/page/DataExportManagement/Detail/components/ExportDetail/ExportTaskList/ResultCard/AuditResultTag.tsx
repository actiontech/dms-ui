import { BasicTag } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useMemo } from 'react';
import { Space } from 'antd';
import {
  IconOrderAuditResultSuccess,
  IconOrderAuditResultNotice,
  IconOrderAuditResultWarning,
  IconOrderAuditResultError
} from 'sqle/src/icon/Order';
import { IAuditSQLResult } from '@actiontech/shared/lib/api/base/service/common';

const AuditResultTag: React.FC<{ auditResult?: IAuditSQLResult[] }> = ({
  auditResult
}) => {
  const { t } = useTranslation();

  const noticeResult = useMemo(() => {
    return (
      auditResult?.filter((i) => i.level === RuleResV1LevelEnum.notice) || []
    );
  }, [auditResult]);

  const errorResult = useMemo(() => {
    return (
      auditResult?.filter((i) => i.level === RuleResV1LevelEnum.error) || []
    );
  }, [auditResult]);

  const warnResult = useMemo(() => {
    return (
      auditResult?.filter((i) => i.level === RuleResV1LevelEnum.warn) || []
    );
  }, [auditResult]);

  if (!auditResult?.length) {
    return (
      <BasicTag
        color="green"
        size="large"
        icon={<IconOrderAuditResultSuccess />}
        bordered={false}
      >
        {t('audit.auditSuccess')}
      </BasicTag>
    );
  } else {
    return (
      <Space>
        {noticeResult.length > 0 ? (
          <BasicTag
            color="blue"
            size="large"
            icon={<IconOrderAuditResultNotice />}
            bordered={false}
          >
            {noticeResult.length}
          </BasicTag>
        ) : null}
        {warnResult.length > 0 ? (
          <BasicTag
            color="orange"
            size="large"
            icon={<IconOrderAuditResultWarning />}
            bordered={false}
          >
            {warnResult.length}
          </BasicTag>
        ) : null}
        {errorResult.length > 0 ? (
          <BasicTag
            color="red"
            size="large"
            icon={<IconOrderAuditResultError />}
            bordered={false}
          >
            {errorResult.length}
          </BasicTag>
        ) : null}
      </Space>
    );
  }
};

export default AuditResultTag;
