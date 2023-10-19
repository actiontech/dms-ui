import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { BasicDrawer } from '@actiontech/shared';
import { MonacoEditor } from '@actiontech/shared/lib/components/MonacoEditor';
import { IAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import { DetailReportDrawerProps } from './index.type';
import { AuditReportStyleWrapper } from './style';
import AuditResultMessage from '../AuditResultMessage';

const ReportDrawer = ({
  open,
  title,
  data,
  onClose,
  footer
}: DetailReportDrawerProps) => {
  const { t } = useTranslation();

  const closeModal = () => {
    onClose();
  };

  const resultDataIsEmpty = useMemo(() => {
    return (
      (Array.isArray(data?.auditResult) && !data?.auditResult.length) ||
      !data?.auditResult
    );
  }, [data?.auditResult]);
  return (
    <>
      <BasicDrawer
        open={open}
        title={title}
        showClosedIcon
        onClose={closeModal}
        noBodyPadding
        size="large"
      >
        <AuditReportStyleWrapper className="audit-report-wrapper">
          <section className="wrapper-item">
            <h3>{t('auditPlan.report.drawer.subTitle.result')}</h3>
            <div className="wrapper-cont">
              {resultDataIsEmpty ? (
                <AuditResultMessage styleClass="result-item" />
              ) : (
                (data?.auditResult ?? [])?.map(
                  (item: IAuditResult, index: number) => {
                    return (
                      <AuditResultMessage
                        styleClass="result-item"
                        key={`${item.rule_name ?? ''}${
                          item.message ?? ''
                        }-${index}`}
                        auditResult={{
                          level: item?.level ?? '',
                          message: item?.message ?? ''
                        }}
                      />
                    );
                  }
                )
              )}
            </div>
          </section>
          <section className="wrapper-item">
            <h3>{t('auditPlan.report.drawer.subTitle.sql')}</h3>
            <div className="wrapper-cont">
              <MonacoEditor
                value={data?.sql ?? ''}
                width="100%"
                height="90%"
                language="sql"
                options={{
                  readOnly: true
                }}
              />
            </div>
          </section>
        </AuditReportStyleWrapper>
      </BasicDrawer>
    </>
  );
};

export default ReportDrawer;
