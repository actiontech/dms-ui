import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import {
  BasicDrawer,
  BasicTag,
  EmptyBox,
  BasicToolTip
} from '@actiontech/dms-kit';
import {
  SQLRenderer,
  BasicTypographyEllipsis,
  parse2ReactRouterPath
} from '@actiontech/shared';
import { DetailReportDrawerProps, IAuditResultItem } from './index.type';
import {
  AuditReportStyleWrapper,
  AuditResultExceptionStyleWrapper
} from './style';
import AuditResultMessage from '../AuditResultMessage';
import { Typography, Space } from 'antd';
import { ProfileSquareFilled, EnvironmentFilled } from '@actiontech/icons';
import useThemeStyleData from '../../hooks/useThemeStyleData';
import { Spin } from 'antd';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import AuditExceptionItem from '../AuditResultMessage/AuditExceptionItem';
const ReportDrawer = ({
  open,
  title,
  data,
  onClose,
  showAnnotation,
  showSourceFile,
  loading,
  extra
}: DetailReportDrawerProps) => {
  const { t } = useTranslation();
  const { sqleTheme } = useThemeStyleData();
  const closeModal = () => {
    onClose();
  };
  const { auditResultWithNormalLevel, auditResultWithAuditException } =
    useMemo(() => {
      const normalLevel: IAuditResultItem[] = [];
      const exceptionResult: IAuditResultItem[] = [];
      (data?.auditResult ?? []).forEach((item) => {
        if (item.execution_failed) {
          exceptionResult.push(item);
        } else {
          normalLevel.push(item);
        }
      });
      return {
        auditResultWithAuditException: exceptionResult,
        auditResultWithNormalLevel: normalLevel
      };
    }, [data?.auditResult]);
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
        maskClosable
        extra={extra}
      >
        <AuditReportStyleWrapper className="audit-report-wrapper">
          <Spin spinning={loading}>
            <EmptyBox if={auditResultWithNormalLevel.length > 0}>
              <section className="wrapper-item">
                <Typography.Title level={3}>
                  {t('auditPlan.report.drawer.subTitle.result')}
                </Typography.Title>
                <div className="wrapper-cont">
                  {resultDataIsEmpty ? (
                    <AuditResultMessage styleClass="result-item" />
                  ) : (
                    auditResultWithNormalLevel.map(
                      (item: IAuditResultItem, index: number) => {
                        if (!showAnnotation || item.isRuleDeleted) {
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
                              isRuleDeleted={item.isRuleDeleted}
                            />
                          );
                        }
                        return (
                          <AuditResultMessage
                            styleClass="result-item"
                            key={`${item.rule_name ?? ''}${
                              item.message ?? ''
                            }-${index}`}
                            auditResult={{
                              level: item?.level ?? '',
                              message: item?.message ?? '',
                              annotation: item.annotation ?? ''
                            }}
                            showAnnotation
                            moreBtnLink={
                              item?.rule_name && item?.db_type
                                ? parse2ReactRouterPath(
                                    ROUTE_PATHS.SQLE.RULE_KNOWLEDGE.index,
                                    {
                                      params: {
                                        ruleName: item.rule_name ?? '',
                                        dbType: item.db_type ?? ''
                                      }
                                    }
                                  )
                                : ''
                            }
                          />
                        );
                      }
                    )
                  )}
                </div>
              </section>
            </EmptyBox>

            <EmptyBox if={auditResultWithAuditException.length > 0}>
              <AuditResultExceptionStyleWrapper>
                <div className="title">
                  <BasicToolTip
                    title={t('auditPlan.report.drawer.subTitle.exceptionTips')}
                    suffixIcon
                  >
                    {t('auditPlan.report.drawer.subTitle.exception')}
                  </BasicToolTip>
                </div>

                <div className="audit-exception-wrapper">
                  {auditResultWithAuditException.map((item, index) => {
                    return (
                      <AuditExceptionItem
                        key={`${item.rule_name}-${index}`}
                        auditExceptionResult={item}
                      />
                    );
                  })}
                </div>
              </AuditResultExceptionStyleWrapper>
            </EmptyBox>
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
                      <BasicToolTip
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
                      </BasicToolTip>
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
                height="100%"
              />
            </div>
          </section>
        </AuditReportStyleWrapper>
      </BasicDrawer>
    </>
  );
};
export default ReportDrawer;
