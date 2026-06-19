import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import {
  BasicDrawer,
  BasicTag,
  EmptyBox,
  BasicToolTips,
  SQLRenderer,
  BasicTypographyEllipsis,
  BasicButton
} from '@actiontech/shared';
import { DetailReportDrawerProps, IAuditResultItem } from './index.type';
import { AuditReportStyleWrapper } from './style';
import AuditResultMessage from '../AuditResultMessage';
import { Typography, Space, Descriptions } from 'antd';
import { ProfileSquareFilled, EnvironmentFilled } from '@actiontech/icons';
import useThemeStyleData from '../../hooks/useThemeStyleData';
import { Spin } from 'antd';
import RuleExceptionDrawer from './RuleExceptionDrawer';
import { formatTime } from '@actiontech/shared/lib/utils/Common';

const ReportDrawer = ({
  open,
  title,
  data,
  onClose,
  showAnnotation,
  showSourceFile,
  loading,
  extra,
  ruleExceptionContext,
  canCreateRuleException = false,
  onRuleExceptionCreated
}: DetailReportDrawerProps) => {
  const { t } = useTranslation();

  const { sqleTheme } = useThemeStyleData();
  const [selectedRuleException, setSelectedRuleException] =
    useState<IAuditResultItem>();

  const closeModal = () => {
    onClose();
  };

  const closeRuleExceptionDrawer = () => {
    setSelectedRuleException(undefined);
  };

  const resultDataIsEmpty = useMemo(() => {
    return (
      (Array.isArray(data?.auditResult) && !data?.auditResult.length) ||
      !data?.auditResult
    );
  }, [data?.auditResult]);

  const skippedAuditResult = useMemo(
    () => data?.skippedAuditResult ?? [],
    [data?.skippedAuditResult]
  );

  const openOperationRecord = () => {
    if (!ruleExceptionContext?.projectName) {
      return;
    }

    window.open(
      `/sqle/project/${
        ruleExceptionContext.projectID ?? ruleExceptionContext.projectName
      }/operation-record`
    );
  };

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
                  (data?.auditResult ?? [])?.map(
                    (item: IAuditResultItem, index: number) => {
                      if (!showAnnotation || item.isRuleDeleted) {
                        return (
                          <div
                            className="result-item"
                            key={`${item.rule_name ?? ''}${
                              item.message ?? ''
                            }-${index}`}
                          >
                            <AuditResultMessage
                              auditResult={{
                                level: item?.level ?? '',
                                message: item?.message ?? ''
                              }}
                              isRuleDeleted={item.isRuleDeleted}
                            />
                          </div>
                        );
                      }
                      return (
                        <div
                          className="result-item"
                          key={`${item.rule_name ?? ''}${
                            item.message ?? ''
                          }-${index}`}
                        >
                          <AuditResultMessage
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
                          <EmptyBox
                            if={
                              canCreateRuleException &&
                              !!ruleExceptionContext &&
                              !!item.rule_name
                            }
                          >
                            <div className="rule-exception-action">
                              <BasicButton
                                type="link"
                                onClick={() => setSelectedRuleException(item)}
                              >
                                {t('whitelist.ruleException.addAction')}
                              </BasicButton>
                            </div>
                          </EmptyBox>
                        </div>
                      );
                    }
                  )
                )}
              </div>
            </section>
            <EmptyBox if={!!skippedAuditResult.length}>
              <section className="wrapper-item skipped-rule-wrapper">
                <Typography.Title level={3}>
                  {t('whitelist.ruleException.skippedModule.title')}
                </Typography.Title>
                <div className="wrapper-cont">
                  {skippedAuditResult.map((item, index) => (
                    <div
                      className="skipped-rule-item"
                      key={`${item.rule_name ?? ''}-${index}`}
                    >
                      <Descriptions
                        size="small"
                        column={2}
                        labelStyle={{ width: 110 }}
                      >
                        <Descriptions.Item
                          label={t('whitelist.ruleException.ruleName')}
                        >
                          {item.rule_name || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={t('whitelist.ruleException.ruleLevel')}
                        >
                          {item.rule_level || item.level || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={t('whitelist.ruleException.ruleDesc')}
                          span={2}
                        >
                          {item.rule_desc ||
                            item.message ||
                            item.rule_name ||
                            '-'}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={t('whitelist.ruleException.createdBy')}
                        >
                          {item.created_by || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={t('whitelist.ruleException.createdAt')}
                        >
                          {formatTime(item.created_at, '-')}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={t('whitelist.ruleException.reason')}
                          span={2}
                        >
                          {item.reason || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={t('whitelist.ruleException.audit')}
                          span={2}
                        >
                          <BasicButton
                            type="link"
                            onClick={openOperationRecord}
                          >
                            {t('whitelist.ruleException.viewAudit')}
                          </BasicButton>
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                  ))}
                </div>
              </section>
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
      <RuleExceptionDrawer
        open={!!selectedRuleException}
        data={selectedRuleException}
        context={ruleExceptionContext}
        onClose={closeRuleExceptionDrawer}
        onCreated={onRuleExceptionCreated}
      />
    </>
  );
};

export default ReportDrawer;
