import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import {
  BasicDrawer,
  BasicTag,
  EmptyBox,
  BasicToolTips,
  SQLRenderer
} from '@actiontech/shared';
import { DetailReportDrawerProps, IAuditResultItem } from './index.type';
import { AuditReportStyleWrapper } from './style';
import AuditResultMessage from '../AuditResultMessage';
import {
  IconFillListActive,
  IconPosition
} from '@actiontech/shared/lib/Icon/common';
import { Typography, Space } from 'antd';

const ReportDrawer = ({
  open,
  title,
  data,
  onClose,
  showAnnotation,
  showSourceFile
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
            <Typography.Title level={3}>
              {t('auditPlan.report.drawer.subTitle.result')}
            </Typography.Title>
            <div className="wrapper-cont">
              {resultDataIsEmpty ? (
                <AuditResultMessage styleClass="result-item" />
              ) : (
                (data?.auditResult ?? [])?.map(
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
                            ? `/sqle/rule/knowledge/${item?.rule_name}/${item?.db_type}`
                            : ''
                        }
                      />
                    );
                  }
                )
              )}
            </div>
          </section>
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
                          <BasicTag icon={<IconFillListActive />}>
                            <span className="sql-source-title">
                              {t('auditPlan.report.drawer.source')}
                            </span>{' '}
                            -
                          </BasicTag>
                        </Space>
                      </BasicToolTips>
                    }
                  >
                    <BasicTag icon={<IconFillListActive />}>
                      <span className="sql-source-title">
                        {t('auditPlan.report.drawer.source')}
                      </span>
                      {data?.sqlSourceFile}
                    </BasicTag>
                  </EmptyBox>
                  <BasicTag icon={<IconPosition />}>
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
