import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Space, Typography } from 'antd';
import { useRequest } from 'ahooks';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { ModalName } from '../../../../../../data/ModalName';
import ReportDrawer from '../../../../../../components/ReportDrawer';
import useSqlManagementRedux from '../../hooks/useSqlManagementRedux';
import useAuditResultRuleInfo from '../../../../../../components/ReportDrawer/useAuditResultRuleInfo';
import { Link } from 'react-router-dom';
import { BasicButton } from '@actiontech/shared';
import useWhitelistRedux from '../../../../../Whitelist/hooks/useWhitelistRedux';
import {
  buildSqlManageRuleExceptionContext,
  resolveDbTypeFromAuditResults,
  toSqlManageRuleExceptionRecord
} from '../../../../../RuleException/index.data';
import { OpenCreateAuditWhitelistExceptionParams } from '../../../../../../components/RuleException/AddRuleExceptionButton';
import EventEmitter from '../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../data/EmitterKey';

const StatusDrawer = () => {
  const { t } = useTranslation();
  const { projectID, projectName } = useCurrentProject();

  const {
    open: visible,
    selectSqlManagement: selectedData,
    setSelectData,
    updateModalStatus
  } = useSqlManagementRedux(ModalName.View_Audit_Result_Drawer);

  const { openAuditWhitelistCreateWithPrefill } = useWhitelistRedux();

  const sqlManageId = selectedData?.id;

  const {
    data: remediationDetail,
    loading: remediationLoading,
    refresh: refreshRemediationDetail
  } = useRequest(
    () =>
      SqlManage.GetSqlManageRemediationV1({
        project_name: projectName,
        sql_manage_id: `${sqlManageId}`
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data;
        }
        throw new Error(res.data?.message);
      }),
    {
      // visible 未初始化时为 undefined；ahooks 会把 undefined 当成 ready=true
      ready: !!(visible && sqlManageId),
      refreshDeps: [projectName, sqlManageId, visible]
    }
  );

  const auditResults = useMemo(() => {
    const latestAuditResult = remediationDetail?.latest_audit_result;
    if (latestAuditResult?.length) {
      return latestAuditResult;
    }
    return selectedData?.audit_result ?? [];
  }, [remediationDetail?.latest_audit_result, selectedData?.audit_result]);

  const skippedByRuleException = useMemo(
    () =>
      remediationDetail?.skipped_by_rule_exception ??
      selectedData?.skipped_by_rule_exception,
    [
      remediationDetail?.skipped_by_rule_exception,
      selectedData?.skipped_by_rule_exception
    ]
  );

  const dbType = useMemo(
    () => resolveDbTypeFromAuditResults(auditResults),
    [auditResults]
  );

  const {
    auditResultRuleInfo,
    loading: auditResultLoading,
    enrichAuditResultItem,
    enrichSkippedItem
  } = useAuditResultRuleInfo(auditResults, dbType, skippedByRuleException);

  const sqlManageContext = useMemo(
    () =>
      buildSqlManageRuleExceptionContext(
        toSqlManageRuleExceptionRecord(selectedData ?? undefined)
      ),
    [selectedData]
  );

  const closeModal = () => {
    updateModalStatus(ModalName.View_Audit_Result_Drawer, false);
    setSelectData(null);
  };

  const handleOpenCreateException = useCallback(
    (params: OpenCreateAuditWhitelistExceptionParams) => {
      openAuditWhitelistCreateWithPrefill(
        toSqlManageRuleExceptionRecord(selectedData ?? undefined),
        { ruleName: params.auditResult?.rule_name }
      );
    },
    [openAuditWhitelistCreateWithPrefill, selectedData]
  );

  useEffect(() => {
    if (!visible) {
      return;
    }
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_SQL_Management,
      refreshRemediationDetail
    );
    return unsubscribe;
  }, [refreshRemediationDetail, visible]);

  const drawerTitle = (
    <Space direction="vertical" size={0}>
      <span>{t('sqlManagement.table.column.currentAuditResult')}</span>
      <Typography.Text
        type="secondary"
        style={{ fontSize: 12, fontWeight: 400 }}
      >
        {formatTime(selectedData?.last_receive_timestamp, '-')}
      </Typography.Text>
    </Space>
  );

  return (
    <ReportDrawer
      open={visible}
      title={drawerTitle}
      data={{
        auditResult: auditResultRuleInfo,
        sql: selectedData?.sql ?? remediationDetail?.sql ?? '',
        skippedByRuleException
      }}
      onClose={closeModal}
      showAnnotation
      loading={remediationLoading || auditResultLoading}
      sqlManageContext={sqlManageContext}
      onOpenCreateException={
        sqlManageContext ? handleOpenCreateException : undefined
      }
      onRefresh={refreshRemediationDetail}
      status={selectedData?.status}
      enrichAuditResultItem={enrichAuditResultItem}
      enrichSkippedItem={enrichSkippedItem}
      extra={
        <Link
          to={`/sqle/project/${projectID}/sql-management/${selectedData?.id}/analyze`}
          target="blank"
        >
          <BasicButton>{t('sqlManagement.table.action.analyze')}</BasicButton>
        </Link>
      }
    />
  );
};

export default StatusDrawer;
