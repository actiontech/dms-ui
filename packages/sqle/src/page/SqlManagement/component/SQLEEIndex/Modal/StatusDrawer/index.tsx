import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Space, Typography } from 'antd';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import { ModalName } from '../../../../../../data/ModalName';
import ReportDrawer from '../../../../../../components/ReportDrawer';
import useSqlManagementRedux from '../../hooks/useSqlManagementRedux';
import useAuditResultRuleInfo from '../../../../../../components/ReportDrawer/useAuditResultRuleInfo';
import { Link } from 'react-router-dom';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { BasicButton } from '@actiontech/shared';

const StatusDrawer = () => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const {
    open: visible,
    selectSqlManagement: selectedData,
    setSelectData,
    updateModalStatus
  } = useSqlManagementRedux(ModalName.View_Audit_Result_Drawer);

  const auditResults = useMemo(
    () => selectedData?.audit_result ?? [],
    [selectedData?.audit_result]
  );

  const { auditResultRuleInfo, loading } = useAuditResultRuleInfo(auditResults);

  const closeModal = () => {
    updateModalStatus(ModalName.View_Audit_Result_Drawer, false);
    setSelectData(null);
  };

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
        sql: selectedData?.sql ?? ''
      }}
      onClose={closeModal}
      showAnnotation
      loading={loading}
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
