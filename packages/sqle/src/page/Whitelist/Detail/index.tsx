import { useCallback, useMemo } from 'react';
import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { Space, Spin, message } from 'antd';
import {
  BasicButton,
  BasicDrawer,
  BasicTag,
  EmptyBox
} from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import AuditWhitelistService from '@actiontech/shared/lib/api/sqle/service/audit_whitelist';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { AuditWhitelistResV1RuleScopeModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { formatMatchMode, formatRuleScope } from '../../RuleException/utils';
import { auditWhitelistRecordToDisplayRecord } from '../utils';
import { AuditWhitelistMatchTypeDirection } from '../../../components/RuleExceptionMatchConditions/index.data';
import useSourceTips, {
  resolveAuditTaskTypeLabel
} from '../../../hooks/useSourceTips';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import AuditResultMessage from '../../../components/AuditResultMessage';
import {
  DetailFieldCard,
  DetailMetaInfoCardStyleWrapper,
  DetailMetaInfoItem,
  MatchModeItemsList,
  RuleExceptionDetailStyleWrapper
} from '../../../components/RuleException/DetailDisplay';

type WhitelistDetailDrawerProps = {
  open: boolean;
  auditWhitelistId?: number;
  onClose: () => void;
  onEdit?: (record: IAuditWhitelistResV1) => void;
  onDeleted?: () => void;
  zIndex?: number;
};

const getMatchTypeLabel = (type?: string) => {
  if (
    type &&
    Object.prototype.hasOwnProperty.call(AuditWhitelistMatchTypeDirection, type)
  ) {
    return AuditWhitelistMatchTypeDirection[
      type as keyof typeof AuditWhitelistMatchTypeDirection
    ];
  }
  return type ?? '-';
};

const WhitelistDetailDrawer: React.FC<WhitelistDetailDrawerProps> = ({
  open,
  auditWhitelistId,
  onClose,
  onEdit,
  onDeleted,
  zIndex
}) => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { projectName } = useCurrentProject();
  const { generateSourceSelectOptions } = useSourceTips();

  const { data: detail, loading } = useRequest(
    async () => {
      if (!auditWhitelistId) {
        return undefined;
      }
      const res = await AuditWhitelistService.getAuditWhitelistByIDV1({
        project_name: projectName,
        audit_whitelist_id: `${auditWhitelistId}`
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        return res.data.data;
      }
      throw new Error(res.data.message);
    },
    {
      ready: open && !!auditWhitelistId,
      refreshDeps: [auditWhitelistId, open, projectName]
    }
  );

  const displayRecord = useMemo(
    () => (detail ? auditWhitelistRecordToDisplayRecord(detail) : undefined),
    [detail]
  );

  const matchModeItems = useMemo(() => {
    if (!displayRecord) {
      return [];
    }
    return formatMatchMode(displayRecord, getMatchTypeLabel, {
      resolveAuditTaskTypeLabel: (content) =>
        resolveAuditTaskTypeLabel(content, generateSourceSelectOptions)
    });
  }, [displayRecord, generateSourceSelectOptions]);

  const formattedRuleScope = useMemo(() => {
    if (!displayRecord) {
      return undefined;
    }
    return formatRuleScope(displayRecord);
  }, [displayRecord]);

  const ruleScopeDbTypes = useMemo(() => {
    if (
      !formattedRuleScope ||
      formattedRuleScope.mode === AuditWhitelistResV1RuleScopeModeEnum.all
    ) {
      return [];
    }
    const dbTypes = formattedRuleScope.rules
      .map((rule) => rule.dbType?.trim())
      .filter((dbType): dbType is string => !!dbType);
    return [...new Set(dbTypes)];
  }, [formattedRuleScope]);

  const handleDelete = useCallback(() => {
    if (!auditWhitelistId) {
      return;
    }
    const hide = messageApi.loading(t('whitelist.operate.deleting'));
    AuditWhitelistService.deleteAuditWhitelistByIdV1({
      project_name: projectName,
      audit_whitelist_id: `${auditWhitelistId}`
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('whitelist.operate.deleteSuccess'));
          onDeleted?.();
          onClose();
        }
      })
      .finally(() => hide());
  }, [auditWhitelistId, messageApi, onClose, onDeleted, projectName, t]);

  const renderRuleScopeTag = () => {
    if (!formattedRuleScope) {
      return null;
    }
    const isAll =
      formattedRuleScope.mode === AuditWhitelistResV1RuleScopeModeEnum.all;
    return (
      <Space size={8}>
        <BasicTag size="small">
          {isAll
            ? t('ruleException.ruleScope.all')
            : t('ruleException.ruleScope.specific', {
                count: formattedRuleScope.ruleLabels.length
              })}
        </BasicTag>
        {ruleScopeDbTypes.map((dbType) => (
          <BasicTag key={dbType} size="small">
            {dbType}
          </BasicTag>
        ))}
      </Space>
    );
  };

  const renderRuleScopeValue = () => {
    if (
      !formattedRuleScope ||
      formattedRuleScope.mode === AuditWhitelistResV1RuleScopeModeEnum.all ||
      !formattedRuleScope.ruleLabels.length
    ) {
      return null;
    }
    return (
      <div className="detail-internal-list rule-scope-result-list">
        {formattedRuleScope.rules.map((rule, index) => (
          <AuditResultMessage
            key={`${rule.ruleName ?? rule.label}-${index}`}
            styleClass="result-item"
            auditResult={{
              level: rule.level ?? '',
              rule_name: rule.ruleName ?? '',
              desc: rule.label,
              annotation: rule.annotation ?? ''
            }}
            displayMode="ruleDesc"
            showAnnotation={!!rule.annotation}
            moreBtnLink={rule.navigatePath ?? ''}
            moreBtnPlacement="descRow"
          />
        ))}
      </div>
    );
  };

  return (
    <>
      {messageContextHolder}
      <BasicDrawer
        size="large"
        title={t('whitelist.pageTitle')}
        open={open}
        onClose={onClose}
        zIndex={zIndex}
        footer={
          <Space>
            <BasicButton onClick={onClose}>{t('common.close')}</BasicButton>
            <EmptyBox if={!!detail && !!onEdit}>
              <BasicButton onClick={() => detail && onEdit?.(detail)}>
                {t('common.edit')}
              </BasicButton>
            </EmptyBox>
            <EmptyBox if={!!detail}>
              <BasicButton danger onClick={handleDelete}>
                {t('common.delete')}
              </BasicButton>
            </EmptyBox>
          </Space>
        }
      >
        <Spin spinning={loading}>
          {displayRecord ? (
            <RuleExceptionDetailStyleWrapper>
              <DetailMetaInfoCardStyleWrapper>
                <DetailMetaInfoItem
                  label={t('ruleException.detail.createdBy')}
                  value={detail?.created_by || '-'}
                />
                <DetailMetaInfoItem
                  label={t('ruleException.detail.createdAt')}
                  value={formatTime(detail?.created_at, '-')}
                />
                <DetailMetaInfoItem
                  label={t('ruleException.detail.matchedCount')}
                  value={detail?.matched_count ?? '-'}
                />
                <DetailMetaInfoItem
                  label={t('ruleException.detail.lastMatchTime')}
                  value={formatTime(detail?.last_match_time, '-')}
                />
              </DetailMetaInfoCardStyleWrapper>
              <DetailFieldCard
                label={t('ruleException.table.matchMode')}
                labelTips={t('ruleException.form.matchModeTips')}
              >
                <MatchModeItemsList items={matchModeItems} />
              </DetailFieldCard>
              <DetailFieldCard
                label={t('ruleException.detail.ruleScope')}
                labelTips={t('ruleException.form.ruleScopeModeTips')}
                labelExtra={renderRuleScopeTag()}
              >
                {renderRuleScopeValue()}
              </DetailFieldCard>
              <DetailFieldCard label={t('ruleException.detail.reason')}>
                {detail?.desc || '-'}
              </DetailFieldCard>
            </RuleExceptionDetailStyleWrapper>
          ) : null}
        </Spin>
      </BasicDrawer>
    </>
  );
};

export default WhitelistDetailDrawer;
