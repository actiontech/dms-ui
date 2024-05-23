import { BasicTag } from '@actiontech/shared';
import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import { useTranslation } from 'react-i18next';
import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useMemo } from 'react';
import { Space } from 'antd';
import {
  IconLevelError,
  IconLevelNormal,
  IconLevelNotice,
  IconLevelWarn
} from '@actiontech/shared/lib/Icon/LevelIcon';
import { IconWorkflowAuditResultSuccess } from '../../../../../../../../../icon/SqlExecWorkflow';

export interface AuditResultTagProps {
  auditResult?: IAuditResult[];
}

const AuditResultTag: React.FC<AuditResultTagProps> = ({ auditResult }) => {
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

  const normalResult = useMemo(() => {
    return (
      auditResult?.filter((i) => i.level === RuleResV1LevelEnum.normal) || []
    );
  }, [auditResult]);

  if (!auditResult?.length) {
    return (
      <BasicTag
        color="green"
        size="large"
        icon={<IconWorkflowAuditResultSuccess />}
        bordered={false}
      >
        {t('audit.auditSuccess')}
      </BasicTag>
    );
  } else {
    return (
      <Space>
        {normalResult.length > 0 ? (
          <BasicTag
            color="gray"
            size="large"
            icon={<IconLevelNormal />}
            bordered={false}
          >
            {noticeResult.length}
          </BasicTag>
        ) : null}
        {noticeResult.length > 0 ? (
          <BasicTag
            color="blue"
            size="large"
            icon={<IconLevelNotice />}
            bordered={false}
          >
            {noticeResult.length}
          </BasicTag>
        ) : null}
        {warnResult.length > 0 ? (
          <BasicTag
            color="orange"
            size="large"
            icon={<IconLevelWarn />}
            bordered={false}
          >
            {warnResult.length}
          </BasicTag>
        ) : null}
        {errorResult.length > 0 ? (
          <BasicTag
            color="red"
            size="large"
            icon={<IconLevelError />}
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
