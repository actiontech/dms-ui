import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { BasicButton } from '@actiontech/shared';
import { IReduxState } from '../../../../../../../base/src/store';
import { updateAuditPlanModalStatus } from '../../../../../store/auditPlan';
import { ModalName } from '../../../../../data/ModalName';
import { IAuditPlanReportSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import ReportDrawer from '../../../../../components/ReportDrawer';
import useAuditResultRuleInfo from '../../../../Order/hooks/useAuditResultRuleInfo';

type typeDetailReportDrawer = {
  actionMethod: (data: IAuditPlanReportSQLResV2) => void;
  dbType?: string;
};

const DetailReportDrawer = (props: typeDetailReportDrawer) => {
  const { dbType } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      updateAuditPlanModalStatus({
        modalName: ModalName.Report_Record,
        status: false
      })
    );
  }, [dispatch]);

  const { open, recordData } = useSelector((state: IReduxState) => ({
    open: state.auditPlan.modalStatus[ModalName.Report_Record],
    recordData: state.auditPlan.selectAuditReport
  }));

  const onClose = () => {
    dispatch(
      updateAuditPlanModalStatus({
        modalName: ModalName.Report_Record,
        status: false
      })
    );
  };

  const { auditResultRuleInfo } = useAuditResultRuleInfo(
    recordData?.audit_plan_report_sql_audit_result ?? [],
    dbType ?? ''
  );

  return (
    <ReportDrawer
      open={open}
      title={
        <div className="flex-space-between flex-align-center">
          {t('auditPlan.report.drawer.title')}
          <BasicButton
            onClick={() => recordData && props.actionMethod(recordData)}
            key="drawer-sql-action"
          >
            {t('auditPlan.report.drawer.action')}
          </BasicButton>
        </div>
      }
      data={{
        auditResult: auditResultRuleInfo,
        sql: recordData?.audit_plan_report_sql ?? ''
      }}
      onClose={onClose}
      showAnnotation
    />
  );
};

export default DetailReportDrawer;
