import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import {
  BasicDrawer,
  BasicTag,
  EmptyBox,
  BasicToolTips,
  SQLRenderer,
  BasicTypographyEllipsis
} from '@actiontech/shared';
import { DetailReportDrawerProps } from './index.type';
import { AuditReportStyleWrapper } from './style';
import AuditResultMessage from '../AuditResultMessage';
import { AuditResultExemptionPanel } from '../RuleException';
import { Typography, Space } from 'antd';
import { ProfileSquareFilled, EnvironmentFilled } from '@actiontech/icons';
import useThemeStyleData from '../../hooks/useThemeStyleData';
import { Spin } from 'antd';

const ReportDrawer = ({
  open,
  title,
  data,
  onClose,
  showAnnotation,
  showSourceFile,
  loading,
  extra,
  sqlManageContext,
  onOpenCreateException,
  onRefresh,
  status,
  enrichAuditResultItem,
  enrichSkippedItem
}: DetailReportDrawerProps) => {
  const { t } = useTranslation();

  const { sqleTheme } = useThemeStyleData();

  const closeModal = () => {
    onClose();
  };

  const resultDataIsEmpty = useMemo(() => {
    const hasAuditResults =
      Array.isArray(data?.auditResult) && (data?.auditResult.length ?? 0) > 0;
    const hasSkippedExceptions =
      (data?.skippedByRuleException?.length ?? 0) > 0;
    return !hasAuditResults && !hasSkippedExceptions;
  }, [data?.auditResult, data?.skippedByRuleException]);

  return (
    <>
      <BasicDrawer
        open={open}
        title={title}
        showClosedIcon
        onClose={closeModal}
        noBodyPadding
        size="large"
        maskClosable
        extra={extra}
      >
        <AuditReportStyleWrapper className="audit-report-wrapper">
          <Spin spinning={loading}>
            <section className="wrapper-item">
              <Typography.Title level={3}>
                {t('auditPlan.report.drawer.subTitle.result')}
              </Typography.Title>
              <div className="wrapper-cont">
                {resultDataIsEmpty ? (
                  <AuditResultMessage
                    styleClass="result-item"
                    auditStatus={data?.auditStatus}
                  />
                ) : (
                  <AuditResultExemptionPanel
                    auditResult={data?.auditResult}
                    skippedByRuleException={data?.skippedByRuleException}
                    auditLevel={data?.auditLevel}
                    sqlManageContext={sqlManageContext}
                    onOpenCreateException={onOpenCreateException}
                    onRefresh={onRefresh}
                    layout="report"
                    showAnnotation={showAnnotation}
                    auditStatus={data?.auditStatus}
                    status={status}
                    showRuleExceptionActions={!!sqlManageContext}
                    showExemptedActions={!!sqlManageContext}
                    enrichAuditResultItem={enrichAuditResultItem}
                    enrichSkippedItem={enrichSkippedItem}
                  />
                )}
              </div>
            </section>
          </Spin>
          <section className="wrapper-item">
            <div className="title-wrap">
              <Typography.Title level={3}>
                {t('auditPlan.report.drawer.subTitle.sql')}
              </Typography.Title>
              <EmptyBox if={showSourceFile}>
                <Space>
                  <EmptyBox
                    if={!!data?.sqlSourceFile}
                    defaultNode={
                      <BasicToolTips
                        title={t('auditPlan.report.drawer.sourceTip')}
                      >
                        <Space>
                          <BasicTag
                            icon={
                              <ProfileSquareFilled
                                width={18}
                                height={18}
                                color={
                                  sqleTheme.icon.execWorkFlow
                                    .profileSquareFilled
                                }
                              />
                            }
                          >
                            <span className="sql-source-title">
                              {t('auditPlan.report.drawer.source')}
                            </span>{' '}
                            -
                          </BasicTag>
                        </Space>
                      </BasicToolTips>
                    }
                  >
                    <BasicTag
                      icon={
                        <ProfileSquareFilled
                          width={18}
                          height={18}
                          color={
                            sqleTheme.icon.execWorkFlow.profileSquareFilled
                          }
                        />
                      }
                      className="ellipsis-column-width"
                    >
                      <span className="sql-source-title">
                        {t('auditPlan.report.drawer.source')}
                      </span>
                      <BasicTypographyEllipsis
                        className="margin-bottom-0 sql-source-content"
                        textCont={data?.sqlSourceFile!}
                        copyable={false}
                        tooltipsMaxWidth={220}
                      />
                    </BasicTag>
                  </EmptyBox>
                  <BasicTag icon={<EnvironmentFilled width={18} height={18} />}>
                    <span className="sql-source-title">
                      {t('auditPlan.report.drawer.fileLine')}
                    </span>
                    {data?.sqlStartLine || '-'}
                  </BasicTag>
                </Space>
              </EmptyBox>
            </div>
            <div className="wrapper-cont">
              <SQLRenderer.ViewOnlyEditor
                value={data?.sql}
                width="100%"
                height="90%"
              />
            </div>
          </section>
        </AuditReportStyleWrapper>
      </BasicDrawer>
    </>
  );
};

export default ReportDrawer;
